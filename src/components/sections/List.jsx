import React, { useState } from "react"
import { PlayBtn } from "../../utils"
import useStore from "../../store"

export default function List(props){
    const { list, category } = props
    const [ hoverItemId, setHoverItemId ] = useState(null)
    const { playerState } = useStore()
    const { currentTrack } = playerState
    
    return(
        <div className="list_wrapper">
            {list.items.map((item, index) => {
                    return (
                        <div key={item.id} style={{ position: "relative" }}>
                            <div 
                            className="flex"                          
                            onMouseEnter={() => setHoverItemId(item.id)}
                            onMouseLeave={() => setHoverItemId(null)}>
                                <img src={`${item.imageUrl}`} className="cover_small" />
                                <div>
                                    {category === "playlist" && <h5>{item.artistName}</h5>}
                                    <h3>{index + 1}. {item.name}</h3>
                                    <h4>{category.slice(0, -1)}</h4>
                                </div>
                            </div>
                            <div onMouseEnter={() => setHoverItemId(item.id)}>
                                <PlayBtn 
                                uri={item.uri} 
                                id={item.id}
                                category={"list"} 
                                type={category.slice(0, -1)} 
                                hoverItemId={hoverItemId}/>
                            </div>
                        </div>
                        )
                    })   
                }     
        </div>
    )
}

