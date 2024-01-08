import React, { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import useStore from "../../store"
import { Axios } from "../../Axios-config"
import { SvgHeart } from "../../assets"

const Reply = React.memo((props) => {
    const { 
        reply,
        setComments, 
        postId, 
        posterId, 
        artistId, 
        replyToComment, 
        getUser,
        currentComment,
        setRepliesLoaded,
        setReplies,
        scrollOnLoad,
        setScrollOnLoad,
        setIsNewReply,
        isNewReply,
    } = props

    const { loggedUser } = useStore()
    const [ user, setUser ] = useState(null)

    async function handleReplies(user_id){ 
        console.log("is new reply?", isNewReply)     
        if(!user){
            const userData = await getUser(user_id)
            setUser(userData)
            setRepliesLoaded(prevCount => prevCount + 1)
        }

        if(scrollOnLoad && isNewReply){
            const newCommentElement = document.getElementById(reply.reply_id)
            newCommentElement.scrollIntoView({ behavior: "smooth", block: "end" })
            setScrollOnLoad(false)
            setIsNewReply(false)

        }
    }

    async function deleteReply(post_id, comment_id, reply_id){
        await Axios.post(`/api/${posterId}/${artistId}/${post_id}/delete_reply/${comment_id}/${reply_id}`)

        const updatedReplies = currentComment.replies.filter(reply => reply.reply_id !== reply_id)
        const updatedComment = {...currentComment, replies: updatedReplies}
        
        setComments(prevComments => 
            prevComments.map(comment =>
                comment.comment_id === comment_id ? updatedComment : comment
            )
        )
    }

    async function likeReply(post_id, comment_id, reply_id){
        await Axios.post(`/api/${posterId}/${artistId}/${post_id}/toggle_like_reply/${comment_id}/${reply_id}`, {
            logged_user_id: loggedUser.id
        })

        const updatedReply = reply.likes?.includes(loggedUser.id) ?
        reply.likes.filter(like => like !== loggedUser.id) :
        [...(reply.likes || []), loggedUser.id]

        console.log("updated reply is", updatedReply)

        setReplies(prevReplies => prevReplies
            .map(prevReply => {
                return prevReply.reply_id === reply_id ?
                updatedReply :
                prevReply
            }))
    }

    useEffect(() => {
        console.log("reply is", reply)
        if(reply){
            handleReplies(reply.user_id)
        }
    }, [reply])

    return (
        reply &&
        <section 
        id={reply.reply_id}
        key={reply.reply_id}
        className="full_width"
        style={{ minWidth: "70px" }}>
            <div 
            className="flex space_between">
                <div>
                    <Link to={`/account/${user?.id}`}>
                        <div className="flex"
                        style={{ marginBottom: "10px" }}>
                            {
                            user?.imgUrl ? 
                            <img 
                            className="profile_small"
                            src={user.imgUrl}/> :
                            <div className="profile_small"></div>
                            }
                            <h3>{user?.name}</h3>
                        </div>
                    </Link>
                    <p>{reply.text}</p>
                </div>
                <div
                onClick={() => likeReply(postId, currentComment?.comment_id, reply.reply_id)}>
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
                onClick={() => replyToComment(user?.name, currentComment?.comment_id)}>
                    Reply
                </h4>}
                {(user?.id === loggedUser.id) &&
                <h4 
                className="pointer"
                onClick={() => deleteReply(postId, currentComment?.comment_id, reply.reply_id)}>
                    Delete Comment
                </h4>}
            </div>
        </section>
        )
        
})

export default Reply