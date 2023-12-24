import React, { useEffect, useState } from "react"
import useStore from "../../store"
import { formatListData, PlayBtn } from "../../utils"

export default function Post(props){
    const [ item, setItem ] = useState(null)
    const { data } = props
    const { spotifyApi } = useStore()
    const [ hoverItemId, setHoverItemId ] = useState(null)

    async function getitem(){
        if(data.type === "track"){
            const item = await spotifyApi.getTrack(data.id)
            const formatedItem = formatListData([item], "tracks")
            setItem(formatedItem)
        } else if(data.type === "album"){
            const item = await spotifyApi.getAlbum(data.id)
            setItem(item)
            const formatedItem = formatListData([item], "albums")
            setItem(formatedItem)
        } else if(data.type === "artist"){
            const item = await spotifyApi.getArtist(data.id)
            setItem(item)
            const formatedItem = formatListData([item], "artists")
            setItem(formatedItem)
        }
    }

    useEffect(() => {
        if(data){
            getitem()
        }
    }, [data])

    return (
        item && (
            <section 
                key={data.post_id}
                className="flex relative">
                <div 
                    className="cover_medium"
                    style={{ backgroundImage: `url('${item.imgUrl}')`}}
                    onMouseOver={() => setHoverItemId(item.id)}
                >
                </div>
                <PlayBtn 
                    uri={`spotify:${item.type}:${item.id}`} 
                    id={item.id}
                    category={"cover"} 
                    type={item.type} 
                    hoverItemId={hoverItemId}
                />
                <div>
                    <h3>{item.name}</h3>
                    <p>{data.comment}</p>
                </div>
            </section>
        )
    )
    
}