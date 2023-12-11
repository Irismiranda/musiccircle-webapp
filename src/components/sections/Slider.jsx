import React, { useState, useEffect } from "react"
import useStore from "../../store"
import { Link } from "react-router-dom"
import { Axios } from "../../Axios-config"
import { SvgRightBtn, SvgLeftBtn } from "../../assets"
import { PlayBtn } from "../../utils"

export default function Slider(props){
    const { list, visibility, category, isLoggedUser, parentRef } = props
    const { loggedUser, setUserTopTracks, setUserTopArtists, playerState } = useStore()
    const [ maxScrollLeft, setMaxScrollLeft ] = useState(0)
    const [ listScroll, setListScroll ] = useState(0)
    const [ hoverItemId, setHoverItemId ] = useState(null)

    const { currentTrack } = playerState

    async function toggleItemVisibility(itemId, category){
        const response = await Axios.post(`/api/user/top_${category}/hide_item`, {
            userId: loggedUser.id,
            itemId: itemId,
        })
        category === "tracks" && setUserTopTracks(response.data.top_tracks)
        category === "artists" && setUserTopArtists(response.data.top_artists)
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
            {list.items
                .filter(item => item.isVisible === visibility)
                .slice(0, 10)
                .map((item) => {
                    return (
                        <div className="slider_item_wrapper" key={item.id}>
                            <div className="slider_image_wrapper">
                                <Link to={`/${category.slice(0, -1)}/${item.id}`}>
                                    <div 
                                    onMouseEnter={() => setHoverItemId(item.id)}
                                    onMouseLeave={() => setHoverItemId(null)}
                                    style={{ backgroundImage: `url('${item.imageUrl}')`}} className="cover_medium cover_wrapper">
                                    </div>
                                </Link>
                                {isLoggedUser && <button onClick={() => toggleItemVisibility(item.id, category)}>{visibility ? "Hide" : "Show"}</button>}
                                {(currentTrack && hoverItemId === item.id) && 
                                <playBtn uri={item.uri} category={"slider"} setHoverItemId={setHoverItemId} />}
                            </div>
                            <Link to={`/${category.slice(0, -1)}/${item.id}`}>
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

