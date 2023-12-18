import React, { useEffect, useRef, useState } from "react"
import { Link } from "react-router-dom"
import { ToggleFollowBtn, useClickOutside } from "../../utils"
import { Axios } from "../../Axios-config"

export default function UserList(props){
    const { idList, setUserProfileData, setUserListVisibility, exceptionRef } = props
    const [userDataList, setUserDataList] = useState(null)
    const userListRef = useRef(null)
    const userSsearchInputRef = useRef(null)

    useClickOutside(userListRef, exceptionRef, () => setUserListVisibility({
        following: false,
        followers: false,
    }))

    async function getUsersData(){
        const userList = []
        idList.slice(0, 15).map(async (id) => {
            const response = await Axios.post("/api/account", {
                userData: {
                    id: id,
                    type: "user",
                }
            })
            userList.push(response.data)
        })

        setUserDataList(userList)
    }

    async function searchUsers(){
        const userList = []
        const searchTerm = userSsearchInputRef.current.value

        console.log("search term is", searchTerm)

        idList.map(async (id) => {
            const response = await Axios.post("/api/account", {
                userData: {
                    id: id,
                    type: "user",
                }
            })

            userList.push(response.data)
        })

        let searchResults

        if(searchTerm === ""){
            searchResults = userList.slice(0, 15)
        } else {
            searchResults = userList.filter(user => user.display_name.includes(searchTerm))
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
          {userDataList && userDataList.length > 0 ? (
            userDataList.map((user) => (
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
                        <ToggleFollowBtn 
                        userId={user.id} 
                        setUserProfileData={setUserProfileData} />
                    </div>
                </section>
            ))
          ) : (
            <h3>Nothing to see here...</h3>
          )}
        </div>
      )
    }      
