import React, { useState, createRef, useEffect } from 'react'
import { Outlet, useLocation, Link } from 'react-router-dom'
import { SvgMusicCircle, SvgHomeIcon, SvgSearchIcon, SvgCommentBtn, SvgNotificationsIcon, SvgMoreIcon } from '../../../src/assets'
import { Notifications, More, Search } from '../'
import { useClickOutside } from "../../utils/utils"
import useStore from "../../store"

export default function SideMenu(){
    const sideMenuRef = createRef(null)
    const extendedMenu = createRef(null)
    const location = useLocation()
    const { currentUser, setSideMenuWidth, sideMenuWidth, setStandardWrapperWidth } = useStore()
    const [ activeMenu, setActiveMenu ] = useState(null)
    const [ IsTextVisible, setIsTextVisible ] = useState(false)

    useClickOutside(extendedMenu, sideMenuRef, () => switchActiveMenu(null))

    function switchActiveMenu(componentName){
        if(activeMenu === null || activeMenu !== componentName){
            setActiveMenu(componentName)
        } else {
            setActiveMenu(null)
        }
    }

    useEffect(() => {
        const path = location.pathname
        if (path.includes('inbox')){
            setActiveMenu('messages')
        } else if(path.includes('/profile')){
            setActiveMenu('account')
        } else {
            setActiveMenu(null)
        }
    }, [])

    useEffect(() => {
        if (sideMenuRef.current) {
            const sideMenuCurrentWidth = sideMenuRef.current.getBoundingClientRect().right + sideMenuRef.current.getBoundingClientRect().left
            setSideMenuWidth(sideMenuCurrentWidth)
            if(!activeMenu){
                setStandardWrapperWidth(sideMenuCurrentWidth)
            }
        }
    }, [activeMenu, setActiveMenu])

    useEffect(() => {
        if(!activeMenu || activeMenu === "messages" || activeMenu === "account"){
            setIsTextVisible(false)
        }
    }, [activeMenu])

    return (
        <>
            <div className='side_menu_wrapper flex' ref={sideMenuRef}>
                <div className='side_menu' style={{ cursor: "pointer", marginRight: !activeMenu ? "30px" : ""}}>
                    <Link to="/" className='flex gap'>
                        <SvgMusicCircle className="svg_big"/>
                        {IsTextVisible && <h2>Music<span style={{ color: "#F230AA", fontWeight: "500" }}>Circle</span></h2>}
                    </Link>
                    <Link to="/" className='flex gap'>
                        <SvgHomeIcon className="svg_big" color={ activeMenu === null ? "#F230AA" : "white" }/>
                        {IsTextVisible && <h2>Home</h2>}
                    </Link>
                    <div className='flex gap' onClick={() => switchActiveMenu("search")}>
                        <SvgSearchIcon className="svg_big" color={ activeMenu === "search" ? "#F230AA" : "white" }/>
                        {IsTextVisible && <h2>Search</h2>}
                    </div>
                    <Link to={"/inbox"} className='flex gap' onClick={() => switchActiveMenu("messages")}>
                        <SvgCommentBtn className="svg_big"  color={ activeMenu === "messages" ? "#F230AA" : "white" }/>
                        {IsTextVisible && <h2>Messages</h2>}
                    </Link>
                    <div className='flex gap' onClick={() => switchActiveMenu("notifications")}>
                        <SvgNotificationsIcon className="svg_big" color={ activeMenu === "notifications" ? "#F230AA" : "white" }/>
                        {IsTextVisible && <h2>Notifications</h2>}
                    </div>
                    <Link to={`/account/${currentUser.id}`} className='flex gap' onClick={() => switchActiveMenu("account")}>
                        { currentUser.images && <img src={`${currentUser.images[0].url}`} className='profile_small'/> }
                        {IsTextVisible && <h2>My Profile</h2>}
                    </Link>
                    <div className='flex gap' onClick={() => switchActiveMenu("more")}>
                        <SvgMoreIcon className="svg_big" color={ activeMenu === "more" ? "#F230AA" : "white" }/>
                        {IsTextVisible && <h2>More</h2>}
                    </div>
                </div>
                {(activeMenu && activeMenu !== "messages" && activeMenu !== "account") && <div ref={extendedMenu} className='side_menu_expanded side_menu_wrapper gap' style={{ left: `${sideMenuWidth}px` }}>
                    {activeMenu === "search" && <Search />}
                    {activeMenu === "notifications" && <Notifications />}
                    {activeMenu === "more" && <More />}
                </div>}
            </div>
            <Outlet />
        </>
    )
}
