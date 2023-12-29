import React, { useEffect, useState, useRef } from "react"
import { Axios } from "../../Axios-config"
import { SvgLinkIcon, SvgFeedIcon } from "../../assets"
import { SliderScrollBtns, formatListData } from "../../utils"
import { EmojiBar } from "../"
import { normalizeText } from "normalize-text"
import useStore from "../../store"

export default function ShareMenu(props){
    const { loggedUser } = useStore()
    const [isLoading, setIsLoading] = useState(true)
    const [userDataList, setUserDataList] = useState(null)
    const [searchResult, setSearchResult] = useState(null)
    const [sendList, setSendList] = useState([])
    const [showMessage, setShowMessage] = useState(false)
    const [publishing, setPublishing] = useState(false)
    const userSearchInputRef = useRef(null)
    const parentRef = useRef(null)
    const textAreaRef = useRef(null)

    const { content, closeMenu } = props

    function toggleSendList(name){
        if(sendList.includes(name)){
            const updatedList = sendList.filter(item => item !== name)
            setSendList(updatedList)
        } else if(sendList){ 
            setSendList((prevList) => [...prevList, name])
        }
    }

    function copyToClipboard(){
        navigator.clipboard.writeText(`https://open.spotify.com/${content.type}/${content.id}`)
        setShowMessage(true)
        setTimeout(() => setShowMessage(false), 5000)
    }

    async function getUsersData(idList){
        setIsLoading(true)

        const userList = []
        await Promise.all(
            idList.slice(0, 15).map(async (id) => {
                const response = await Axios.get(`/api/account/${id}`)
                userList.push(response.data)
            })
        )

        const formatedData = formatListData(userList, "user")

        setUserDataList(formatedData)
        setSearchResult(formatedData)
        setIsLoading(false)
    }

    async function searchUsers() {
        const searchTerm = userSearchInputRef.current.value
        
        const normalizedSearchTerm = normalizeText(searchTerm).toLowerCase()        
        let searchResults
        
        if (searchTerm === "") {
            searchResults = userDataList.slice(15)
        } else {
            searchResults = userDataList?.filter((user) =>
            normalizeText(user.userHandle).toLowerCase().includes(normalizedSearchTerm) ||
            normalizeText(user.name).toLowerCase().includes(normalizedSearchTerm)
            )
        }
        
        setSearchResult(searchResults)
    }

    async function sendMessage(){
        setPublishing(true)
        closeMenu()
    }

    async function postMessage(){
        setPublishing(true)

        Axios.post(`/api/${loggedUser.id}/post/${content.id}`, {
            description: textAreaRef.current.value,
            type: content.type,
        })

        setTimeout(() => closeMenu(), 5000)
    }

    useEffect(() => {
        getUsersData(loggedUser.following)
    }, [])

    return (
        <div className={publishing ? "share_menu_inner_wrapper posting_wrapper" : "share_menu_inner_wrapper"}>
            <input 
            ref={userSearchInputRef} 
            className="search_bar" 
            placeholder="Find a friend..." 
            onInput={() => searchUsers()} />

            <section className="slider_inner_wrapper">
                {!isLoading ?
                <div>
                    {(searchResult?.length > 0) ? 
                    <div>
                        <div 
                        className="user_slider_grid"
                        ref={parentRef}>
                            {searchResult.map((user) => {
                                return (
                                    <div 
                                    className={sendList.includes(user.name) ? 
                                        "flex flex_column user_slider_item user_slider_selected" : 
                                        "flex flex_column user_slider_item"}
                                    key={user.id}
                                    onClick={() => toggleSendList(user.name)}>
                                        <img 
                                        className="profile_small"
                                        src={user.imgUrl}/>
                                        <h3>{user.name}</h3>
                                    </div>
                                )
                            })}
                        </div>
                    <SliderScrollBtns 
                    parentRef={parentRef}
                    list={userDataList}
                    slidePercent={0.8}
                    />   
                    </div> :
                    <h3>No results found...</h3>} 
                </div> :
                <h3>Loading...</h3>
                }
            </section>
            
            {sendList.length > 0 && 
            <div 
            className="flex"
            style={{ flexWrap: "wrap" }}>
                {sendList.map((name) => {
                    return (
                        <button 
                        onClick={() => toggleSendList(name)}
                        className="bullet_btn">
                            {name}
                        </button>
                    )
                })}
            </div>}

            <section> 
                <textarea 
                ref={textAreaRef}
                className="share_menu_textarea"
                placeholder="Say something about this..."/>
                <EmojiBar 
                textAreaRef={textAreaRef}/>
                <button
                className="full_width" 
                disabled={sendList?.length === 0} 
                onClick={() => sendMessage()}>
                    Send
                </button>
            </section>

            <section 
            className="flex full_width"
            style={{ marginTop: "20px"}}>
                <div 
                className="flex full_width justify_center"
                onClick={() => copyToClipboard()}>
                    <SvgLinkIcon className="svg" />
                    {showMessage && <h5>Copied to Clipboard!</h5>}
                </div>
                <div 
                className="flex full_width justify_center"
                onClick={() => postMessage()}>
                    <SvgFeedIcon className="svg"/>
                </div>
            </section>

        </div>
    )
}