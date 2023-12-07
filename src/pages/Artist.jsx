import React, { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import useStore from "../store"

export default function Artist(){
    const { standardWrapperWidth, spotifyApi } = useStore()
    const { artistId } = useParams()
    const [ artistData, setArtistData ] = useState(null)

    async function getArtistData(){
        const data = await spotifyApi.getArtist()
        setArtistData(data)
        console.log("artist data is:", artistData)
    }
    

    useEffect(() => {
        if(artistId){
            getArtistData()
        }
    }, [artistId])
    
    return(
        <div className="wrapper default_padding" style={{ width: standardWrapperWidth }}>
            <h1> Artist Page Goes Here</h1>
        </div>
    )
}
