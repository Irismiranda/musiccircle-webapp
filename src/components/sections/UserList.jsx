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

    return (
        <div className="user_list_wrapper wrapper default_padding">
          <input onInput={() => searchUsers()} />
          {userDataList && userDataList.length > 0 ? (
            userDataList.map((user) => (
              <section className="user_list_grid" key={user.id}>
                <div>
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
            <h1>Nothing to see here...</h1>
          )}
        </div>
      )
    }      
