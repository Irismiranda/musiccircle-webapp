import React, { useEffect, useState } from "react"
import { useClickOutside, formatListData } from "../../utils"
import { List } from "../"
import { Axios } from "../../Axios-config"

export default function UserList(props){
    const { idList, setUserProfileData } = props
    const { formatedUserList, setFormatedUserList } = useState(null)

    async function getUsersData(){
        const userList = {items: {}}
        idList.slice(15).map(async (id) => {
            const response = await Axios.post("/api/account", {
                userData: {
                    id: id,
                    type: "user",
                }
            })
            userList.items.push(response.data)
        })
        const formatedData = formatListData(userList)
        setFormatedUserList({items: formatedData})
    }

    async function searchUsers(){

    }

    useEffect(() => {
        if(idList){
            getUsersData()
        }
    }, [idList])

    return (
        <>
            <input onInput={() => searchUsers()}/>
            <List 
            list={formatedUserList} 
            category={"userList"} 
            setUserProfileData={setUserProfileData}/>
        </>
    )
}
