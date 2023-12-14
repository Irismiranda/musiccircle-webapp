import React, { useEffect, useState } from "react"
import { useClickOutside, formatListData } from "../../utils"
import { List } from "../"
import { Axios } from "../../Axios-config"

export default function UserList(props){
    const { idList, setUserProfileData } = props
    const { formatedUserList, setFormatedUserList } = useState(null)

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

        const formatedData = formatListData({items: userList})

        if(formatedData.length > 0){
            setFormatedUserList({items: formatedData})
        }
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

            {formatedUserList && <List 
            list={formatedUserList} 
            category={"userList"} 
            setUserProfileData={setUserProfileData}/>}
        </>
    )
}
