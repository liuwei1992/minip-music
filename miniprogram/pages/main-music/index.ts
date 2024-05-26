import { getMusicBanner, getPlaylistDetail, getSongMenuList } from "../../service/music"

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
    isRankingData: false,
    rankingInfos: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad() {
    // this.fetchMusicBanner()
    // this.fetchRecommendSongs()
    this.fetchSongMenuList()
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


  onSearchClick() {
    console.log('onSearchClick')
  },

  onRecommendMoreClick() {
    console.log('onRecommendMoreClick')

  },

  onRecommendItemClick(event: any) {
    console.log('onRecommendItemClick', event.detail.id)

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
    console.log('onRankingTap', event.detail.key)

    wx.navigateTo({
      url: `/pages/detail-song/index?type=ranking&key=${event.detail.key}`,
    })
  }
})