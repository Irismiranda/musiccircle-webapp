import React, { useEffect, useState } from "react"
import { SvgLinkIcon, SvgFeedIcon } from "../../assets"
import { Axios } from "../../Axios-config"
import useStore from "../../store"

export default function ShareMenu(){
    const { loggedUser } = useStore()

    return (
        <div>
            <input placeholder="Find a friend..."/>
            <div className="flex">
                <SvgLinkIcon className="svg" />
            </div>
            <div className="flex">
                <SvgFeedIcon className="svg"/>
            </div>
        </div>
    )
}