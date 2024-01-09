import React, { useState } from "react"
import { PlayBtnManager } from "../../utils"
import useStore from "../../store"

export default function SimplifiedList(props){
    const { list, category } = props
    const { currentTrack } = useStore()
    const [ hoverItemId, setHoverItemId ] = useState(null)
    
    return(
        <div className="simplified_list_wrapper relative">
            {list.map((item, index) => {
                    return (
                        <div 
                        key={item.id}
                        className="grid"                
                        onMouseEnter={() => {
                        if(currentTrack){ 
                        setHoverItemId(item.id)
                        } }}
                        onMouseLeave={() => setHoverItemId(null)}> 
                            <div 
                            style={{ justifySelf: "center" }}
                            onMouseEnter={() => {
                            if(currentTrack){ 
                            setHoverItemId(item.id)
                            } }} >
                                <PlayBtnManager 
                                uri={item.uri} 
                                id={item.id}
                                category={"simplified_list"} 
                                type={item.type} 
                                hoverItemId={hoverItemId}/>
                                {(hoverItemId !== item.id) && <h3>{index + 1}.</h3>}
                            </div>
                            
                            <h3>{item.name}</h3>
                            {category === "playlist" && <h5>{item.artist_name}</h5>}
                            <h4>{item.type}</h4>
                        </div>
                        )
                    })   
                }     
        </div>
    )
}

