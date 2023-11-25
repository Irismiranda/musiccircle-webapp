import React, { useEffect, useState } from "react"
import { SvgLinkIcon, SvgFeedIcon, SvgIgIcon, SvgTiktokIcon } from "../../assets"
import { Axios } from "../../Axios-config"
import useStore from "../../store"

export default function ShareMenu(){
    const { currentUser, setCurrentUser } = useStore()
    const [followingList, setFollowingList] = useState(null)

    async function handleIgConnect(){
        try{
           const response = await Axios.post('/instagram_connect', { user_id: currentUser.id })
           const windowFeatures = 'toolbar=no, menubar=no, width=500, height=700, top=100, left=100'
           window.open(response.data, 'InstagramAuth', windowFeatures)
        } catch(err){
            console.log(err)
        }
    }

    function handleTiktokConnect(){

    }

    async function getFollowersList(){
        const response = await Axios.post('/api/profile/following', currentUser)
        console.log("user is following:", response.data)
        if(response){
            setFollowingList(response.data)
        }
    }

    useEffect(() => {
        console.log("current uer is:", currentUser)
        if(currentUser){
            getFollowersList()
        }
        console.log("log - updated user is:", currentUser)
    }, [currentUser])

    useEffect(() => {
        const handleMessage = async (event) => {
            console.log("message received")
            event.stopImmediatePropagation()
            if (event.origin !== 'https://musiccircle.onrender.com') return;
            if (event.data === 'InstagramAuthSuccess') {
                console.log('Authentication was successful!')
                try {
                    const response = await Axios.post("/api/profile", {
                        id: currentUser.id,
                        type: "user",
                    })
                    setCurrentUser(response.data.userData)
                } catch (error) {
                    console.error('Error updating profile:', error)
                }
            }
        }

        window.addEventListener('message', handleMessage, false)
        console.log("Setting up message event listener")

        return () => {
            console.log("Removing message event listener")
            window.removeEventListener('message', handleMessage, false)
        }
    }, [])

    return (
        <div>
            { !currentUser?.instagram_connected && 
            <div className="flex" onClick={handleIgConnect}>
                < SvgIgIcon className="svg" />
            </div>}

            { !currentUser?.instagram_connected && 
            <div className="flex" onClick={handleTiktokConnect}>
                <SvgTiktokIcon className="svg" />
            </div>}

            { (!currentUser?.instagram_connected || !currentUser.tiktok_connected) && 
            <h4>Connect to find your friends</h4>}
            <div className="friend_list">
               { followingList && followingList.map(user => {
                    <h1> </h1>     
               })} 
            </div>
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