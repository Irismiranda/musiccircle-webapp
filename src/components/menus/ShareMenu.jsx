import React, { useEffect, useState } from "react"
import { SvgLinkIcon, SvgFeedIcon } from "../../assets"
import { Axios } from "../../Axios-config"
import useStore from "../../store"

export default function ShareMenu(){
    const { currentUser, setCurrentUser } = useStore()
    const [followingList, setFollowingList] = useState(null)

    async function getFollowersList(){
        console.log("log - user is:", currentUser)
        const response = await Axios.post('/api/profile/following', currentUser)
        console.log("user is following:", response.data)
        if(response){
            setFollowingList(response.data)
        }
    }

    useEffect(() => {
        if(currentUser){
            getFollowersList()
        }
        console.log("log - updated user is:", currentUser)
    }, [currentUser])

    return (
        <div>
            <input placeholder="Find a friend..."/>
            <div className="flex">
                <SvgLinkIcon className="svg" />
            </div>
            <div className="flex">
                <SvgFeedIcon className="svg"/>
            </div>
        </div>
    )
}