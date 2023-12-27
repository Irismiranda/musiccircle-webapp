import React, { useEffect, useRef, useState } from "react"
import { SvgCommentBtn } from "../../assets"
import { useClickOutside } from "../../utils"

export default function PostWindowed(props){
    const [isPostVisible, setIsPostVisible] = useState(false)
    const [item, setItem] = useState(null)

    const { content, id, type } = props

    const postWindowRef = useRef(null)
    const commentsBtnRef = useRef(null)

    useClickOutside(postWindowRef, commentsBtnRef, () => setIsPostVisible(false))

    async function getitem(id, type){
        const methodName = `get${type.charAt(0).toUpperCase() + type.slice(1)}`
        const item = await spotifyApi[methodName](id)
        const formatedItem = formatListData([item], `${type}s`)
        setItem(formatedItem[0])
    }

    useEffect(() => {
        if(content){
            setItem(content)
        } else if(id && type){
            getitem(id, type)
        }
    }, [content, id])

    return (
        <>
            <div
            ref={commentsBtnRef}
            onClick={() => setIsPostVisible(!isPostVisible)}>
                <SvgCommentBtn />
            </div>

            {isPostVisible && 
            <section
            className="absolute wrapper post_windowed_wrapper"
            ref={postWindowRef}>
                
            </section>}
        </>
        
    )
    
}