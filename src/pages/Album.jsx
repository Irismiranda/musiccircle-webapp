import React, { useEffect, useRef, useState } from "react"
import { Slider, List } from "../components"
import { useParams } from "react-router-dom"
import { formatListData } from "../utils"
import useStore from "../store"

export default function Album(){
    const { standardWrapperWidth, spotifyApi } = useStore()
    const { albumId } = useParams()
    const [ albumData, setAlbumData ] = useState(null)
    const [ artistAlbums, setArtistAlbums] = useState(null)
    const [ albumTracks, setAlbumTracks ] = useState(null)
    const albumsSlider = useRef(null)

    async function getAlbumData(){
        const response = await spotifyApi.getAlbum(albumId)
        setAlbumData(response)
    }

    async function getAlbumTracks(){
        const response = await spotifyApi.getAlbumTracks(albumId)
        const tracks = formatListData(response.items, "tracks")
        setAlbumTracks(tracks)
    }

    async function getArtistAlbums(){
        const response = await spotifyApi.getArtistAlbums(albumData.artists[0].id)
        const formatedData = formatListData(response.items, "albums")
        setArtistAlbums({items: formatedData})
    }

    useEffect(() => {
        if(albumId){
            getAlbumData()
            getAlbumTracks()
        }
        if(albumData){
            getArtistAlbums()
        }
    }, [albumId, albumData])
    
    return(
        <div className="wrapper default_padding" style={{ width: standardWrapperWidth }}>
            <div className="cover_container flex">
                <img src={albumData?.images[0].url} className="cover_large"/>
                <h2>{albumData?.name}</h2>
            </div>
            {albumTracks && 
            <section>
                <h2> Tracks</h2>
                <List 
                list={albumTracks} 
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
