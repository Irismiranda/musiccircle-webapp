import React, { useState, useEffect, useRef } from "react"
import { Link } from "react-router-dom"
import useStore from "../../store"
import { Axios } from "../../Axios-config"
import { formatListData, convertTimestampToDate } from "../../utils"
import { SvgHeart } from "../../assets"
import { Reply } from "../"

export default function Comments(props) {
    const [comments, setComments] = useState([])
    const [showReplies, setShowReplies] = useState(false)
    const [isLoading, setIsLoading] = useState(true)
    const [listening, setIsListening] = useState(false)
    const [inputSectionHeight, setInputSectionHeight] = useState(200)
    const [isFirstRepliesLoad, setIsFirstRepliesLoad] = useState(true)

    const { 
        postId, 
        posterId, 
        artistId, 
        setReplyTo, 
        replyTo,
        setCommentsNumber, 
        descriptionMenuRef, 
        inputSectionRef,
    } = props

    const { 
        socket, 
        loggedUser 
    } = useStore()

    const commentsRef = useRef(null)

    async function getUser(data){
        try {
            const promises = data.map(async (comment) => {
                const updatedComment = { ...comment }
    
                try {
                    const user = await Axios.get(`api/user/${comment.user_id}`)
                    console.log("user is", user.data)
    
                    const formatedUser = formatListData([user.data], user.data.type)
                    console.log("formated user is", formatedUser)
    
                    updatedComment.user = formatedUser[0]
                    console.log("formated comment is", updatedComment)
    
                    return updatedComment
                } catch (error) {
                    console.log("Error fetching user:", error)
                    return { ...comment, error: "Failed to fetch user" }
                }
            })
    
            const settledResults = await Promise.allSettled(promises)
    
            const updatedComments = settledResults
                .filter((result) => result.status === "fulfilled")
                .map((result) => result.value)

            return updatedComments
        } catch (err) {
            console.log(err)
            return []
        }
    }

    async function handleData(data, call){
        const updatedComments = await getUser(data)
        console.log("loaded comments are", updatedComments)
            
        if(call === "loadAllComments"){
            console.log("loading all comments")
            setComments(updatedComments)
            
            console.log("comments were set")

        } else if (call === "loadNewComment"){
            setComments((prevComments) => {
                if (prevComments.some((comment) => comment.comment_id === updatedComments[0].comment_id)) {
                    return prevComments.map((comment) =>
                        comment.comment_id === updatedComments[0].comment_id ? updatedComments[0] : comment
                    )              
                } else {
                    return [...prevComments, updatedComments[0]]
                }
            })

            if(data[0].user_id === loggedUser.id){
                commentsRef?.current && commentsRef.current.scrollTo({ bottom: 0 })
            }
        }
    }

    async function deleteComment(post_id, comment_id){       
        await Axios.post(`/api/${posterId}/${artistId}/${post_id}/delete_comment/${comment_id}`)
        console.log("comments are", comments.filter(comment => comment.comment_id !== comment_id))
        setComments(comments.filter(comment => comment.comment_id !== comment_id))
    }

    function replyToComment(handle, comment_id){
        setReplyTo({comment_id: comment_id, user_handle: handle})
    }

    async function likeComment(post_id, comment_id){       
        await Axios.post(`/api/${posterId}/${artistId}/${post_id}/toggle_like_comment/${comment_id}`, {
            logged_user_id: loggedUser.id
        })

        const currentComment = comments.find(comment => comment.comment_id === comment_id)

        if(currentComment.likes?.includes(loggedUser.id)){
            currentComment.likes = currentComment.likes.filter(like => like !== loggedUser.id)
        } else {
            currentComment.likes ? currentComment.likes.push(loggedUser.id) : 
            currentComment.likes = [loggedUser.id]
        }
        setComments(comments.map(comment => comment.comment_id === comment_id ? currentComment : comment))
    }

    useEffect(() => {
        if(postId && !listening){
            socket.emit('listenToComments', { post_id: postId, poster_id: posterId, artist_id: artistId })
            setIsListening(true)
        }

        return () => {
            socket.emit('disconnectFromComments', { post_id: postId })
        }
    }, [postId])

    useEffect(() => {
        socket.on('loadAllComments', (comment) => {
            setIsLoading(true)
            if(!comment || comment?.length === 0){
                console.log("no new comments to load")
                setIsLoading(false)
            } else {
                console.log("formatting comment")
                handleData(comment, "loadAllComments")
            }
        })

        return () => {
            socket.off('loadAllComments')
        }      
    }, [])

    useEffect(() => {
        socket.on('loadNewComment', (comment) => {
            if(!comment || comment?.length === 0){
                return
            } else handleData(comment, "loadNewComment") 
        })

        return () => {
            socket.off('loadNewComment')
        }
    }, [])

    useEffect(() => {
        console.log("comments are", comments)
        if(comments){
            setCommentsNumber(comments.length)
            setIsLoading(false)
        }
    }, [comments])

    useEffect(() => {
        inputSectionRef?.current && setTimeout(setInputSectionHeight(inputSectionRef?.current?.clientHeight), 3000)
    }, [replyTo])

    useEffect(() => {
        setIsFirstRepliesLoad(true)
    }, [showReplies])

    return (
        !isLoading ? (
        <div 
        ref={commentsRef}
        className="flex flex_column comments_inner_wrapper"
        style={{ height: 
        `calc(100% - ${descriptionMenuRef?.current?.clientHeight + inputSectionHeight}px - 30px)` }}>
            {(comments?.length > 0) &&
            comments
            .sort((a, b) => (convertTimestampToDate(b.timestamp) > convertTimestampToDate(a.timestamp) ? -1 : 1))
            .map(comment => {
                const { user, comment_id, text, likes, timestamp, replies } = comment || {}
                return (
                    <section 
                    key={comment_id}
                    className="flex flex_column align_start full_width"
                    style={{ gap: "15px" }}>
                        <div 
                        className="flex space_between">
                            <div>
                                <Link to={`/account/${user?.id}`}>
                                    <div 
                                    className="flex"
                                    style={{ marginBottom: "15px" }}>
                                        <img 
                                        className="profile_small"
                                        src={user?.imgUrl}/>
                                        <h3>{user?.name}</h3>
                                    </div>
                                </Link>
                                <p>{text}</p>
                            </div>
                            <div
                            onClick={() => likeComment(postId, comment_id)}>
                                <SvgHeart 
                                style={{ 
                                    height: "15px",
                                    marginRight: "20px",
                                    fill: likes?.includes(loggedUser.id) ? '#AFADAD' : 'none', 
                                    }}/>
                            </div>
                        </div>
                        <div className="flex">
                            <h4>{timestamp}</h4>
                            <h4>{likes?.length || 0} Likes</h4>
                            {(user?.id !== loggedUser.id) && 
                            <h4 
                            className="pointer"
                            onClick={() => replyToComment(user?.name, comment_id)}>Reply</h4>}
                            {(user?.id === loggedUser.id) &&
                            <h4 
                            className="pointer"
                            onClick={() => deleteComment(postId, comment_id)}>Delete Comment</h4>}
                        </div>
                        {replies && 
                        <h4 
                        className="pointer"
                        onClick={() => setShowReplies((prevShowReplies) => (prevShowReplies === comment_id ? null : comment_id))}> 
                        {showReplies ? "Hide" : "View"} {replies?.length} replies </h4>}

                        <section
                        className="replies_section flex flex_column">
                            {(showReplies === comment_id && replies) &&
                                replies 
                                .sort((a, b) => (convertTimestampToDate(b.timestamp) > convertTimestampToDate(a.timestamp) ? -1 : 1))
                                .map(reply => {
                                    return (
                                    <Reply 
                                    reply={reply}
                                    comment_id={comment_id} 
                                    setComments={setComments}
                                    comments={comments}
                                    postId={postId}
                                    posterId={posterId}
                                    artistId={artistId}
                                    replyToComment={replyToComment}
                                    getUser={getUser}
                                    isFirstRepliesLoad={isFirstRepliesLoad}
                                    setIsFirstRepliesLoad={setIsFirstRepliesLoad}
                                    currentComment={currentComment}/>
                                    )
                                })
                            }
                            {(isFirstRepliesLoad && showReplies === comment_id) &&
                                <section 
                                className="loading_comments full_width"
                                style={{ height: '100px' }}>
                                </section>
                            }
                        </section>
                    </section>
                    )
                })
            }
        </div>
        ) : (
        <div 
        className="loading_comments"
        style={{ height: 
        `calc(100% - ${descriptionMenuRef?.current?.clientHeight + inputSectionHeight}px)` }}>
        </div>
        )
    )
}