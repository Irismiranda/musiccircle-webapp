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
     
  console.log("items are:", items)

  return items.map(item => {   
    let listItem = {
      id: item.id,
      type: item.type,
      uri: item.uri,
      imageUrl: item.type === "track" ? item.album.images[0].url : item.images[0].url,
      name: item.name,
      isVisible: true,
    }

    if (category !== "simplified") {
      if (category === "tracks") {
        listItem.imageUrl = item.album.images[0].url
      } else if(category === "albums") {
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