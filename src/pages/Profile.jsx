import React, { useEffect, useRef, useState } from "react"
import { useParams, Link } from "react-router-dom"
import { Axios } from "../Axios-config"
import { SvgRightBtn, SvgLeftBtn } from "../assets"
import useStore from "../store"

export default function Profile(){
    const { standardWrapperWidth, currentUser, userTopTracks, setUserTopTracks, userTopArtists, setUserTopArtists } = useStore()
    const { userId } = useParams()
    const [ isLoggedUser, setIsLoggedUser ] = useState(false)
    const [ userProfileData, setUserProfileData ] = useState(null)
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
    }, [userTopTracks, userTopArtists])

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
        } else{
            userId && getUser(userId)
        }
    }, [userId])

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
            <div className="flex space_between">
                <h2> Top Artists </h2>
                {isLoggedUser && <button onClick={() => hideSection(userTopArtists)}>{userTopArtists?.showTopArtists ? "Hide Top Artists" : "Show Top Artists"}</button>}
            </div>
            {!userTopArtists && <h3>Loading...</h3>}
            {(userTopArtists && userTopArtists.show_top_artists && userTopArtists.items.length > 0) && 
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
                {userTopArtists.items
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
                {isLoggedUser && <button onClick={() => hideSection(userTopArtists)}>{userTopTracks?.showTopTracks ? "Hide Top Tracks" : "Show Top Tracks"}</button>}
           </div>
           {!userTopTracks && <h3>Loading...</h3>}
           {(userTopTracks && userTopTracks.show_top_tracks && userTopTracks.items.length > 0) && 
           <section>
                <div style={{ position: "relative" }}>
                    {(topTracksScroll > (maxScrollLeft * 0.1)) && <div className="btn_wrapper_left" onClick={() => slideLeft(topTracksSlider)}>
                        <SvgLeftBtn className="svg"/>
                    </div>}
                    {(topTracksScroll < (maxScrollLeft * 0.9)) && <div className="btn_wrapper_right" onClick={() => slideRight(topTracksSlider)}>
                        <SvgRightBtn className="svg"/>
                    </div>}
                    <div ref={topTracksSlider} className="slider_grid">
                    {userTopTracks.items
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
