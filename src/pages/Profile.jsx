import React, { useEffect, useRef, useState } from "react"
import { useParams } from "react-router-dom"
import { SvgRightBtn, SvgLeftBtn } from "../assets"
import { Slider } from "../components"
import { Axios } from "../Axios-config"
import useStore from "../store"

export default function Profile(){
    const { standardWrapperWidth, currentUser, userTopTracks, userTopArtists } = useStore()
    const { userId } = useParams()
    const [ isLoggedUser, setIsLoggedUser ] = useState(false)
    const [ userProfileData, setUserProfileData ] = useState(null)
    const [ topTracksScroll, setTopTracksScroll ] = useState(0)
    const [ topArtistsScroll, setTopArtistsScroll ] = useState(0)
    const [ maxScrollLeft, setMaxScrollLeft ] = useState(0)
    const [ topTracks, setTopTracks ] = useState(null)
    const [ topArtists, setTopArtists ] = useState(null)
    const [ showVisibleTopTracks, setShowVisibleTopTracks ] = useState(true)
    const [ showVisibleTopArtists, setShowVisibleTopArtists ] = useState(true)
    const topArtistsSlider = useRef(null)
    const topTracksSlider = useRef(null)
    
    async function getUser(id){
        const response = await Axios.post("/api/account", {
            userData: {
                id: id,
                type: "user",
            }
        })
        setUserProfileData(response.data)
        const topTracksList = await Axios.get(`/api/user/top_tracks/${id}`)
        const topArtistsList = await Axios.get(`/api/user/top_artists/${id}`)
        setTopTracks(topTracksList.data)
        setTopArtists(topArtistsList.data)
    }

    function slideLeft(parentRef){
        parentRef.current.scrollBy({ left: -(maxScrollLeft * 0.2), behavior: 'smooth' })
    }
    
    function slideRight(parentRef){
        parentRef.current.scrollBy({ left: (maxScrollLeft * 0.2), behavior: 'smooth' })
    }

    function hideSection(id){

    }

    useEffect(() => {
        if(topArtistsSlider.current){
            const maxScroll = topArtistsSlider.current.scrollWidth - topArtistsSlider.current.clientWidth
            setMaxScrollLeft(maxScroll)
        }
    }, [topTracks, topArtists])

    useEffect(() => {
        const handleTopArtistsScroll = () => {
            if (topArtistsSlider.current) {
                setTopArtistsScroll(topArtistsSlider.current.scrollLeft)
                console.log("log - top artist scroll is:", topTracksSlider.current.scrollLeft)
            }
        }
    
        const handleTopTracksScroll = () => {
            if (topTracksSlider.current) {
                setTopTracksScroll(topTracksSlider.current.scrollLeft)
                console.log("log - top track scroll is:", topTracksSlider.current.scrollLeft)
            }
        }

        const artistSliderElement = topArtistsSlider.current
        const tracksSliderElement = topTracksSlider.current
    
        if (artistSliderElement) artistSliderElement.addEventListener('scroll', handleTopArtistsScroll)
        if (tracksSliderElement) tracksSliderElement.addEventListener('scroll', handleTopTracksScroll)
    
        return () => {
            if (artistSliderElement) artistSliderElement.removeEventListener('scroll', handleTopArtistsScroll)
            if (tracksSliderElement) tracksSliderElement.removeEventListener('scroll', handleTopTracksScroll)
        }
    }, [userTopArtists, userTopTracks])
    
    useEffect(() => {
        if(userId === currentUser.id){
            setIsLoggedUser(true)
            setUserProfileData(currentUser)
            userTopTracks && setTopTracks(userTopTracks)
            userTopArtists && setTopArtists(userTopArtists)
        } else{
            userId && getUser(userId)
        }
    }, [userId, userTopTracks, userTopArtists])

    useEffect(() => {
        console.log("top tracks are:", userTopTracks, "top artists are:", userTopArtists)
    }, [userTopArtists, userTopTracks])
    
    return(
        <div className="wrapper default_padding profile" style={{ width: standardWrapperWidth }}>
            <div className="flex" style={{ marginBottom: "30px" }}>
                <img src={`${userProfileData?.images[1].url}`} className="profile_large" style={{ marginRight: "90px" }}/>
                <div className="user_data_grid">
                    <h2>{userProfileData?.display_name}</h2>
                    {isLoggedUser ? <button> Edit Profile </button> : <button> Follow </button>} 
                    <div>
                        <h3> Posts </h3>
                        <h3> Followers </h3>
                        <h3> Following </h3>
                    </div>
                </div>
            </div>
            <div className={ showVisibleTopArtists ? "flex space_between" : "flex space_between hidden_items_section" }>
                <div className="flex">
                    <h2> Top Artists </h2>
                    {isLoggedUser && <button onClick={() => setShowVisibleTopArtists(!showVisibleTopArtists)}>{showVisibleTopArtists ? "Show Hidden Artists" : "Hide" }</button>}
                </div>
                {isLoggedUser && <button onClick={() => hideSection(userTopArtists)}>{userTopArtists?.showTopArtists ? "Hide Top Artists" : "Show Top Artists"}</button>}
            </div>
            {!topArtists && <h3>Loading...</h3>}
            {(topArtists && topArtists.show_top_artists && topArtists.items.length > 0) && 
            <section>
                <div style={{ position: "relative" }}>
                    {(topArtistsScroll > (maxScrollLeft *  0.08)) && <div className="btn_wrapper_left" onClick={() => slideLeft(topArtistsSlider)}>
                        <SvgLeftBtn className="svg_left_right" />
                    </div>}
                    {(topArtistsScroll < (maxScrollLeft * 0.9)) && <div className="btn_wrapper_right" onClick={() => slideRight(topArtistsSlider)}>
                        <SvgRightBtn className="svg_left_right" />
                    </div>}
                </div>
                <div>
                    <div ref={topArtistsSlider} className={showVisibleTopArtists ? "slider_grid" : "slider_grid hidden_items_grid"}>
                        <Slider list={topArtists} category="top_artists" visibility={showVisibleTopArtists} isLoggedUser={isLoggedUser}/>
                    </div>
                </div>
           </section>}
           <div className={ showVisibleTopTracks ? "flex space_between" : "flex space_between hidden_items_section" }>
            <div className="flex">
                <h2>  Top Tracks </h2>
                {isLoggedUser && <button onClick={() => setShowVisibleTopTracks(!showVisibleTopTracks)}>{showVisibleTopTracks ?  "Show HiddenTracks" : "Hide"}</button>}
            </div>
                {isLoggedUser && <button onClick={() => hideSection(userTopArtists)}>{userTopTracks?.showTopTracks ? "Hide Top Tracks" : "Show Top Tracks"}</button>}
           </div>
           {!topTracks && <h3>Loading...</h3>}
           {(topTracks && topTracks.show_top_tracks && topTracks.items.length > 0) && 
           <section>
                <div style={{ position: "relative" }}>
                    {(topTracksScroll > (maxScrollLeft * 0.08)) && <div className="btn_wrapper_left" onClick={() => slideLeft(topTracksSlider)}>
                        <SvgLeftBtn className="svg_left_right"/>
                    </div>}
                    {(topTracksScroll < (maxScrollLeft * 0.9)) && <div className="btn_wrapper_right" onClick={() => slideRight(topTracksSlider)}>
                        <SvgRightBtn className="svg_left_right"/>
                    </div>}
                    <div ref={topTracksSlider} className={showVisibleTopTracks ? "slider_grid" : "slider_grid hidden_items_grid"}>
                        <Slider list={topTracks} category="top_tracks" visibility={showVisibleTopTracks} isLoggedUser={isLoggedUser}/>
                    </div>
                </div>
           </section>}
           <h2> Posts </h2>
           <div>

           </div>
        </div>
    )
}
