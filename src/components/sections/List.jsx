import React, { useState } from "react"
import { Link } from "react-router-dom"

export default function List(props){
    const { list, category } = props
    const [ hoverItemId, setHoverItemId ] = useState(null)

    return(
        <div className="list_wrapper">
            {list.items.map((item) => {
                    return (
                        <div>
                            <Link 
                            to={`/${category.slice(0, -1)}/${item.id}`} 
                            onMouseEnter={() => setHoverItemId(item.id)}
                            onMouseLeave={() => setHoverItemId(null)}>
                                <img src={`${item.imageUrl}`} className="cover_small" />
                                {category === "playlist" && <h5>{item.artistName}</h5>}
                                <h3>{item.name}</h3>
                            </Link>
                            {hoverItemId === item.id && 
                                <div 
                                className="play_btn" 
                                onClick={() => playItem(item.id)} 
                                onMouseEnter={() => setHoverItemId(item.id)}>
                            </div>}
                        </div>
                        )
                    })   
                }     
        </div>
    )
}

