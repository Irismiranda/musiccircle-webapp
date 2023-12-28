import React, { useState } from "react"
import { PlayBtn, ShareBtn, CommentBtn } from "../../utils"
import useStore from "../../store"

export default function SimplifiedList(props){
    const { list, category } = props
    const { playerState } = useStore()
    const [ hoverItemId, setHoverItemId ] = useState(null)
    
    return(
        <div className="simplified_list_wrapper relative">
            {list.map((item, index) => {
                    return (
                        <div 
                        key={item.id}
                        className="grid"                
                        onMouseEnter={() => {
                        if(playerState.currentTrack){ 
                        setHoverItemId(item.id)
                        } }}
                        onMouseLeave={() => setHoverItemId(null)}> 
                            <div 
                            style={{ justifySelf: "center" }}
                            onMouseEnter={() => {
                            if(playerState.currentTrack){ 
                            setHoverItemId(item.id)
                            } }} >
                                <PlayBtn 
                                uri={item.uri} 
                                id={item.id}
                                category={"simplified_list"} 
                                type={item.type} 
                                hoverItemId={hoverItemId}/>
                                {(hoverItemId !== item.id) && <h3>{index + 1}.</h3>}
                            </div>
                            
                            <h3>{item.name}</h3>
                            {category === "playlist" && <h5>{item.artistName}</h5>}
                            <h4>{item.type}</h4>
                            <div
                            className="flex">
                                <ShareBtn 
                                content={item}/>
                                <CommentBtn 
                                content={item}/>
                            </div>
                        </div>
                        )
                    })   
                }     
        </div>
    )
}

