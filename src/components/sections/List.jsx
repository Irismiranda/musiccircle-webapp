    import React, { useState } from "react"
    import { Link } from "react-router-dom"
    import { PlayBtn} from "../../utils"

    export default function List(props){
        const { list, category, showIndex } = props
        const [ hoverItemId, setHoverItemId ] = useState(null)

        return(
            <div className="list_wrapper">
                {list.map((item, index) => {
                        return (
                            <div 
                            className="relative"
                            key={item.id}>
                                    <div 
                                    className="flex"                          
                                    onMouseEnter={() => setHoverItemId(item.id)}
                                    onMouseLeave={() => setHoverItemId(null)}>
                                        <Link 
                                        to={item.type !== "track" ? `/${item.type}/${item.id}` : ""}
                                        onClick={(item.type === "track") && ((e) => e.preventDefault())}>
                                            <img 
                                            src={`${item.imgUrl}`} 
                                            className="cover_small" />
                                        </Link>
                                        <div>
                                            <h3>{showIndex && <span>{index + 1}.</span>} {item.name}</h3>
                                            {(category === "track" || category === "album") && 
                                            <Link to={`/artist/${item.artist_id}`}>
                                                <h3>{item.artist_name}</h3>
                                            </Link>}
                                            <h4>{item.type}</h4>
                                        </div>
                                    </div>
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

