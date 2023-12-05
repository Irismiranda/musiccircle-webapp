  import React, { useState, useEffect } from "react"
  import { Outlet, useNavigate } from "react-router-dom"
  import { Axios } from "../Axios-config"
  import { io } from "socket.io-client"
  import Cookies from 'js-cookie'
  import Spotify from "spotify-web-api-js"
  import useStore from "../store"
import { off } from "process"

  export default function AuthRequired() {
    const [refreshToken, setRefreshToken] = useState(null)
    const [expiringTime, setExpiringTime] = useState(null)
    const [expired, setExpired] = useState(false)
    const [isLoading, setIsLoading] = useState(true)
    const [offset, setOffset] = useState(0)
    const newSpotifyApi = new Spotify()
    const navigate = useNavigate()

    const { setAccessToken, accessToken, spotifyApi, setSpotifyApi, setCurrentUser, currentUser, setSocket, socket, setTopTracks, topTracks, setTopArtists, topArtists } = useStore()

    function setCookies(accessToken, refreshToken, expiringTime){
      const tokenExpiringDate = new Date(Date.now() + expiringTime)
      const refreshTokenExpiringDate = new Date(Date.now() + 86400000)
        const tokenData = {
          token: accessToken,
          expiringTimeStamp: tokenExpiringDate,
        }
        try{
          Cookies.set('storedAccessToken', JSON.stringify(tokenData), { expires: tokenExpiringDate })
          Cookies.set('storedRefreshToken', refreshToken, { expires: refreshTokenExpiringDate})
        } catch(err){
          console.log(err)
        }
    }

    async function getNewToken(refreshToken){
      try {
        const response = await Axios.post("/auth/refresh_token", {
          refresh_token: refreshToken,
        })
        const accessToken = response.data.access_token
        const expiresIn = response.data.expires_in * 1000
        console.log("log - new token expires in:", expiresIn, "ms")
        setExpiringTime(expiresIn - 6000)
        setAccessToken(accessToken)
        setCookies(accessToken, refreshToken, expiresIn)
        console.log("log - token was refreshed successfully")
      } catch(error){
        console.log(error)
      }
    }

    async function getUser() {
      try{       
        const userData = await spotifyApi.getMe()
        
        const response = await Axios.post("/api/profile", {
          userData: userData,
        })
        
        setCurrentUser(userData)
        const stringData = JSON.stringify(userData)
        localStorage.setItem("currentUser", stringData)
        
      } catch(error){
        console.log(error)
      }
    
    }

    function formatListData(items, category) {
      return items.map(item => {
        let listItem = {
          id: item.id,
          name: item.name,
          imageUrl: category === "top_tracks" ? item.album.images[0].url : item.images[0].url,
          isVisible: true,
        };
    
        if (category === "top_tracks") {
          listItem.artistName = item.artists[0].name;
        }
    
        return listItem;
      });
    }

    async function getTopList(category){
      const options = {
        limit: 50,
      }
      
      let response

      if(category === "top_tracks"){
        response = await spotifyApi.getMyTopTracks(options)
        console.log("log - response is:", response.items)  
      } else if(category === "top_artists"){
        response = await spotifyApi.getMyTopArtists(options)
        console.log("log - response is:", response.items)  
      }

      const dbTopListData = formatListData(response.items, category)

      console.log("log - dbTopListData is:", dbTopListData)

      const firestoreResponse = await Axios.post(`/api/user/${category}`, {
        id: currentUser.id,
        data: dbTopListData,
      })
      setOffset(49)
      console.log("fire store response is:", firestoreResponse.data)
      category === "top_tracks" ? setTopTracks(firestoreResponse.data) : setTopArtists(firestoreResponse.data)
    }

    function calculateTimeLeft(dateAndTime){
      const currentTime = Math.floor(Date.now())
      const expirationDate = new Date(dateAndTime) 
      const expiresIn = expirationDate.getTime()
      const timeLeft = expiresIn - currentTime
      return timeLeft
    }

    useEffect(() => {
      
      if (!socket && setSocket) {
        const newSocket = io("https://musiccircle-api.onrender.com", { withCredentials: true });
        setSocket(newSocket)
        
        return () => {
            newSocket.off('connect')
        }
    }
    }, [socket, setSocket])

    useEffect(() =>{
        if(socket && !socket.connected){
          socket.connect()
        }
    }, [socket, socket?.connected])

    useEffect(() => {
      setIsLoading(true)
      let storedAccessToken = null
      let storedRefreshToken = null
      try{
        storedAccessToken = Cookies.get('storedAccessToken')
        storedRefreshToken = Cookies.get('storedRefreshToken')
      } catch(err){
        console.log(err)
      }

      if(storedAccessToken && storedRefreshToken){
      const storedAccessTokenData = JSON.parse(storedAccessToken)
      const { token, expiringTimeStamp } = storedAccessTokenData 
      const timeLeft = calculateTimeLeft(expiringTimeStamp)
      setAccessToken(token)
      setExpiringTime(timeLeft)
      setRefreshToken(storedRefreshToken)
      } else if(!storedAccessToken && (storedRefreshToken)){
        setRefreshToken(storedRefreshToken)
        getNewToken(storedRefreshToken)
      } else {
        let url = window.location.href
        let params = new URL(url).searchParams
        const access_token = params.get("access_token")
        const expires_in = params.get("expires_in") * 1000
        const refresh_token = params.get("refresh_token")
          if (access_token && refresh_token) {
            setAccessToken(access_token)
            setRefreshToken(refresh_token)
            setExpiringTime(expires_in - 6000)
            setCookies(access_token, refresh_token, expires_in)
            params.delete("access_token")
            let cleanUrl =
            window.location.protocol +
            "//" +
            window.location.host +
            window.location.pathname
            window.history.replaceState({}, document.title, cleanUrl)
          } else {
            navigate("/welcome")
          }
      }
    }, [])

    useEffect(() => {
      if(accessToken){
        newSpotifyApi.setAccessToken(accessToken)
        setSpotifyApi(newSpotifyApi)
      }
    }, [accessToken])

    useEffect(() => {
      let storedUser = null
      try{
        storedUser = localStorage.getItem("currentUser")
      } catch(err){
        console.log(err)
      }

      if(storedUser){
        setCurrentUser(JSON.parse(storedUser))
      } else {
        if(spotifyApi){
          getUser()
        }
      }
      
      if(spotifyApi){
        getTopList("top_tracks")
        getTopList("top_artists")
      }

      setIsLoading(false)
    }, [spotifyApi])

    useEffect(() => {
      if (expiringTime){
        const timeInMs = expiringTime
        setTimeout(() => {
          setExpired(true)
        }, timeInMs)
      }
    }, [expiringTime])

    useEffect(() => {
      if(expired && refreshToken){
        getNewToken(refreshToken)
      }
    }, [expired])

    useEffect(() => {
    console.log("top tracks are", topTracks, "top artists are", topArtists) 
    async function fetchMoreItems(category, list){
      console.log("log - offset is:", offset)
        const options = {
          limit: 50,
          offset: offset,
        }
        const response = category === "top_artists" ? await spotifyApi.getMyTopArtists(options) : await spotifyApi.getMyTopTracks(options)
        console.log("fetchMoreItems log - response is:", response.items)
        const newItems = formatListData(response.items, category)

        if(newItems.length > 0){
          const updatedList = { ...list, items: list.items.concat(newItems)}
        console.log("fetchMoreItems log - updated list is:", updatedList)
        
        Axios.post(`/api/user/${category}`, {
          id: currentUser.id,
          data: updatedList,
        })
        category === "top_artists" ? setTopArtists(updatedList) : setTopTracks(updatedList)
        setOffset(prevOffset => prevOffset + 10)
        }
      }
      
      if(topTracks){
        const visibleItems = topTracks.items.filter(item => item.isVisible)
        console.log("visible items are:", visibleItems)
        if(visibleItems.length < 10 && offset < 50){
        fetchMoreItems("top_tracks", topTracks)
        }
      }

      if(topArtists){
        const visibleItems = topArtists.items.filter(item => item.isVisible)
        console.log("visible items are:", visibleItems)
        if(visibleItems.length < 10 && offset < 50){
        fetchMoreItems("top_artists", topTracks)
        }
      }

    }, [topTracks, topArtists])

    if (accessToken && !isLoading) {
      return <Outlet/>
    } else {
      return (
      <div className="wrapper default_padding" style={{ width: "95vw", margin: "10px auto" }}>
          <h2>Loading...</h2>
      </div>
      )
    }
  }
