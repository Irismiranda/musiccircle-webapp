import React, { useState, useEffect } from "react"
import useStore from "../../store"
import { Axios } from "../../Axios-config"
import { formatListData } from "../../utils"

export default function Comments(props) {
    const [comments, setComments] = useState({})
    const [showReplies, setShowReplies] = useState(false)

    const { postId, posterId, artistId, setReplyTo, setCommentsNumber } = props
    const { socket, loggedUser } = useStore()

    function replyToComment(name, comment_id){
        textAreaRef.current.value = `@${name} `
        setReplyTo(comment_id)
    }

    async function handleData(data, call){
         try{
            const updatedComments = await Promise.all(
                data.map(async (comment) => {
                const updatedComment = {...comment}

                const user = await Axios.get(`user/${comment.user_id}`)
                if(user.data){
                    const formatedUser = formatListData(user)
    
                    updatedComment.user = formatedUser
                }
            }))
            
            call === "loadAllComments" && setComments(updatedComments)
            call === "loadNewComment" && setComments(prevComments => [...prevComments, updatedComment])
         } catch(err){
            console.log(err)
         }
    }

    async function deleteComment(post_id, comment_id){       
        await Axios.post(`/api/${posterId}/${artistId}/${post_id}/delete_comment/${comment_id}`)
    }

    async function deleteReply(post_id, comment_id, reply_id){
        await Axios.post(`/api/${posterId}/${artistId}/${post_id}/delete_reply/${comment_id}/${reply_id}`)
    }

    useEffect(() => {
        socket.emit('listenToComments', { post_id: postId, poster_id: posterId, artist_id: artistId })

        return () => {
            socket.emit('disconnectFromComments', { post_id: postId })
        }
    }, [socket])

    useEffect(() => {
        socket?.on('loadAllComments', (comment) => {
            handleData(comment, "loadAllComments")
        })

        return () => {
            socket.off('loadAllComments')
        }
    }, [socket])

    useEffect(() => {
        socket?.on('loadNewComment', (comment) => {
            handleData(comment, "loadNewComment")           
        })

        return () => {
            socket.off('loadNewComment')
        }
    }, [socket])

    useEffect(() => {
        if(comments){
            setCommentsNumber(comments.length)
        }

        console.log("comments are", comments)
    }, [comments])

    return (
        <>
            {(comments?.length > 0) &&
            comments
            .sort((a, b) => (a.timestamp > b.timestamp ? -1 : 1))
            .map(comment => {
                const { user, comment_id, text, likes, timestamp, replies } = comment
                return (
                    <section key={comment_id}>
                        <div className="flex">
                            <img src={user?.imgUrl}/>
                            <h3>{user?.name}</h3>
                        </div>
                        <p>{text}</p>
                        <div className="flex">
                            <h4>{timestamp}</h4>
                            <h4>{likes || 0} Likes</h4>
                            {(user?.id !== loggedUser.id) && 
                            <h4 onClick={() => replyToComment(user?.name, comment_id)}>Reply</h4>}
                            {(user?.id === loggedUser.id) &&
                            <h4 onClick={() => deleteComment(postId, comment_id)}>Delete Comment</h4>}
                        </div>
                        {replies && 
                        <h4 onClick={() => setShowReplies(!showReplies)}> 
                        {showReplies ? "Hide" : "View"} {replies?.length} replies </h4>}
                        
                        {showReplies &&
                            replies 
                            .sort((a, b) => (a.timestamp > b.timestamp ? -1 : 1))
                            .map(reply => {
                                return (
                                    <section key={reply.comment_id}>
                                    <div className="flex">
                                    <img src={reply.user?.imgUrl}/>
                                    <h3>{reply.user?.name}</h3>
                                    </div>
                                    <p>{text}</p>
                                    <div className="flex">
                                        <h4>{reply.timestamp}</h4>
                                        <h4>{likes || 0} Likes</h4>
                                        {(reply.user?.id !== loggedUser.id) && 
                                        <h4 
                                        onClick={() => replyToComment(reply.user?.name, comment_id)}>
                                            Reply
                                        </h4>}
                                        {(reply.user?.id === loggedUser.id) &&
                                        <h4 onClick={() => deleteReply(postId, comment_id, reply.comment_id)}>Delete Comment</h4>}
                                    </div>
                                </section>
                                )
                            })
                        }
                    </section>
                )
            })
            }
        </>
    )
}
