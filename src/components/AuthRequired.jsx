  import React, { useState, useEffect } from "react"
  import { Outlet, useNavigate } from "react-router-dom"
  import { Axios } from "../Axios-config"
  import { io } from "socket.io-client"
  import { formatListData } from "../utils"
  import { normalizeText } from 'normalize-text'
  import { Error } from "../pages"
  import Cookies from 'js-cookie'
  import Spotify from "spotify-web-api-js"
  import useStore from "../store"

  export default function AuthRequired() {
    const [refreshToken, setRefreshToken] = useState(null)
    const [expiringTime, setExpiringTime] = useState(null)
    const [expired, setExpired] = useState(false)
    const [isLoading, setIsLoading] = useState(true)
    const [offset, setOffset] = useState(0)
    const [isUserPremium, setIsUserPremium] = useState(true)
    const newSpotifyApi = new Spotify()
    const navigate = useNavigate()

    const { setAccessToken, accessToken, spotifyApi, setSpotifyApi, setLoggedUser, loggedUser, setSocket, socket, setUserTopTracks, userTopTracks, setUserTopArtists, userTopArtists } = useStore()

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
        setExpiringTime(expiresIn - 6000)
        setAccessToken(accessToken)
        setCookies(accessToken, refreshToken, expiresIn)
      } catch(err){
        console.log(err)
      }
    }

    async function getUser() {
      try{       
        const userData = await spotifyApi.getMe()
        if(userData.product === "free"){
          setIsUserPremium(false)
          return
        }
        userData.user_handle = `${normalizeText(userData.display_name).replace(/\s/g,'')}#${userData.id}`
        
        const response = await Axios.post(`/api/account/${userData.id}`)
        console.log("logged user is:", response.data)
        
        setLoggedUser(response.data)
        
      } catch(err){
        console.log(err)
      }
    
    }

    async function getTopList(category){
      const options = {
        limit: 48,
        time_range: "long_term",
      }
      
      let response

      if(category === "top_tracks"){
        response = await spotifyApi.getMyTopTracks(options)
      } else if(category === "top_artists"){
        response = await spotifyApi.getMyTopArtists(options)
      }

      const dbTopListData = formatListData(response.items, category.slice(4))

      const firestoreResponse = await Axios.post(`/api/user/${category}`, {
        id: loggedUser.id,
        items: dbTopListData,
      })
      setOffset(48)
      category === "top_tracks" ? setUserTopTracks(firestoreResponse.data) : setUserTopArtists(firestoreResponse.data)
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
      setExpiringTime(timeLeft - 6000)
      setAccessToken(token)      
      setRefreshToken(storedRefreshToken)
      } else if(!storedAccessToken && storedRefreshToken){
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
        storedUser = localStorage.getItem("loggedUser")
      } catch(err){
        console.log(err)
      }

      if(storedUser){
        setLoggedUser(JSON.parse(storedUser))
      } else {
        if(spotifyApi){
          getUser()
        }
      }
      setIsLoading(false)
    }, [spotifyApi])

    useEffect(() => {
      if(spotifyApi && loggedUser){
        getTopList("top_tracks")
        getTopList("top_artists")
      }
    }, [spotifyApi, loggedUser])

    useEffect(() => {
      if(loggedUser){
        const stringData = JSON.stringify(loggedUser)
        localStorage.setItem("loggedUser", stringData)
      }
    }, [loggedUser])

    useEffect(() => {
      const timeInMs = expiringTime || 0
      setTimeout(() => {
        setExpired(true)
      }, timeInMs)
      
    }, [expiringTime])

    useEffect(() => {
      console.log("token expires in", expiringTime)
    }, [expiringTime])

    useEffect(() => {
    async function fetchMoreItems(category, list){
        const options = {
          limit: 50,
          time_range: "long_term",
          offset: offset,
        }
        const response = category === "top_artists" ? await spotifyApi.getMyTopArtists(options) : await spotifyApi.getMyTopTracks(options)
        
        if(response.items.length > 0){
          const dbTopListData = formatListData(response.items, category.slice(4))
          const existingItemIds = new Set(list.items.map(item => item.id))
          const newUniqueItems = dbTopListData.filter(item => !existingItemIds.has(item.id))
          const updatedList = { ...list.items, items: list.items.concat(newUniqueItems)}
        
        const firebaseResponse = await Axios.post(`/api/user/${category}`, {
          id: loggedUser.id,
          items: updatedList.items,
        })

        setOffset(prevOffset => prevOffset + 50)
        category === "top_artists" ? setUserTopArtists(firebaseResponse.data) : setUserTopTracks(firebaseResponse.data)
        }
      }
      
      if(userTopTracks){
        const visibleItems = userTopTracks.items.filter(item => item.isVisible)
        if(visibleItems.length < 10 && offset < 95 && offset > 0){
        fetchMoreItems("top_tracks", userTopTracks)
        }
      }

      if(userTopArtists){
        const visibleItems = userTopArtists.items.filter(item => item.isVisible)
        if(visibleItems.length < 10 && offset < 95 && offset > 0){
        fetchMoreItems("top_artists", userTopTracks)
        }
      }

    }, [userTopTracks, userTopArtists, offset])

    if(!isUserPremium){
      return <Error/>
    } else if (accessToken && !isLoading) {
      return <Outlet/>
    } else {
      return (
      <div className="wrapper default_padding" style={{ width: "95vw", margin: "10px auto" }}>
          <h2>Loading...</h2>
      </div>
      )
    }
  }
