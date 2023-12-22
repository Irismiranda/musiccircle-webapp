import React from "react"
import { Link } from "react-router-dom"
import { ToggleFollowBtn } from "../../utils"

export default function UserSearchSection(props){
    const { list, setUserProfileData, setPreventUpdate, showBtn } = props

    function toggleTransparency(e){
        setPreventUpdate(true)
        const parentDiv = e.currentTarget.parentElement
        parentDiv.classList.toggle("transparent_section")
    }

    return (
        <section style={{ overflowY: list.length > 3 ? "scroll" : ""  }}>
            {list && list.length > 0 ? (
                list.map((user, index) => (
                    <div className="list_items_wrapper" key={user.id}>
                        <div className="user_list_grid">
                            <Link to={`/account/${user.id}`}>
                                <img
                                    className="profile_medium"
                                    src={user.imageUrl}
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
                    </div>
                ))
            ) : (
                <h3>Nothing to see here...</h3>
            )}
        </section>
    );
    }      
