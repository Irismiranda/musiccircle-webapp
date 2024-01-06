import React, { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import useStore from "../../store"
import { Axios } from "../../Axios-config"
import { SvgHeart } from "../../assets"

export default function Reply(props) {
    const { 
        reply,
        comment_id,  
        setComments, 
        comments,
        postId, 
        posterId, 
        artistId, 
        replyToComment, 
        getUser,
        isFirstRepliesLoad,
        setIsFirstRepliesLoad,
        currentComment,
    } = props

    const { loggedUser } = useStore()
    const [isLoadingReply, setIsLoadingReply] = useState(true)

    async function handleReplies(id){
        console.log("reply is", reply, "current comment is", currentComment)
        
        setIsLoadingReply(true)

        const updatedReplies = await getUser(currentComment.replies)
        
        const updatedComment = {...currentComment, replies: updatedReplies}
        console.log("updated comment is", updatedComment)
        setComments(comments.map(comment => comment.comment_id === id ? updatedComment : comment))
        
        setIsLoadingReply(false)
        setIsFirstRepliesLoad(false)
    }

    async function deleteReply(post_id, comment_id, reply_id){
        await Axios.post(`/api/${posterId}/${artistId}/${post_id}/delete_reply/${comment_id}/${reply_id}`)
    }

    async function likeReply(post_id, comment_id, reply_id){
        await Axios.post(`/api/${posterId}/${artistId}/${post_id}/toggle_like_reply/${comment_id}/${reply_id}`, {
            logged_user_id: loggedUser.id
        })
        
        const currentReply = currentComment.find(reply => reply.comment_id === reply_id)

        if(currentReply.likes?.includes(loggedUser.id)){
            currentReply.likes = currentReply.likes.filter(like => like !== loggedUser.id)
        } else {
            currentReply.likes.push(loggedUser.id)
        }

        currentComment.replies = currentComment.replies
            .map(reply => reply.reply_id === reply_id ? currentReply : reply)
        setComments(comments.map(comment => comment.comment_id === comment_id ? currentComment : comment))
    }

    useEffect(() => {
        if(reply){
            handleReplies(reply.reply_id)
        }
    }, [reply])

    return (
        <>
            {(isLoadingReply && !isFirstRepliesLoad) &&
            <section 
            className="loading_comments full_width"
            style={{ height: '100px' }}>
            </section>}
            
            {(!isLoadingReply && reply) &&
            <section 
            className="full_width"
            key={reply.comment_id}>
                <div 
                className="flex space_between">
                    <div>
                        <Link to={`/account/${reply.user?.id}`}>
                            <div className="flex"
                            style={{ marginBottom: "10px" }}>
                                <img 
                                className="profile_small"
                                src={reply.user?.imgUrl}/>
                                <h3>{reply.user?.name}</h3>
                            </div>
                        </Link>
                        <p>{reply.text}</p>
                    </div>
                    <div
                    onClick={() => likeReply(postId, reply.reply_id)}>
                        <SvgHeart 
                        style={{ 
                            height: "15px",
                            marginRight: "20px",
                            fill: reply?.likes?.includes(loggedUser.id) ? '#AFADAD' : 'none',
                            }}/>
                    </div>
                </div>
                <div className="flex">
                    <h4>{reply.timestamp}</h4>
                    <h4>{reply.likes?.length || 0} Likes</h4>
                    {(reply.user?.id !== loggedUser.id) && 
                    <h4 
                    className="pointer"
                    onClick={() => replyToComment(reply.user?.name, comment_id)}>
                        Reply
                    </h4>}
                    {(reply.user?.id === loggedUser.id) &&
                    <h4 
                    className="pointer"
                    onClick={() => deleteReply(postId, comment_id, reply.reply_id)}>
                        Delete Comment
                    </h4>}
                </div>
            </section>}
        </>
        )
        
}