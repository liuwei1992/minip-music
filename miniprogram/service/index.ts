import { BASEURL } from "./config"

class Request {
  constructor(private baseUrl: string) { }

  request<T>(options: WechatMiniprogram.RequestOption) {
    const { url } = options
    return new Promise<T>((resolve, reject) => {
      wx.request<T>({
        ...options,
        url: this.baseUrl + url,
        success: (res) => {
          if(res.data){
            resolve(res.data)
          }else{
            console.log('request success err', res)
            reject(res)
          }
          
        },
        fail: (err) => {
          console.log('request err', err)
          reject(err)
        }
      })
    })
  }

  get<T=any>(options: WechatMiniprogram.RequestOption) {
    return this.request<T>({
      ...options,
      method: 'GET'
    })
  }

  post<T=any>(options: WechatMiniprogram.RequestOption) {
    return this.request<T>({
      ...options,
      method: 'POST'
    })
  }
}

export const request = new Request(BASEURL)

