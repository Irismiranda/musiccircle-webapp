import React, { useEffect, useState, useRef } from "react"
import { Axios } from "../../Axios-config"
import { SvgLinkIcon, SvgFeedIcon } from "../../assets"
import { Slider } from "../"
import useStore from "../../store"

export default function ShareMenu(){
    const { loggedUser } = useStore()
    const [userDataList, setUserDataList] = useState(null)
    const [isLoading, setIsLoading] = useState(true)
    const userSsearchInputRef = useRef(null)

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
        setIsLoading(false)
    }

    async function searchUsers() {
        const searchTerm = userSsearchInputRef.current.value.toLowerCase()        
        let searchResults
        
        if (searchTerm === "") {
            searchResults = userDataList.slice(0, 15)
        } else {
            searchResults = userDataList.filter((user) =>
            user.userHandle.toLowerCase().includes(searchTerm)
            )
        }
        
        setUserDataList(searchResults)
    }

    useEffect(() => {
        getUsersData(loggedUser.following)
    }, [])

    return (
        <div>
            <input 
            ref={userSsearchInputRef} 
            className="search_bar" 
            placeholder="Find a friend..." 
            onInput={() => searchUsers()} />

            {(userDataList?.length > 0) ?
            <section>
                !isLoading ? 
                <Slider 
                list={userDataList}
                category="user"
                type="user_list"/> :
                <h3>Loading...</h3> 
            </section> :
            <h3>No results found...</h3>
            }

            <div className="flex">
                <SvgLinkIcon className="svg" />
            </div>
            <div className="flex">
                <SvgFeedIcon className="svg"/>
            </div>
        </div>
    )
}