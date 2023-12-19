import React, { useState } from "react"
import { Link } from "react-router-dom"
import { PlayBtn } from "../../utils"

export default function List(props){
    const { list, category, showIndex } = props
    const [ hoverItemId, setHoverItemId ] = useState(null)

    return(
        <div className="list_wrapper">
            {list.map((item, index) => {
                    return (
                        <div 
                        key={item.id} 
                        style={{ position: "relative" }}>
                            <Link to={category !== "tracks" ? `/${category.slice(0, -1)}/${item.id}` : ""}>
                                <div 
                                className="flex"                          
                                onMouseEnter={() => setHoverItemId(item.id)}
                                onMouseLeave={() => setHoverItemId(null)}>
                                    <img src={`${item.imageUrl}`} 
                                    className="cover_small" />
                                    <div>
                                        {category === "tracks" && <h5>{item.artistName}</h5>}
                                        <h3>{showIndex && <span>{index + 1}.</span>} {item.name}</h3>
                                        <h4>{item.type}</h4>
                                    </div>
                                </div>
                            </Link>
                            <div onMouseEnter={() => setHoverItemId(item.id)}>
                                <PlayBtn 
                                uri={item.uri} 
                                id={item.id}
                                category={"list"} 
                                type={item.type} 
                                hoverItemId={hoverItemId}/>
                            </div>
                        </div>
                        )
                    })   
                }     
        </div>
    )
}

