import React, { useEffect, useState } from "react"
import { Link } from "react-router-dom"
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

    useEffect(() => {
        if(userDataList){
            console.log("user data list is:", userDataList)
        }
    }, [userDataList])

        return (
            <>
                <input onInput={() => searchUsers()}/>
                {userDataList && 
                    userDataList.map((user) => {
                        return (
                        <section className="user_list_grid">
                            {userDataList.length > 0 ? 
                            <div>
                                <Link to={`/account/${user.id}`}>
                                    <img className="profile_medium" src={user.images[0].url} />
                                </Link>
                                <Link to={`/account/${user.id}`}>
                                    {user.display_name}
                                </Link>
                                <ToggleFollowBtn 
                                userId={user.id} 
                                setUserProfileData={setUserProfileData}/>
                            </div> :
                            <h1>Nothing to see here...</h1>
                            }
                        </section>
                        )
                    })
                }
            </>
        )
}
