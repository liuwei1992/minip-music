import { isObject } from "./utils"

interface IOptions<S> {
  state: IState,
  actions?: IActions<S>
}

interface IState {
  [p: string]: any
}

type IActionsFun<S> = (state: S, ...args: any[]) => void

interface IActions<S> {
  [p: string]: IActionsFun<S>
}

class EventStore<S extends IState> {
  state:S = {} as S
  actions: IActions<S> | null = null

  private bis:any[] = []
  private _updated = false
  private _stateEvent = {} as any

  constructor(options: IOptions<S>) {
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

      if(target[key] === newValue) return true

      this._updated = false
      // 合并执行wx.setDate
      Promise.resolve().then(()=>{
        this._setData()
      })

      const events = this._stateEvent[key]
      events?.forEach((cb: Function) => {
        cb(newValue)
      });

      target[key] = newValue
      return true
    }
  }

  onState(statekey: string, cb: Function){
    const events = this._stateEvent[statekey] || []
    events.push(cb)
    this._stateEvent[statekey] = events
  }

  offState(statekey: string, cb: Function){
    const events = this._stateEvent[statekey]
    if(events){
      deleteEvent(events, cb)
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

function deleteEvent(events: Function[], cb: Function){
  const index = events.findIndex(item => item == cb)
  events.slice(index, 1)
}

export default EventStore