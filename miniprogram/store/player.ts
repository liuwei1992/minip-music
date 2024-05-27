import { Store } from "../modules/event-store/index";

const playerStore = new Store({
  state:{
    test: 'aaa'
  }
})

export default playerStore