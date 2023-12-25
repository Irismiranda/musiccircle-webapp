import React, { useEffect, useState } from "react"
import useStore from "../../store"
import { formatListData, PlayBtn, ShareBtn } from "../../utils"
import { Link } from "react-router-dom"
import { Axios } from "../../Axios-config"

export default function Post(props){
    const [ item, setItem ] = useState(null)
    const { data } = props
    const { spotifyApi,  } = useStore()
    const [ hoverItemId, setHoverItemId ] = useState(null)
    const [ user, setUser ] = useState(null)

    async function getitem(){
        const methodName = `get${data.type.charAt(0).toUpperCase() + data.type.slice(1)}`
        const item = await spotifyApi[methodName](data.id)
        const formatedItem = formatListData([item], `${data.type}s`)
        setItem(formatedItem[0])
    }

    async function getUser(id){
        const response = await Axios.get(`/api/account/${id}`)
        const formatedData = formatListData([response.data], "user")
        setUser(formatedData[0])
    }

    useEffect(() => {
        if(data.id){
            console.log(data)
            getitem()
            getUser(data.user_id)
        }
    }, [data])

    return (
        item && (
            <section 
                key={data.post_id}
                className="flex relative inner_wrapper"
                style={{ padding: "0px 25px 0px 0px" }}>
                <div 
                    className="cover_large cover_post"
                    style={{ backgroundImage: `url('${item.imgUrl}')`}}
                    onMouseEnter={() => setHoverItemId(item.id)}
                    onMouseLeave={() => setHoverItemId(null)}
                >
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
                </div>
                <div className="flex flex_column align_start">
                    <h3>{item.name} by <Link to={`/artist/${item.artist_id}`}>{item.artist_name}</Link></h3>
                    <p>{data.comment}</p>
                    <Link to={`/account/${user?.id}`}>
                        <div 
                        className="flex"
                        style={{ marginBottom: "10px" }}>
                                <img 
                                src={user?.imgUrl}
                                className="profile_small" />
                                <h4>{user?.name}</h4>
                        </div>
                    </Link>
                    <div>
                        <div 
                        className="flex">
                            <h4>{item.likes ? item.likes?.length : 0} Likes</h4>
                            <h4>{item.comments ? item.comments?.length : 0} Comments</h4>
                        </div>
                        <ShareBtn 
                        content={data}/>
                    </div>
                </div>
            </section>
        )
    )
    
}