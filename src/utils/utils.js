import { useEffect } from 'react'
import { placeholder_img } from "../assets"

const useClickOutside = (ref, exceptionRefs, callback) => {
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!ref?.current?.contains(event.target)) {
        if (!exceptionRefs.some((ref) => ref?.current?.contains(event.target))) {
          callback()
        } else if(!exceptionRefs){
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
  console.log("category is", category)

  return items.map(item => {   
    let listItem = {
      id: item.id,
      type: item.type,
      uri: item.uri,
      name: item.type === "user" ? item.display_name : item.name,
      isVisible: true,
    }

    if (category !== "simplified") {
      if (category === "track") {
        listItem.imgUrl = item.album.images[0].url
        listItem.artist_name = item.artists[0].name
        listItem.artist_id = item.artists[0].uri.slice(15)
      } else {
        listItem.imgUrl = item.images[0]?.url ? item.images[0].url : placeholder_img
      }
      
      if(category === "user"){
        listItem.userHandle = item.user_handle
      } 
      
      if(category === "album") {
        listItem.releaseDate = item.release_date
        listItem.artist_name = item.artists[0].name
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