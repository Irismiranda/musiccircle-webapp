import React, { useEffect, useRef, useState } from "react"
import {UserList, List} from ".."
import { formatListData } from "../../utils"
import { Axios } from "../../Axios-config"
import useStore from "../../store"

export default function SearchMenu(){
    const [searchResults, setSearchResults] = useState(null)
    const [isLoading, setIsLoading] = useState(true)
    const [activeCategory, setActiveCategory] = useState("tracks")
    const { spotifyApi } = useStore()
    const searchBarRef = useRef(null)

    async function search(){
        setIsLoading(true)
        const searchTerm = searchBarRef.current.value
        const options = {limit: 20}

        if(!activeCategory) return

        if(searchTerm === "" && activeCategory !== "user"){
            const response = await spotifyApi.getMyRecentlyPlayedTracks()
            const tracks = response.items.map(item => {
                return item.track
            })
            const formatedData = formatListData(tracks)
            setSearchResults(formatedData)
        } else if(activeCategory === "tracks"){
            const response = await spotifyApi.searchTracks(searchTerm, options)
            if(response){
                const formatedData = formatListData(response.tracks.items)
                setSearchResults(formatedData)
            } else setSearchResults(null)
        } else if(activeCategory === "artists"){
            const response = await spotifyApi.searchArtists(searchTerm, options)
            const formatedData = formatListData(response.artists.items)
            setSearchResults(formatedData)
        } else if(activeCategory === "albums"){
            const response = await spotifyApi.searchAlbums(searchTerm, options)
            const formatedData = formatListData(response.albums.items)
            setSearchResults(formatedData)
        } else if(activeCategory === "users" && searchTerm !== ""){
            const response = await Axios.get(`/api/user/search/${searchTerm}`)
            console.log("response is:", response)
            setSearchResults(response)
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

            {(!isLoading && searchResults?.length > 0) ? 
            <section
            style={{ overflowY: "scroll" }}>
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
            <h3>No {category} were found</h3>}

        </div>
    )
}
