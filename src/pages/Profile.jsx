import React, { useEffect } from "react"
import { useLocation } from "react-router-dom"
import useStore from "../store"

export default function Profile(){
    const { standardWrapperWidth } = useStore()
    const location = useLocation()
    const params = location.search
    
    useEffect(() => {
        console.log("log - params are:", params)
        console.log("log - AAAAAAAAAAAAAAAAAAAAA")
    }, [location])
    
    return(
        <div className="wrapper default_padding" style={{ width: standardWrapperWidth }}>
            <h1> Profile goes here</h1>
        </div>
    )
}
