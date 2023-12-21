import React, { useState, useRef } from "react"
import useStore from "../../store"
import { Link } from "react-router-dom"
import { Axios } from "../../Axios-config"
import { PlayBtn, SliderScrollBtns } from "../../utils"

export default function Slider(props){
    const { list, visibility, category, isLoggedUser, type } = props
    const { loggedUser, setUserTopTracks, setUserTopArtists } = useStore()
    const parentRef = useRef(null)
    
    const [ hoverItemId, setHoverItemId ] = useState(null)

    async function toggleItemVisibility(itemId, category){
        const response = await Axios.post(`/api/user/top_${category}s/hide_item`, {
            userId: loggedUser.id,
            itemId: itemId,
        })
        category === "track" && setUserTopTracks(response.data.top_tracks)
        category === "artist" && setUserTopArtists(response.data.top_artists)
    }

    return(
        <>
            <SliderScrollBtns 
            parentRef={parentRef}
            list={list}/>

            <div 
            className="slider_grid"
            ref={parentRef}
            style={{ position: "relative" }} >
                {list
                    .filter(item => item.isVisible === visibility)
                    .sort((a, b) => {
                        if (a.releaseDate && b.releaseDate) {
                            return b.releaseDate.localeCompare(a.releaseDate)
                        }
                        return 0
                    })
                    .slice(type === "top_list" ? 0 : undefined, type === "top_list" ? 10 : undefined)
                    .map((item) => {
                        return (
                            <div className="slider_item_wrapper" key={item.id}>
                                <div className="slider_image_wrapper">
                                    <Link to={category === "tracks" ? "" : `/${item.type}/${item.id}`}>
                                        <div 
                                        onMouseEnter={() => setHoverItemId(item.id)}
                                        onMouseLeave={() => setHoverItemId(null)}
                                        style={{ backgroundImage: `url('${item.imageUrl}')`}} className="cover_medium cover_wrapper">
                                        </div>
                                    </Link>
                                    {isLoggedUser && <button onClick={() => toggleItemVisibility(item.id, item.type)}>{visibility ? "Hide" : "Show"}</button>}
                                    <div onMouseEnter={() => setHoverItemId(item.id)}>
                                        <PlayBtn 
                                        uri={item.uri} 
                                        id={item.id}
                                        category={"slider"} 
                                        type={item.type} 
                                        hoverItemId={hoverItemId}/>
                                    </div>
                                </div>
                                <Link to={category === "tracks" ? "" : `/${item.type}/${item.id}`}>
                                    <h3>{item.name}</h3>
                                    {(category === "tracks" || category === "albums") && <h5>{item.artistName}</h5>}
                                    <h4>{(category === "albums" || category === "albums") && 
                                    <span>{item.releaseDate.slice(0, -6)} • </span>}
                                    {category.slice(0, -1)}</h4>
                                </Link>
                            </div>
                            )
                        })   
                    }     
            </div>
        </>
    )
}

