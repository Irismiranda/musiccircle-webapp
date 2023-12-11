import React from "react"
import useStore from "../store"

export default function playBtn(props){
    const { spotifyApi } = useStore()
    const { uri } = props

    async function playItem(){
        spotifyApi.play(uri)
    }

    return (
        <div 
        className="play_btn play_btn_slider" 
        onClick={() => playItem(item.uri)} 
        onMouseEnter={() => setHoverItemId(item.id)}>
        </div>
    )
    
  }