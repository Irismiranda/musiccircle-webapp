import React, { useEffect, useRef, useState } from "react"
import { useParams } from "react-router-dom"
import { Slider } from "../components"
import { Axios } from "../Axios-config"
import { List } from "../components"
import { useClickOutside, ToggleFollowBtn, formatListData } from "../utils"
import useStore from "../store"

export default function Profile(){
    const { standardWrapperWidth, loggedUser, userTopTracks, userTopArtists, setUserTopTracks, setUserTopArtists } = useStore()
    const { userId } = useParams()
    const [ isLoggedUser, setIsLoggedUser ] = useState(false)
    const [ userProfileData, setUserProfileData ] = useState(null)
    const [ topTracks, setTopTracks ] = useState(null)
    const [ topArtists, setTopArtists ] = useState(null)
    const [ showVisibleTopTracks, setShowVisibleTopTracks ] = useState(true)
    const [ showVisibleTopArtists, setShowVisibleTopArtists ] = useState(true)
    const [ listVisibility, setListVisibility ] = useState({
        following: false,
        followers: false,
    })
    const topArtistsSlider = useRef(null)
    const topTracksSlider = useRef(null)
    
    async function getUser(id){
        const response = await Axios.post("/api/account", {
            userData: {
                id: id,
                type: "user",
            }
        })
        setUserProfileData(response.data)
        const topTracksList = await Axios.get(`/api/user/top_tracks/${id}`)
        const topArtistsList = await Axios.get(`/api/user/top_artists/${id}`)
        setTopTracks(topTracksList.data)
        setTopArtists(topArtistsList.data)
    }

    async function hideSection(category){
        const response = await Axios.post(`/api/user/${category}/hide_category`, {
            userId: loggedUser.id
        })
        category === "top_artists" && setUserTopArtists(response.data)
        category === "top_track" && setUserTopTracks(response.data)
    }

    function toggleVisibility(item){
        item === "following" && setListVisibility({
            following: true,
            followers: false,
        })

        item === "followers" && setListVisibility({
            following: false,
            followers: true,
        })
    }
    
    useEffect(() => {
        if(userId === loggedUser.id){
            setIsLoggedUser(true)
            setUserProfileData(loggedUser)
        } else{
            userId && getUser(userId)
        }
    }, [userId])

    useEffect(() => {
        if(isLoggedUser && userTopArtists){
            setTopArtists(userTopArtists)
        }
    }, [userTopArtists, isLoggedUser])
    
    useEffect(() => {
        if(isLoggedUser && userTopTracks){
            setTopTracks(userTopTracks)
        }
    }, [userTopTracks, isLoggedUser])
    
    return(
        <div className="wrapper default_padding profile" style={{ width: standardWrapperWidth }}>
            {(listVisibility.following && userProfileData?.following?.length > 0) && <List list={{items: formatListData({items: userProfileData?.following}, "users")}} category={"userList"}/>}
            {(listVisibility.followers  && userProfileData?.following_you?.length > 0) && <List list={{items: formatListData({items: userProfileData?.following_you}, "users")}} category={"userList"}/>}
            <section className="flex" style={{ marginBottom: "30px" }}>
                <img src={`${userProfileData?.images[1].url}`} className="profile_large" style={{ marginRight: "90px" }}/>
                <div className="user_data_grid">
                    <h2>{userProfileData?.display_name}</h2>
                    {!isLoggedUser && <ToggleFollowBtn id="follow_btn" userId={userId} loggedUser={loggedUser} setUserProfileData={setUserProfileData}/>}
                    {!isLoggedUser && <button is="message_btn">Send Message</button>}
                    <div>
                        <h3> {userProfileData?.posts?.length || 0} Posts </h3>
                        <h3 onClick={() => { toggleVisibility("followers") }}> {userProfileData?.following_you?.length || 0} Followers </h3>
                        <h3 onClick={() => { toggleVisibility("following") }}> {userProfileData?.following?.length || 0} Following </h3>
                    </div>
                </div>
            </section>
            <section className={ showVisibleTopArtists ? "flex space_between slider_wrapper aling_start" : "slider_wrapper flex space_between hidden_items_section aling_start" }>
                <div className="flex aling_start">
                    {(topArtists?.show_top_artists || isLoggedUser) && <h2> Top Artists </h2>}
                    {isLoggedUser && <button onClick={() => setShowVisibleTopArtists(!showVisibleTopArtists)}>{showVisibleTopArtists ? "Manage Hidden Artists" : "Hide" }</button>}
                </div>
                {isLoggedUser && <button onClick={() => hideSection("top_artists")}>{topArtists?.show_top_artists ? "Hide From My Profile" : "Show On My Porfile"}</button>}
            </section>
            {!topArtists && <h3>Loading...</h3>}
            {(topArtists && topArtists.items.length > 0 && (topArtists?.show_top_artists || isLoggedUser)) && 
            <section style={{ position: "relative" }} className={topArtists?.show_top_artists ? "" : "transparent_section"}>
                <div ref={topArtistsSlider} className={showVisibleTopArtists ? "slider_grid" : "slider_grid hidden_items_grid"}>
                    <Slider 
                    list={topArtists} 
                    category="artists" 
                    visibility={showVisibleTopArtists} 
                    isLoggedUser={isLoggedUser} 
                    parentRef={topArtistsSlider}/>
                </div>
           </section>}
           <section className={ showVisibleTopTracks ? "slider_wrapper flex space_between aling_start" : "slider_wrapper flex space_between hidden_items_section aling_start" }>
            <div className="flex aling_start">
                {(topTracks?.show_top_tracks || isLoggedUser) && <h2>  Top Tracks </h2>}
                {isLoggedUser && <button onClick={() => setShowVisibleTopTracks(!showVisibleTopTracks)}>{showVisibleTopTracks ?  "Manage Hidden Tracks" : "Hide"}</button>}
            </div>
                {isLoggedUser && <button onClick={() => hideSection("top_tracks")}>{topTracks?.show_top_tracks ? "Hide From my Profile" : "Show On My Profile"}</button>}
           </section>
           {!topTracks && <h3>Loading...</h3>}
           {(topTracks && topTracks.items.length > 0 && (topTracks?.show_top_tracks || isLoggedUser)) && 
           <section style={{ position: "relative" }} className={topTracks?.show_top_tracks ? "" : "transparent_section"}>
                <div ref={topTracksSlider} className={showVisibleTopTracks ? "slider_grid" : "slider_grid hidden_items_grid"}>
                    <Slider 
                    list={topTracks} 
                    category="tracks" 
                    visibility={showVisibleTopTracks} 
                    isLoggedUser={isLoggedUser} 
                    parentRef={topTracksSlider}/>
                </div>
           </section>}
           <h2> Posts </h2>
           <div>

           </div>
        </div>
    )
}
