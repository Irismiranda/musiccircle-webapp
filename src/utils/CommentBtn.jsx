import React, { useEffect, useRef, useState } from "react"
import { Link } from "react-router-dom"
import { Comments, EmojiBar } from "../components"
import { SvgCommentBtn, SvgSendBtn } from "../assets"
import { useClickOutside, formatListData, SaveTrackBtn, PlayBtn } from "."
import useStore from "../store"
import { Axios } from "../Axios-config"

export default function CommentBtn(props){
    const [isPostVisible, setIsPostVisible] = useState(false)
    const [hoverItemId, setHoverItemId] = useState(null)
    const [artistPic, setArtistPic] = useState(null)
    const [showFullDescription, setShowFullDescription] = useState(false)
    const [commentsNumber, setCommentsNumber] = useState(0)
    const { spotifyApi, loggedUser, playerRef } = useStore()
    const { content } = props
    const { user, data, item, id, type } = content
    const [postData, setPostData] = useState(null)
    const [artistId, setArtistId] = useState(null)
    const [replyTo, setReplyTo] = useState(null)

    const postWindowRef = useRef(null)
    const commentsBtnRef = useRef(null)
    const textAreaRef = useRef(null)
    const descriptionRef = useRef(null)
    const descriptionMenuRef = useRef(null)

    useClickOutside(postWindowRef, [commentsBtnRef, playerRef], () => setIsPostVisible(false))

    async function getitem(id, type){
        const methodName = `get${type.charAt(0).toUpperCase() + type.slice(1)}`
        const data = await spotifyApi[methodName](id)
        const formatedItem = formatListData([data], `${type}s`)
        setPostData(formatedItem[0])
    }

    async function getArtist(id){
        const artist = await spotifyApi.getArtist(id)
        setArtistPic(artist.images[0].url)
    }

    async function sendComment(id){
        const endpointPath = replyTo ? 
        `/api/${id}/reply_to/${replyTo}` :
        `/api/${id}/add_comment`

        const commentData = {
            text: textAreaRef.current.value,
            user_id: loggedUser.id,
            poster_id: user?.id,
            timestamp: new Date().toLocaleString(),
            artist_id: artistId
        }

        replyTo && commentData.reply_to === replyTo
        !user && commentData.artist_id === artistId
        
        if(textAreaRef.current.value !== ""){
            await Axios.post(endpointPath, commentData)
            textAreaRef.current.value = ""
        }
    }

    useEffect(() => {
        if(item && isPostVisible){
            setPostData(item)
        } else if(id && type && isPostVisible){
            getitem(id, type)
        }
    }, [content, id, isPostVisible])

    useEffect(() => {
        if(postData && isPostVisible){
            setArtistId(postData?.artists ? postData?.artists[0]?.id : postData?.artist_id)
        }
    }, [postData, isPostVisible])

    useEffect(() => {
        if(artistId){
            getArtist(artistId)
        }
    }, [artistId])

    useEffect(() => {
        descriptionRef?.current && descriptionRef.current.scrollTo({ top: 0, behavior: "smooth" })
    }, [showFullDescription])

    return (
        <>
            <div
            ref={commentsBtnRef}
            onClick={() => setIsPostVisible(!isPostVisible)}>
                <SvgCommentBtn 
                className="svg"/>
            </div>

            {isPostVisible && 
            <div
            className="windowed wrapper post_windowed_wrapper flex"
            ref={postWindowRef}>
                <section 
                className="cover_long flex flex_column relative"
                style={{ background: `linear-gradient(rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.84) 100%), url('${postData?.imgUrl}')`}}
                onMouseEnter={() => setHoverItemId(postData?.id)}
                onMouseLeave={() => setHoverItemId(null)}>
                    
                    {artistPic && 
                    <div 
                    style={{ backgroundImage: `url('${artistPic}')`}}
                    className="cover_medium relative">
                        <div 
                        onMouseEnter={() => setHoverItemId(postData?.id)}>
                            <PlayBtn 
                            uri={`spotify:${postData?.type}:${postData?.id}`} 
                            id={postData?.id}
                            category={"cover"} 
                            type={postData?.type} 
                            hoverItemId={hoverItemId}/>
                        </div>
                    </div>}
                    <div
                    className="flex">
                        <h2>{postData?.name}</h2>
                        {(postData?.type === "track") && 
                        <SaveTrackBtn 
                        trackId={postData?.id}/>}
                    </div>
                    <h3><Link to={`/artist/${postData?.artist_id}`}>{postData?.artist_name}</Link></h3>
                    
                </section>
                <div
                className="post_comments_wrapper">
                    <div 
                    className="post_description_menu"
                    ref={descriptionMenuRef}>
                        {user && 
                        <section>
                            <div 
                            className="flex"
                            style={{ marginBottom: "10px" }}>
                                <Link to={`/account/${user.id}`}>
                                    <img 
                                    src={user.imgUrl}
                                    className="profile_small" />
                                </Link>
                                <Link to={`/account/${user.id}`}>
                                    <h4>{user.name}</h4>
                                </Link>
                            </div>
                                <p 
                                className={showFullDescription ? "show_description" : "hide_description"}
                                ref={descriptionRef}>
                                    {data?.description}
                                </p> 
                                { (descriptionRef?.current?.scrollHeight > 150) &&
                                <span 
                                className={showFullDescription ? 
                                "show_more_toggle show_less" : "show_more_toggle show_more"}
                                onClick={() => setShowFullDescription(!showFullDescription)}>
                                    {showFullDescription ? "Hide" : "Show More..."}
                                </span>} 
                        </section>}
                        <div 
                        className="flex">
                            <h4>{postData?.likes ? postData?.likes?.length : 0} Likes</h4>
                            <h4>{commentsNumber} Comments</h4>
                        </div>
                    </div>
                    <Comments 
                    postId={data?.post_id || postData?.id}
                    posterId={user?.id}
                    artistId={postData?.artist_id}
                    textAreaRef={textAreaRef}
                    descriptionMenuRef={descriptionMenuRef}
                    setReplyTo={setReplyTo}
                    setCommentsNumber={setCommentsNumber}/>
                    <section 
                    className="relative full_width"
                    style={{ marginTop: "10px" }}>
                        <textarea 
                        ref={textAreaRef}
                        placeholder={`Say something cool about this ${postData?.type}`}/>
                        <div
                        className="flex absolute"
                        style={{ top: "10px", right: "15px", gap: "5px" }}>
                            <EmojiBar 
                            textAreaRef={textAreaRef}/>
                            <div 
                            onClick={() => sendComment(data?.post_id || postData?.id)}>
                                <SvgSendBtn 
                                className="send_btn"/>
                            </div>
                        </div>
                    </section>
                </div>
            </div>}
        </>
        
    )
    
}