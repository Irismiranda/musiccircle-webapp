import React from "react"
import { Link } from "react-router-dom"
import { ToggleFollowBtn } from "../../utils"

export default function UserSearchSection(props){
    const { list, setUserProfileData, setPreventUpdate, showBtn } = props

    console.log(list)

    function toggleTransparency(e){
        setPreventUpdate(true)
        const parentDiv = e.currentTarget.parentElement
        parentDiv.classList.toggle("transparent_section")
    }

    return (
        list && list?.length > 0 ? (
            list.map((user, index) => (
                <section 
                className="list_items_wrapper" 
                style={{ overflowY: list.length > 3 ? "scroll" : ""  }}>
                    <div 
                    className="user_list_grid" 
                    key={user.id}>
                        <Link to={`/account/${user.id}`}>
                            <img 
                            className="profile_medium" 
                            src={user.images[0].url} 
                            alt={`Profile of ${user.display_name}`} />
                        </Link>
                        <Link to={`/account/${user.id}`}>
                            {user.display_name}
                        </Link>
                        {showBtn && <div
                        className="flex" 
                        style={{ justifyContent: "end" }}
                        onClick={(e) => toggleTransparency(e)}>
                            <ToggleFollowBtn 
                            currentUserId={user.id} 
                            setUserProfileData={setUserProfileData} />
                        </div>}
                    </div>
                </section>
            ))
          ) : (
            <h3>Nothing to see here...</h3>
          )
      )
    }      
