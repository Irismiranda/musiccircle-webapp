import React, { useEffect, useState } from "react"
import { useParams, Link } from "react-router-dom"
import { Axios } from "../Axios-config"
import useStore from "../store"

export default function Profile(){
    const { standardWrapperWidth, currentUser, spotifyApi } = useStore()
    const { userId } = useParams()
    const [ isLoggedUser, setIsLoggedUser ] = useState(false)
    const [ userProfileData, setUserProfileData ] = useState(null)
    const [ topSongs, setTopSongs ] = useState(null)
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

    async function getTopSongs(){
       const response = await Axios.get(`/api/profile/top_tracks/${currentUser.id}`)
       setTopSongs(response.data)
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
            getTopSongs()
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
           <h3> Following </h3>
           {topArtists?.isVisible && 
           <section>
                <h1> Top Artists </h1>
                <button>Hide</button>
                <button>Edit</button>
                <div>
                   {topArtists.map((artist) => {
                   return (
                    <Link to={`/artist/${artist.id}`}>
                        <img src={artist.images[0]}/>
                        <h3>{artist.name}</h3>
                    </Link>
                   )
                   }) }
                </div>
           </section>}
           {topSongs?.isVisible && 
           <section>
                <button>Hide</button>
                <button>Edit</button>
                <h1> Top Songs </h1>
                <div>
                   {topSongs.map((song) => {
                   return (
                    <Link to={`/song=${song.id}`}>
                        <img src={song.album.images[0]}/>
                        <h3>{song.name}</h3>
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
