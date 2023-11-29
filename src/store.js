import { create } from 'zustand'

const useStore = create((set, get) => ({
  accessToken: null,
  currentUser: {},
  spotifyApi: null,
  artistUri: null,
  socket: null,
  standardWrapperWidth: `calc(100vw - 295px)`,
  isComponentLoading: true,

  setAccessToken: (token) => set({ accessToken: token }),
  setCurrentUser: (user) => set({ currentUser: user }),
  setSpotifyApi: (api) => set({ spotifyApi: api }),
  setArtistUri: (artist) => set({ artistUri: artist }),
  setStandardWrapperWidth: (sideMenuWidth) => set({ standardWrapperWidth: `calc(${document.documentelement.clientwidth}px - ${sideMenuWidth}px - 25px)`}), // 25px for padding
  setSocket: (socket) => set({ socket: socket }),
  setIsComponentLoading: (state) => set({isContentLoading: state}),
}))

export default useStore
