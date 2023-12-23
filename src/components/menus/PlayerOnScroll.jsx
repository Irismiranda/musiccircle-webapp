import React, { useRef } from "react"
import { Link } from "react-router-dom"
import useStore from "../../store"
import { SvgCommentBtn, SvgPlayBtn, SvgRandom, SvgRepeat, SvgVolume, SvgPrevBtn, SvgNextBtn } from "../../assets"
import { useClickOutside, HeartBtn } from "../../utils"


const PlayerOnScroll = ((props) => {
    const { playerState, setPlayerState } = useStore()
    const shareBtnRef = useRef(null)
    const commentBtnRef = useRef(null)
    const volumeBarRef = useRef(null)
    const trackTimelineRef = useRef(null)
    const { 
        player, 
        isPaused,
        currentTrack, 
        listened, 
        isLiked, 
        shuffleState, 
        repeatState, 
        volumePercentage, 
        isMute,  
    } = playerState
    
    const { 
        handleShuffleClick,
        handleRepeatClick,
        trackVolumePosition,
        handleTimelineClick,
        isPostVisible, 
        setIsPostVisible,
    } = props.playerFunctionalProps

    const { postWindowRef } = props

    const albumImg = currentTrack.album.images[0].url
    const trackName = currentTrack.name
    const artistName = currentTrack.artists[0].name
    const songId = currentTrack.id

    useClickOutside(postWindowRef, commentBtnRef, () => setIsPostVisible(false))

    return (
            <div className="flex_column gap">
                <div className="flex">
                    <h3 
                    style={{ lineHeight: "50px"}}>  
                    {trackName} 
                    by 
                    <Link to={`/artist/${currentTrack.artists[0].id}`}>
                        <h3> {artistName} </h3>
                    </Link>
                    </h3>
                    <HeartBtn songId={songId} isLiked={isLiked}/>
                </div>
                <div className="flex">
                    <div onClick={() => { player.previousTrack() }}>
                        <SvgPrevBtn className="svg" />
                    </div>

                    <div onClick={() => { player.togglePlay() }} >
                        <SvgPlayBtn is_paused={isPaused ? "true" : "false"} className="svg_medium"/>
                    </div>

                    <div>
                        <SvgNextBtn className="svg" onClick={() => { player.nextTrack() }} />
                    </div>

                    <div className="track-timeline bar" 
                        ref={trackTimelineRef} 
                        onClick={(e) => handleTimelineClick(e, trackTimelineRef)}>
                        <div className="track-listened" style={{ width: `${listened}%` }}></div>
                    </div>
                </div>
                <div className="flex space_between">
                    <div className="flex">
                        <div className="flex" onClick={() => handleShuffleClick()}>
                            <SvgRandom className="svg" style={{ fill: shuffleState ? '#F230AA' : '#AFADAD' }} />
                        </div>
                        <div className="flex" onClick={() => handleRepeatClick()}>
                            <SvgRepeat className="svg" repeat_state={repeatState} style={{ fill: repeatState === 1 || repeatState === 2 ? '#F230AA' : '#AFADAD' }} />
                        </div>
                        <div className="flex">
                            <div className="flex" onClick={() => setPlayerState({ isMute: !isMute })}> 
                                <SvgVolume className="svg" volume_percentage={volumePercentage}/>
                            </div>
                            <div
                            ref={volumeBarRef}
                            className="volume-bar bar flex"
                            onClick={(e) => trackVolumePosition(e, volumeBarRef)}>
                                <div className="volume-level"
                                    style={{ width: `${volumePercentage}%` }}>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="flex">
                        <div className="flex" ref={commentBtnRef}>
                            <SvgCommentBtn className="svg" fill={"#AFADAD"} onClick={() => setIsPostVisible(!isPostVisible)}/>
                        </div>
                        <div className="flex" ref={shareBtnRef}>
                            <ShareBtn
                            content={currentTrack}/>
                        </div>
                    </div>
                </div>
            </div> 
    )
})

export default PlayerOnScroll