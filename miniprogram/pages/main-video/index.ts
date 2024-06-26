import { getTopMV } from "../../service/video"

// pages/main-video/index.ts
Page({

  /**
   * 页面的初始数据
   */
  data: {
    offset: 0 as number,
    videoList: [] as any[],
    hasMore: true as boolean
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad() {
    console.log(this)
    this.fetchTopMV()
  },

  async fetchTopMV() {
    const res = await getTopMV(this.data.offset)
    const { data, hasMore } = res
    this.setData({
      videoList: [...this.data.videoList, ...data],
      hasMore: hasMore
    })


    console.log(res)
  },

  onReachBottom(){
    if(this.data.hasMore){
      this.data.offset++
      this.fetchTopMV()
    }
  },

  async onPullDownRefresh(){
    this.setData({
      offset: 0,
      videoList: [],
      hasMore: true
    })

    await this.fetchTopMV()

    wx.stopPullDownRefresh()
  },

})