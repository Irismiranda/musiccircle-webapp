import React from "react"
import useStore from "../store"

export default function PlayBtn(props){
    const { spotifyApi, playerState } = useStore()
    const { deviceId } = playerState
    const { uri, category, type } = props

    async function playItem(){
        console.log("device is;", deviceId)
        type === "track" && await spotifyApi.play({uris: [uri], device_id: deviceId})
        (type === "album" || type === "playlist") && await spotifyApi.play({context_uri: uri, device_id: deviceId})
    }

    return (
        <div 
        className={`play_btn play_btn_${category}`}
        onClick={() => playItem(uri)}>
        </div>
    )
  }