import React, { useEffect, useRef, useState } from "react"
import { Slider, List } from "../components"
import { useParams } from "react-router-dom"
import { formatListData } from "../utils/utils"
import useStore from "../store"

export default function Artist(){
    const { standardWrapperWidth, spotifyApi, loggedUser } = useStore()
    const { artistId } = useParams()
    const [ artistData, setArtistData ] = useState(null)
    const [ artistAlbums, setArtistAlbums] = useState(null)
    const [ artistTopTracks, setArtistTopTracks ] = useState(null)
    const [ isFollowing, setIsFollowing ] = useState(false)
    const albumsSlider = useRef(null)

    async function getArtistData(){
        const response = await spotifyApi.getArtist(artistId)
        setArtistData(response)
    }

    async function getArtistTopTracks(){
        const response = await spotifyApi.getArtistTopTracks(artistId, loggedUser.country)
        console.log("response is:", response)
        const formatedData = formatListData(response.tracks, "tracks")
        console.log("formated top track list is:", formatedData)
        setArtistTopTracks({items: formatedData})
    }

    async function getArtistAlbums(){
        const response = await spotifyApi.getArtistAlbums(artistId)
        const formatedData = formatListData(response.items, "albums")
        setArtistAlbums({items: formatedData})
    }

    async function getIsFollowing(){
        const response = await spotifyApi.isFollowingArtists([artistId])
        setIsFollowing(response[0])
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
        getIsFollowing()
    }

    useEffect(() => {
        if(artistId){
            getArtistData()
            getArtistAlbums()
            getArtistTopTracks()
            getIsFollowing()
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
            {artistTopTracks && 
            <section>
                <List 
                list={artistTopTracks} 
                category={"tracks"}/>
            </section>}
            {artistAlbums && <h2>Discography</h2>}
            {artistAlbums && 
            <section style={{ position: "relative" }} >
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
