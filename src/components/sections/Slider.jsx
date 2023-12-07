import React from "react"
import useStore from "../../store"
import { Link } from "react-router-dom"
import { Axios } from "../../Axios-config"
import { SvgRightBtn, SvgLeftBtn } from "../../assets"

export default function Slider(props){
    const { list, visibility, category, isLoggedUser, parentRef } = props
    const { currentUser, setUserTopTracks, setUserTopArtists } = useStore()
    const [ maxScrollLeft, setMaxScrollLeft ] = useState(0)
    const [ listScroll, setListScroll ] = useState(0)

    async function toggleItemVisibility(itemId, category){
        const response = await Axios.post(`/api/user/${category}/toggleVisibility`, {
            userId: currentUser.id,
            itemId: itemId,
        })
        console.log("response data is:", response.data)
        category === "top_tracks" && setUserTopTracks(response.data.top_tracks)
        category === "top_artists" && setUserTopArtists(response.data.top_artists)
    }

    function slideLeft(){
        parentRef.current.scrollBy({ left: -(maxScrollLeft * 0.2), behavior: 'smooth' })
    }
    
    function slideRight(){
        parentRef.current.scrollBy({ left: (maxScrollLeft * 0.2), behavior: 'smooth' })
    }

    useEffect(() => {
        if(ref.current){
            const maxScroll = ref.current.scrollWidth - ref.current.clientWidth
            setMaxScrollLeft(maxScroll)
        }
    }, [list])

    return(
        <>
            {(listScroll > (maxScrollLeft * 0.08)) && 
                <div className="btn_wrapper_left" onClick={() => slideLeft()}>
            <SvgLeftBtn className="svg_left_right"/>
            </div>}
            {(listScroll < (maxScrollLeft * 0.9)) && 
                <div className="btn_wrapper_right" onClick={() => slideRight()}>
                <SvgRightBtn className="svg_left_right"/>
            </div>}
            {list.items
                .filter(item => item.isVisible === visibility)
                .slice(0, 10)
                .map((item) => {
                    return (
                        <Link to={`/artist/${item.id}`}>
                            <div style={{ maxWidth: "200px" }}>
                                <div style={{ backgroundImage: `url('${item.imageUrl}')`}} className="cover_medium cover_wrapper">
                                    {isLoggedUser && <button onClick={() => toggleItemVisibility(item.id, category)}>{visibility ? "Hide" : "Show"}</button>}
                                </div>
                                <h3>{item.name}</h3>
                                {category === "top_tracks" && <h5>{item.artistName}</h5>}
                            </div>
                        </Link>
                    )
                })   }     
        </>
    )
}

