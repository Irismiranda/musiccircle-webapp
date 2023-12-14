import React from "react"
import useStore from "../store"
import { SvgHeart } from "../assets"

export default function LikeBtn(props){
    const { spotifyApi, setPlayerState } = useStore()
    const { isLiked, songId } = props

    async function handleHeartClick(id) {
        const trackIds = [id]
        if (!isLiked) {
            try{
                await spotifyApi.addToMySavedTracks(trackIds)
                setPlayerState({ isLiked: true })
            } catch(err){
                console.log(err)
            }
        } else {
            try{
                await spotifyApi.removeFromMySavedTracks(trackIds)
                setPlayerState({ isLiked: false })
            } catch(err){
                console.log(err)
            }
        }
    }

    return (
        <div onClick={() => handleHeartClick(songId)}>
            <SvgHeart className="svg" style={{ fill: isLiked ? '#F230AA' : 'none', stroke: isLiked ? "#F230AA" : "#AFADAD" }} />
        </div>
    )
  }