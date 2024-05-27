import { getMusicBanner, getPlaylistDetail, getSongMenuList } from "../../service/music"
import { rankingsMap } from "../../utils/const"

const RecomendSongsTypeId = 3778678
// pages/main-music/index.ts
Page({

  /**
   * 页面的初始数据
   */
  data: {
    banners: [],
    recommendSongs: [],
    hotMenuList: [],
    recMenuList: [],
    rankingInfos: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad() {
    this.fetchMusicBanner()
    this.fetchRecommendSongs()
    this.fetchSongMenuList()
    this.fetchRankingData()
  },

  async fetchSongMenuList() {
    getSongMenuList().then(res => {
      this.setData({ hotMenuList: res.playlists })
    })
    getSongMenuList("华语").then(res => {
      this.setData({ recMenuList: res.playlists })
    })
  },

  async fetchRecommendSongs() {
    [].slice()
    const res = await getPlaylistDetail(RecomendSongsTypeId)
    this.setData({
      recommendSongs: res.playlist.tracks.slice(0, 6)
    })
  },

  async fetchMusicBanner() {
    const res = await getMusicBanner()
    this.setData({ banners: res.banners })
  },

  async fetchRankingData(){
    const rankingInfos:any = []
    const ps: Promise<any>[] = []
    rankingsMap.forEach(([_, id]) =>{
      ps.push(getPlaylistDetail(id))
    })

    const res = await Promise.all(ps)

    res.forEach(res=>{
      rankingInfos.push(res.playlist)
    })

    this.setData({
      rankingInfos
    })
  },


  onSearchClick() {
    console.log('onSearchClick')
  },

  onRecommendMoreClick() {
    console.log('onRecommendMoreClick')

  },

  onRecommendItemClick(event: any) {
    console.log('onRecommendItemClick', event.detail.id)
    wx.navigateTo({
      url: `/pages/music-player/index?id=${event.detail.id}`,
    })

  },

  toMenuDetail() {
    wx.navigateTo({
      url: '/pages/detail-menu/index',
    })
  },

  onHotAndRecItemClick(event: any) {
    console.log('onHotAndRecItemClick', event.detail.id)
  },

  onRankingTap(event:any) {
    console.log('onRankingTap', event.detail)

    wx.navigateTo({
      url: `/pages/detail-song/index?type=ranking&id=${event.detail.id}`,
    })
  }
})