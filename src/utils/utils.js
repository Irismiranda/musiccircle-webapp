import { useEffect } from 'react'
import { placeholder_img } from "../assets"

const useClickOutside = (ref, exceptionRef, callback) => {
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        if(exceptionRef && exceptionRef.current && !exceptionRef.current.contains(event.target)){
          callback()
        } else if(!exceptionRef){
          callback()
        } 
      }
    }

    document.addEventListener('mousedown', handleClickOutside)

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [ref, callback])
}

function formatListData(items, category) {

  return items.map(item => {   
    let listItem = {
      id: item.id,
      type: item.type,
      uri: item.uri,
      name: item.type === "user" ? item.display_name : item.name,
      isVisible: true,
    }

    if (category !== "simplified") {
      if (category === "tracks") {
        listItem.imgUrl = item.album.images[0].url
        listItem.artist_name = item.artists[0].name
        listItem.artist_id = item.artists[0].uri.slice(0, 15)
      } else {
        listItem.imgUrl = item.images[0]?.url ? item.images[0].url : placeholder_img
      }
      
      if(category === "user"){
        listItem.userHandle = item.user_handle
      } 
      
      if(category === "albums") {
        listItem.releaseDate = item.release_date
      }
      
    }
  
    return listItem
  })
}

function setProperties(callback, property, value) {
  callback((prevState) => ({
    ...prevState,
    [property]: value,
  }))
}

export { useClickOutside, formatListData, setProperties }