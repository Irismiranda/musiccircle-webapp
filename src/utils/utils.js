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
      imageUrl: category === "tracks" ? item.album.images[0].url : item.images[0].url,
      isVisible: true,
    }

    if (category === "tracks") {
      listItem.artistName = item.artists[0].name
    }
    
    if(category === "albums") {
      listItem.releaseDate = item.release_date
    }

    return listItem
  })
}

async function playItem(uri){
  const { spotifyApi } = useStore()
  console.log("clicked on item uri:", uri)
  await spotifyApi.play(uri)
}

export { useClickOutside, formatListData, playItem }