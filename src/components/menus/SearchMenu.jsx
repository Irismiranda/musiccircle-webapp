import React, { useEffect, useRef, useState } from "react"
import {UserList, List} from ".."
import { Axios } from "../../Axios-config"
import useStore from "../../store"

export default function SearchMenu(){
    const [searchResults, setSearchResults] = useState(null)
    const [activeCategory, setActiveCategory] = useState("tracks")
    const { spotifyApi } = useStore()
    const searchBarRef = useRef(null)

    async function search(){
        const searchTerm = searchBarRef.current.value
        const options = {limit: 20}

        if(!activeCategory || searchTerm === "") return
        
        if(activeCategory === "tracks"){
            const response = await spotifyApi.searchTracks(searchTerm, options)
            console.log(response.tracks.items)
            setSearchResults(response.tracks.items)
        } else if(activeCategory === "artists"){
            const response = await spotifyApi.searchArtists(searchTerm, options)
            console.log(response.artists.items)
            setSearchResults(response.artists.items)
        } else if(activeCategory === "albums"){
            const response = await spotifyApi.searchAlbums(searchTerm, options)
            console.log(response.albums.items)
            setSearchResults(response.albums.items)
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

            {searchResults && 
            <section>
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
