import { getMVInfo, getMVRelated, getMVUrl } from "../../service/video"

// pages/detail-video/index.ts
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: 0 as any,
    mvSrc: '',
    mvInfo: {},
    relatedVideo:[],
    danmuList:[
      { text: "这是一条弹幕", color: "#ff0000", time: 3 },
      { text: "这是另外一条弹幕", color: "#ff00ff", time: 30 },
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    const id = options.id
    this.setData({ id })

    this.fetchMVUrl()
    this.fetchMVInfo()
    this.fetchMVRelated()
  },


  async fetchMVUrl(){
    const res = await getMVUrl(this.data.id)
    const url = res?.data?.url
    if(url){
      this.setData({
        mvSrc:url
      })
    }
  },

  async fetchMVInfo(){
    const res = await getMVInfo(this.data.id)
    this.setData({ mvInfo: res?.data ?? {} })
  },

  async fetchMVRelated(){
    const res = await getMVRelated(this.data.id)
    this.setData({ relatedVideo: res?.data ?? []})
  }
  
})