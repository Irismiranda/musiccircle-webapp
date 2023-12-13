import React, { useState } from "react"
import { PlayBtn } from "../../utils"
import useStore from "../../store"

export default function SimplifiedList(props){
    const { list, category } = props
    const { playerState } = useStore()
    const [ hoverItemId, setHoverItemId ] = useState(null)
    
    return(
        <div className="simplified_list_wrapper">
            {list.items.map((item, index) => {
                    return (
                        <div 
                        key={item.id} 
                        style={{ position: "relative" }} 
                        className="grid"                
                        onMouseEnter={() => {
                        if(playerState.currentTrack){ 
                        setHoverItemId(item.id)
                        } }}
                        onMouseLeave={() => setHoverItemId(null)}> 
                            <div 
                            style={{ justifySelf: "center"}}
                            onMouseEnter={() => {
                            if(playerState.currentTrack){ 
                            setHoverItemId(item.id)
                            } }} >
                                <PlayBtn 
                                uri={item.uri} 
                                id={item.id}
                                category={"simplified_list"} 
                                type={category.slice(0, -1)} 
                                hoverItemId={hoverItemId}/>
                                {(hoverItemId !== item.id) && <h3>{index + 1}.</h3>}
                            </div>
                            
                            <h3>{item.name}</h3>
                            {category === "playlist" && <h5>{item.artistName}</h5>}
                            <h4>{category.slice(0, -1)}</h4>
                               
                        </div>
                        )
                    })   
                }     
        </div>
    )
}

