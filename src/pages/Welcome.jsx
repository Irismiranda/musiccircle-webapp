import React from 'react'
import Cookies from 'js-cookie'
import { Axios } from "../Axios-config"

export default function Welcome() {
    const storedAccessToken = Cookies.get('storedAccessToken')
    const storedRefreshToken = Cookies.get('storedRefreshToken')
    
    async function login() {
        const response = await Axios.get("https://musiccircle-api.onrender.com/auth/login");
        const redirectURL = response.data
        window.location.href = redirectURL                
    }

    if(storedAccessToken || storedRefreshToken){
        window.location.href = 'https://musiccircle.onrender.com/'
        return null
    } else return (       
        <button onClick={login}>login</button>      
    )
}
