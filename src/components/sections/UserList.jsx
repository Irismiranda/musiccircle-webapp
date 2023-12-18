import React, { useEffect, useRef, useState } from "react"
import { Link } from "react-router-dom"
import { ToggleFollowBtn, useClickOutside } from "../../utils"
import { Axios } from "../../Axios-config"

export default function UserList(props){
    const { idList, setUserProfileData, setUserListVisibility, exceptionRef } = props
    const [userDataList, setUserDataList] = useState(null)
    const [isLoading, setIsLoading] = useState(true)
    const userListRef = useRef(null)
    const userSsearchInputRef = useRef(null)

    useClickOutside(userListRef, exceptionRef, () => setUserListVisibility({
        following: false,
        followers: false,
    }))

    function toggleTransparency(e){
        const parentDiv = e.currentTarget.parentElement
        parentDiv.classList.toggle("transparent_section")
    }

    async function getUsersData(){
        setIsLoading(true)
        const userList = []
        await Promise.all(
            idList.slice(0, 15).map(async (id) => {
                const response = await Axios.post("/api/account", {
                    userData: {
                        id: id,
                        type: "user",
                    }
                })
                userList.push(response.data)
            })
        )

        setUserDataList(userList)
        setIsLoading(false)
    }

    async function searchUsers() {
        const userList = []
        const searchTerm = userSsearchInputRef.current.value.toLowerCase()        
        await Promise.all(
            idList.map(async (id) => {
            const response = await Axios.post("/api/account", {
                userData: {
                id: id,
                type: "user",
                },
            })
        
            userList.push(response.data)
            })
        )

        let searchResults
        
        if (searchTerm === "") {
            searchResults = userList.slice(0, 15)
        } else {
            searchResults = userList.filter((user) =>
            user.display_name.toLowerCase().includes(searchTerm)
            )
        }
        
        console.log("search results are", searchResults)
        setUserDataList(searchResults)
    }

    useEffect(() => {
        if(idList){
            getUsersData()
        }
    }, [idList])

    return (
        <div ref={userListRef} className="user_list_wrapper wrapper default_padding">
          <input ref={userSsearchInputRef} placeholder="Search..." onInput={() => searchUsers()} />
          { !isLoading ?       
          (userDataList && userDataList?.length > 0 ? (
            userDataList.map((user, index) => (
                <section className="list_items_wrapper">
                    <div className="user_list_grid" key={user.id}>
                        <Link to={`/account/${user.id}`}>
                            <img 
                            className="profile_medium" 
                            src={user.images[0].url} 
                            alt={`Profile of ${user.display_name}`} />
                        </Link>
                        <Link to={`/account/${user.id}`}>
                            {user.display_name}
                        </Link>
                        <div 
                        style={{ 
                            display: "flex",
                            justifyContent: "end"
                         }}
                        onClick={(e) => toggleTransparency(e)}>
                            <ToggleFollowBtn 
                            currentUserId={user.id} 
                            setUserProfileData={setUserProfileData} />
                        </div>
                    </div>
                </section>
            ))
          ) : (
            <h3>Nothing to see here...</h3>
          )) :
          <h3>Loading...</h3>
        }
        </div>
      )
    }      
