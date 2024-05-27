import { isObject } from "./utils"

interface IOptions {
  state: IState,
  actions?: IActions
}

interface IState {
  [p: string]: any
}

interface IActions {
  [p: string]: Function
}

class EventStore {
  state:IState = {}
  actions: IActions | null = null

  private bis:any[] = []
  private _updated = false

  constructor(options: IOptions) {
    if (!isObject(options.state)) {
      throw new TypeError("the state must be object type")
    }

    if (options.actions && isObject(options.actions)) {
      const values = Object.values(options.actions)
      for (const value of values) {
        if (typeof value !== "function") {
          throw new TypeError("the value of actions must be a function")
        }
      }
      this.actions = options.actions
    }

    this._observe(options.state)

  }

  private _observe(state: IState){
    const _state = new Proxy(state, this._handler);
    this.state = _state
  }

  private _setData(){
    if(!this._updated){
      this._updated = true
      
      const data:any = {}
      Object.getOwnPropertyNames(this.state).forEach(key => {
        data[key] = this.state[key]
      })

      this.bis.forEach((bi: any) => {
        bi.setData(data)
      })
    }
  }

  private _handler = {
    get: function (target:any, key: PropertyKey) {
      return target[key]
    },

    set: (target: any, key: PropertyKey, newValue: any)=>{
      // this.bis.forEach(bi => {
      //   bi.setData({
      //     [key]: newValue
      //   })
      // })
      this._updated = false
      // 合并执行wx.setDate
      Promise.resolve().then(()=>{
        this._setData()
      })

      target[key] = newValue
      return true
    }
  }

  bindBis(bi:any){
    this.bis.push(bi)
  }

  unBindBis(bi:any){
    if(this.bis[bi]){
      delete this.bis[bi]
    }
  }

  dispatch(actionName: string, ...args: any[]){
    this.actions?.[actionName]?.(this.state,...args)
  }

}

export default EventStore