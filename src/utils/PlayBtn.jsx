import React, { useEffect } from "react"
import useStore from "../store"

export default function PlayBtn(props){
    const { spotifyApi, playerState, setReference, reference } = useStore()
    const { uri, category, type, hoverItemId } = props
    const { deviceId } = playerState
    const id = uri.slice(14)

    async function playItem(){
        if(type === "track"){
            await spotifyApi.play({uris: [uri], device_id: deviceId})
            setReference(id)
        } else{
            await spotifyApi.play({context_uri: uri, device_id: deviceId})
        }
    }

    useEffect(() => {
        console.log("reference is (PlayBtn):", reference)
    }, [reference])

    return (
        <>
            {(hoverItemId === id) && 
            <div 
            className={`play_btn play_btn_${category}`}
            onClick={() => playItem(uri)}>
            </div>}
        </>
    )
  }