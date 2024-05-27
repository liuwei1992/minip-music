import { request } from "./index"

export function getSongDetail(id: number) {
  return request.get({
    url: "/song/detail",
    data: {
      ids: id
    }
  })
}

export function getSongLyric(id:number) {
  return request.get({
    url: "/lyric",
    data: {
      id
    }
  })
}
