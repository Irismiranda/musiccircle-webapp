import React from "react"
import useStore from "../store"

export default function PlayBtn(props){
    const { spotifyApi, playerState, setSeedTracks, loggedUser } = useStore()
    const { uri, id, category, type, hoverItemId } = props
    const { deviceId, currentTrack } = playerState

    async function playItem(){

        if(type === "track"){
            await spotifyApi.play({uris: [uri], device_id: deviceId})
            setSeedTracks({ids: [id], type: "tracks"})
        } else if (type === "album"){
            await spotifyApi.play({context_uri: uri, device_id: deviceId})
            const album = await spotifyApi.getAlbum(id)

            let retries = 0
            const maxRetries = 3
            while (retries < maxRetries) {
                try{
                    const ids = album.tracks.map( track => {
                        return track.id
                    })
        
                    await Promise.all(ids.map(id => {
                        spotifyApi.queue(id)
                    }))
        
                    setSeedTracks({ids: ids.slice(0, 5), type: "tracks"})
                } catch (err) {
                    if (err.status === 502) {
                        retries++
                        await delay(1000)
                    } else {
                        throw err
                    }
                }
            }
            throw new Error(`Failed after ${maxRetries} retries`)
        } else if (type === "artist"){
            let retries = 0
            const maxRetries = 3
            await spotifyApi.play({context_uri: uri, device_id: deviceId})
            const response = spotifyApi.getArtistTopTracks(id, loggedUser.country)

            const ids = response.tracks.map(track => {
                return track.id
            })

            while (retries < maxRetries) {
                try{
                    await Promise.all(ids.map(id => {
                        spotifyApi.queue(id)
                    }))
        
                    setSeedTracks({ids: [id], type: "artists"})
                } catch (err) {
                    if (err.status === 502) {
                        retries++
                        await delay(1000)
                    } else {
                        throw err
                    }
                }
            }
            throw new Error(`Failed after ${maxRetries} retries`)
        }
    }

    async function delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
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