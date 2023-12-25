import React, { useEffect, useState } from "react"
import useStore from "../../store"
import { formatListData, PlayBtn } from "../../utils"
import { Link } from "react-router-dom"

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
        setItem(formatedItem[0])
    }

    useEffect(() => {
        if(data.id){
            getitem()
        }
    }, [data])

    return (
        item && (
            <section 
                key={data.post_id}
                className="flex relative inner_wrapper"
                style={{ padding: "0px 25px 0px 0px" }}>
                <div 
                    className="cover_medium cover_post"
                    style={{ backgroundImage: `url('${item.imgUrl}')`}}
                    onMouseEnter={() => setHoverItemId(item.id)}
                    onMouseLeave={() => setHoverItemId(null)}
                >
                </div>
                <div 
                onMouseEnter={() => setHoverItemId(item.id)}>
                    <PlayBtn 
                        uri={`spotify:${item.type}:${item.id}`} 
                        id={item.id}
                        category={"cover"} 
                        type={item.type} 
                        hoverItemId={hoverItemId}
                    />
                </div>
                <div>
                    <h3>{item.name} by <Link to={`/artist/${item.artist_id}`}>{item.artist_name}</Link></h3>
                    <p>{data.comment}</p>
                </div>
            </section>
        )
    )
    
}