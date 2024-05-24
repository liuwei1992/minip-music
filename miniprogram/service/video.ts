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

export function getMVUrl(id: number){
  return request.get({
    url: '/mv/url',
    data: {
      id
    }
  })
}

export function getMVInfo(id: number){
  return request.get({
    url: '/mv/detail',
    data: {
      mvid:id
    }
  })
}

export function getMVRelated(id: number){
  return request.get({
    url: '/related/allvideo',
    data: {
      id
    }
  })
}