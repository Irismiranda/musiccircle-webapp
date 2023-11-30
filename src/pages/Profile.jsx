import React, { useEffect, useState } from "react"
import { useParams, Link } from "react-router-dom"
import { Axios } from "../Axios-config"
import useStore from "../store"

export default function Profile(){
    const { standardWrapperWidth, currentUser, spotifyApi } = useStore()
    const { userId } = useParams()
    const [ isLoggedUser, setIsLoggedUser ] = useState(false)
    const [ userProfileData, setUserProfileData ] = useState(null)
    const [ topTracks, settopTracks ] = useState(null)
    const [ topArtists, setTopArtists ] = useState(null)

    async function getUser(id){
        const response = await Axios.post("/api/profile", {
            userData: {
                id: id,
                type: "user",
            }
        })
        setUserProfileData(response.data.userData)
    }

    async function getTopTracks(){
       const response = await Axios.get(`/api/profile/top_tracks/${currentUser.id}`)
       settopTracks(response.data)
    }

    async function getTopArtists(){
        const response = await Axios.get(`/api/profile/top_artists/${currentUser.id}`)
        setTopArtists(response.data)
     }

    useEffect(() => {
        console.log("log - useEffect ran on profile")
        if(spotifyApi){
           
        }
    }, [spotifyApi])
    
    useEffect(() => {
        if(userId === currentUser.id){
            setIsLoggedUser(true)
            setUserProfileData(currentUser)
            getTopTracks()
            getTopArtists()
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
           <button>Edit</button>
           <button>{topArtists?.show_top_artists ? "Hide Top Artists" : "Show Top Artists"}</button>
           {topArtists?.show_top_artists && 
           <section>
                <h1> Top Artists </h1>
                <div>
                   {topArtists.map((artist) => {
                   return (
                    <Link to={`/artist/${artist.id}`}>
                        <img src={artist.images[0]}/>
                        <button data-artist_id={artist.id}>Hide</button>
                        <h3>{artist.name}</h3>
                    </Link>
                   )
                   }) }
                </div>
           </section>}
           <button>{topTracks?.show_top_tracks ? "Hide Top Tracks" : "Show Top Tracks"}</button>
           {topTracks?.show_top_tracks && 
           <section>
                <h1> Top Songs </h1>
                <div>
                   {topTracks.map((track) => {
                   return (
                    <Link to={`/song=${track.id}`}>
                        <img src={track.album.images[0]}/>
                        <button data-track_id={track.id}>Hide</button>
                        <h3>{track.name}</h3>
                    </Link>
                   )
                   }) }
                </div>
           </section>}
           <h1> Posts </h1>
           <div>

           </div>
        </div>
    )
}
