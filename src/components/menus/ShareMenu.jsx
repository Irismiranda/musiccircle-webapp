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

    function addToSendList(handle){
        if(sendList?.includes(handle)){
            const updatedList = sendList.filter(item => item !== handle)
            setSendList(updatedList)
        } else {
            setSendList((prevList) => [...prevList, handle])
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

        console.log("user list is:", userList)

        const formatedData = formatListData(userList, "user")

        console.log("formated data is", formatedData)

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
            searchResults = userDataList.filter((user) =>
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

    return (
        <div className="share_menu_inner_wrapper">
            <input 
            ref={userSearchInputRef} 
            className="search_bar" 
            placeholder="Find a friend..." 
            onInput={() => searchUsers()} />

            {(searchResult?.length > 0) ?
            <section>
                {!isLoading ? 
                <section>
                <SliderScrollBtns 
                parentRef={parentRef}
                list={userDataList}
                />   
                    <div 
                    className="slider_grid"
                    ref={parentRef}
                    style={{ position: "relative" }}>
                        {searchResult.map((user) => {
                            return (
                                <div 
                                className={sendList?.includes(user.userHandle) ? "flex flex_column user_slider_selected" : "flex flex_column"}
                                key={user.id}
                                onClick={() => addToSendList(user.userHandle)}>
                                    <img 
                                    className="profile_small"
                                    src={user.imageUrl}/>
                                    <h3>{user.name}</h3>
                                    <h5>@{user.userHandle}</h5>
                                </div>
                            )
                        })}
                    </div>
                </section> :
                <h3>Loading...</h3>} 
            </section> :
            <h3>No results found...</h3>
            }

            { sendList?.length > 0 && 
            <section>
                <div>
                    {sendList.map((handle) => {
                        return (
                            <div className="bullet_btn">handle</div>
                        )
                    })}
                </div>
                <textarea 
                className="share_menu_textarea" 
                ref={textAreaRef}/>
            </section>}

            <button 
            disabled={sendList?.length > 0} 
            onClick={() => sendMessage()}>
                send
            </button>

            <div className="flex">
                <SvgLinkIcon className="svg" />
            </div>
            <div className="flex">
                <SvgFeedIcon className="svg"/>
            </div>
        </div>
    )
}