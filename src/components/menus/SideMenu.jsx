import React, { useState, createRef, useEffect, useLayoutEffect } from 'react'
import { Outlet, useLocation, Link } from 'react-router-dom'
import { SvgMusicCircle, SvgHomeIcon, SvgSearchIcon, SvgCommentBtn, SvgNotificationsIcon, SvgMoreIcon } from '../../../src/assets'
import { Notifications, More, Search } from '../'
import { useClickOutside } from "../../utils/utils"
import useStore from "../../store"

export default function SideMenu(){
    const sideMenuRef = createRef(null)
    const extendedMenu = createRef(null)
    const location = useLocation()
    const { currentUser, setStandardWrapperWidth, artistUri } = useStore()
    const [ activeMenu, setActiveMenu ] = useState(null)
    const [ isTextVisible, setisTextVisible ] = useState(true)
    const [ sideMenuWidth, setSideMenuWidth ] = useState(null)
    
    function setActiveMenuByLocation(){
        const path = location.pathname
        if (path.includes('inbox')){
            setActiveMenu('messages')
        } else if(path.includes(currentUser.id)){
            setActiveMenu('account')
        } else {
            setActiveMenu(null)
        }
    }
    
    function switchActiveMenu(componentName){
        if(activeMenu === componentName && (activeMenu === "messages" || activeMenu === "account")){
            return
        } else if(!activeMenu || activeMenu !== componentName){
            setActiveMenu(componentName)
        } else {
            setActiveMenuByLocation()
        }
    }

    function calculateAvailableWidth(sideMenuWIdth){
        setStandardWrapperWidth(sideMenuWIdth)
    }
    
    useClickOutside(extendedMenu, sideMenuRef, () => setActiveMenuByLocation())
    
    useEffect(() => {
        const sideMenuRect = sideMenuRef.current.getBoundingClientRect()
        setSideMenuWidth(sideMenuRect.right - sideMenuRect.left)
        setActiveMenuByLocation()
    }, [])

    useLayoutEffect(() => {
        sideMenuWidth && calculateAvailableWidth(sideMenuWidth)
    }, [sideMenuWidth])

    useLayoutEffect(() => {
        calculateAvailableWidth(sideMenuWidth)
    }, [artistUri, location])

    useEffect(() => {
        if (activeMenu === "messages" || activeMenu === "account" || !activeMenu) {
            setisTextVisible(true)
        } else {
            setisTextVisible(false)
        }
    }, [activeMenu])

    return (
        <>
            <div className='side_menu'>
                <div ref={sideMenuRef} className='side_menu_wrapper'>
                    <Link to="/" className='menu_item_wrapper' onClick={() => setActiveMenu(null)} style={{ gridTemplateColumns: isTextVisible ? "1fr 2fr" : "" }}>
                        <SvgMusicCircle className="svg_big"/>
                        {isTextVisible && <h2>Music<span style={{ color: "#F230AA", fontWeight: "500" }}>Circle</span></h2>}
                    </Link>
                    <Link to="/" className='menu_item_wrapper' onClick={() => setActiveMenu(null)} style={{ gridTemplateColumns: isTextVisible ? "1fr 2fr" : "" }}>
                        <SvgHomeIcon className="svg_big" color={ activeMenu === null ? "#F230AA" : "white" }/>
                        {isTextVisible && <h2 style={{ color: activeMenu === null ? "#F230AA" : "white", fontWeight: activeMenu === null ? "500" : "" }}>Home</h2>}
                    </Link>
                    <div className='menu_item_wrapper' onClick={() => switchActiveMenu("search")} style={{ gridTemplateColumns: isTextVisible ? "1fr 2fr" : "" }}>
                        <SvgSearchIcon className="svg_big" color={ activeMenu === "search" ? "#F230AA" : "white" }/>
                        {isTextVisible && <h2>Search</h2>}
                    </div>
                    <Link to={"/inbox"} className='menu_item_wrapper' onClick={() => switchActiveMenu("messages")} style={{ gridTemplateColumns: isTextVisible ? "1fr 2fr" : "" }}>
                        <SvgCommentBtn className="svg_big"  color={ activeMenu === "messages" ? "#F230AA" : "white" }/>
                        {isTextVisible && <h2 style={{ color: activeMenu === "messages" ? "#F230AA" : "white", fontWeight: activeMenu === "messages" ? "500" : "" }}>Messages</h2>}
                    </Link>
                    <div className='menu_item_wrapper' onClick={() => switchActiveMenu("notifications")} style={{ gridTemplateColumns: isTextVisible ? "1fr 2fr" : "" }}>
                        <SvgNotificationsIcon className="svg_big" color={ activeMenu === "notifications" ? "#F230AA" : "white" }/>
                        {isTextVisible && <h2>Notifications</h2>}
                    </div>
                    <Link to={`/account/${currentUser.id}`} className='menu_item_wrapper' onClick={() => switchActiveMenu("account")} style={{ gridTemplateColumns: isTextVisible ? "1fr 2fr" : "" }}>
                        { currentUser.images && <img src={`${currentUser.images[0].url}`} className='profile_small'/> }
                        {isTextVisible && <h2 style={{ color: activeMenu === "account" ? "#F230AA" : "white", fontWeight: activeMenu === "account" ? "500" : ""  }}>My Profile</h2>}
                    </Link>
                    <div className='menu_item_wrapper' onClick={() => switchActiveMenu("more")} style={{ gridTemplateColumns: isTextVisible ? "1fr 2fr" : "" }}>
                        <SvgMoreIcon className="svg_big" color={ activeMenu === "more" ? "#F230AA" : "white" }/>
                        {isTextVisible && <h2>More</h2>}
                    </div>
                </div>
                {(activeMenu && (activeMenu !== "messages" && activeMenu !== "account")) && <div ref={extendedMenu} className='side_menu_wrapper gap'>
                    {activeMenu === "search" && <Search />}
                    {activeMenu === "notifications" && <Notifications />}
                    {activeMenu === "more" && <More />}
                </div>}
            </div>
            <Outlet />
        </>
    )
}
