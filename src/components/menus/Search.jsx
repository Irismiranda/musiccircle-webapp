import React, { useRef, useState } from "react"
import {List, SimplifiedList} from "../"
import { Axios } from "../../Axios-config"
import { useStore } from "zustand"

export default function Search(){
    const [searchResults, setSearchResults] = useState(null)
    const [activeCategory, setActiveCategory] = useState(null)
    const { spotifyApi } = useStore
    const searchBarRef = useRef(null)

    async function search(){
        const searchTerm = searchBarRef.current.value
        console.log("search term is:", searchTerm)
        const options = {limit: 20}

        if(searchTerm === ""){
            return
        } else if(activeCategory === "tracks"){
            const response = await spotifyApi.searchTracks(searchTerm, options)
            setSearchResults(response.items)
        } else if(activeCategory === "artists"){
            const response = await spotifyApi.searchArtists(searchTerm, options)
            setSearchResults(response.items)
        } else if(activeCategory === "albums"){
            const response = await spotifyApi.searchAlbums(searchTerm, options)
            setSearchResults(response.items)
        } else if(activeCategory === "users"){
            const response = await Axios.get(`/api/user/search/${searchTerm}`)
            setSearchResults({items: response.data})
        }
        
    }

    return (
        <div className="wrapper default_padding" style={{ paddingTop: "50px" }}>
            <section>
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

            <section>
                {activeCategory === "users" ?
                <UserList 
                list={searchResults}/> :
                <SimplifiedList 
                list={searchResults} 
                category={activeCategory} />}
            </section>

        </div>
    )
}
