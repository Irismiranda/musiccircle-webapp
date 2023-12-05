import React, { useEffect, useRef, useState } from "react"
import { useParams, Link } from "react-router-dom"
import { Axios } from "../Axios-config"
import { SvgRightBtn, SvgLeftBtn } from "../assets"
import useStore from "../store"

export default function Profile(){
    const { standardWrapperWidth, currentUser, userTopTracks, setUserTopTracks, userTopArtists, setUserTopArtists } = useStore()
    const { userId } = useParams()
    const [ isCurrentUser, setisCurrentUser ] = useState(false)
    const [ userProfileData, setUserProfileData ] = useState(null)
    const [ topTracksScroll, setTopTracksScroll ] = useState(0)
    const [ topArtistsScroll, setTopArtistsScroll ] = useState(0)
    const [ maxScrollLeft, setMaxScrollLeft ] = useState(0)
    const [ topTracks, setTopTracks] = useState(null)
    const [ topArtists, setTopArtists] = useState(null)
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
        getList(id, "top_artists")
        getList(id, "top_tracks")
    }
    
    async function getList(id, category){
        const response = await Axios.get(`/api/user/${category}/${id}`)
        if (category === "top_artists") {
            setTopArtists(response.data)
        } else if (category === "top_tracks") {
            setTopTracks(response.data)
        }
    }

    function slideLeft(parentRef){
        parentRef.current.scrollBy({ left: -(maxScrollLeft * 0.1), behavior: 'smooth' })
    }
    
    function slideRight(parentRef){
        parentRef.current.scrollBy({ left: (maxScrollLeft * 0.1), behavior: 'smooth' })
    }

    async function toggleItemVisibility(itemId, category){
        const response = await Axios.post(`/api/user/${category}/toggleVisibility`, {
            userId: currentUser.id,
            itemId: itemId,
        })
        console.log("response data is:", response.data)
        category === "top_tracks" && setUserTopTracks(response.data.top_tracks)
        category === "top_artists" && setUserTopArtists(response.data.top_artists)
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

    useEffect(() => {
        if(isCurrentUser){
            setTopTracks(userTopTracks)
            setTopArtists(userTopArtists)
        }
    }, [userTopTracks, userTopArtists])

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
            setisCurrentUser(true)
            setUserProfileData(currentUser)
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
                    {isCurrentUser ? <button> Edit Profile </button> : <button> Follow </button>} 
                    <div>
                        <h3> Posts </h3>
                        <h3> Followers </h3>
                        <h3> Following </h3>
                    </div>
                </div>
            </div>
            <div className="flex space_between">
                <h2> Top Artists </h2>
                {isCurrentUser && <button onClick={() => hideSection(topArtists)}>{topArtists?.showTopArtists ? "Hide Top Artists" : "Show Top Artists"}</button>}
            </div>
            {!topArtists && <h3>Loading...</h3>}
            {(topArtists && topArtists.show_top_artists && topArtists.items.length > 0) && 
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
                {topArtists.items
                    .filter(item => item.isVisible)
                    .slice(0, 10)
                    .map((item) => {
                        return (
                            <Link to={`/artist/${item.id}`}>
                                <div style={{ backgroundImage: `url('${item.imageUrl}')`}} className="cover_medium cover_wrapper">
                                    <button onClick={() => toggleItemVisibility(item.id, "top_artists")}>Hide</button>
                                </div>
                                <h3>{item.name}</h3>
                            </Link>
                            )
                        }) 
                    }
                </div>
           </section>}
           <div className="flex space_between">
                <h2> Top Tracks </h2>
                {isCurrentUser && <button onClick={() => hideSection(topArtists)}>{topTracks?.showTopTracks ? "Hide Top Tracks" : "Show Top Tracks"}</button>}
           </div>
           {!topTracks && <h3>Loading...</h3>}
           {(topTracks && topTracks.show_top_tracks && topTracks.items.length > 0) && 
           <section>
                <div style={{ position: "relative" }}>
                    {(topTracksScroll > (maxScrollLeft * 0.1)) && <div className="btn_wrapper_left" onClick={() => slideLeft(topTracksSlider)}>
                        <SvgLeftBtn className="svg"/>
                    </div>}
                    {(topTracksScroll < (maxScrollLeft * 0.9)) && <div className="btn_wrapper_right" onClick={() => slideRight(topTracksSlider)}>
                        <SvgRightBtn className="svg"/>
                    </div>}
                    <div ref={topTracksSlider} className="slider_grid">
                    {topTracks.items
                    .filter(item => item.isVisible)
                    .slice(0, 10)
                    .map((item) => {
                        return (    
                            <div>
                                <div href={`/song=${item.id}`} style={{ backgroundImage: `url('${item.imageUrl}')`}} className="cover_medium cover_wrapper">
                                    <button onClick={() => toggleItemVisibility(item.id, "top_tracks")}>Hide</button>
                                </div>
                                <h3 href={`/song=${item.id}`}>{item.name}</h3>
                                <h5 href={`/song=${item.id}`}>{item.artistName}</h5>
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
