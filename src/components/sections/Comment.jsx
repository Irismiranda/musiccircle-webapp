import React, { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { SvgHeart } from "../../assets"
import { Reply } from ".."
import useStore from "../../store"
import { convertTimestampToDate, formatListData } from "../../utils"
import { Axios } from "../../Axios-config"

const Comment = React.memo((props) => {
    const [replies, setReplies] = useState([])
    const [showReplies, setShowReplies] = useState(false)
    const [repliesLoaded, setRepliesLoaded] = useState(0)
    const [isLoading, setIsLoading] = useState(true)
    const [userData, setUserData] = useState(null)
    const [isNewReply, setIsNewReply] = useState(false)
    const [listening, setIsListening] = useState(false)

    const { 
        comment, 
        comments,
        setComments,
        setReplyTo, 
        posterId,
        postId,
        artistId,
        setCommentsLoaded,
        scrollOnLoad,
        setScrollOnLoad,
        isNewComment,
        setIsNewComment,
    } = props

    const { text, likes, timestamp } = comment || {}

    const { loggedUser, setpostCommentsCount,socket } = useStore()

    async function getUser(id){
        const userData = await Axios.get(`api/user/${id}`)
        const formatedUser = formatListData([userData.data], userData.data.type) 
        return formatedUser[0]
    }

    async function deleteComment(post_id, comment_id){       
        await Axios.post(`/api/${posterId}/${artistId}/${post_id}/delete_comment/${comment_id}`)
        setComments(comments.filter(comment => comment.comment_id !== comment_id))
    }

    async function handleData(data){       
        if(!userData){
            const userData = await getUser(data.user_id)
            setUserData(userData)
            setCommentsLoaded(prevCount => prevCount + 1)
        }
    }

    function handleReplies(data, call){
        if(call === "loadAllReplies"){
            setReplies(data)
        } else if (call === "loadNewReply"){
            setReplies((prevReplies) => {
                if (prevReplies.some((prevReply) => prevReply.reply_id === data[0].reply_id)) {
                    return prevReplies.map((prevReply) =>
                    prevReply.reply_id === data[0].reply_id ? data[0] : prevReply
                    )              
                } else {
                    setIsNewComment(true)
                    return [...prevReplies, data[0]]
                }
            })
        }
        setpostCommentsCount(postId, ((comments?.length || 0) + (replies?.length || 0)))
    }

    function replyToComment(handle, comment_id){
        setReplyTo({comment_id: comment_id, user_handle: handle})
    }

    async function likeComment(post_id, comment_id){       
        await Axios.post(`/api/${posterId}/${artistId}/${post_id}/toggle_like_comment/${comment_id}`, {
            logged_user_id: loggedUser.id
        })

        const updatedLikes = comment.likes ? [...comment.likes] : []

        if (updatedLikes.includes(loggedUser.id)) {
            updatedLikes.splice(updatedLikes.indexOf(loggedUser.id), 1);
        } else {
            updatedLikes.push(loggedUser.id)
        }

        const updatedComment = {...comment, likes: updatedLikes}
        
        setComments(comments
            .map(prevComment => prevComment.comment_id === comment_id ? updatedComment : prevComment))
    }

    useEffect(() => {
        comment && handleData(comment)
        if(scrollOnLoad && isNewComment){
            const newCommentElement = document.getElementById(comment.comment_id)
            newCommentElement.scrollIntoView({ behavior: "smooth", block: "end" })
            setScrollOnLoad(false)
            setIsNewComment(false)
        }
    }, [comment])
    
    useEffect(() => {
        if(repliesLoaded >= replies.length){
            setIsLoading(false)
        }
    }, [repliesLoaded])

    useEffect(() => {
        if(comment && !listening){
            socket.emit('listenToReplies', { post_id: postId, poster_id: posterId, artist_id: artistId, comment_id: comment.comment_id })
            setIsListening(true)
        }
    
        return () => {
            socket.emit('disconnectFromReplies', { comment_id: comment.comment_id })
        }
    }, [comment])


    useEffect(() => {
        socket.on('loadAllReplies', (reply) => {
            if(!reply || reply?.length === 0){
                setIsLoading(false)
            } else {
                handleReplies(reply, 'loadAllReplies')
            }
        })

        return () => {
            socket.off('loadAllReplies')
        }      
    }, [])

    useEffect(() => {
        socket.on('loadNewReply', (reply) => {
            if(!reply || reply?.length === 0){
                return
            } else {
                handleReplies(reply, 'loadNewReply')
            } 
        })

        return () => {
            socket.off('loadNewReply')
        }
    }, [])


    return (
        <section 
        id={comment.comment_id}
        key={comment?.comment_id}
        className="flex flex_column align_start full_width"
        style={{ gap: "15px" }}>
            <div 
            className="flex space_between">
                <div>
                    <Link to={`/account/${userData?.id}`}>
                        <div 
                        className="flex"
                        style={{ marginBottom: "15px" }}>
                            {
                            userData?.imgUrl ? 
                            <img 
                            className="profile_small"
                            src={userData?.imgUrl}/> :
                            <div className="profile_small"></div>
                            }
                            <h3>{userData?.name}</h3>
                        </div>
                    </Link>
                    <p>{text}</p>
                </div>
                <div
                onClick={() => likeComment(postId, comment?.comment_id)}>
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
                {(userData?.id !== loggedUser.id) && 
                <h4 
                className="pointer"
                onClick={() => replyToComment(userData?.name, comment?.comment_id)}>Reply</h4>}
                {(userData?.id === loggedUser.id) &&
                <h4 
                className="pointer"
                onClick={() => deleteComment(postId, comment?.comment_id)}>Delete Comment</h4>}
            </div>
            {replies?.length > 0 && 
            <h4 
            className="pointer"
            onClick={() => setShowReplies(!showReplies)}> 
            {showReplies ? "Hide" : "View"} {replies?.length} replies </h4>}

            <section
            className="replies_section flex flex_column">
                {showReplies &&
                    replies 
                    .sort((a, b) => (convertTimestampToDate(b?.timestamp) > convertTimestampToDate(a?.timestamp) ? -1 : 1))
                    .map(reply => {
                        return (
                            <section
                            className="full_width"
                            style={{ display: isLoading ? "none" : "" }}>
                                <Reply 
                                replies={replies}
                                setReplies={setReplies}
                                setRepliesLoaded={setRepliesLoaded}
                                reply={reply}
                                isNewReply={isNewReply}
                                setIsNewReply={setIsNewReply}
                                postId={postId}
                                posterId={posterId}
                                artistId={artistId}
                                replyToComment={replyToComment}
                                getUser={getUser}
                                currentComment={comment}
                                scrollOnLoad={scrollOnLoad}
                                setScrollOnLoad={setScrollOnLoad}
                                />
                            </section>
                        )
                    })
                }
                {(isLoading && showReplies) &&
                    <div 
                    className="loading_comments full_width"
                    style={{ height: "100px" }}>
                    </div>
                }
            </section>
        </section>
        )
})

export default Comment