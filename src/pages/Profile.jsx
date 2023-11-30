import React, { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { Axios } from "../Axios-config"
import useStore from "../store"

export default function Profile(){
    const { standardWrapperWidth, currentUser, spotifyApi } = useStore()
    const { userId } = useParams()
    const [ isLoggedUser, setIsLoggedUser ] = useState(false)
    const [ userProfileData, setUserProfileData ] = useState(null)
    const [ recentlyPlayed, setRecentlyPlayed ] = useState(null)

    async function getUser(id){
        const response = await Axios.post("/api/profile", {
            userData: {
                id: id,
                type: "user",
            }
        })
        setUserProfileData(response.data.userData)
    }

    useEffect(() => {
        console.log("log - useEffect ran on profile")
        if(spotifyApi){
            getRecentlyPlayed()
        }
    }, [spotifyApi])
    
    useEffect(() => {
        if(userId === currentUser.id){
            setIsLoggedUser(true)
            setUserProfileData(currentUser)
        } else{
            userId && getUser(userId)
        }
    }, [userId])
    
    return(
        <div className="wrapper default_padding" style={{ width: standardWrapperWidth }}>
           <img src={`${userProfileData?.images[1].url}`} className="profile_large"/>
           <h2>{userProfileData?.display_name}</h2>
           {isLoggedUser && <button> Edit Profile </button>}
           <h3> Posts </h3>
           <h3> Followers </h3>
           <h3> Following </h3>
           <h1> Recently Listened to </h1>
           <div>
            
           </div>
           <h1> Posts </h1>
           <div>

           </div>
        </div>
    )
}
