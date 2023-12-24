import React, { useEffect, useState } from "react"
import useStore from "../../store"
import { formatListData, PlayBtn } from "../../utils"

export default function Post(props){
    const [ item, setItem ] = useState(null)
    const { data } = props
    const { spotifyApi } = useStore()
    const [ hoverItemId, setHoverItemId ] = useState(null)

    async function getitem(){
        const methodName = `get${data.type.charAt(0).toUpperCase() + data.type.slice(1)}`
        const item = await spotifyApi[methodName](data.id)
        console.log(item)
        const formatedItem = formatListData([item], `${data.type}s`)
        setItem(formatedItem)
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