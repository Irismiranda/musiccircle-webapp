import React, { useEffect, useRef, useState } from "react"
import {UserList, List} from ".."
import { formatListData } from "../../utils"
import { Axios } from "../../Axios-config"
import useStore from "../../store"

export default function SearchMenu(){
    const [searchResults, setSearchResults] = useState(null)
    const [activeCategory, setActiveCategory] = useState(null)
    const { spotifyApi } = useStore()
    const searchBarRef = useRef(null)

    async function search(){
        const searchTerm = searchBarRef.current.value
        const options = {limit: 20}

        if(!activeCategory) return

        if(searchTerm === ""){
            const response = await spotifyApi.getMyRecentlyPlayedTracks()
            const tracks = response.items.map(item => {
                return item.track
            })
            const formatedData = formatListData(tracks)
            setSearchResults(formatedData)
        } else if(activeCategory === "tracks"){
            const response = await spotifyApi.searchTracks(searchTerm, options)
            const formatedData = formatListData(response.tracks.items)
            setSearchResults(formatedData)
        } else if(activeCategory === "artists"){
            const response = await spotifyApi.searchArtists(searchTerm, options)
            const formatedData = formatListData(response.artists.items)
            setSearchResults(formatedData)
        } else if(activeCategory === "albums"){
            const response = await spotifyApi.searchAlbums(searchTerm, options)
            const formatedData = formatListData(response.albums.items)
            setSearchResults(formatedData)
        } else if(activeCategory === "users"){
            const response = await Axios.get(`/api/user/search/${searchTerm}`)
            setSearchResults(response)
        }
        
    }

    useEffect(() => {
        search()
    }, [activeCategory])

    return (
        <>
            <section 
            className="flex space_between">
                <button 
                className="bullet_btn"
                style={{ backgroundColor: activeCategory === "tracks" ? "#F230AA" : ""}}
                onClick={() => setActiveCategory("tracks")}>
                    Tracks
                </button>

                <button 
                className="bullet_btn"
                style={{ backgroundColor: activeCategory === "albums" ? "#F230AA" : ""}}
                onClick={() => setActiveCategory("albums")}>
                    Albums
                </button>

                <button 
                className="bullet_btn"
                style={{ backgroundColor: activeCategory === "artists" ? "#F230AA" : ""}}
                onClick={() => setActiveCategory("artists")}>
                    Artists
                </button>

                <button 
                className="bullet_btn"
                style={{ backgroundColor: activeCategory === "users" ? "#F230AA" : ""}}
                onClick={() => setActiveCategory("users")}>
                    Users
                </button>
            </section>

            <input 
            ref={searchBarRef}
            onInput={() => search()}
            className="search_bar" 
            placeholder="Search..." />

            {(searchBarRef?.current?.value === "") && <h3>Recently Listened</h3>}

            {searchResults && 
            <section
            style={{ overflowY: "scroll" }}>
                {activeCategory === "users" ?
                <UserList 
                list={searchResults}
                showBtn={false}/> :
                <List 
                list={searchResults} 
                category={activeCategory} />}
            </section>}

        </>
    )
}
