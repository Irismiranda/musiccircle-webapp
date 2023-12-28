        import React, { useEffect, useState, createRef } from "react"
        import { v4 as uuidv4 } from 'uuid'
        import { SvgPinned, SvgSendBtn } from "../../assets"
        import { EmojiBar, Messages } from "../index"
        import useStore from "../../store"

        export default function Chat(){
            const messageTextArea = createRef(null)
            const { artistUri, spotifyApi, loggedUser, socket, standardWrapperWidth } = useStore()
            const [chatState, setChatState] = useState({
                    artistData: null,
                    artistId: null,
                    chatId: null,
                    isPinned: false,
                })

            function setChatProperties(property, value){
                setChatState((prevState) => ({
                    ...prevState,
                    [property]: value,
                }))
            }

            useEffect(() => {
                async function getArtistData(id) {
                    setChatProperties('artistId', id)
                    try{
                        const artist = await spotifyApi.getArtist(id)
                        const newArtistData = {
                            artistName: artist.name,
                            profilePic: artist.images[1].url,
                            id:id
                        }
                        setChatProperties('artistData', newArtistData)
                    } catch(err){
                        console.log(err)
                    }
                }

    
            if(!chatState.isPinned && artistUri){
                const newId = artistUri.replace("spotify:artist:", "")

                getArtistData(newId)
                
                }
            }, [artistUri, chatState.isPinned])

            useEffect(() => {
                socket?.once('gotChat', (newChatId) => {
                    setChatProperties('chatId', newChatId)
                }) 
            }, [socket])

            async function sendMessage() {
                const { chatId, artistId } = chatState
                if (messageTextArea.current.value.trim()){
                    const newMessage = {
                    messageId: `${loggedUser.id}_${chatId}_${uuidv4()}`,
                    id: artistId,
                    chatId: chatId,
                    userId: loggedUser.id,
                    text: messageTextArea.current.value,
                    userName: loggedUser.display_name,
                    userProfilePic: loggedUser.images[0].url,
                    timeStamp: new Date().toLocaleString(),
                    display: true,
                }
                
                socket?.emit('sendMessage', newMessage )

                messageTextArea.current.value = ""

                }
            }
                    
            if(chatState.artistData){
                const { artistId, artistData, isPinned } = chatState
                const { artistName, profilePic} = artistData
                return (
                    <div className="wrapper default_padding" style={{ width: standardWrapperWidth }}>
                        <div className="flex space_between">
                            <div className="flex gap">
                                <img src={profilePic} alt={artistName} className="profile_medium"/>
                                <h2>{artistName} Live Chat</h2>
                            </div>
                            <div onClick={() => setChatProperties('isPinned', !isPinned)} className="svg">
                                <SvgPinned className="svg_medium pinned" is_pinned={isPinned ? "true" : "false"} style={{ fill: isPinned ? '#AFADAD' : 'none', }}/>
                            </div> 
                        </div>
                        <Messages 
                        chatId={chatState.chatId} 
                        chatProfileId={artistId} 
                        type={"artist"} 
                        key={chatState.chatId}/>
                        <div className="flex relative">
                            <textarea id="chatInput" ref={messageTextArea} placeholder={`Say something nice to other ${artistName} fans...`} onKeyDown={(e) => {
                                if (e.key === "Enter" && !e.shiftKey) {
                                    e.preventDefault()
                                    sendMessage()
                                }
                            }}>
                            </textarea>
                            <div className="input_menu_wrapper">
                                <EmojiBar
                                textAreaRef={messageTextArea}/>
                                <div onClick={() => sendMessage()}>
                                    <SvgSendBtn className="sendBtn"/>
                                </div>
                            </div>
                        </div>
                    </div>
                )
            } else return null
        }