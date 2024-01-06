import React, { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import useStore from "../../store"
import { Axios } from "../../Axios-config"
import { SvgHeart } from "../../assets"

export default function Reply(props) {
    const { 
        reply,
        comments,
        setComments, 
        postId, 
        posterId, 
        artistId, 
        replyToComment, 
        getUser,
        isFirstRepliesLoad,
        setIsFirstRepliesLoad,
        currentComment,
    } = props

    const { comment_id } = currentComment

    const { loggedUser } = useStore()
    
    const [isLoadingReply, setIsLoadingReply] = useState(true)
    const [ user, setUser ] = useState(null)

    async function handleReplies(id){
        console.log("reply is", reply, "current comment is", currentComment)
        
        setIsLoadingReply(true)

        const userData = await getUser(reply.user_id)

        setUser(userData)
               
        setIsLoadingReply(false)
        isFirstRepliesLoad && setIsFirstRepliesLoad(false)
    }

    async function deleteReply(post_id, comment_id, reply_id){
        await Axios.post(`/api/${posterId}/${artistId}/${post_id}/delete_reply/${comment_id}/${reply_id}`)
    }

    async function likeReply(post_id, comment_id, reply_id){
        await Axios.post(`/api/${posterId}/${artistId}/${post_id}/toggle_like_reply/${comment_id}/${reply_id}`, {
            logged_user_id: loggedUser.id
        })

        if(reply.likes?.includes(loggedUser.id)){
            reply.likes = reply.likes.filter(like => like !== loggedUser.id)
        } else {
            reply.likes.push(loggedUser.id)
        }

        currentComment.replies = currentComment.replies
            .map(prev => prev.reply_id === reply_id ? reply : prev)
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
                        <Link to={`/account/${user?.id}`}>
                            <div className="flex"
                            style={{ marginBottom: "10px" }}>
                                <img 
                                className="profile_small"
                                src={user?.imgUrl}/>
                                <h3>{user?.name}</h3>
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
                    {(user?.id !== loggedUser.id) && 
                    <h4 
                    className="pointer"
                    onClick={() => replyToComment(user?.name, comment_id)}>
                        Reply
                    </h4>}
                    {(user?.id === loggedUser.id) &&
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