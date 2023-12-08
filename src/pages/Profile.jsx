import React, { useEffect, useRef, useState } from "react"
import { useParams } from "react-router-dom"
import { Slider } from "../components"
import { Axios } from "../Axios-config"
import useStore from "../store"

export default function Profile(){
    const { standardWrapperWidth, currentUser, userTopTracks, userTopArtists, setUserTopTracks, setUserTopArtists } = useStore()
    const { userId } = useParams()
    const [ isLoggedUser, setIsLoggedUser ] = useState(false)
    const [ userProfileData, setUserProfileData ] = useState(null)
    const [ topTracks, setTopTracks ] = useState(null)
    const [ topArtists, setTopArtists ] = useState(null)
    const [ showVisibleTopTracks, setShowVisibleTopTracks ] = useState(true)
    const [ showVisibleTopArtists, setShowVisibleTopArtists ] = useState(true)
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

    function hideSection(category){
        const response = Axios.post(`/api/user/${category}/hide_category`, {
            userId: currentUser.id
        })
        category === "top_artists" && setUserTopArtists(response.data)
        category === "top_track" && setUserTopTracks(response.data)
    }
    
    useEffect(() => {
        if(userId === currentUser.id){
            setIsLoggedUser(true)
            setUserProfileData(currentUser)
            userTopTracks && setTopTracks(userTopTracks)
            userTopArtists && setTopArtists(userTopArtists)
        } else{
            userId && getUser(userId)
        }
    }, [userId, userTopTracks, userTopArtists])

    useEffect(() => {
    }, [userTopArtists, userTopTracks])
    
    return(
        <div className="wrapper default_padding profile" style={{ width: standardWrapperWidth }}>
            <section className="flex" style={{ marginBottom: "30px" }}>
                <img src={`${userProfileData?.images[1].url}`} className="profile_large" style={{ marginRight: "90px" }}/>
                <div className="user_data_grid">
                    <h2>{userProfileData?.display_name}</h2>
                    {isLoggedUser ? <button> Edit Profile </button> : <button> Follow </button>} 
                    <div>
                        <h3> Posts </h3>
                        <h3> Followers </h3>
                        <h3> Following </h3>
                    </div>
                </div>
            </section>
            <section className={ showVisibleTopArtists ? "flex space_between slider_wrapper aling_start" : "slider_wrapper flex space_between hidden_items_section aling_start" }>
                <div className="flex aling_start">
                    {(topArtists?.show_top_artists || isLoggedUser) && <h2> Top Artists </h2>}
                    {isLoggedUser && <button onClick={() => setShowVisibleTopArtists(!showVisibleTopArtists)}>{showVisibleTopArtists ? "Show Hidden Artists" : "Hide" }</button>}
                </div>
                {isLoggedUser && <button onClick={() => hideSection("top_artists")}>{topArtists?.show_top_artists ? "Hide Top Artists" : "Show Top Artists"}</button>}
            </section>
            {!topArtists && <h3>Loading...</h3>}
            {(topArtists && topArtists.items.length > 0 && (topArtists?.show_top_tracks || isLoggedUser)) && 
            <section style={{ position: "relative" }} className={topTracks?.show_top_tracks ? "" : "transparent_section"}>
                <div ref={topArtistsSlider} className={showVisibleTopArtists ? "slider_grid" : "slider_grid hidden_items_grid"}>
                    <Slider list={topArtists} category="artists" visibility={showVisibleTopArtists} isLoggedUser={isLoggedUser} parentRef={topArtistsSlider}/>
                </div>
           </section>}
           <section className={ showVisibleTopTracks ? "slider_wrapper flex space_between aling_start" : "slider_wrapper flex space_between hidden_items_section aling_start" }>
            <div className="flex aling_start">
                {(topArtists?.show_top_tracks || isLoggedUser) && <h2>  Top Tracks </h2>}
                {isLoggedUser && <button onClick={() => setShowVisibleTopTracks(!showVisibleTopTracks)}>{showVisibleTopTracks ?  "Show HiddenTracks" : "Hide"}</button>}
            </div>
                {isLoggedUser && <button onClick={() => hideSection("top_tracks")}>{topTracks?.show_top_tracks ? "Hide Top Tracks" : "Show Top Tracks"}</button>}
           </section>
           {!topTracks && <h3>Loading...</h3>}
           {(topTracks && topTracks.items.length > 0 && (topTracks?.show_top_tracks || isLoggedUser)) && 
           <section style={{ position: "relative" }} className={topTracks?.show_top_tracks ? "" : "transparent_section"}>
                <div ref={topTracksSlider} className={showVisibleTopTracks ? "slider_grid" : "slider_grid hidden_items_grid"}>
                    <Slider list={topTracks} category="tracks" visibility={showVisibleTopTracks} isLoggedUser={isLoggedUser} parentRef={topTracksSlider}/>
                </div>
           </section>}
           <h2> Posts </h2>
           <div>

           </div>
        </div>
    )
}
