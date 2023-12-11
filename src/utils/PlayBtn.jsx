import React from "react"
import useStore from "../store"

export default function PlayBtn(props){
    const { spotifyApi, deviceId } = useStore()
    const { uri, category } = props

    async function playItem(){
        await spotifyApi.play({uris: [uri], device_id: deviceId})
    }

    return (
        <div 
        className={`play_btn play_btn_${category}`}
        onClick={() => playItem(uri)}>
        </div>
    )
  }