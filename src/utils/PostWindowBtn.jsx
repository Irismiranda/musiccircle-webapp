import React, { useEffect, useRef, useState } from "react"
import { Link } from "react-router-dom"
import { Chat, EmojiBar } from "../components"
import { SvgCommentBtn, SvgSendBtn } from "../assets"
import { useClickOutside, formatListData, HeartBtn, PlayBtn } from "."
import useStore from "../store"

export default function PostWindowBtn(props){
    const [isPostVisible, setIsPostVisible] = useState(false)
    const [ hoverItemId, setHoverItemId ] = useState(null)
    const [artistPic, setArtistPic] = useState(null)
    
    const { spotifyApi } = useStore()
    const { content, id, type } = props
    const [item, setItem] = useState(null)

    const postWindowRef = useRef(null)
    const commentsBtnRef = useRef(null)
    const inputRef = useRef(null)

    useClickOutside(postWindowRef, commentsBtnRef, () => setIsPostVisible(false))

    async function getitem(id, type){
        const methodName = `get${type.charAt(0).toUpperCase() + type.slice(1)}`
        const item = await spotifyApi[methodName](id)
        const formatedItem = formatListData([item], `${type}s`)
        setItem(formatedItem[0])
    }

    async function getArtist(id){
        const artist = await spotifyApi.getArtist(id)
        setArtistPic(artist.images[0].url)
    }

    async function sendComment(id){
        
    }

    useEffect(() => {
        if(content){
            setItem(content)
        } else if(id && type){
            getitem(id, type)
        }
    }, [content, id])

    useEffect(() => {
        if(item?.artists){
            getArtist(item.artists[0].id)
        }

        console.log("item is", item)
    }, [item])

    return (
        <>
            <div
            ref={commentsBtnRef}
            onClick={() => setIsPostVisible(!isPostVisible)}>
                <SvgCommentBtn 
                className="svg"/>
            </div>

            {(isPostVisible && item) && 
            <section
            className="windowed wrapper post_windowed_wrapper flex"
            ref={postWindowRef}>
                <div 
                className="cover_long"
                style={{ backgroundImage: `url('${item.imgUrl}')`}}
                onMouseEnter={() => setHoverItemId(item.id)}
                onMouseLeave={() => setHoverItemId(null)}>
                    <div 
                    onMouseEnter={() => setHoverItemId(item.id)}>
                        <PlayBtn 
                        uri={`spotify:${item.type}:${item.id}`} 
                        id={item.id}
                        category={"cover"} 
                        type={item.type} 
                        hoverItemId={hoverItemId}/>
                        <div
                        className="flex">
                            {artistPic && <img src={artistPic}
                            className="cover_medium"/>}
                            <div>
                                <h1>{item.name}</h1>
                                <h3><Link to={`/artist/${item.artist_id}`}>{item.artist_name}</Link></h3>
                            </div>
                            <HeartBtn 
                            id={item.id}/>
                        </div>

                    </div>
                </div>
                <div 
                className="flex">
                    <h4>{item.likes ? item.likes?.length : 0} Likes</h4>
                    <h4>{item.comments ? item.comments?.length : 0} Comments</h4>
                </div>
                <input 
                ref={inputRef}
                placeholder={`say something cool about this ${item.type}`}/>
                <div
                onClick={() => sendComment(item.post_id ? item.post_id : item.id)}>
                    <EmojiBar 
                    textAreaRef={inputRef}/>
                    <SvgSendBtn 
                    className="svg"/>
                </div>
            </section>}
        </>
        
    )
    
}