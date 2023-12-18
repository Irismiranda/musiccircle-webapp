import React, { useEffect, useRef, useState } from "react"
import {UserList, SimplifiedList} from ".."
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

        if(!activeCategory || searchTerm === "") return
        
        if(activeCategory === "tracks"){
            const response = await spotifyApi.searchTracks(searchTerm, options)
            setSearchResults(response.tracks)
        } else if(activeCategory === "artists"){
            const response = await spotifyApi.searchArtists(searchTerm, options)
            setSearchResults(response.albums)
        } else if(activeCategory === "albums"){
            const response = await spotifyApi.searchAlbums(searchTerm, options)
            setSearchResults(response.artists)
        } else if(activeCategory === "users"){
            const response = await Axios.get(`/api/user/search/${searchTerm}`)
            setSearchResults(response.data)
        }
        
    }

    useEffect(() => {
        search()
    }, [activeCategory])

    return (
        <>
            <section className="flex space_between" style={{ marginBottom: "20px" }}>
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
                    ALbums
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

            {searchResults && 
            <section>
                {activeCategory === "users" ?
                <UserList 
                list={searchResults}
                showBtn={false}/> :
                <SimplifiedList 
                list={{searchResults}} 
                category={activeCategory} />}
            </section>}

        </>
    )
}
