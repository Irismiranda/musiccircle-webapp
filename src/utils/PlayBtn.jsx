import React from "react"
import useStore from "../store"

export default function PlayBtn(props){
    const { spotifyApi, playerState, setPlayerState } = useStore()
    const { deviceId } = playerState
    const { uri, category, type } = props

    async function playItem(){
        if(type === "track"){
            await spotifyApi.play({uris: [uri], device_id: deviceId})
            setPlayerState({reference: {uri: uri, type: type}})
        } else{
            await spotifyApi.play({context_uri: uri, device_id: deviceId})
        } 
    }

    return (
        <div 
        className={`play_btn play_btn_${category}`}
        onClick={() => playItem(uri)}>
        </div>
    )
  }