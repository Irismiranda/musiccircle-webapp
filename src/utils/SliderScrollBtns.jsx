import React, { useState, useEffect } from "react"
import { SvgRightBtn, SvgLeftBtn } from "../assets"

export default function SliderScrollBtns(props){
    const [ maxScrollLeft, setMaxScrollLeft ] = useState(0)
    const [ listScroll, setListScroll ] = useState(0)

    const { parentRef, list, slidePercent } = props

    function slideLeft(){
        parentRef.current.scrollBy({ left: - (maxScrollLeft * slidePercent), behavior: 'smooth' })
    }
    
    function slideRight(){
        parentRef.current.scrollBy({ left: (maxScrollLeft * slidePercent), behavior: 'smooth' })
    }

    useEffect(() => {
        if(parentRef.current){
            const maxScroll = parentRef.current.scrollWidth - parentRef.current.clientWidth
            console.log("max scroll is:", maxScroll)
            setMaxScrollLeft(maxScroll)
        }
    }, [list])

    useEffect(() => {
        const handleScroll = () => {
            if (parentRef.current) {
                setListScroll(parentRef.current.scrollLeft)
            }
        }
    
        const sliderElement = parentRef.current
        if (sliderElement) sliderElement.addEventListener('scroll', handleScroll)
    
        return () => {
            if (sliderElement) sliderElement.removeEventListener('scroll', handleScroll)
        }
    }, [list])

    return (
        <>
            {(listScroll > (maxScrollLeft * 0.08)) && 
                <div className="btn_wrapper_left" onClick={() => slideLeft()}>
            <SvgLeftBtn className="svg_left_right"/>
            </div>}
            {(listScroll < (maxScrollLeft * 0.9)) && 
                <div className="btn_wrapper_right" onClick={() => slideRight()}>
                <SvgRightBtn className="svg_left_right"/>
            </div>}
        </>
    )
  }