import React, { useEffect, useState } from "react"
import useStore from "../../store"
import { formatListData, PlayBtn } from "../../utils"

export default function Post(props){
    const [ item, setItem ] = useState(null)
    const { data } = props
    const { spotifyApi,  } = useStore()
    const [ hoverItemId, setHoverItemId ] = useState(null)

    async function getitem(){
        const methodName = `get${data.type.charAt(0).toUpperCase() + data.type.slice(1)}`
        const item = await spotifyApi[methodName](data.id)
        console.log(item)
        const formatedItem = formatListData([item], `${data.type}s`)
        console.log(formatedItem)
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
                    style={{ backgroundImage: `url('${item[0].imgUrl}')`}}
                    onMouseEnter={() => setHoverItemId(item[0].id)}
                    onMouseLeave={() => setHoverItemId(null)}
                >
                </div>
                <PlayBtn 
                    uri={`spotify:${item[0].type}:${item[0].id}`} 
                    id={item[0].id}
                    category={"cover"} 
                    type={item[0].type} 
                    hoverItemId={hoverItemId}
                />
                <div>
                    <h3>{item[0].name}</h3>
                    <p>{data.comment}</p>
                </div>
            </section>
        )
    )
    
}