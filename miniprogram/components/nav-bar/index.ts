import { NavBarHeight } from "../../utils/const"

// components/nav-bar/index.ts
const app = getApp()
Component({
  options: {
    multipleSlots: true
  },

  /**
   * 组件的属性列表
   */
  properties: {
    title: {
      type: String,
      value: ''
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    statusHeight: 20,
    navBarHeight: NavBarHeight
  },

  lifetimes: {
    attached() {
      this.setData({
        statusHeight: app.globalData.statusHeight,
      })
    }
  },

  /**
   * 组件的方法列表
   */
  methods: {
    onLeftTap(){
      this.triggerEvent('leftTap')
    }
  }
})