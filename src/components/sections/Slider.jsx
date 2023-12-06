import React from "react"
import { Link } from "react-router-dom"
import useStore from "../../store"
import { Axios } from "../../Axios-config"

export default function Slider(props){
    const { list, visibility, category, isLoggedUser } = props
    const { currentUser, setUserTopTracks, setUserTopArtists } = useStore()

    async function toggleItemVisibility(itemId, category){
        const response = await Axios.post(`/api/user/${category}/toggleVisibility`, {
            userId: currentUser.id,
            itemId: itemId,
        })
        console.log("response data is:", response.data)
        category === "top_tracks" && setUserTopTracks(response.data.top_tracks)
        category === "top_artists" && setUserTopArtists(response.data.top_artists)
    }

    return(
        list.items
            .filter(item => item.isVisible === visibility)
            .slice(0, 10)
            .map((item) => {
                return (
                    <Link to={`/artist/${item.id}`}>
                        <div style={{ backgroundImage: `url('${item.imageUrl}')`}} className="cover_medium cover_wrapper">
                            {isLoggedUser && <button onClick={() => toggleItemVisibility(item.id, category)}>{visibility ? "Hide" : "Show"}</button>}
                        </div>
                        <h3>{item.name}</h3>
                        {category === "top_tracks" && <h5>{item.artistName}</h5>}
                    </Link>
                )
            })        
    )
}

