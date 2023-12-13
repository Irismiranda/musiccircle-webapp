import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

const useStore = create(devtools((set, get) => ({
  accessToken: null,
  loggedUser: {},
  spotifyApi: null,
  artistUri: null,
  seedTrackId: null,
  socket: null,
  standardWrapperWidth: `calc(${document.documentElement.clientWidth}px - 269px - 25px)`,
  userTopTracks: null,
  userTopArtists: null,
  playerState:{ 
      player: undefined,
      isConnected: false,
      deviceId: null,
      isPaused: false,
      isActive: false,
      currentTrack: null,
      listened: (0.1),
      isLiked: false,
      shuffleState: false,
      repeatState: false,
      volumePercentage: 1,
      isMute: false,
      isMinimized: false,
      isScrolled: false,
  },

  setAccessToken: (token) => set({ accessToken: token }),
  setLoggedUser: (user) => set({ loggedUser: user }),
  setSpotifyApi: (api) => set({ spotifyApi: api }),
  setArtistUri: (artist) => set({ artistUri: artist }),
  setStandardWrapperWidth: (sideMenuWidth) => set({ standardWrapperWidth: `calc(100vw - ${sideMenuWidth}px - (${window.innerWidth}px - ${document.documentElement.clientWidth}px) - 12.5px)` }), // 12.5px for padding
  setSocket: (socket) => set({ socket: socket }),
  setUserTopTracks: (tracks) => set({ userTopTracks: tracks }),
  setUserTopArtists: (artists) => set({ userTopArtists: artists }),
  setSeedTrackId: (id) => set({ seedTrackId: id }),
  setPlayerState: (newPlayerState) => set((state) => ({
    ...state,
    playerState: {
      ...state.playerState,
      ...newPlayerState,
    },
  })),
  
})))

export default useStore
