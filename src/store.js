import { create } from 'zustand'

const useStore = create((set, get) => ({
  accessToken: null,
  loggedUser: {},
  spotifyApi: null,
  artistUri: null,
  playerState:{ 
      player: undefined,
      deviceId: null,
      isPaused: false,
      isActive: false,
      currentTrack: null,
      reference: null,
      listened: (0.1),
      isLiked: false,
      shuffleState: false,
      repeatState: false,
      volumePercentage: 1,
      isMute: false,
      isMinimized: false,
      isScrolled: false,
  },
  socket: null,
  standardWrapperWidth: `calc(${document.documentElement.clientWidth}px - 269px - 12.5px)`,
  userTopTracks: null,
  userTopArtists: null,

  setAccessToken: (token) => set({ accessToken: token }),
  setLoggedUser: (user) => set({ loggedUser: user }),
  setSpotifyApi: (api) => set({ spotifyApi: api }),
  setArtistUri: (artist) => set({ artistUri: artist }),
  setStandardWrapperWidth: (sideMenuWidth) => set({ standardWrapperWidth: `calc(100vw - ${sideMenuWidth}px - (${window.innerWidth}px - ${document.documentElement.clientWidth}px) - 12.5px)` }), // 25px for padding
  setSocket: (socket) => set({ socket: socket }),
  setUserTopTracks: (tracks) => set({ userTopTracks: tracks }),
  setUserTopArtists: (artists) => set({ userTopArtists: artists }),
  setPlayerState: (newPlayerState) => set((state) => ({
    ...state,
    playerState: {
      ...state.playerState,
      ...newPlayerState,
    },
  })),
  
}))

export default useStore
