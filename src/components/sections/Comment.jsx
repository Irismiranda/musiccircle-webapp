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
        replyTo,
        posterId,
        postId,
        artistId,
        inputSectionHeight,
        descriptionMenuRef,
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
        setIsFirstRepliesLoad(true)
    }, [showReplies])

    useEffect(() => {
        handleData(comment)
    }, [comment])

    return (
        <section 
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
                            <img 
                            className="profile_small"
                            src={userData?.imgUrl}/>
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
            {replies && 
            <h4 
            className="pointer"
            onClick={() => setShowReplies((prevShowReplies) => (prevShowReplies === comment?.comment_id ? null : comment?.comment_id))}> 
            {showReplies === comment?.comment_id && replies ? "Hide" : "View"} {replies?.length} replies </h4>}

            <section
            className="replies_section flex flex_column">
                {(showReplies === comment?.comment_id && replies) &&
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
                {(isFirstRepliesLoad && showReplies === comment?.comment_id) &&
                    <div 
                    className="loading_comments"
                    style={{ height: 
                    `calc(100% - ${descriptionMenuRef?.current?.clientHeight + inputSectionHeight}px)`}}>
                    </div>
                }
            </section>
        </section>
        )
}