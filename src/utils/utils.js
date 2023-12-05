import { useEffect } from 'react'

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
      name: item.name,
      imageUrl: category === "top_tracks" ? item.album.images[0].url : item.images[0].url,
      isVisible: true,
    };

    if (category === "top_tracks") {
      listItem.artistName = item.artists[0].name
    }

    return listItem
  })
}

export { useClickOutside, formatListData }