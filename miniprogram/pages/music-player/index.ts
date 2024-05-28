import playerStore from "../../store/player"
import { lyricItemLineHeight, PlayMode } from "../../utils/const"
const app = getApp()

// pages/music-player/index.ts
Page({

  /**
   * 页面的初始数据
   */
  data: {
    windowHeight: 0,
    sliderValue:0,
    playModeName: PlayMode.ORDER,
    currentPage:1,
    lyricScrollTop: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(query) {
    playerStore.bindBis(this)
    const id = query.id
    playerStore.dispatch('setPlay',id)
    this.setData({
      windowHeight: app.globalData.windowHeight,
      lyricItemLineHeight
    })
  },

  onUnload(){
    playerStore.unBindBis(this)
  },

  swipeToSong(){
    this.setData({ currentPage: 0 })
  },

  swipeToLyric(){
    this.setData({ currentPage: 1 })
  },

  onSwiperChange(event: any){
    const currentPage = event.detail.current
    this.setData({ currentPage })
  },

  onSliderChange(){},

  onSliderChanging(){},

  onModeBtnTap(){
    playerStore.dispatch('changeMode')
  },

  onPrevBtnTap(){
    playerStore.dispatch('changeSong', false)

  },

  onNextBtnTap(){
    playerStore.dispatch('changeSong', true)

  },

  onSongListTap(){
    console.log('onSongListTap 未实现')
  }

})