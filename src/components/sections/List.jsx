import React from "react"

export default function List(props){
    const { list, category } = props

    return(
        <>
            {list.items.map((item) => {
                    return (
                        <div className="list_wrapper flex space_between">
                            <Link to={`/${category.slice(0, -1)}/${item.id}`}>
                                <img src={`${item.imageUrl}`} className="cover_small" />
                                {(category === "playlist" || category === "albums") && <h5>{item.artistName}</h5>}
                                <h3>{item.name}</h3>
                            </Link>
                        </div>
                        )
                    })   
                }     
        </>
    )
}
