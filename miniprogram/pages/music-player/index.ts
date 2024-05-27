import playerStore from "../../store/player"
const app = getApp()

// pages/music-player/index.ts
Page({

  /**
   * 页面的初始数据
   */
  data: {
    windowHeight: 0,
    currentLyricText: '歌词'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(query) {
    playerStore.bindBis(this)
    const id = query.id
    playerStore.dispatch('setPlay',id)
    this.setData({
      windowHeight: app.globalData.windowHeight
    })
  },

  onUnload(){
    playerStore.unBindBis(this)
  },

  swipeToSong(){

  },

  swipeToLyric(){

  }

})