import React, { useEffect, useRef, useState } from "react"
import { useParams, Link } from "react-router-dom"
import { Axios } from "../Axios-config"
import { SvgRightBtn, SvgLeftBtn } from "../assets"
import useStore from "../store"

export default function Profile(){
    const { standardWrapperWidth, currentUser, spotifyApi } = useStore()
    const { userId } = useParams()
    const [ isLoggedUser, setIsLoggedUser ] = useState(false)
    const [ userProfileData, setUserProfileData ] = useState(null)
    const [ topTracks, setTopTracks ] = useState(null)
    const [ topArtists, setTopArtists ] = useState(null)
    const [ topTracksScroll, setTopTracksScroll ] = useState(0)
    const [ topArtistsScroll, setTopArtistsScroll ] = useState(0)
    const [ maxScrollLeft, setMaxScrollLeft ] = useState(0)
    const topArtistsSlider = useRef(null)
    const topTracksSlider = useRef(null)

    async function getUser(id){
        const response = await Axios.post("/api/profile", {
            userData: {
                id: id,
                type: "user",
            }
        })
        setUserProfileData(response.data)
        getTopTracks()
        getTopArtists()
    }

    async function getTopTracks(){
       const response = await Axios.get(`/api/user/top_tracks/${userId}`)
       console.log("log - response is:", response.data)
       setTopTracks(response.data)
    }

    async function getTopArtists(){
        const response = await Axios.get(`/api/user/top_artists/${userId}`)
        setTopArtists(response.data)
    }
     
    function slideLeft(parentRef){
        parentRef.current.scrollBy({ left: -(maxScrollLeft * 0.1), behavior: 'smooth' })
    }
    
    function slideRight(parentRef){
        parentRef.current.scrollBy({ left: (maxScrollLeft * 0.1), behavior: 'smooth' })
    }

    async function toggleItemVisibility(itemId, category){
        const response = await Axios.post(`/api/user/top_list/${category}/toggleVisibility`, {
            userId: currentUser.id,
            itemId: itemId,
        })
        const updatedTracks = {...topTracks, tracks: response.data}
        setTopTracks(updatedTracks)
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
    }, [topArtists, topTracks])
    
    useEffect(() => {
        if(userId === currentUser.id){
            setIsLoggedUser(true)
            setUserProfileData(currentUser)
            getTopTracks()
            getTopArtists()
        } else{
            userId && getUser(userId)
        }
    }, [userId])
    
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
            <div className="flex space_between">
                <h2> Top Artists </h2>
                {isLoggedUser && <button onClick={() => hideSection(topArtists)}>{topArtists?.showTopArtists ? "Hide Top Artists" : "Show Top Artists"}</button>}
            </div>
            {!topArtists && <h3>Loading...</h3>}
            {(topArtists && topArtists?.showTopArtists) && 
            <section>
                <div style={{ position: "relative" }}>
                    {(topArtistsScroll > (maxScrollLeft * 0.1)) && <div className="btn_wrapper_left" onClick={() => slideLeft(topArtistsSlider)}>
                        <SvgLeftBtn className="svg_left_right" />
                    </div>}
                    {(topArtistsScroll < (maxScrollLeft * 0.9)) && <div className="btn_wrapper_right" onClick={() => slideRight(topArtistsSlider)}>
                        <SvgRightBtn className="svg_left_right" />
                    </div>}
                </div>
                <div ref={topArtistsSlider} className="slider_grid">
                   {topArtists.artists.map((artist) => {
                   return (
                        <Link to={`/artist/${artist.id}`}>
                            <div style={{ backgroundImage: `url('${artist.images[0].url}')`}} className="cover_medium cover_wrapper">
                                <button onClick={() => toggleItemVisibility(track.id)}>Hide</button>
                            </div>
                            <h3>{artist.name}</h3>
                        </Link>
                        )
                    }) 
                   }
                </div>
           </section>}
           <div className="flex space_between">
                <h2> Top Tracks </h2>
                {isLoggedUser && <button onClick={() => hideSection(topArtists)}>{topTracks?.showTopTracks ? "Hide Top Tracks" : "Show Top Tracks"}</button>}
           </div>
           {!topArtists && <h3>Loading...</h3>}
           {(topTracks && topTracks?.showTopTracks) && 
           <section>
                <div style={{ position: "relative" }}>
                    {(topTracksScroll > (maxScrollLeft * 0.1)) && <div className="btn_wrapper_left" onClick={() => slideLeft(topTracksSlider)}>
                        <SvgLeftBtn className="svg"/>
                    </div>}
                    {(topTracksScroll < (maxScrollLeft * 0.8)) && <div className="btn_wrapper_right" onClick={() => slideRight(topTracksSlider)}>
                        <SvgRightBtn className="svg"/>
                    </div>}
                    <div ref={topTracksSlider} className="slider_grid">
                    {topTracks.tracks
                    .filter(track => track.isVisible)
                    .slice(0, 10)
                    .map((track) => {
                        return (
                            <div>
                                <div href={`/song=${track.id}`} style={{ backgroundImage: `url('${track.imageUrl}')`}} className="cover_medium cover_wrapper">
                                    <button onClick={() => toggleItemVisibility(track.id, "top_tracks")}>Hide</button>
                                </div>
                                <h3 href={`/song=${track.id}`}>{track.name}</h3>
                                <h5 href={`/song=${track.id}`}>{track.artistName}</h5>
                            </div>
                            )
                        }) 
                    }
                    </div>
                </div>
           </section>}
           <h2> Posts </h2>
           <div>

           </div>
        </div>
    )
}
