// [00:00.000] 作词 : 林达浪
// [00:01.000] 作曲 : 林达浪
// return [{time: text}]
const timeReg = /(\d{2}):(\d{2}).(\d{2,3})]/g
export function parseLyric(str:string){
  if(!str) return []

  const lyrics = []

  const lines = str.split('\n')

  for(const line of lines){
    if(!line) continue

    const times = timeReg.exec(line)
    if(!times) continue
  
    const time = Number(times[1]) * 60 * 1000 + Number(times[2]) * 1000 + Number(times[2].padEnd(3,'0')) 
    lyrics.push({
      [time]: line.replace(timeReg, '')
    })
  }

  return lyrics
}