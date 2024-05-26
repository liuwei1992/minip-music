// components/ranking-item/index.ts
Component({

  /**
   * 组件的属性列表
   */
  properties: {
    itemData: {
      type: Object,
      value: {}
    },
    key: {
      type: String,
      value: "newRanking"
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
    onItemtap(){
      this.triggerEvent('itemtap', this.properties.key)
    }
  }
})