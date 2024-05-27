import { NavBarHeight } from "./utils/const"

// app.ts
App<any>({
  globalData: {},
  onLaunch() {
    wx.getSystemInfo({
      success: (res) => {
        const {screenWidth, screenHeight, statusBarHeight} = res
        this.globalData = {
          ...this.globalData,
          screenWidth,
          screenHeight,
          statusBarHeight,
          windowHeight: res.screenHeight - res.statusBarHeight - NavBarHeight
        }
      }
    })
  },
})