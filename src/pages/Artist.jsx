import React, { useEffect, useRef, useState } from "react"
import { Slider } from "../components"
import { useParams } from "react-router-dom"
import { formatListData } from "../utils/utils"
import useStore from "../store"

export default function Artist(){
    const { standardWrapperWidth, spotifyApi } = useStore()
    const { artistId } = useParams()
    const [ artistData, setArtistData ] = useState(null)
    const [ artistAlbums, setArtistAlbums] = useState(null)
    const [ isFollowing, setIsFollowing ] = useState(false)
    const albumsSlider = useRef(null)

    async function getArtistData(){
        const response = await spotifyApi.getArtist(artistId)
        console.log("response is:", response)
        setArtistData(response)
    }

    async function getArtistAlbums(){
        const response = await spotifyApi.getArtistAlbums(artistId)
        const formatedData = formatListData(response.items, "albums")
        setArtistAlbums({items: formatedData})
    }

    async function getIsFollowing(){
        const response = await spotifyApi.isFollowingArtists([artistId])
        setIsFollowing(response)
    }

    async function toggleFollow(){
        try {
            if(isFollowing){
                await spotifyApi.unfollowArtists([artistId])
            } else {
                !isFollowing && await spotifyApi.followArtists([artistId])
            }
        } catch(err){
            console.log(err)
        }
        setIsFollowing(!isFollowing)
    }

    useEffect(() => {
        if(artistId){
            getArtistData()
            getIsFollowing()
            getArtistAlbums()
        }
    }, [artistId])
    
    return(
        <div className="wrapper default_padding" style={{ width: standardWrapperWidth }}>
            <div className="artist_profile_cover" style={{ backgroundImage: `url("${artistData?.images[0].url}")` }}>
                <div className="gradient_wrapper">
                    <h1>{artistData?.name}</h1>
                    <button onClick={() => toggleFollow()} className="outline_button">{isFollowing ? "Following" : "Follow"}</button>
                </div>
            </div>
            {artistAlbums && <section style={{ position: "relative" }} >
                <h2>Discography</h2>
                <div ref={albumsSlider} className="slider_grid">
                    <Slider 
                    list={artistAlbums} 
                    visibility={true} 
                    category="albums" 
                    isLoggedUser={false} 
                    parentRef={albumsSlider}/>
                </div>
            </section>}
        </div>
    )
}
