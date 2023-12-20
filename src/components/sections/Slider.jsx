import React, { useState, useEffect } from "react"
import useStore from "../../store"
import { Link } from "react-router-dom"
import { Axios } from "../../Axios-config"
import { SvgRightBtn, SvgLeftBtn } from "../../assets"
import { PlayBtn } from "../../utils"

export default function Slider(props){
    const { list, visibility, category, isLoggedUser, parentRef, type } = props
    const { loggedUser, setUserTopTracks, setUserTopArtists, playerState } = useStore()
    const [ maxScrollLeft, setMaxScrollLeft ] = useState(0)
    const [ listScroll, setListScroll ] = useState(0)
    const [ hoverItemId, setHoverItemId ] = useState(null)

    const { currentTrack } = playerState

    async function toggleItemVisibility(itemId, category){
        const response = await Axios.post(`/api/user/top_${category}s/hide_item`, {
            userId: loggedUser.id,
            itemId: itemId,
        })
        category === "track" && setUserTopTracks(response.data.top_tracks)
        category === "artist" && setUserTopArtists(response.data.top_artists)
    }

    function slideLeft(){
        parentRef.current.scrollBy({ left: - (maxScrollLeft * 0.2), behavior: 'smooth' })
    }
    
    function slideRight(){
        parentRef.current.scrollBy({ left: (maxScrollLeft * 0.2), behavior: 'smooth' })
    }

    useEffect(() => {
        if(parentRef.current){
            const maxScroll = parentRef.current.scrollWidth - parentRef.current.clientWidth
            setMaxScrollLeft(maxScroll)
        }
    }, [list])

        useEffect(() => {
            const handleScroll = () => {
                if (parentRef.current) {
                    setListScroll(parentRef.current.scrollLeft)
                }
            }
        
            const sliderElement = parentRef.current
            if (sliderElement) sliderElement.addEventListener('scroll', handleScroll)
        
            return () => {
                if (sliderElement) sliderElement.removeEventListener('scroll', handleScroll)
            }
        }, [list])

    return(
        <>
            {(listScroll > (maxScrollLeft * 0.08)) && 
                <div className="btn_wrapper_left" onClick={() => slideLeft()}>
            <SvgLeftBtn className="svg_left_right"/>
            </div>}
            {(listScroll < (maxScrollLeft * 0.9)) && 
                <div className="btn_wrapper_right" onClick={() => slideRight()}>
                <SvgRightBtn className="svg_left_right"/>
            </div>}
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
                                <Link to={`/${item.type}/${item.id}`}>
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
                            <Link to={`/${item.type}/${item.id}`}>
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
        </>
    )
}

