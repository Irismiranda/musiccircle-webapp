import { create } from 'zustand'

const useStore = create((set, get) => ({
  accessToken: null,
  currentUser: {},
  spotifyApi: null,
  artistUri: null,
  socket: null,
  sideMenuWidth: "200",
  standardWrapperWidth: `calc(100vw - 295px)`,

  setAccessToken: (token) => set({ accessToken: token }),
  setCurrentUser: (user) => set({ currentUser: user }),
  setSpotifyApi: (api) => set({ spotifyApi: api }),
  setArtistUri: (artist) => set({ artistUri: artist }),
  setSideMenuWidth: (menuWidth) => set({ sideMenuWidth: menuWidth }),
  setStandardWrapperWidth: (width) => set({ standardWrapperWidth: `calc(100vw - ${width}px - 30px)` }),
  setSocket: (socket) => set({ socket: socket }),
  
}))

export default useStore
