import React, { useState, useRef } from "react"
import { SvgShareBtn } from "../assets"
import { ShareMenu } from "../components"
import { useClickOutside, formatListData } from "./"

export default function ShareBtn(props){
    const [isShareMenuVisibile, setIsShareMenuVisibile] = useState(false)
    const shareMenuRef = useRef(null)
    const shareBtnRef = useRef(null)

    const { content } = props

    useClickOutside(shareMenuRef, shareBtnRef, () => setIsShareMenuVisibile(false))

    return (
        <section
        className="relative">
            {isShareMenuVisibile && 
            <div 
            ref={shareMenuRef}
            className="share_menu_wrapper wrapper">
                
                <ShareMenu 
                content={content}
                closeMenu={() => setIsShareMenuVisibile(false)}/>
            </div>}
            <div 
            ref={shareBtnRef}>
                <SvgShareBtn 
                className="svg" 
                onClick={() => setIsShareMenuVisibile(!isShareMenuVisibile)}/>
            </div>
        </section>
    )
  }