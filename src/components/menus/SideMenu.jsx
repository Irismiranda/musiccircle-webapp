import React, { useState, createRef, useEffect } from 'react'
import { Outlet, useLocation, Link } from 'react-router-dom'
import { SvgMusicCircle, SvgHomeIcon, SvgSearchIcon, SvgCommentBtn, SvgNotificationsIcon, SvgMoreIcon } from '../../../src/assets'
import { Notifications, More, Search } from '../'
import { useClickOutside } from "../../utils/utils"
import ResizeObserver from 'resize-observer-polyfill'
import useStore from "../../store"

export default function SideMenu(){
    const sideMenuRef = createRef(null)
    const extendedMenu = createRef(null)
    const location = useLocation()
    const { currentUser, setSideMenuWidth, sideMenuWidth, setStandardWrapperWidth } = useStore()
    const [ activeMenu, setActiveMenu ] = useState(null)
    const [ isTextVisible, setisTextVisible ] = useState(true)
    
    function setActiveMenuByLocation(){
        const path = location.pathname
        if (path.includes('inbox')){
            setActiveMenu('messages')
        } else if(path.includes('/profile')){
            setActiveMenu('account')
        } else {
            setActiveMenu(null)
        }
    }
    
    function switchActiveMenu(componentName){
        if(!activeMenu || activeMenu !== componentName){
            setActiveMenu(componentName)
        } else {
            setActiveMenu(null)
        }
    }
    
    useClickOutside(extendedMenu, sideMenuRef, () => setActiveMenuByLocation())

    useEffect(() => {
        const resizeObserver = new ResizeObserver((entries) => {
            for (const entry of entries) {
                const { width } = entry.contentRect
                setSideMenuWidth(width)
                console.log("log - width is:", width, "data is:", entry.contentRect)
                if (!activeMenu) {
                    setStandardWrapperWidth(width)
                }
            }
        })

        if (sideMenuRef.current) {
            resizeObserver.observe(sideMenuRef.current)
        }

        return () => {
            if (sideMenuRef.current) {
                resizeObserver.unobserve(sideMenuRef.current)
            }
        }
    }, [sideMenuRef.current])

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
                    <Link to="/" className='menu_item_wrapper' onClick={() => setActiveMenu(null)}>
                        <SvgMusicCircle className="svg_big"/>
                        {isTextVisible && <h2>Music<span style={{ color: "#F230AA", fontWeight: "500" }}>Circle</span></h2>}
                    </Link>
                    <Link to="/" className='menu_item_wrapper' onClick={() => setActiveMenu(null)}>
                        <SvgHomeIcon className="svg_big" color={ activeMenu === null ? "#F230AA" : "white" }/>
                        {isTextVisible && <h2 style={{ color: activeMenu === null ? "#F230AA" : "white" }}>Home</h2>}
                    </Link>
                    <div className='menu_item_wrapper' onClick={() => switchActiveMenu("search")}>
                        <SvgSearchIcon className="svg_big" color={ activeMenu === "search" ? "#F230AA" : "white" }/>
                        {isTextVisible && <h2>Search</h2>}
                    </div>
                    <Link to={"/inbox"} className='menu_item_wrapper' onClick={() => switchActiveMenu("messages")}>
                        <SvgCommentBtn className="svg_big"  color={ activeMenu === "messages" ? "#F230AA" : "white" }/>
                        {isTextVisible && <h2 style={{ color: activeMenu === "messages" ? "#F230AA" : "white" }}>Messages</h2>}
                    </Link>
                    <div className='menu_item_wrapper' onClick={() => switchActiveMenu("notifications")}>
                        <SvgNotificationsIcon className="svg_big" color={ activeMenu === "notifications" ? "#F230AA" : "white" }/>
                        {isTextVisible && <h2>Notifications</h2>}
                    </div>
                    <Link to={`/account/${currentUser.id}`} className='menu_item_wrapper' onClick={() => switchActiveMenu("account")}>
                        { currentUser.images && <img src={`${currentUser.images[0].url}`} className='profile_small'/> }
                        {isTextVisible && <h2 style={{ color: activeMenu === "account" ? "#F230AA" : "white" }}>My Profile</h2>}
                    </Link>
                    <div className='menu_item_wrapper' onClick={() => switchActiveMenu("more")}>
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
