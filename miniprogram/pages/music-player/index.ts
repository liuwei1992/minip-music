import playerStore from "../../store/player"

// pages/music-player/index.ts
Page({

  /**
   * 页面的初始数据
   */
  data: {
    
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(query) {
    playerStore.bindBis(this)
    const id = query.id
    playerStore.dispatch('setPlay',id)
  },

  onUnload(){
    playerStore.unBindBis(this)
  },

})