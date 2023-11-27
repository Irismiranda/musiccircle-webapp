import React from "react"
import useStore from "../store"

export default function Inbox(){
    const { standardWrapperWidth } = useStore()
    
    return(
        <div className="wrapper default_padding" style={{ width: standardWrapperWidth }}>
            <h1> Inbox goes here</h1>
        </div>
    )
}
