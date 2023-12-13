import React, { useEffect } from "react"
import useStore from "../store"

export default function PlayBtn(props){
    const { spotifyApi, playerState, setSeedTrackId } = useStore()
    const { uri, id, category, type, hoverItemId } = props
    const { deviceId, currentTrack } = playerState

    async function playItem(){
        if(type === "track"){
            await spotifyApi.play({uris: [uri], device_id: deviceId})
            setSeedTrackId(id)
        } else{
            await spotifyApi.play({context_uri: uri, device_id: deviceId})
            setSeedTrackId(null)
        }
    }

    return (
        <>
            {(hoverItemId === id && currentTrack) && 
            <div 
            className={`play_btn play_btn_${category}`}
            onClick={() => playItem(uri)}>
            </div>}
        </>
    )
  }