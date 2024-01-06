import React, { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { SvgHeart } from "../../assets"
import { Reply } from ".."
import useStore from "../../store"
import { convertTimestampToDate, formatListData } from "../../utils"
import { Axios } from "../../Axios-config"

export default function Comment(props){
    const [showReplies, setShowReplies] = useState(false)
    const [replies, setReplies] = useState([])
    const [isFirstRepliesLoad, setIsFirstRepliesLoad] = useState(true)
    const [userData, setUserData] = useState(null)
    
    const { 
        comment, 
        comments,
        setComments,
        setReplyTo, 
        posterId,
        postId,
        artistId,
    } = props

    const { comment_id, text, likes, timestamp } = comment || {}

    const { loggedUser } = useStore()

    async function getUser(id){
        const userData = await Axios.get(`api/user/${id}`)
        const formatedUser = formatListData([userData.data], userData.data.type) 

        console.log("formated user is", formatedUser[0])

        return formatedUser[0]   
    }

    async function deleteComment(post_id, comment_id){       
        await Axios.post(`/api/${posterId}/${artistId}/${post_id}/delete_comment/${comment_id}`)
        setComments(comments.filter(comment => comment.comment_id !== comment_id))
    }

    async function handleData(data){
        const userData = await getUser(data.user_id)
        setUserData(userData)
        setReplies(data.replies)
    }

    function replyToComment(handle, comment_id){
        setReplyTo({comment_id: comment_id, user_handle: handle})
    }

    async function likeComment(post_id, comment_id){       
        await Axios.post(`/api/${posterId}/${artistId}/${post_id}/toggle_like_comment/${comment_id}`, {
            logged_user_id: loggedUser.id
        })

        if(comment.likes?.includes(loggedUser.id)){
            comment.likes = comment.likes.filter(like => like !== loggedUser.id)
        } else {
            comment.likes ? comment.likes.push(loggedUser.id) : 
            comment.likes = [loggedUser.id]
        }
        setComments(comments.map(prevComment => prevComment.comment_id === comment_id ? comment : prevComment))
    }

    useEffect(() => {
        setIsFirstRepliesLoad(true)
    }, [showReplies])

    useEffect(() => {
        handleData(comment)
    }, [comment])

    return (
        <section 
        key={comment_id}
        className="flex flex_column align_start full_width"
        style={{ gap: "15px" }}>
            <div 
            className="flex space_between">
                <div>
                    <Link to={`/account/${userData?.id}`}>
                        <div 
                        className="flex"
                        style={{ marginBottom: "15px" }}>
                            <img 
                            className="profile_small"
                            src={userData?.imgUrl}/>
                            <h3>{userData?.name}</h3>
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
                {(userData?.id !== loggedUser.id) && 
                <h4 
                className="pointer"
                onClick={() => replyToComment(userData?.name, comment_id)}>Reply</h4>}
                {(userData?.id === loggedUser.id) &&
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
                        setComments={setComments}
                        comments={comments}
                        postId={postId}
                        posterId={posterId}
                        artistId={artistId}
                        replyToComment={replyToComment}
                        getUser={getUser}
                        isFirstRepliesLoad={isFirstRepliesLoad}
                        setIsFirstRepliesLoad={setIsFirstRepliesLoad}
                        currentComment={comment}/>
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
}