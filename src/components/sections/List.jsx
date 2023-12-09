import React from "react"
import { Link } from "react-router-dom"

export default function List(props){
    const { list, category } = props

    return(
        <div className="list_wrapper">
            {list.items.map((item) => {
                    return (
                        <div>
                            <Link to={`/${category.slice(0, -1)}/${item.id}`}>
                                <img src={`${item.imageUrl}`} className="cover_small" />
                                {category === "playlist" && <h5>{item.artistName}</h5>}
                                <h3>{item.name}</h3>
                            </Link>
                        </div>
                        )
                    })   
                }     
        </div>
    )
}

