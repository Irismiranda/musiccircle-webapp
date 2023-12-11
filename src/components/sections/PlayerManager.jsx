import React, { useState, useEffect, useRef } from "react"
import { Outlet } from "react-router-dom"
import { PlayerMaximized, PlayerMinimized, PlayerOnScroll, Post, ShareMenu } from ".."
import { SvgDeviceIcon, SvgMinMaxBtn, SvgResizeHandle } from "../../assets"
import useStore from "../../store"

export default function PlayerManager() {
    const [isShareMenuVisibile, setIsShareMenuVisibile] = useState(false)
    const [isPostVisible, setIsPostVisible] = useState(false)
    const [queueIndex, setQueueIndex] = useState(null)
    const [recommendations, setRecommendations] = useState(null)
    const prevArtistUriRef = useRef(null)
    const prevSetVolume = useRef(null)
    const postWindowRef = useRef(null)
    const shareMenuRef = useRef(null)
    const playerRef = useRef(null)
    const playerWrapperRef = useRef(null)
    const draggableHandleRef = useRef(null)
    const clientPrevPosY = useRef(null)
    const clientPrevPosX = useRef(null)
    const playerRectRef = useRef(null)

    const [isResizing, setIsResizing] = useState(false)
    const [playerSize, setPlayerSize] = useState({
        height: 248,
        width: 620,
    })

    const [isMoving, setIsMoving] = useState(false)
    const [playerPosStyle, setPlayerPosStyle] = useState({ 
        top: 0, 
        left: 0,
    })
    
    const { spotifyApi, accessToken, setArtistUri, artistUri, standardWrapperWidth, playerState, setPlayerState } = useStore()

    const { 
        isMinimized,
        player, 
        currentTrack, 
        isLiked, 
        shuffleState, 
        repeatState, 
        isMute,  
        reference,
    } = playerState

    function setProperties(callback, property, value) {
        callback((prevState) => ({
          ...prevState,
          [property]: value,
        }))
    }

    async function handleShuffleClick() {
        spotifyApi.setShuffle(!shuffleState)
        setPlayerState({ shuffleState: !shuffleState })
    }

    async function handleRepeatClick() {
        if (repeatState === 0 || repeatState === 1) {
            const newState = repeatState + 1
            setPlayerState({ repeatState: newState })
        } else {
            setPlayerState({ repeatState: 0 })
        }
    }

    async function trackVolumePosition(e, volumeBarRef) {
        const volumeBarRect = volumeBarRef.current.getBoundingClientRect()
        const volumePercentage = calculatePosition(e, volumeBarRect) * 100
        const roundedPercentage = Math.round(volumePercentage)
        setPlayerState({ volumePercentage: roundedPercentage })
        try {
            await spotifyApi.setVolume(roundedPercentage)
        } catch (error) {
            console.log(error)
        }
    }

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

    async function getRecommendations(){
        const { type, uri } = reference
        const id = uri.slice(14)

        if(type === "track"){
            const recommendations = await spotifyApi.getRecommendations({ seed_tracks: [id], limit: 100 })
            const recomendationsUriList = recommendations.map(track => {
                return track.uri
            })
            setRecommendations(recomendationsUriList)
            setQueueIndex(1)
        } 
    }

    async function setQueue(){
        spotifyApi.queue(recommendations[queueIndex])
        setQueueIndex(prevIndex => prevIndex + 1)
    }

    function calculatePosition(e, rect) {
        const handleRelativePosition = e.clientX - rect.left
        const fraction = handleRelativePosition / rect.width
        return fraction
    }

    function handleTimelineClick(e, trackTimelineRef) {
        const rect = trackTimelineRef.current.getBoundingClientRect()
        const fraction = calculatePosition(e, rect)
        setPlayerState({ listened: fraction * 100 })
        const positionInSec = fraction * currentTrack.duration_ms
        player.seek(positionInSec).then(() => {
        }) 
    }

    const handleScroll = () => {  

        const prevPlayerHeight = playerRef?.current?.offsetHeight
        
        if(window.scrollY > 1 + prevPlayerHeight){
            setPlayerState({ isScrolled: true })
        } else{
            setPlayerState({ isScrolled: false })
        }
    }

    const getInitialPos = (e) => {   
        if(isMinimized){

            clientPrevPosX.current = e.clientX
            clientPrevPosY.current = e.clientY 
            playerRectRef.current = playerRef.current.getBoundingClientRect()
            
            if(draggableHandleRef.current.contains(e.target)) {
                setProperties(setPlayerSize, 'width', playerRef?.current?.offsetWidth)
                setProperties(setPlayerSize, 'height', playerRef?.current?.offsetHeight)
                setIsResizing(true)
                setIsMoving(false)
            } else{  
                setIsMoving(true)
                setIsResizing(false)
            }
        }
    }

    const handlePlayerMove = (e) => {
        if (!isMoving) return

        const dx = e.clientX - clientPrevPosX.current
        const dy = e.clientY - clientPrevPosY.current

        const newLeft = Math.max(0, Math.min((playerRectRef.current.left + dx), document.documentElement.clientWidth - playerWrapperRef?.current.offsetWidth))
        const newTop = Math.max(0, Math.min((playerRectRef.current.top + dy), document.documentElement.clientHeight - playerWrapperRef?.current?.offsetHeight - 5))

        setPlayerPosStyle({ left: newLeft, top: newTop })
    }

    const handleResize = (e) => {
        if (!isResizing) return
        const { width, height } = playerSize
        const dx = e.clientX - clientPrevPosX.current + width
        const dy = e.clientY - clientPrevPosY.current + height

        const newWidth = Math.min(dx, document.documentElement.clientWidth - playerRectRef.current.x)

        if(dx > 615){
            setProperties(setPlayerSize, 'width', newWidth)
            setProperties(setPlayerSize, 'height', (newWidth / 2.5))
        } else{
            const maxHeight = Math.min(dy, 175)
            setProperties(setPlayerSize, 'width', newWidth)
            setProperties(setPlayerSize, 'height', maxHeight)
        }
    }

    useEffect(() => {
        console.log("player state is:", playerState)
    }, [playerState])

    useEffect(() => {
        async function updateMuteState(){
            const { isMute, volumePercentage } = playerState
            if(isMute && volumePercentage){
                prevSetVolume.current = volumePercentage
                setPlayerState({ volumePercentage: 0 })
                await spotifyApi.setVolume(0)
            } else if(!isMute && prevSetVolume.current){
                setPlayerState({ volumePercentage: prevSetVolume.current })
                await spotifyApi.setVolume(prevSetVolume.current)
            }
        }
        updateMuteState()
    }, [isMute])

    useEffect(() => {
        window.addEventListener("scroll", handleScroll)
    
        return () => {
            window.removeEventListener("scroll", handleScroll)
        }
    }, [])

    useEffect(() => {
        async function getIsTrackSaved() {
            const trackIds = [currentTrack.id]
            const response = await spotifyApi.containsMySavedTracks(trackIds)
            setPlayerState({ isLiked: response[0] })
        }

        if (currentTrack) {
            getIsTrackSaved()
        }
    }, [currentTrack])

    useEffect(() => {
        const script = document.createElement("script")
        script.src = "https://sdk.scdn.co/spotify-player.js"
        script.async = true

        document.body.appendChild(script);

        window.onSpotifyWebPlaybackSDKReady = () => {

            const player = new window.Spotify.Player({
                name: 'MusicCircle',
                getOAuthToken: cb => { cb(accessToken); },
                volume: 0.5
            })

            setPlayerState({ player: player })
        
            player.connect()

            player.addListener()

            player.addListener('ready', ({ device_id }) => {
                setPlayerState({ deviceId: device_id })
            })

              
            player.addListener('player_state_changed', (state => {
                  
                if (!state) {
                    return
                }
                    
                const interval = setInterval(() => {
                    player.getCurrentState().then((state) => {
                        if (state && state.position && state.duration && !state.paused) {
                            const totalListened = (100 * state.position) / state.duration
                            setPlayerState({ listened: totalListened })
                        }
                    })
                }, 50)
                    
                setPlayerState({ currentTrack: state.track_window.current_track })
                    
                try{
                    const currentArtistUri = state.track_window.current_track.artists[0].uri
                    if (!artistUri || currentArtistUri !== prevArtistUriRef.current) {
                    setArtistUri(currentArtistUri)
                    prevArtistUriRef.current = currentArtistUri
                    }
                }catch(err){
                    console.log(err)
                }

                setPlayerState({ 
                    shuffleState: state.shuffle, 
                    repeatState: state.repeat_mode, 
                    isPaused: state.paused })

                player.getVolume().then(volume => {
                    let percentage = volume * 100

                    setPlayerState({ volumePercentage: percentage })
                })

                player?.getCurrentState().then(state => {
                    (!state) ? setPlayerState({ isActive: false }) : setPlayerState({ isActive: true })
                })

                const currentQueue = state.track_window.next_tracks
                if(currentTrack && currentQueue.length < 1 && !queueIndex){
                    getRecommendations()
                }

                if(currentTrack && currentQueue.length < 1 && queueIndex < 100 && recommendations){
                    setQueue()
                }

            }))

            player.addListener('player_state_changed', ({
                state,
                position,
                duration,
            }) => {
                const totalListened = (100 * position) / duration
                setPlayerState({ listened: totalListened })
            })

            return () => clearInterval(interval)
        }

    }, [accessToken])

    useEffect(() => {

        const handleMouseUp = () => {
            setIsResizing(false)
        }
        
        if (isResizing) {
            window.addEventListener('mousemove', handleResize)
            window.addEventListener('mouseup',  handleMouseUp)
        } else {
            window.removeEventListener('mousemove', handleResize)
            window.removeEventListener('mouseup', handleMouseUp)
        }

        return () => {
            window.removeEventListener('mousemove', handleResize)
            window.removeEventListener('mouseup', handleMouseUp)
        }
    }, [isResizing])

    useEffect(() => {       
        const handleMouseUp = () => {
            setIsMoving(false)
        }

        if (isMoving) {
            window.addEventListener('mousemove', handlePlayerMove)
            window.addEventListener('mouseup',  handleMouseUp)
        } else {
            window.removeEventListener('mousemove', handlePlayerMove)
            window.removeEventListener('mouseup', handleMouseUp)
        }

        return () => {
            window.removeEventListener('mousemove', handlePlayerMove);
            window.removeEventListener('mouseup', handleMouseUp);
        }
    }, [isMoving])

    const playerFunctionalProps = {
        setProperties,
        handleShuffleClick,
        handleRepeatClick,
        trackVolumePosition,
        handleHeartClick,
        handleTimelineClick,
        isPostVisible, 
        setIsPostVisible,
        isShareMenuVisibile, 
        setIsShareMenuVisibile,
        handleResize,
        getInitialPos,
        playerSize,
      }

    if (!currentTrack) {
        return (
            <>
            <div className="flex connect_device_float">
                <SvgDeviceIcon className="svg_big"/>
                <div>
                    <h3>Connect your Spotify Player</h3>
                    <h4>To start your experience</h4>
                </div>
                <div className="more_info_button">
                    <h5>?</h5>
                </div>
            </div>
            <Outlet />
            </>
        )
    } else {
        const { isScrolled, isMinimized } = playerState
        return (
            <> 
            { isPostVisible && 
                <div 
                className="post_wrapper wrapper default_padding" 
                ref={postWindowRef}>
                    <Post />
                </div> }
                <div 
                ref={playerWrapperRef}
                className={isMinimized ? "player_minimized wrapper fixed" : "player_default wrapper sticky"}
                onMouseDown={(e) => getInitialPos(e)}
                style={{ 
                    width: isMinimized ? `${playerSize.width}px` : standardWrapperWidth,
                    height: isMinimized ? `${playerSize.height}px` : "",
                    left: isMinimized ?  playerPosStyle.left : "",
                    top: isMinimized ? playerPosStyle.top : ""}}>

                    { isShareMenuVisibile &&
                        <div 
                        className="share_menu_wrapper wrapper default_padding sticky full_width" 
                        style={{ 
                            left: isMinimized ? "18%" : "", 
                            top: isMinimized ? "90%" : ""
                        }}
                        >
                            <ShareMenu />
                    </div>}

                    <div onClick={() => setPlayerState({ isMinimized: !isMinimized })}>
                        <SvgMinMaxBtn className="minMaxBtn" is_minimized={isMinimized.toString()}/>
                    </div>

                    { (!isScrolled && !isMinimized) &&
                    <div 
                    className="full_width"
                    ref={playerRef}>
                        <PlayerMaximized
                        shareMenuRef={shareMenuRef}
                        postWindowRef={postWindowRef}
                        playerState={playerState}
                        playerFunctionalProps={playerFunctionalProps}
                    />
                    </div>
                    }

                    { (isScrolled && !isMinimized) 
                    && 
                    <div 
                    className="full_width"
                    ref={playerRef}>
                        <PlayerOnScroll 
                        shareMenuRef={shareMenuRef}
                        postWindowRef={postWindowRef}
                        playerState={playerState}
                        playerFunctionalProps={playerFunctionalProps}
                    />
                    </div>
                    }

                    { isMinimized && 
                    <div 
                    className={playerSize.width > 615 ? "grid" : "min_layout"}
                    style={{ flexDirection: playerSize.height < 120 ? "row" : "column" }}
                    ref={playerRef}>
                        <PlayerMinimized 
                        shareMenuRef={shareMenuRef}
                        postWindowRef={postWindowRef}
                        playerState={playerState}
                        playerFunctionalProps={playerFunctionalProps}
                    />
                       <div 
                        className="draggable_handle" 
                        ref={draggableHandleRef}
                        onMouseDown={(e) => getInitialPos(e)}>
                            <SvgResizeHandle />
                        </div>
                    </div>}
                </div>
                <Outlet />
            </>
        )

    }

}
