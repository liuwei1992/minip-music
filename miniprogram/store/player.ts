import { Store } from "../modules/event-store/index";
import { getSongDetail, getSongLyric } from "../service/player";
import { PlayMode } from "../utils/const";
import { parseLyric } from "../utils/lyric";


interface ISong {
  song: any,
  lyric: [number, string][]
}

type IPlay = [number, ISong]


interface IState {
  playList: IPlay[],
  currentIndex: number,
  currentSong: any,
  currentTime: number,
  currentLyricIndex: number,
  playMode: PlayMode,
  isPlaying: boolean
}

const playerStore = new Store<IState>({
  state: {
    playList: [] as IPlay[],
    currentIndex: 0,
    currentSong: null,
    currentTime: 0,
    currentLyricIndex:0,
    playMode: PlayMode.ORDER,
    isPlaying: false
  },
  actions: {
    async setPlay(state, id: number) {
      const index = getSongIndexById(state.playList, id)
      if (index == -1) {
        const currentSong = await fetchSong(state, id)
        state.playList = [...state.playList, [id, currentSong]]
        state.currentIndex = state.playList.length - 1
      } else {
        state.currentIndex = index
      }

      state.currentSong = state.playList[state.currentIndex][1]
    },

    async setPlayByIndex(state, index: number){
      let [id, currentSong] = state.playList[index]
      if(!currentSong){
        currentSong = await fetchSong(state, id)
      }
      state.currentIndex = index
      state.currentSong = currentSong
    },

    changeSong(state, isNext: boolean) {
      switch (state.playMode) {
        case PlayMode.ORDER:
          const nextIndex = getRealIndex(isNext ? state.currentIndex - 1 : state.currentIndex + 1, state.playList.length)
          this.setPlayByIndex(state, nextIndex)
            break;
        case PlayMode.RANDOM:
          break
        case PlayMode.REPEAT:
          break
      }


    },

    changeMode(state) {
      if (state.playMode === PlayMode.ORDER) {
        state.playMode = PlayMode.RANDOM
      } else if (state.playMode === PlayMode.RANDOM) {
        state.playMode = PlayMode.REPEAT
      } else if (state.playMode === PlayMode.REPEAT) {
        state.playMode = PlayMode.ORDER
      }
    }
  }
})

function getRealIndex(index: number, lastIndex: number) {
  if (index > lastIndex) {
    return 0
  } else if (index == -1) {
    return lastIndex
  } else {
    return index
  }
}

async function fetchSong(_: IState, id: number): Promise<ISong> {
  let song = null
  let lyric = null

  const songRes = await getSongDetail(id)
  song = songRes.songs[0]
  const lyricRes = await getSongLyric(id)
  const lyricString = lyricRes.lrc.lyric
  lyric = parseLyric(lyricString)

  return {
    song,
    lyric
  }
}

function getSongIndexById(playList: IPlay[], id: number): number {
  return playList.findIndex(([playId, _]) => playId == id)
}

export default playerStore