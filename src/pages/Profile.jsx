import React, { useEffect, useRef, useState } from "react"
import { useParams, Link } from "react-router-dom"
import { Axios } from "../Axios-config"
import { SvgRightBtn, SvgLeftBtn } from "../assets"
import useStore from "../store"

export default function Profile(){
    const { standardWrapperWidth, currentUser, spotifyApi } = useStore()
    const { userId } = useParams()
    const [ isLoggedUser, setIsLoggedUser ] = useState(false)
    const [ userProfileData, setUserProfileData ] = useState(null)
    const [ topTracks, setTopTracks ] = useState(null)
    const [ topArtists, setTopArtists ] = useState(null)
    const topArtistsSlider = useRef(null)
    const topTracksSlider = useRef(null)

    async function getUser(id){
        console.log("log - id is:", id)
        const response = await Axios.post("/api/profile", {
            userData: {
                id: id,
                type: "user",
            }
        })
        console.log("response is:", response.data)
        setUserProfileData(response.data)
        getTopTracks()
        getTopArtists()
        console.log("log - user data is:", response.data.userData)
    }

    async function getTopTracks(id){
       const response = await Axios.get(`/api/profile/top_tracks/${userId}`)
       setTopTracks(response.data)
    }

    async function getTopArtists(){
        const response = await Axios.get(`/api/profile/top_artists/${userId}`)
        setTopArtists(response.data)
     }
     
    function slideLeft(parentRef){
        parentRef.current.scrollBy({ left: -100, behavior: 'smooth' })
    }
    
    function slideRight(parentRef){
        parentRef.current.scrollBy({ left: 100, behavior: 'smooth' })
    }

    function hideItem(id){

    }

    useEffect(() => {
        console.log("log - top tracks are:", topTracks, "top artists are:", topArtists)
    }, [topTracks, topArtists])
    
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
            <div className="flex">
                <img src={`${userProfileData?.images[1].url}`} className="profile_large"/>
                <div className="user_data_grid">
                    <h2>{userProfileData?.display_name}</h2>
                    {isLoggedUser ? <button> Edit Profile </button> : <button> Follow </button>} 
                    <h3> Posts </h3>
                    <h3> Followers </h3>
                    <h3> Following </h3>
                </div>
            </div>
            <div className="flex">
                <h1> Top Artists </h1>
                {isLoggedUser && <button>{topArtists?.showTopArtists ? "Hide Top Artists" : "Show Top Artists"}</button>}
            </div>
           {(topArtists && topArtists?.showTopArtists) && 
           <section>
                <div style={{ position: "relative" }}>
                    <div className="btn_wrapper_left" onClick={() => slideLeft(topArtistsSlider)}>
                        <SvgLeftBtn style={{ height: "25px" }} />
                    </div>
                    <div className="btn_wrapper_right" onClick={() => slideRight(topArtistsSlider)}>
                        <SvgRightBtn style={{ height: "25px" }} />
                    </div>
                </div>
                <div ref={topArtistsSlider} className="slider_grid">
                   {topArtists.artists.map((artist) => {
                   return (
                        <Link to={`/artist/${artist.id}`}>
                            <div style={{ backgroundImage: `url('${artist.images[0].url}')`}} className="cover_medium cover_wrapper">
                                <button onClick={() => hideItem(track.id)}>Hide</button>
                            </div>
                            <h3>{artist.name}</h3>
                        </Link>
                        )
                    }) 
                   }
                </div>
           </section>}
           <div className="flex">
                <h1> Top Tracks </h1>
                {isLoggedUser && <button>{topTracks?.showTopTracks ? "Hide Top Tracks" : "Show Top Tracks"}</button>}
           </div>
           {(topTracks && topTracks?.showTopTracks) && 
           <section>
                <div style={{ position: "relative" }}>
                    <div className="btn_wrapper_left" onClick={() => slideLeft(topArtistsSlider)}>
                        <SvgLeftBtn className="svg"/>
                    </div>
                    <div className="btn_wrapper_right" onClick={() => slideRight(topTracksSlider)}>
                        <SvgRightBtn className="svg"/>
                    </div>
                    <div ref={topTracksSlider} className="slider_grid">
                    {topTracks.tracks.map((track) => {
                    return (
                            <Link to={`/song=${track.id}`}>
                                <div style={{ backgroundImage: `url('${track.album.images[0].url}')`}} className="cover_medium cover_wrapper">
                                    <button onClick={() => hideItem(track.id)}>Hide</button>
                                </div>
                                <h3>{track.name}</h3>
                                <h5>{track.artists[0].name}</h5>
                            </Link>
                            )
                        }) 
                    }
                    </div>
                </div>
           </section>}
           <h1> Posts </h1>
           <div>

           </div>
        </div>
    )
}
