import { Store } from "../modules/event-store/index";
import { getSongDetail, getSongLyric } from "../service/player";
import { parseLyric } from "../utils/lyric";


interface ISong{
  song: any,
  lyric: {[x: number]: string}[]
}

type IPlay=[number, ISong]

const playerStore = new Store({
  state:{
    playList: [] as IPlay[],
    currentIndex: 0,
    currentSong: null
  },
  actions:{
    async fetchSong(_: any, id: number): Promise<IPlay>{
      let song = null
      let lyric = null

      const songRes = await getSongDetail(id)
      song = songRes.songs[0]
      const lyricRes = await  getSongLyric(id)
      const lyricString = lyricRes.lrc.lyric
      lyric = parseLyric(lyricString)

      return [id, {
        song,
        lyric
      }]
    },

    async setPlay(state: any,id:number){
      const index = getSongIndex(state.playList,id)
      if(index == -1){
        const play = await this.fetchSong(state, id)
        state.playList = [...state.playList, play]
        state.currentIndex = state.playList.length - 1
      }else{
        state.currentIndex = index
      }

      state.currentSong = state.playList[state.currentIndex][1]
    }
  }
})

function getSongIndex(playList:IPlay[],id: number): number{
  return playList.findIndex(([playId, _]) => playId == id)
  
}

export default playerStore