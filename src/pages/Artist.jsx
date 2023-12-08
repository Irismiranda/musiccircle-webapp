import React, { useEffect, useState } from "react"
import { Slider } from "../components"
import { useParams } from "react-router-dom"
import useStore from "../store"

export default function Artist(){
    const { standardWrapperWidth, spotifyApi } = useStore()
    const { artistId } = useParams()
    const [ artistData, setArtistData ] = useState(null)

    async function getArtistData(){
        const data = await spotifyApi.getArtist(artistId)
        setArtistData(data)
        console.log("artist data is:", data)
    }

    async function getArtistData(){
        const data = await spotifyApi.getArtist(artistId)
        setArtistData(data)
        console.log("artist data is:", data)
    }

    useEffect(() => {
        if(artistId){
            getArtistData()
        }
    }, [artistId])
    
    return(
        <div className="wrapper default_padding" style={{ width: standardWrapperWidth }}>
            <div style={{ backgroundImage: `url("${artistData?.images[0].url}")` }}>
                <h1>{artistData?.name}</h1>
            </div>
            <h1> Artist Page Goes Here</h1>
        </div>
    )
}
