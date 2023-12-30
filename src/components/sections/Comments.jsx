import React, { useState, useEffect } from "react"
import useStore from "../../store"
import { Axios } from "../../Axios-config"
import { formatListData } from "../../utils"
import { SvgHeart } from "../../assets"

export default function Comments(props) {
    const [comments, setComments] = useState({})
    const [showReplies, setShowReplies] = useState(false)
    const [isLoading, setIsLoading] = useState(true)

    const { postId, posterId, artistId, setReplyTo, setCommentsNumber, descriptionMenuRef } = props
    const { socket, loggedUser } = useStore()

    function replyToComment(name, comment_id){
        textAreaRef.current.value = `@${name} `
        setReplyTo(comment_id)
    }

    async function handleData(data, call){
        console.log("data is", data)
         try{
            const updatedComments = await Promise.all(
                data.map(async (comment) => {
                const updatedComment = {...comment}
                console.log("comment data is", comment)

                const user = await Axios.get(`api/user/${comment.user_id}`)
                if(user.data){
                    console.log("user is", user.data)

                    const formatedUser = formatListData([user.data], user.data.type)
                    updatedComment.user = formatedUser[0]
                    return updatedComment
                }
            }))

            console.log("updated comment is", updatedComments)
            
            call === "loadAllComments" && setComments(updatedComments)
            call === "loadNewComment" && setComments(prevComments => [...prevComments, updatedComments])
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

    async function likeComment(post_id, comment_id){       
        await Axios.post(`/api/${posterId}/${artistId}/${post_id}/toggle_like_comment/${comment_id}`, {
            logged_user_id: loggedUser.id
        })
    }

    async function likeReply(post_id, comment_id, reply_id){
        await Axios.post(`/api/${posterId}/${artistId}/${post_id}/toggle_like_reply/${comment_id}/${reply_id}`, {
            logged_user_id: loggedUser.id
        })
    }

    useEffect(() => {
        socket.emit('listenToComments', { post_id: postId, poster_id: posterId, artist_id: artistId })

        return () => {
            socket.emit('disconnectFromComments', { post_id: postId })
        }
    }, [socket])

    useEffect(() => {
        socket?.on('loadAllComments', (comment) => {
            setIsLoading(true)

            handleData(comment, "loadAllComments")

            setIsLoading(false)
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
        !isLoading ? (
        <div 
        className="flex flex_column comments_inner_wrapper"
        style={{ height: `calc(100% - ${descriptionMenuRef?.current?.clientHeight + 100}px)` }}>
            {(comments?.length > 0) &&
            comments
            .sort((a, b) => (a.timestamp > b.timestamp ? -1 : 1))
            .map(comment => {
                console.log("comment is", comment)
                const { user, comment_id, text, likes, timestamp, replies } = comment
                return (
                    <section 
                    key={comment_id}
                    className="flex flex_column align_start full_width"
                    style={{ gap: "15px" }}>
                        <div 
                        className="flex space_between">
                            <div>
                                <div 
                                className="flex"
                                style={{ marginBottom: "15px" }}>
                                <img 
                                className="profile_small"
                                src={user?.imgUrl}/>
                                <h3>{user?.name}</h3>
                                </div>
                                <p>{text}</p>
                            </div>
                            <div
                            onClick={() => likeComment(user?.name, comment_id)}>
                                <SvgHeart 
                                className="svg"
                                style={{ 
                                    fill: likes?.includes(loggedUser.id) ? '#F230AA' : 'none', 
                                    stroke: likes?.includes(loggedUser.id) ? "#F230AA" : "#AFADAD" 
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
                        onClick={() => setShowReplies(!showReplies)}> 
                        {showReplies ? "Hide" : "View"} {replies?.length} replies </h4>}
                        
                        {showReplies &&
                            replies 
                            .sort((a, b) => (a.timestamp > b.timestamp ? -1 : 1))
                            .map(reply => {
                                return (
                                    <section key={reply.comment_id}>
                                        <div 
                                        className="flex space-between">
                                            <div>
                                                <div className="flex"
                                                style={{ marginBottom: "10px" }}>
                                                    <img 
                                                    className="profile_small"
                                                    src={reply.user?.imgUrl}/>
                                                    <h3>{reply.user?.name}</h3>
                                                </div>
                                                <p>{text}</p>
                                            </div>
                                            <div
                                            onClick={() => likeReply(reply.user?.name, comment_id)}>
                                                <SvgHeart 
                                                className="svg"
                                                style={{ 
                                                    fill: reply?.likes?.includes(loggedUser.id) ? '#F230AA' : 'none', 
                                                    stroke: reply?.likes?.includes(loggedUser.id) ? "#F230AA" : "#AFADAD" 
                                                    }}/>
                                            </div>
                                        </div>
                                        <div className="flex">
                                            <h4>{reply.timestamp}</h4>
                                            <h4>{reply.likes?.length || 0} Likes</h4>
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
        </div>
        ) : (
        <div 
        className="loading_comments"
        style={{ height: `calc(100% - ${descriptionMenuRef?.current?.clientHeight + 100}px)` }}>
        </div>
        )
    )
}
