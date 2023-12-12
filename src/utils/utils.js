import { useEffect } from 'react'
import useStore from "../store"

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
  const itemsArray = Array.isArray(items) ? items : Object.values(items)
  return items.map(item => {
    let listItem = {
      id: item.id,
      uri: item.uri,
      name: item.name,
      isVisible: true,
    }

    if (category === "tracks") {
      listItem.artistName = item.artists[0].name
    }
    
    if(category === "albums") {
      listItem.releaseDate = item.release_date
    }

    if (item.album.images && item.album.images.length > 0) {
      listItem.imageUrl = item.album.images[0].url;
    }

    if (item.images && item.images.length > 0) {
      listItem.imageUrl = item.images[0].url;
    }

    return listItem
  })
}

export { useClickOutside, formatListData }