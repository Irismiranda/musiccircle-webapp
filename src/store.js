import { create } from 'zustand'

const useStore = create((set, get) => ({
  accessToken: null,
  currentUser: {},
  spotifyApi: null,
  artistUri: null,
  socket: null,
  standardWrapperWidth: `calc(100vw - 295px)`,

  setAccessToken: (token) => set({ accessToken: token }),
  setCurrentUser: (user) => set({ currentUser: user }),
  setSpotifyApi: (api) => set({ spotifyApi: api }),
  setArtistUri: (artist) => set({ artistUri: artist }),
  setStandardWrapperWidth: (width) => set({ standardWrapperWidth: `${width}px` }),
  setSocket: (socket) => set({ socket: socket }),
  
}))

export default useStore
