import React, { useEffect, useRef, useState } from "react"
import useStore from "../../store"
import { Link } from "react-router-dom"
import { Axios } from "../../Axios-config"
import { SvgDots, SvgHeart } from "../../assets"
import { PlayBtn, ShareBtn, CommentBtn, formatListData, useClickOutside } from "../../utils"

export default function Post(props){
    const { spotifyApi, loggedUser } = useStore()
    const [item, setItem] = useState(null)
    const [hoverItemId, setHoverItemId] = useState(null)
    const [user, setUser] = useState(null)
    const [commentsNumber, setCommentsNumber] = useState(0)
    const [showMenuVisibility, setShowMenuVisibility] = useState(false)
    
    const { data, isLoggedUser, setPosts } = props

    const dropMenuRef = useRef(null)
    const dotsIconRef = useRef(null)

    useClickOutside(dropMenuRef, [dotsIconRef], () => setShowMenuVisibility(false))

    async function getitem(){
        const methodName = `get${data.type.charAt(0).toUpperCase() + data.type.slice(1)}`
        
        console.log("method name is", methodName)
        
        const item = await spotifyApi[methodName](data.id)
        const formatedItem = formatListData([item], data.type)
        setItem(formatedItem[0])
    }

    async function getUser(id){
        const response = await Axios.get(`/api/user/${id}`)
        const formatedData = formatListData([response.data], "user")
        setUser(formatedData[0])
    }

    async function toggleHidePost(){
        try {
            const response = await Axios.post(`/api/${loggedUser.id}/${data.post_id}/toggle_hide_post`)
            setPosts(response.data)
            setShowMenuVisibility(false)
          } catch (error) {
            console.error("Toggle hide post error:", error)
          }
    }

    async function likePost(){
        await Axios.post(`/api/${user?.id}/${item.artist_id}/toggle_like_post/${data.post_id}`, {
            logged_user_id: loggedUser
        })
        
    }

    async function deletePost(){
        try {
            const response = await Axios.post(`/api/${loggedUser.id}/${data.post_id}/delete_post`)
            setPosts(response.data)
            setShowMenuVisibility(false)
          } catch (error) {
            console.error("Delete post error:", error)
          }
    }

    useEffect(() => {
        if(data.id){
            getitem()
            getUser(data.user_id)
            console.log("data is", data)
        }
    }, [data])

    return (
        (item && (!data.hide_post || isLoggedUser)) && (
            <section
            className="inner_wrapper relative"
            style={{ padding: "0px 20px 0px 0px" }}>
                <div 
                    key={data.post_id}
                    className={data.hide_post ? "transparent_section flex" : "flex"}>
                    <div 
                        className="cover_large cover_post"
                        style={{ backgroundImage: `url('${item.imgUrl}')`}}
                        onMouseEnter={() => setHoverItemId(item.id)}
                        onMouseLeave={() => setHoverItemId(null)}>
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
                            <h3>{item.name} 
                            {item.type !== "artist" && <span> by <Link to={`/artist/${item.artist_id}`}>{item.artist_name}</Link></span>}
                            </h3>
                            {isLoggedUser && 
                            <div ref={dotsIconRef}>
                                <SvgDots 
                                className="svg"
                                onClick={() => setShowMenuVisibility(!showMenuVisibility)}/>
                            </div>
                            }
                        </div>
                        {showMenuVisibility && 
                        <div
                        ref={dropMenuRef} 
                        className="wrapper default_padding post_drop_menu">
                            <h3 onClick={() => toggleHidePost()}>{data.hide_post ? "Show Post" : "Hide Post"}</h3>
                            <hr />
                            <h3 onClick={() => deletePost()}>Delete Post</h3>
                        </div>}
                        
                        <div 
                        className="flex"
                        style={{ marginBottom: "10px" }}>
                            <Link to={`/account/${user?.id}`}>
                                <img 
                                src={user?.imgUrl}
                                className="profile_small" />
                            </Link>
                            <Link to={`/account/${user?.id}`}>
                                <h4>{user?.name}</h4>
                            </Link>
                        </div>

                        <p>{data.description}</p>
                        
                        <div 
                        className="flex">
                            <h4>{item?.likes?.length || 0} Likes</h4>
                            <h4>{commentsNumber} Comments</h4>
                            <div
                            onClick={() => likePost()}>
                                <SvgHeart
                                style={{ 
                                    height: "15px",
                                    fill: item?.likes?.includes(loggedUser.id) ? '#F230AA' : 'none', 
                                    stroke: item?.likes?.includes(loggedUser.id) ? "#F230AA" : "#AFADAD" 
                                    }}/>
                            </div>
                        </div>
                        
                    </div>
                </div>
                <div
                className="absolute flex"
                style={{ right: "20px", bottom: "20px" }}>   
                    <CommentBtn 
                    content={{
                        data: data,
                        item: item,
                        user: user,
                        }}
                    commentsNumber={commentsNumber}
                    setCommentsNumber={setCommentsNumber}
                    /> 
                    <ShareBtn 
                    content={data}/>
                </div>
            </section>
        )
    )
    
}