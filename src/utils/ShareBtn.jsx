import React, { useState, useRef } from "react"
import { Link } from "react-router-dom"
import { SvgShareBtn } from "../assets"
import { ShareMenu } from "../components"
import { useClickOutside } from "./utils"

export default function ShareBtn(props){
    const [isShareMenuVisibile, setIsShareMenuVisibile] = useState(false)
    const shareMenuRef = useRef(null)
    const shareBtnRef = useRef(null)

    const { content } = props

    useClickOutside(shareMenuRef, shareBtnRef, () => setIsShareMenuVisibile(false))

    return (
        <section
        className="relative">
            <div 
            ref={shareMenuRef}>
                {isShareMenuVisibile && 
                <ShareMenu 
                content={content}
                closeMenu={() => setIsShareMenuVisibile(false)}/>}
            </div>
            <SvgShareBtn 
            ref={shareBtnRef}
            className="svg" 
            onClick={() => setIsShareMenuVisibile(!isShareMenuVisibile)}/>
        </section>
    )
  }