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
    const albumsSection = useRef(null)

    async function getArtistData(){
        const response = await spotifyApi.getArtist(artistId)
        setArtistData(response)
    }

    async function getArtistAlbums(){
        const response = await spotifyApi.getArtistAlbums(artistId)
        console.log("albums data are:", response)
        const formatedData = formatListData(response.items, "albums")
        console.log("formated data is:", formatedData)
        setArtistAlbums({items: formatedData})
    }

    async function getIsFollowing(){
        const response = await spotifyApi.isFollowingArtists([artistId])
        setIsFollowing(response)
    }

    async function toggleFollow(){
        try {
            isFollowing && await spotifyApi.unfollowArtists([artistId])
            !isFollowing && await spotifyApi.followArtists([artistId])
            getIsFollowing()
        } catch(err){
            console.log(err)
        }
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
            <section ref={albumsSection}>
                <Slider list={artistAlbums} visibility={true} category="albums" isLoggedUser={false} parentRef={albumsSection}/>
            </section>
        </div>
    )
}
