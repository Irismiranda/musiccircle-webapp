import React, { useState, useEffect, useRef } from "react"
import useStore from "../../store"
import { Comment } from "../"
import { convertTimestampToDate } from "../../utils"


export default function Comments(props) {
    const [comments, setComments] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [commentsLoaded, setCommentsLoaded] = useState(0)
    const [listening, setIsListening] = useState(false)
    const [inputSectionHeight, setInputSectionHeight] = useState(200)

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

    const { socket } = useStore()

    const commentsRef = useRef(null)

    async function handleData(data, call){   
        if(call === "loadAllComments"){
            setComments(data)
        } else if (call === "loadNewComment"){
            setComments((prevComments) => {
                if (prevComments.some((prevComment) => prevComment.comment_id === data[0].comment_id)) {
                    return prevComments.map((prevComment) =>
                    prevComment.comment_id === data[0].comment_id ? data[0] : prevComment
                    )              
                } else {
                    return [...prevComments, data[0]]
                }
            })
        }
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
                setIsLoading(false)
            } else {
                handleData(comment, 'loadAllComments')
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
            } else {
                handleData(comment, 'loadNewComment')
            } 
        })

        return () => {
            socket.off('loadNewComment')
        }
    }, [])

    useEffect(() => {
        console.log("comments Loaded are", commentsLoaded)
        if(commentsLoaded >= comments?.length){
            setCommentsNumber(comments.length + (comments.replies?.length || 0))
            setIsLoading(false)
        }
    }, [commentsLoaded])

    useEffect(() => {
        inputSectionRef?.current && setTimeout(() => setInputSectionHeight(inputSectionRef?.current?.clientHeight), 50)
    }, [replyTo])

    return (
        isLoading ? (
        <div 
        className="loading_comments full_width"
        style={{ height: 
        `calc(100% - ${descriptionMenuRef?.current?.clientHeight + inputSectionHeight}px - 30px)`}}>
        </div>
        ) : (
        <div 
        ref={commentsRef}
        className="flex flex_column comments_inner_wrapper"
        style={{ height: 
        `calc(100% - ${descriptionMenuRef?.current?.clientHeight + inputSectionHeight}px - 30px)`}}>
            {(comments?.length > 0) &&
            comments
            .sort((a, b) => (convertTimestampToDate(b.timestamp) > convertTimestampToDate(a.timestamp) ? -1 : 1))
            .map(comment => {
                    return (
                        <Comment 
                        comment={comment}
                        comments={comments}
                        setComments={setComments}
                        setReplyTo={setReplyTo}
                        replyTo={replyTo}
                        posterId={posterId}
                        postId={postId}
                        artistId={artistId}
                        inputSectionHeight={inputSectionHeight}
                        descriptionMenuRef={descriptionMenuRef}
                        setCommentsLoaded={setCommentsLoaded}/>
                    )
                })
            }
        </div>
        )
    )
}