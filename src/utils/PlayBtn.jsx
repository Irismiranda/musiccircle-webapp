import React, { useEffect } from "react"
import useStore from "../store"

export default function PlayBtn(props){
    const { spotifyApi, playerState, setReference, reference } = useStore()
    const { deviceId } = playerState
    const { uri, category, type } = props

    async function playItem(){
        if(type === "track"){
            await spotifyApi.play({uris: [uri], device_id: deviceId})
            const id = uri.slice(14)
            console.log("id is:", id)
            setReference(id)
        } else{
            await spotifyApi.play({context_uri: uri, device_id: deviceId})
        } 
    }

    useEffect(() => {
        console.log("reference is: (playBtn)", reference)
    }, [reference])

    return (
        <div 
        className={`play_btn play_btn_${category}`}
        onClick={() => playItem(uri)}>
        </div>
    )
  }