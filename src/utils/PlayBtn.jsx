import React from "react"
import useStore from "../store"

export default function PlayBtn(props){
    const { spotifyApi, playerState } = useStore()
    const { deviceId } = playerState
    const { uri, category } = props

    async function playItem(){
        console.log("device is;", deviceId)
        await spotifyApi.play({uris: [uri], device_id: deviceId})
    }

    return (
        <div 
        className={`play_btn play_btn_${category}`}
        onClick={() => playItem(uri)}>
        </div>
    )
  }