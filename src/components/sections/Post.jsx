import React, { useEffect, useRef, useState } from "react"
import useStore from "../../store"
import { formatListData, PlayBtn, ShareBtn, useClickOutside } from "../../utils"
import { Link } from "react-router-dom"
import { Axios } from "../../Axios-config"
import { SvgDots } from "../../assets"

export default function Post(props){
    const { spotifyApi, loggedUser } = useStore()
    const [ item, setItem ] = useState(null)
    const [ hoverItemId, setHoverItemId ] = useState(null)
    const [ user, setUser ] = useState(null)
    const [showMenuVisibility, setShowMenuVisibility] = useState(false)
    
    const { data, isLoggedUser, setPosts } = props

    const dropMenuRef = useRef(null)
    const dotsIconRef = useRef(null)

    useClickOutside(dropMenuRef, dotsIconRef, () => setShowMenuVisibility(false))

    async function getitem(){
        const methodName = `get${data.type.charAt(0).toUpperCase() + data.type.slice(1)}`
        const item = await spotifyApi[methodName](data.id)
        const formatedItem = formatListData([item], `${data.type}s`)
        setItem(formatedItem[0])
    }

    async function getUser(id){
        const response = await Axios.get(`/api/account/${id}`)
        const formatedData = formatListData([response.data], "user")
        setUser(formatedData[0])
    }

    async function toggleHidePost(id){
        const response = await Axios.post(`/api/${loggedUser.id}/${data.post_id}/toggle_hide_post`)
        setPosts(response.data)
        setShowMenuVisibility(false)
    }

    async function deletePost(id){
        const response = await Axios.post(`/api/${loggedUser.id}/${data.post_id}/delete_post`)
        setPosts(response.data)
        setShowMenuVisibility(false)
    }

    useEffect(() => {
        if(data.id){
            console.log(data)
            getitem()
            getUser(data.user_id)
        }
    }, [data])

    return (
        (item && (data.show_post || isLoggedUser))(
            <section 
                key={data.post_id}
                className={data.hide_post ? 
                    "flex relative inner_wrapper transparent_section" : 
                    "flex relative inner_wrapper"}
                style={{ padding: "0px 25px 0px 0px" }}>

                <div 
                    className="cover_large cover_post"
                    style={{ backgroundImage: `url('${item.imgUrl}')`}}
                    onMouseEnter={() => setHoverItemId(item.id)}
                    onMouseLeave={() => setHoverItemId(null)}
                >
                    <div 
                    onMouseEnter={() => setHoverItemId(item.id)}>
                        <PlayBtn 
                            uri={`spotify:${item.type}:${item.id}`} 
                            id={item.id}
                            category={"cover"} 
                            type={item.type} 
                            hoverItemId={hoverItemId}
                        />
                    </div>
                </div>
                <div className="grid post_grid">
                    <div className="flex space_between full_width">
                        <h3>{item.name} by <Link to={`/artist/${item.artist_id}`}>{item.artist_name}</Link></h3>
                        {isLoggedUser && 
                        <SvgDots 
                        ref={dotsIconRef}
                        className="svg"
                        onClick={() => setShowMenuVisibility(!showMenuVisibility)}/>}
                    </div>
                    {showMenuVisibility && 
                    <div
                    ref={dropMenuRef} 
                    className="wrapper default_padding post_drop_menu">
                        <h3 onClick={() => toggleHidePost()}>{data.hide_post ? "Show Post" : "Hide Post"}</h3>
                        <hr />
                        <h3 onClick={() => deletePost()}>Delete Post</h3>
                    </div>}
                    <Link to={`/account/${user?.id}`}>
                        <div 
                        className="flex"
                        style={{ marginBottom: "10px" }}>
                                <img 
                                src={user?.imgUrl}
                                className="profile_small" />
                                <h4>{user?.name}</h4>
                        </div>
                    </Link>
                    <p>{data.comment}</p>
                    <div className="flex space_between full_width">
                        <div 
                        className="flex">
                            <h4>{item.likes ? item.likes?.length : 0} Likes</h4>
                            <h4>{item.comments ? item.comments?.length : 0} Comments</h4>
                        </div>
                        <ShareBtn 
                        content={data}/>
                    </div>
                </div>
            </section>
        )
    )
    
}