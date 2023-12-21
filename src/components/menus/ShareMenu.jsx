import React, { useEffect, useState, useRef } from "react"
import { Axios } from "../../Axios-config"
import { SvgLinkIcon, SvgFeedIcon } from "../../assets"
import { Slider } from "../"
import useStore from "../../store"

export default function ShareMenu(){
    const { loggedUser } = useStore()
    const [friendList, setFriendList] = useState(null)
    const [userDataList, setUserDataList] = useState(null)
    const [isLoading, setIsLoading] = useState(true)
    const userSsearchInputRef = useRef(null)

    async function getUsersData(){
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

    useEffect(() => {

    }, [])



    return (
        <div>
            <input placeholder="Find a friend..."/>
            <Slider 
            list={friendList}
            category="user"
            type="user_list"/>
            <div className="flex">
                <SvgLinkIcon className="svg" />
            </div>
            <div className="flex">
                <SvgFeedIcon className="svg"/>
            </div>
        </div>
    )
}