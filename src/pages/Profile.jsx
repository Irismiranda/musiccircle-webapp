import React, { useEffect, useRef, useState } from "react"
import { useParams } from "react-router-dom"
import { Slider, Post } from "../components"
import { Axios } from "../Axios-config"
import { UserSearchSection } from "../components"
import { ToggleFollowBtn } from "../utils"
import { placeholder_img } from "../assets"
import useStore from "../store"

export default function Profile(){
    const { standardWrapperWidth, loggedUser, userTopTracks, userTopArtists, setUserTopTracks, setUserTopArtists } = useStore()
    const { userId } = useParams()
    const [ isLoggedUser, setIsLoggedUser ] = useState(false)
    const [ userProfileData, setUserProfileData ] = useState(null)
    const [ topTracks, setTopTracks ] = useState(null)
    const [ topArtists, setTopArtists ] = useState(null)
    const [ posts, setPosts ] = useState(null)
    const [ showVisibleTopTracks, setShowVisibleTopTracks ] = useState(true)
    const [ showVisibleTopArtists, setShowVisibleTopArtists ] = useState(true)
    const [ userListVisibility, setUserListVisibility ] = useState({
        following: false,
        followers: false,
    })
    const followersRef = useRef(null)
    const followingRef = useRef(null)
    
    async function getUser(id){
        const response = await Axios.get(`/api/user/${id}`)
        setUserProfileData(response.data)
        const topTracksList = await Axios.get(`/api/user/data/top_tracks/${id}`)
        const topArtistsList = await Axios.get(`/api/user/data/top_artists/${id}`)
        setTopTracks(topTracksList.data)
        setTopArtists(topArtistsList.data)
    }

    async function getPosts(userId){
        const response = await Axios.get(`/api/${userId}/posts`)
        setPosts(response.data)
    }

    
    function toggleVisibility(item){
        if(!isLoggedUser || !userProfileData) return
        
        item === "following" && setUserListVisibility({
            following: true,
            followers: false,
        })
        
        item === "followers" && setUserListVisibility({
            following: false,
            followers: true,
        })
    }
    
    async function hideSection(category){
        const response = await Axios.post(`/api/user/data/${category}/hide_category`, {
            userId: loggedUser.id
        })
        category === "top_artists" && setUserTopArtists(response.data)
        category === "top_tracks" && setUserTopTracks(response.data)
    }

    useEffect(() => {

        setUserListVisibility({
            following: false,
            followers: false,
        })

        userId && getUser(userId)
        if(userId === loggedUser?.id){
            setIsLoggedUser(true)
            getPosts(loggedUser.id)
        } else{
            setIsLoggedUser(false)
            userId && getPosts(userId)
        }
    }, [userId, loggedUser])

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
            {userListVisibility.following &&
            <UserSearchSection 
            idList={userProfileData?.following} 
            setUserProfileData={setUserProfileData}
            setUserListVisibility={setUserListVisibility}
            exceptionRef={followingRef}/>}

            {userListVisibility.followers &&
            <UserSearchSection 
            idList={userProfileData?.following_you} 
            setUserProfileData={setUserProfileData}
            setUserListVisibility={setUserListVisibility}
            exceptionRef={followersRef}/>}
            
            <section 
            className="flex" 
            style={{ marginBottom: "30px" }}>
                <img src={userProfileData?.images[1] ? `${userProfileData?.images[1].url}` : placeholder_img} 
                className="profile_large" 
                style={{ marginRight: "90px" }}/>

                <div className="user_data_grid">
                    <h2>
                        {userProfileData?.display_name}
                        <br/>
                        <span className="user_handle">
                            @{userProfileData?.user_handle}
                        </span>
                    </h2>
                    {!isLoggedUser && 
                    <ToggleFollowBtn
                    className="follow_btn"
                    currentUserId={userId} 
                    loggedUser={loggedUser} 
                    setUserProfileData={setUserProfileData}/>}
                    {!isLoggedUser && 
                    <button 
                    className="message_btn">
                        Send Message
                    </button>}

                    <h3 
                    style={{ gridArea: "d" }}>
                        {posts?.length || 0} Posts
                    </h3>
                    <h3 
                    ref={followersRef}
                    onClick={() => { toggleVisibility("followers") }}
                    style={{ cursor: isLoggedUser ? "pointer" : "", textAlign: "center", gridArea: "e" }}> {userProfileData?.following_you?.length || 0} Followers 
                    </h3>
                    <h3 
                    ref={followingRef}
                    onClick={() => { toggleVisibility("following") }}
                    style={{ cursor: isLoggedUser ? "pointer" : "", textAlign: "end", gridArea: "f"  }}> {userProfileData?.following?.length || 0} Following 
                    </h3>

                </div>
            </section>
            <section className={ showVisibleTopArtists ? "flex space_between slider_wrapper aling_start" : "slider_wrapper flex space_between hidden_items_section aling_start" }>
                <div className="flex aling_start">
                    {(topArtists?.show_top_artists || isLoggedUser) && <h2> Top Artists </h2>}
                    {isLoggedUser && <button onClick={() => setShowVisibleTopArtists(!showVisibleTopArtists)}>{showVisibleTopArtists ? "Manage Hidden Artists" : "Show Artists" }</button>}
                </div>
                {isLoggedUser && <button onClick={() => hideSection("top_artists")}>{topArtists?.show_top_artists ? "Hide From My Profile" : "Show On My Porfile"}</button>}
            </section>
            {!topArtists && <h3>Loading...</h3>}
            {(topArtists && topArtists.items.length > 0 && (topArtists?.show_top_artists || isLoggedUser)) && 
            <section
            className={topArtists?.show_top_artists ? "relative" : "transparent_section relative"}>
                <div 
                className={showVisibleTopArtists ? "" : "hidden_items_grid"}>
                    <Slider 
                    list={topArtists.items} 
                    category={"artist"}
                    visibility={showVisibleTopArtists} 
                    isLoggedUser={isLoggedUser} 
                    slidePercent={0.2} 
                    type={"top_list"}/>
                </div>
           </section>}
           <section className={ showVisibleTopTracks ? "slider_wrapper flex space_between aling_start" : "slider_wrapper flex space_between hidden_items_section aling_start" }>
            <div className="flex aling_start">
                {(topTracks?.show_top_tracks || isLoggedUser) && <h2>  Top Tracks </h2>}
                {isLoggedUser && <button onClick={() => setShowVisibleTopTracks(!showVisibleTopTracks)}>{showVisibleTopTracks ?  "Manage Hidden Tracks" : "Show Tracks"}</button>}
            </div>
                {isLoggedUser && <button onClick={() => hideSection("top_tracks")}>{topTracks?.show_top_tracks ? "Hide From my Profile" : "Show On My Profile"}</button>}
           </section>
           {!topTracks && <h3>Loading...</h3>}
           {(topTracks && topTracks.items.length > 0 && (topTracks?.show_top_tracks || isLoggedUser)) && 
           <section
           className={topTracks?.show_top_tracks ? "relative" : "transparent_section relative"}>
                <div className={showVisibleTopTracks ? "" : "hidden_items_grid"}>
                    <Slider 
                    list={topTracks.items} 
                    category="track" 
                    visibility={showVisibleTopTracks} 
                    isLoggedUser={isLoggedUser} 
                    slidePercent={0.2} 
                    type="top_list"/>
                </div>
           </section>}
           {posts?.length > 0 && 
           <section 
           className="flex flex_column align_stretch"
           style={{ gap: "30px" }}>
           <h2> Posts </h2>
            { posts.map(post => {
                return (
                    <Post 
                    data={post}
                    posts={posts}
                    isLoggedUser={isLoggedUser} 
                    setPosts={setPosts}/>        
                )
            })
            }
           </section>}
        </div>
    )
}
