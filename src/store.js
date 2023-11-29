import { create } from 'zustand'

const useStore = create((set, get) => ({
  accessToken: null,
  currentUser: {},
  spotifyApi: null,
  artistUri: null,
  socket: null,
  standardWrapperWidth: `calc(100vw - 295px)`,
  isComponentLoading: null,

  setAccessToken: (token) => set({ accessToken: token }),
  setCurrentUser: (user) => set({ currentUser: user }),
  setSpotifyApi: (api) => set({ spotifyApi: api }),
  setArtistUri: (artist) => set({ artistUri: artist }),
  setStandardWrapperWidth: (sideMenuWidth) => set({ standardWrapperWidth: `calc(100vw - ${sideMenuWidth}px - (${window.innerWidth}px - ${document.documentElement.clientWidth}px) - 25px)` }), // 25px for padding
  setSocket: (socket) => set({ socket: socket }),
  setIsComponentLoading: (state) => set({isContentLoading: state}),
}))

export default useStore
