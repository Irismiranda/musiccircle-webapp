import React from "react"
import useStore from "../store"

export default function playBtn(props){
    const { spotifyApi } = useStore()
    const { uri, category } = props

    async function playItem(){
        await spotifyApi.play(uri)
    }

    return (
        <div 
        className={`play_btn play_btn_${category}`}
        onClick={() => playItem(item.uri)} 
        onMouseEnter={() => setHoverItemId(item.id)}>
        </div>
    )
    
  }