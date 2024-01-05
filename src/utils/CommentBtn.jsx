import React, { useEffect, useRef, useState } from "react"
import { Link } from "react-router-dom"
import { Comments, EmojiBar } from "../components"
import { SvgCommentBtn, SvgSendBtn, SvgHeart } from "../assets"
import { useClickOutside, SaveTrackBtn, PlayBtn } from "."
import useStore from "../store"
import { Axios } from "../Axios-config"

export default function CommentBtn(props){
    const [isPostVisible, setIsPostVisible] = useState(false)
    const [hoverItemId, setHoverItemId] = useState(null)
    const [artistPic, setArtistPic] = useState(null)
    const [showFullDescription, setShowFullDescription] = useState(false)
    const [replyTo, setReplyTo] = useState(null)
    const [localCommentsNumber, localSetCommentsNumber] = useState(null)
    
    const { spotifyApi, loggedUser, playerRef } = useStore()
    const { post, setCommentsNumber, commentsNumber, setPosts, posts } = props
    const { track, likes, post_id, description, user } = post

    const postWindowRef = useRef(null)
    const commentsBtnRef = useRef(null)
    const textAreaRef = useRef(null)
    const descriptionRef = useRef(null)
    const descriptionMenuRef = useRef(null)
    const inputSectionRef = useRef(null)

    useClickOutside(postWindowRef, [commentsBtnRef, playerRef], () => setIsPostVisible(false))

    async function getArtist(id){
        const artist = await spotifyApi.getArtist(id)
        setArtistPic(artist.images[0].url)
    }

    async function sendComment(){
        const endpointPath = replyTo ? 
        `/api/${post_id || track?.id}/reply_to/${replyTo.comment_id}` :
        `/api/${post_id || track?.id}/add_comment`

        const commentData = {
            text: textAreaRef.current.value,
            user_id: loggedUser.id,
            poster_id: user?.id,
            timestamp: new Date().toLocaleString(),
            post_id: post_id || track?.id,
            artist_id: track?.artist_id,
        }

        replyTo && commentData.reply_to === replyTo
        
        if(textAreaRef.current.value !== ""){
            await Axios.post(endpointPath, commentData)
            textAreaRef.current.value = ""
        }
    }

    async function likePost(){
        await Axios.post(`/api/${user?.id}/${track?.artist_id}/toggle_like_post/${post_id || track?.id}`, {
            logged_user_id: loggedUser.id
        })

        const updatedLikes = likes?.includes(loggedUser.id) ?
        likes?.filter(like => like !== loggedUser.id) :
        [...(likes || []), loggedUser.id]

        const updatedPost = {
            ...post, 
            likes: updatedLikes
        }

        const updatedPosts = posts.map(post => post.post_id === post_id ? updatedPost : post)

        setPosts(updatedPosts)
    }

    useEffect(() => {
        if(track?.artist_id){
            getArtist(track?.artist_id)
        }
    }, [track?.artist_id])

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
                style={{ background: `linear-gradient(rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.84) 100%), url('${track?.imgUrl}')`}}
                onMouseEnter={() => setHoverItemId(track?.id)}
                onMouseLeave={() => setHoverItemId(null)}>
                    
                    {artistPic && 
                    <div 
                    style={{ backgroundImage: `url('${artistPic}')`}}
                    className="cover_medium relative">
                        <div 
                        onMouseEnter={() => setHoverItemId(track?.id)}>
                            <PlayBtn 
                            uri={`spotify:${track?.type}:${track?.id}`} 
                            id={track?.id}
                            category={"cover"} 
                            type={track?.type} 
                            hoverItemId={hoverItemId}/>
                        </div>
                    </div>}
                    <div
                    className="flex">
                        <h2>{track?.name}</h2>
                        <SaveTrackBtn 
                        trackId={track?.id}/>
                    </div>
                    <h3><Link to={`/artist/${track?.artist_id}`}>{track?.artist_name}</Link></h3>
                    
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
                                <Link to={`/account/${user?.id}`}>
                                    <img 
                                    src={user?.imgUrl}
                                    className="profile_small" />
                                </Link>
                                <Link to={`/account/${user?.id}`}>
                                    <h4>{user?.name}</h4>
                                </Link>
                            </div>
                                <p 
                                className={showFullDescription ? "show_description" : "hide_description"}
                                ref={descriptionRef}>
                                    {description}
                                </p> 
                                { (descriptionRef?.current?.scrollHeight > 150) &&
                                <span 
                                className={showFullDescription ? 
                                "show_more_toggle show_less" : "show_more_toggle show_more"}
                                onClick={() => setShowFullDescription(!showFullDescription)}>
                                    {showFullDescription ? "Hide" : "Show More..."}
                                </span>} 
                        </section>}
                        <section 
                        className="flex space_between ">
                            <div 
                            className="flex">
                                <h4>{likes?.length || 0} Likes</h4>
                                <h4>{commentsNumber || localCommentsNumber || 0} Comments</h4>
                            </div>
                            <div
                            onClick={() => likePost()}>
                                <SvgHeart 
                                style={{ 
                                    height: "15px",
                                    marginTop: "4px",
                                    fill: likes?.includes(loggedUser.id) ? '#F230AA' : 'none', 
                                    stroke: likes?.includes(loggedUser.id) ? "#F230AA" : "#AFADAD" 
                                    }}/>
                            </div>
                        </section>
                    </div>
                    <Comments 
                    postId={post_id ? post_id : track?.id}
                    posterId={user?.id}
                    artistId={track?.artist_id}
                    textAreaRef={textAreaRef}
                    inputSectionRef={inputSectionRef}
                    descriptionMenuRef={descriptionMenuRef}
                    setReplyTo={setReplyTo}
                    replyTo={replyTo}
                    setCommentsNumber={setCommentsNumber || localSetCommentsNumber}/>
                    <section 
                    ref={inputSectionRef}
                    className="relative full_width"
                    style={{ marginTop: "10px" }}>
                        {replyTo && 
                        <h4
                        style={{ 
                            display: "flex",
                            justifyContent: "space-between",
                            padding: "10px 20px" 
                            }}>
                            {`Replying to ${replyTo.user_handle}`} 
                        <span 
                        className="underline_text"
                        onClick={() => setReplyTo(null)}>Cancel</span></h4>}
                        <div 
                        className="relative">
                            <textarea
                            ref={textAreaRef}
                            placeholder={`Say something cool about this ${track?.type}`}/>
                            <div
                            className="flex absolute"
                            style={{ top: "15px", right: "15px", gap: "5px" }}>
                                <EmojiBar 
                                textAreaRef={textAreaRef}/>
                                <div 
                                onClick={() => sendComment()}>
                                    <SvgSendBtn 
                                    className="send_btn"/>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>
            </div>}
        </>
        
    )
    
}