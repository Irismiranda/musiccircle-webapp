import React from "react"
import { Link } from "react-router-dom"

export default function List(props){
    const { list, category } = props
    console.log("props are:",list, category)

    return(
        <>
            {list.items.map((item) => {
                    return (
                        <div className="list_wrapper flex space_between">
                            <Link to={`/${category.slice(0, -1)}/${item.id}`}>
                                <div className="flex">
                                    <img src={`${item.imageUrl}`} className="cover_small" />
                                    {category === "playlist" && <h5>{item.artistName}</h5>}
                                    <h3>{item.name}</h3>
                                </div>
                            </Link>
                        </div>
                        )
                    })   
                }     
        </>
    )
}

