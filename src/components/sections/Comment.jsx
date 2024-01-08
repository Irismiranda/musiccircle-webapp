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

    const { loggedUser } = useStore()

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
        console.log("comment is", comment)
        if(!userData){
            const userData = await getUser(data.user_id)
            setUserData(userData)
        }
        console.log("is new comment?", isNewComment)

        if(replies?.length === 0){
            setReplies(data.replies)
        } else if(data.replies){
            const prevRepliesIds = replies?.map(reply => reply.reply_id)
            const newReplyIds = data.replies?.map(reply => reply.reply_id)

            console.log("prev reply ids are", prevRepliesIds, "new reply ids are", newReplyIds)
            
            const newReplyId = newReplyIds.find(id => !prevRepliesIds?.includes(id))
            const newReply = newReplyId ? 
            data.replies.find(reply => reply.reply_id === newReplyId) :
            undefined

            console.log("new reply id is", newReplyId, "new reply is", newReply)

            if(newReply){
                setIsNewReply(true)
                setReplies(prevReplies => [...prevReplies, newReply])
            } else {
                const updatedReply = replies.map(prevReply => {
                const updatedReplyData = data.replies.find(reply => reply.reply_id === prevReply.reply_id)

                console.log("found reply is", updatedReplyData)

                if (updatedReplyData && (updatedReplyData.likes?.length !== prevReply.likes?.length)) {
                    return updatedReplyData
                    }
                })

                console.log("updated reply is", updatedReply)
                
                updatedReply && setReplies(prevReplies => prevReplies
                    .map(prevReply => (
                        prevReply.reply_id === updatedReply.reply_id ?
                            updatedReply : prevReply
                    ))
                ) 
            }
        }
        
        setCommentsLoaded(prevCount => prevCount + 1)

        if(scrollOnLoad && isNewComment){
            const newCommentElement = document.getElementById(data.comment_id)
            newCommentElement.scrollIntoView({ behavior: "smooth", block: "end" })
            setScrollOnLoad(false)
            setIsNewComment(false)
        }
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
        handleData(comment)
    }, [comment])

    useEffect(() => {
        if(repliesLoaded >= replies.length){
            setIsLoading(false)
        }
    }, [repliesLoaded])

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
                                reply={reply}
                                setComments={setComments}
                                postId={postId}
                                posterId={posterId}
                                artistId={artistId}
                                replyToComment={replyToComment}
                                getUser={getUser}
                                currentComment={comment}
                                setRepliesLoaded={setRepliesLoaded}
                                setReplies={setReplies}
                                replies={replies}
                                isNewReply={isNewReply}
                                setIsNewReply={setIsNewReply}/>
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