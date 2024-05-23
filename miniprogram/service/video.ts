import { request } from "./index";

export interface IMVItem{
  id: number
  cover: string,
  playCount: number,
  mv:{
    videos:{
      duration: number
    }[]
  },
  name: string,
  artistName: string
}
interface ITopMV{
  data: IMVItem[]
  hasMore: boolean
}
export function getTopMV(offset = 0, limit = 20){
  return request.get<ITopMV>({
    url: '/top/mv',
    data:{
      offset,
      limit
    }
  })
}