import React, { useEffect, useState } from "react"
import { Slider } from "../components"
import { useParams } from "react-router-dom"
import useStore from "../store"

export default function Artist(){
    const { standardWrapperWidth, spotifyApi } = useStore()
    const { artistId } = useParams()
    const [ artistData, setArtistData ] = useState(null)
    const [ isFollowing, setIsFollowing ] = useState(false)

    async function getArtistData(){
        const response = await spotifyApi.getArtist(artistId)
        setArtistData(response)
        console.log("artist data is:", response)
    }

    async function getIsFollowing(){
        const response = await spotifyApi.isFollowingArtists([artistId])
        setIsFollowing(response)
    }

    useEffect(() => {
        if(artistId){
            getArtistData()
            getIsFollowing()
        }
    }, [artistId])
    
    return(
        <div className="wrapper default_padding" style={{ width: standardWrapperWidth }}>
            <div className="artist_profile_cover" style={{ backgroundImage: `url("${artistData?.images[0].url}")` }}>
                <h1>{artistData?.name}</h1>
                <button className="outline_button">{isFollowing ? "following" : "follow"}</button>
            </div>
            <h1> Artist Page Goes Here</h1>
        </div>
    )
}
