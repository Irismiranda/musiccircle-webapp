import React, { useState, useRef } from "react"
import { SvgShareBtn } from "../assets"
import { ShareMenu } from "../components"
import { useClickOutside } from "./"
import useStore from "../store"

export default function ShareBtn(props){
    const [isShareMenuVisibile, setIsShareMenuVisibile] = useState(false)
    const shareMenuRef = useRef(null)
    const shareBtnRef = useRef(null)

    const { content } = props
    const { setLoggedUser } = useStore()

    useClickOutside(shareMenuRef, [shareBtnRef], () => setIsShareMenuVisibile(false))

    return (
        <section
        className="relative">
            {isShareMenuVisibile && 
            <div 
            ref={shareMenuRef}
            className="share_menu_wrapper wrapper windowed">
                
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