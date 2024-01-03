import React, { useEffect, useRef, useState } from "react"
import { normalizeText } from 'normalize-text'
import { formatListData } from "../../utils"
import {UserList, List} from ".."
import { Axios } from "../../Axios-config"
import useStore from "../../store"

export default function SearchMenu(){
    const [searchResults, setSearchResults] = useState(null)
    const [isLoading, setIsLoading] = useState(true)
    const [activeCategory, setActiveCategory] = useState("track")
    const { spotifyApi } = useStore()
    const searchBarRef = useRef(null)

    async function search(){
        setIsLoading(true)
        const searchTerm = searchBarRef.current.value
        const options = {limit: 20}

        if(!activeCategory) return

        if(searchTerm === "" && activeCategory !== "users"){
            const response = await spotifyApi.getMyRecentlyPlayedTracks()
            const tracks = response.items.map(item => {
                return item.track
            })
            const formatedData = formatListData(tracks, "track")
            setSearchResults(formatedData)

        } else if(activeCategory === "track"){

            const response = await spotifyApi.searchTracks(searchTerm, options)

            if(response){

                const formatedData = formatListData(response.tracks.items, "track")

                setSearchResults(formatedData)
            } else setSearchResults(null)

        } else if(activeCategory === "artist"){

            const response = await spotifyApi.searchArtists(searchTerm, options)
            const formatedData = formatListData(response.artists.items, "artist")

            setSearchResults(formatedData)

        } else if(activeCategory === "album"){
            const response = await spotifyApi.searchAlbums(searchTerm, options)
            const formatedData = formatListData(response.albums.items, "album")

            setSearchResults(formatedData)

        } else if(activeCategory === "users"){
            if(searchTerm !== ""){
                const normalizedSearchTerm = normalizeText(searchTerm).replace(/\s/g,'').toLowerCase()
                const response = await Axios.get(`/api/search/user/${normalizedSearchTerm}`)

                const formatedData = formatListData(response.data, "user")

                setSearchResults(formatedData)

            } else {
                setSearchResults(null)
            }
        }
        
        setIsLoading(false)
    }
    
    useEffect(() => {
        search()
    }, [activeCategory])

    return (
        <div
        className="search_list_wrapper flex flex_column">
            <section 
            className="flex space_between">
                <button 
                className="bullet_btn"
                style={{ backgroundColor: activeCategory === "track" ? "#F230AA" : ""}}
                onClick={() => setActiveCategory("track")}>
                    Tracks
                </button>

                <button 
                className="bullet_btn"
                style={{ backgroundColor: activeCategory === "album" ? "#F230AA" : ""}}
                onClick={() => setActiveCategory("album")}>
                    Albums
                </button>

                <button 
                className="bullet_btn"
                style={{ backgroundColor: activeCategory === "artist" ? "#F230AA" : ""}}
                onClick={() => setActiveCategory("artist")}>
                    Artists
                </button>

                <button 
                className="bullet_btn"
                style={{ backgroundColor: activeCategory === "users" ? "#F230AA" : ""}}
                onClick={() => {
                    setIsLoading(true)
                    setActiveCategory("users")}}>
                    Users
                </button>
            </section>

            <input 
            ref={searchBarRef}
            onInput={() => search()}
            className="search_bar" 
            placeholder="Search..." />

            {(searchBarRef?.current?.value === "" && searchResults?.length > 0) && <h2>Recently Listened</h2>}

            {(!isLoading && searchResults?.length > 0) ? 
            <section className="search_list_wrapper">
                {activeCategory === "users" ?
                <UserList 
                list={searchResults}
                showBtn={false}/> :
                <List 
                list={searchResults} 
                category={activeCategory}
                showIndex={false} />}
            </section> :
            isLoading ? <h3>Loading...</h3> :
            <h3>No {activeCategory} were found</h3>}

        </div>
    )
}
