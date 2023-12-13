import React, { useEffect, useState } from "react"
import { Axios } from "../Axios-config"

export default function ToggleFollowBtn(props){
    const [ isFollowing, setIsFollowing ] = useState(false)
    const { userId, loggedUser } = props

    async function getIsFollowing(id){
        const response = await Axios.get(`/api/${loggedUser.id}/is_following/${id}`)
        setIsFollowing(response.data)
    }

    async function toggleFollow(id){
        const response = await Axios.post(`/api/${loggedUser.id}/toggle_follow/${id}`)
        setIsFollowing(response.data.isFollowing)
        setLoggedUser(response.data.updatedLoggedUser)
        setUserProfileData(response.data.updatedCurrentUser)
        const stringData = JSON.stringify(response.data.updatedLoggedUser)
        localStorage.setItem("loggedUser", stringData)
    }

    useEffect(() => {
        getIsFollowing(userId)
    }, [userId])

    return (
        <>
            <button onClick={() => toggleFollow(userId)}> {isFollowing ? "Following" : "Follow"} </button>
        </>
    )
  }