import React, { useState, useRef } from "react"
import { SvgShareBtn } from "../assets"
import { ShareMenu } from "../components"

export default function ShareBtn(props){
    const [isShareMenuVisibile, setIsShareMenuVisibile] = useState(false)
    const shareMenuRef = useRef(null)

    const { content } = props

    return (
        <section
        className="relative">
            <div>
                {isShareMenuVisibile && 
                <ShareMenu 
                content={content}
                closeMenu={() => setIsShareMenuVisibile(false)}/>}
            </div>
            <SvgShareBtn 
            ref={shareMenuRef}
            className="svg" 
            onClick={() => setIsShareMenuVisibile(!isShareMenuVisibile)}/>
        </section>
    )
  }