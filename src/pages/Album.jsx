import React, { useEffect, useRef, useState } from "react"
import { Slider, SimplifiedList } from "../components"
import { useParams } from "react-router-dom"
import { formatListData, PlayBtn  } from "../utils"
import useStore from "../store"

export default function Album(){
    const { standardWrapperWidth, spotifyApi } = useStore()
    const { albumId } = useParams()
    const [ albumData, setAlbumData ] = useState(null)
    const [ artistAlbums, setArtistAlbums] = useState(null)
    const [ albumTracks, setAlbumTracks ] = useState(null)
    const [ hoverItemId, setHoverItemId ] = useState(null)

    async function getAlbumData(){
        const response = await spotifyApi.getAlbum(albumId)
        setAlbumData(response)
    }

    async function getAlbumTracks(){
        const response = await spotifyApi.getAlbumTracks(albumId)
        const tracks = formatListData(response.items, "simplified")
        setAlbumTracks(tracks)
    }

    async function getArtistAlbums(){
        const response = await spotifyApi.getArtistAlbums(albumData.artists[0].id)
        const formatedData = formatListData(response.items, "albums")
        setArtistAlbums( formatedData.filter(item => item.id !== albumData.id))    
    }

    useEffect(() => {
        if(albumId){
            getAlbumData()
            getAlbumTracks()
        }
    }, [albumId])

    useEffect(() => {
        if(albumData){
            getArtistAlbums()
        }
    }, [albumData])
    
    return(
        <div className="wrapper default_padding" style={{ width: standardWrapperWidth, overflow: "hidden" }}>
            <section style={{ position: "relative" }}>
                <div className="flex profile_cover blur_cover" style={{ backgroundImage: `url("${albumData?.images[0].url}")` }}>
                </div>
                <div 
                className="cover_data_grid"
                onMouseEnter={() => setHoverItemId(albumData?.id)}
                onMouseLeave={() => setHoverItemId(null)}>
                    <div className="cover_medium" style={{ backgroundImage: `url('${albumData?.images[0].url}')` }}>
                        <PlayBtn 
                        uri={albumData?.uri} 
                        id={albumData?.id}
                        category={"cover"} 
                        type={"album"} 
                        hoverItemId={hoverItemId}/>
                    </div>
                    <h4>Album</h4>
                    <h1>{albumData?.name}</h1>
                    <h2>{albumData?.artists[0].name}</h2>
                </div>
            </section>
            
            {albumTracks && 
            <section>
                <h2> Tracks</h2>
                <SimplifiedList 
                list={albumTracks} 
                category={"tracks"}/>
            </section>}
            {artistAlbums && <h2>More on {albumData?.artists[0].name}</h2>}
            {(artistAlbums && albumData) && 
            <Slider 
            list={artistAlbums} 
            visibility={true} 
            category="albums" 
            isLoggedUser={false}
            slidePercent={0.2} 
            type={"list"}/>}
        </div>
    )
}
