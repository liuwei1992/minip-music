// components/area-header/index.ts
Component({

  /**
   * 组件的属性列表
   */
  properties: {
    title:{
      type: String
    },
    hasMore:{
      type: Boolean
    }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    onMoreTap(){
      this.triggerEvent("moreclick")
    }
  }
})