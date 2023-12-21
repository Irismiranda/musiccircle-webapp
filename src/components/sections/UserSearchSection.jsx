import React, { useEffect, useRef, useState } from "react"
import { useClickOutside } from "../../utils"
import { UserList } from "../"
import { Axios } from "../../Axios-config"

export default function UserSearchSection(props){
    const { idList, setUserProfileData, setUserListVisibility, exceptionRef } = props
    const [userDataList, setUserDataList] = useState(null)
    const [isLoading, setIsLoading] = useState(true)
    const [preventUpdate, setPreventUpdate] = useState(false)
    const userListRef = useRef(null)
    const userSsearchInputRef = useRef(null)

    useClickOutside(userListRef, exceptionRef, () => setUserListVisibility({
        following: false,
        followers: false,
    }))

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

        const formatedData = formatListData(userList, "user")

        setUserDataList(formatedData)
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
        
        setUserDataList(searchResults)
    }

    useEffect(() => {
        if(!preventUpdate && idList){
            getUsersData()
        }
    }, [idList])

    return (
        <div ref={userListRef} className="user_list_wrapper wrapper default_padding">
          <input 
          ref={userSsearchInputRef} 
          className="search_bar" 
          placeholder="Search..." 
          onInput={() => searchUsers()} />
          
          { !isLoading ?       
          <UserList 
          list={userDataList}
          setUserProfileData={setUserProfileData}
          setPreventUpdate={setPreventUpdate}
          showBtn={true}/> :
          <h3>Loading...</h3>
        }
        </div>
      )
    }      
