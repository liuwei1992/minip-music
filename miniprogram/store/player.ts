import { StreamReader } from "XrFrame/core/utils";
import { Store } from "../modules/event-store/index";
import { getSongDetail, getSongLyric } from "../service/player";
import { PlayMode } from "../utils/const";
import { parseLyric } from "../utils/lyric";

export const audioContext = wx.createInnerAudioContext()
let bindedPlaying = false

type ILyric = [number, string][]

interface ISong {
  song: any,
  lyric: ILyric,
  id: number
}

type IPlay = [number, ISong]


interface IState {
  playList: IPlay[],
  currentIndex: number,
  currentSong: ISong,
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
    currentLyricIndex: 0,
    playMode: PlayMode.ORDER,
    isPlaying: true
  },
  actions: {
    setPlayList(state, list: any[]){
      const playList = list.map(item=>{
        return [item.id, null]
      })
      state.playList = playList as IPlay[]
      console.log('state.playList',state.playList)
    },
    async setPlay(state, id: number) {
      const index = getSongIndexById(state.playList, id)
      
      if (index == -1 || state.playList[index][1]==null) {
        const currentSong = await fetchSong(state, id)
        state.playList = [...state.playList, [id, currentSong]]
        state.currentIndex = state.playList.length - 1
      } else {
        state.currentIndex = index
      }

      state.currentSong = state.playList[state.currentIndex][1]

      this.play(state, id)
    },

    async setPlayByIndex(state, index: number) {
      if (index === state.currentIndex) {
        audioContext.seek(0)
        state.currentTime = 0
        state.currentLyricIndex = 0
        return
      }

      let [id, currentSong] = state.playList[index]
      if (!currentSong) {
        currentSong = await fetchSong(state, id)
      }
      this.play(state, id)
      
      state.currentIndex = index
      state.currentSong = currentSong
      state.currentTime = 0
      state.currentLyricIndex = 0
    },

    changeSong(state, isNext: boolean) {
      switch (state.playMode) {
        case PlayMode.REPEAT:
        case PlayMode.ORDER:
          const nextIndex = getRealIndex(isNext ? state.currentIndex - 1 : state.currentIndex + 1, state.playList.length-1)
          this.setPlayByIndex(state, nextIndex)
          break;
        case PlayMode.RANDOM:
          const index = Math.floor(Math.random() * state.playList.length)
          this.setPlayByIndex(state, index)
          break

      }


    },

    changeMode(state) {
      audioContext.loop = false
      if (state.playMode === PlayMode.ORDER) {
        state.playMode = PlayMode.RANDOM
      } else if (state.playMode === PlayMode.RANDOM) {
        state.playMode = PlayMode.REPEAT
        audioContext.loop = true
      } else if (state.playMode === PlayMode.REPEAT) {
        state.playMode = PlayMode.ORDER
      }
    },

    play(state, id: number) {
      audioContext.autoplay = true
      audioContext.src = `https://music.163.com/song/media/outer/url?id=${id}.mp3`
      if (!bindedPlaying) {
        this.onPlaying(state)
      }
    },

    changePlayStatus(state) {
      if (state.isPlaying) {
        audioContext.pause()
      } else {
        audioContext.play()
      }

      state.isPlaying = !state.isPlaying
    },

    onPlaying(state) {
      bindedPlaying = true

      audioContext.onTimeUpdate(() => {
        const currentTime = audioContext.currentTime * 1000

        const index = getLyricIndex(currentTime, state.currentSong.lyric)
        console.log('index')
        state.currentTime = currentTime
        state.currentLyricIndex = index
      })

      audioContext.onEnded(() => {
        this.changeSong(state, true)
      })
    }
  }

})

function getLyricIndex(currentTime: number, lyric: ILyric) {
  const index = lyric.findIndex(([time]) => time > currentTime)
  return index > 0 ? (index - 1) : index
}

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
    lyric,
    id
  }
}

function getSongIndexById(playList: IPlay[], id: number): number {
  return playList.findIndex(([playId, _]) => playId == id)
}

export default playerStore