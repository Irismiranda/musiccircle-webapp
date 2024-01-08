import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

const useStore = create(devtools((set, get) => ({
  accessToken: null,
  loggedUser: null,
  spotifyApi: null,
  artistUri: null,
  recommendationSeed: {
    ids: null,
    type: null,
  },
  socket: null,
  standardWrapperWidth: `calc(${document.documentElement.clientWidth}px - 269px - 25px)`,
  userTopTracks: null,
  userTopArtists: null,
  playerRef: null,
  currentTrack: null,
  playerState:{ 
      player: undefined,
      isConnected: false,
      deviceId: null,
      isPaused: false,
      isActive: false,
      listened: (0.1),
      shuffleState: false,
      repeatState: false,
      volumePercentage: 1,
      isMute: false,
      isMinimized: false,
      isScrolled: false,
  },
  postCommentsCount: {},

  setAccessToken: (token) => set({ accessToken: token }),
  setLoggedUser: (user) => set({ loggedUser: user }),
  setSpotifyApi: (api) => set({ spotifyApi: api }),
  setArtistUri: (artist) => set({ artistUri: artist }),
  setStandardWrapperWidth: (sideMenuWidth) => set({ 
    standardWrapperWidth: 
    `calc(100vw - ${sideMenuWidth}px - (${window.innerWidth}px - ${document.documentElement.clientWidth}px) - 12.5px)` }), // 12.5px for padding
  setSocket: (socket) => set({ socket: socket }),
  setUserTopTracks: (tracks) => set({ userTopTracks: tracks }),
  setUserTopArtists: (artists) => set({ userTopArtists: artists }),
  setPlayerRef: (ref) => set({ playerRef: ref }),
  setCurrentTrack: (track) => set({ currentTrack: track }),
  setRecommendationSeed: (newSeed) => set((prevState) => ({ 
    ...prevState, 
    recommendationSeed: { 
      ...prevState.newSeed,
      ...newSeed, 
    }, 
  })),
  setPlayerState: (newPlayerState) => set((state) => ({
    ...state,
    playerState: {
      ...state.playerState,
      ...newPlayerState,
    },
  })),
  setPostCommentsCount: (postId, count) => set((state) => ({
    ...state,
    commentsCount: {
      ...state.commentsCount,
      [postId]: count,
    },
  })),
  resetPostCommentsCount: () => set({ commentsCount: {} })
})))

export default useStore
