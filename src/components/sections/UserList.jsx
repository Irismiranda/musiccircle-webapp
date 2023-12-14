import React, { useEffect, useState } from "react"
import { ToggleFollowBtn } from "../../utils"
import { Axios } from "../../Axios-config"

export default function UserList(props){
    const { idList, setUserProfileData } = props
    const [userDataList, setUserDataList] = useState(null)

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

    }

    useEffect(() => {
        if(idList){
            getUsersData()
        }
    }, [idList])

    return (
        <>
            <input onInput={() => searchUsers()}/>

            {userDataList && 
                userDataList.map((user) => {
                    <section className="flex">
                        <img src={user.images[0].url} />
                        {user.display_name}
                        <ToggleFollowBtn 
                        userId={user.id} 
                        setUserProfileData={setUserProfileData}/>
                    </section>
                })
            }
        </>
    )
}
