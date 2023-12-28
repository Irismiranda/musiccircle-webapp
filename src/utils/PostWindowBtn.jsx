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
    const { user, content, id, type } = props
    const [item, setItem] = useState(null)

    const postWindowRef = useRef(null)
    const commentsBtnRef = useRef(null)
    const textAreaRef = useRef(null)

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
        if(content && isPostVisible){
            setItem(content.item)
        } else if(id && type && isPostVisible){
            console.log("id and type are:", id, type)
            getitem(id, type)
        }
    }, [content, id])

    useEffect(() => {
        console.log("item is", item)
        if(isPostVisible){
            item?.artists && getArtist(item.artists[0].id)
            item?.artist_id && getArtist(item?.artist_id)
        }
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
            <div
            className="windowed wrapper post_windowed_wrapper flex"
            ref={postWindowRef}>
                <section 
                className="cover_long flex flex_column"
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
                    </div>
                    
                    {artistPic && 
                    <img src={artistPic}
                    className="cover_medium"/>}
                    <div
                    className="flex">
                        <h2>{item.name}</h2>
                        <HeartBtn 
                        id={item.id}/>
                    </div>
                    <h3><Link to={`/artist/${item.artist_id}`}>{item.artist_name}</Link></h3>
                    
                </section>
                <div
                className="post_comments_wrapper"> 
                    {user && 
                    <section>
                        <div 
                        className="flex"
                        style={{ marginBottom: "10px" }}>
                            <Link to={`/account/${user?.id}`}>
                                <img 
                                src={user?.imgUrl}
                                className="profile_small" />
                            </Link>
                            <Link to={`/account/${user?.id}`}>
                                <h4>{user?.name}</h4>
                            </Link>
                        </div>
                            <p>{data?.comment}</p>   
                    </section>}
                    <div 
                    className="flex">
                        <h4>{item.likes ? item.likes?.length : 0} Likes</h4>
                        <h4>{item.comments ? item.comments?.length : 0} Comments</h4>
                    </div>
                    <section 
                    className="relative full_width"
                    style={{ marginTop: "10px" }}>
                        <textarea 
                        ref={textAreaRef}
                        placeholder={`say something cool about this ${item.type}`}/>
                        <div
                        className="flex absolute"
                        style={{ top: "5px", right: "15px", gap: "5px" }}>
                            <EmojiBar 
                            textAreaRef={textAreaRef}/>
                            <div 
                            onClick={() => sendComment(item.post_id ? item.post_id : item.id)}>
                                <SvgSendBtn 
                                className="svg"/>
                            </div>
                        </div>
                    </section>
                </div>
            </div>}
        </>
        
    )
    
}