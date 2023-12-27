import React from "react"
import { Link } from "react-router-dom"
import { ToggleFollowBtn } from "../../utils"
import { UserList } from ".."

export default function UserSearchSection(props){
    const { list, setUserProfileData, setPreventUpdate, showBtn } = props
    console.log("user list it", UserList)

    function toggleTransparency(e){
        setPreventUpdate(true)
        const parentDiv = e.currentTarget.parentElement
        parentDiv.classList.toggle("transparent_section")
    }

    return (
        <section className="list_items_wrapper">
            {list && list.length > 0 ? (
                list.map((user, index) => (
                    <div className="user_list_grid">
                        <Link to={`/account/${user.id}`}>
                            <img
                                className="profile_medium"
                                src={user.imgUrl}
                                alt={`Profile of ${user.name}`}
                            />
                        </Link>
                        <Link to={`/account/${user.id}`}>
                            <h3>
                                {user.name}
                                <br />
                                <span className="user_handle">
                                    @{user.userHandle}
                                </span>
                            </h3>
                        </Link>
                        {showBtn && (
                            <div
                                className="flex"
                                style={{ justifyContent: "end" }}
                                onClick={(e) => toggleTransparency(e)}
                            >
                                <ToggleFollowBtn
                                    currentUserId={user.id}
                                    setUserProfileData={setUserProfileData}
                                />
                            </div>
                        )}
                    </div>  
                ))
            ) : (
                <h3>Nothing to see here...</h3>
            )}
        </section>
    );
    }      
