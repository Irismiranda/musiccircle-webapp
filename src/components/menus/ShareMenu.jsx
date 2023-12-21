import React, { useEffect, useState, useRef } from "react"
import { Axios } from "../../Axios-config"
import { SvgLinkIcon, SvgFeedIcon } from "../../assets"
import { SliderScrollBtns, formatListData } from "../../utils"
import { normalizeText } from "normalize-text"
import useStore from "../../store"

export default function ShareMenu(props){
    const { loggedUser } = useStore()
    const [isLoading, setIsLoading] = useState(true)
    const [userDataList, setUserDataList] = useState(null)
    const [searchResult, setSearchResult] = useState(null)
    const [sendList, setSendList] = useState(null)
    const userSearchInputRef = useRef(null)
    const parentRef = useRef(null)
    const textAreaRef = useRef(null)

    const { contentId } = props

    function toggleSendList(handle){
        if(sendList?.includes(handle)){
            const updatedList = sendList.filter(item => item !== handle)
            setSendList(updatedList)
        } else if(sendList){ 
            setSendList([...prevList, handle])
        }
    }

    async function getUsersData(idList){
        setIsLoading(true)

        const userList = []
        await Promise.all(
            idList.slice(0, 15).map(async (id) => {
                const response = await Axios.post("/api/account", {
                    userData: {
                        id: id,
                        type: "user",
                    }
                })
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
            searchResults = userDataList.slice(0, 15)
        } else {
            searchResults = userDataList?.filter((user) =>
            normalizeText(user.userHandle).toLowerCase().includes(normalizedSearchTerm) ||
            normalizeText(user.name).toLowerCase().includes(normalizedSearchTerm)
            )
        }
        
        setSearchResult(searchResults)
    }

    async function sendMessage(){
        console.log("content id is", contentId)
    }

    useEffect(() => {
        getUsersData(loggedUser.following)
    }, [])

    useEffect(() => {
        console.log(sendList)
    }, [sendList])

    return (
        <div className="share_menu_inner_wrapper">
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
                                    className={sendList?.includes(user.userHandle) ? "flex flex_column user_slider_selected" : "flex flex_column"}
                                    key={user.id}
                                    onClick={() => toggleSendList(user.userHandle)}>
                                        <img 
                                        className="profile_small"
                                        src={user.imageUrl}/>
                                        <h3>{user.name}</h3>
                                        <h5>@{user.userHandle}</h5>
                                    </div>
                                )
                            })}
                        </div>
                    <SliderScrollBtns 
                    parentRef={parentRef}
                    list={userDataList}
                    />   
                    </div> :
                    <h3>No results found...</h3>} 
                </div> :
                <h3>Loading...</h3>
                }
            </section>

            { sendList?.length > 0 && 
            <section>
                <div className="flex">
                    {sendList.map((handle) => {
                        return (
                            <button 
                            onClick={toggleSendList(handle)}
                            className="bullet_btn">
                                {handle}
                            </button>
                        )
                    })}
                </div>
                <textarea 
                className="share_menu_textarea" 
                ref={textAreaRef}/>
            </section>}

            <button
            className="full_width" 
            disabled={sendList?.length > 0} 
            onClick={() => sendMessage()}>
                Send
            </button>

            <section 
            className="flex full_width"
            style={{ marginTop: "20px", justifyContent: "space-around" }}>
                <div>
                    <SvgLinkIcon className="svg" />
                </div>
                <div>
                    <SvgFeedIcon className="svg"/>
                </div>
            </section>

        </div>
    )
}