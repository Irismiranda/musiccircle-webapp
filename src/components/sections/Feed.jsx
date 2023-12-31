import React, { useEffect, useState } from "react"
import useStore from "../../store"
import { Axios } from "../../Axios-config"
import { Post } from ".."

export default function Feed(){
    const [index, setIndex] = useState(0)
    const [posts, setPosts] = useState(null)
    
    const { standardWrapperWidth, loggedUser } = useStore()

    async function getPosts(index, user_ids){
        const postsArr = await Axios.post(`api/posts/${index}`, {user_ids: user_ids})

        console.log(postsArr.data)
        setPosts(postsArr.data)
        setIndex(prevIndex => prevIndex + 10)
    }

    useEffect(() => {
        loggedUser && getPosts(index, loggedUser.following)
        console.log(loggedUser.following)
    }, [loggedUser])

    return (
        <div className="wrapper default_padding" style={{ width: standardWrapperWidth }}>
            { posts && posts.map(post => {
                return (
                    <Post 
                    data={post}
                    posts={posts}
                    isLoggedUser={false} 
                    setPosts={setPosts}/>        
                )
            })
            }
        </div>
    )
}