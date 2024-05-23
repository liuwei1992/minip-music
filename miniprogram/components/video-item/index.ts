import { IMVItem } from "../../service/video";

// components/video-item/index.ts
Component({

  /**
   * 组件的属性列表
   */
  properties: {
    itemData:{
      type: Object,
      value: {} as IMVItem
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
    onItemTap(){
      console.log('onItemTap')
    }
  }
})