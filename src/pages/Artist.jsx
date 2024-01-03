import React, { useEffect, useRef, useState } from "react"
import { Slider, List } from "../components"
import { useParams } from "react-router-dom"
import { formatListData, PlayBtn } from "../utils"
import useStore from "../store"

export default function Artist(){
    const { standardWrapperWidth, spotifyApi, loggedUser } = useStore()
    const { artistId } = useParams()
    const [ artistData, setArtistData ] = useState(null)
    const [ artistAlbums, setArtistAlbums] = useState(null)
    const [ artistTopTracks, setArtistTopTracks ] = useState(null)
    const [ isFollowing, setIsFollowing ] = useState(false)
    const [ hoverItemId, setHoverItemId ] = useState(null)
    const albumsSlider = useRef(null)

    async function getArtistData(){
        const response = await spotifyApi.getArtist(artistId)
        setArtistData(response)
    }

    async function getArtistTopTracks(){
        const response = await spotifyApi.getArtistTopTracks(artistId, loggedUser.country)
        const formatedData = formatListData(response.tracks, "track")
        setArtistTopTracks(formatedData)
    }

    async function getArtistAlbums(){
        const response = await spotifyApi.getArtistAlbums(artistId)
        const formatedData = formatListData(response.items, "album")
        setArtistAlbums(formatedData)
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
        <div 
        className="wrapper default_padding relative" 
        style={{ width: standardWrapperWidth, overflow: "hidden" }}>
            <section>
                <div 
                className="flex profile_cover blur_cover" 
                style={{ backgroundImage: `url("${artistData?.images[0].url}")` }}>
                </div>
                <div 
                className="cover_data_grid"
                onMouseEnter={() => setHoverItemId(artistData?.id)}
                onMouseLeave={() => setHoverItemId(null)}>
                    <div className="cover_medium" style={{ backgroundImage: `url('${artistData?.images[0].url}')` }}>
                        <PlayBtn 
                        uri={artistData?.uri} 
                        id={artistData?.id}
                        category={"cover"} 
                        type={"artist"} 
                        hoverItemId={hoverItemId}/>
                    </div>
                    <h4>Artist</h4>
                    <h1>{artistData?.name}</h1>
                    <button onClick={() => toggleFollow()} className="outline_button">{isFollowing ? "Following" : "Follow"}</button>
                </div>
            </section>
            {artistTopTracks && 
            <section>
                <h2> Popular Tracks</h2>
                <List 
                list={artistTopTracks} 
                category={"track"}
                showIndex={true}/>
            </section>}
            {artistAlbums && <h2>Discography</h2>}
            {artistAlbums && 
                <div>
                    <Slider 
                    list={artistAlbums} 
                    visibility={true} 
                    category="album" 
                    isLoggedUser={false} 
                    slidePercent={0.2} 
                    type={"list"}/>
                </div>}
        </div>
    )
}
