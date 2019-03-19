// export default function MapLoader () { // <-- 原作者这里使用的是module.exports
//   return new Promise((resolve, reject) => {
//     if (window.AMap) {
//       resolve(window.AMap)
//     } else {
//       var script = document.createElement('script')
//       script.type = 'text/javascript'
//       script.async = true
//       script.src = 'http://webapi.amap.com/maps?v=1.3&callback=initAMap&key=39c2bdc3f3e760172337d94058852e4f'
//       script.onerror = reject
//       document.head.appendChild(script)
//     }
//     window.initAMap = () => {
//       resolve(window.AMap)
//     }
//   })
// }
export default function MapLoader () {
  const key = '39c2bdc3f3e760172337d94058852e4f'
  const p1 = new Promise(function (resolve, reject) {
    window.init = function () {
      resolve(AMap)
    }
    let script = document.createElement('script')
    script.type = 'text/javascript'
    script.src = '//webapi.amap.com/maps?v=1.4.12&key=' + key + '&callback=init&plugin=AMap.Geocoder'
    script.onerror = reject
    document.head.appendChild(script)
  })
  const p2 = new Promise(function (resolve, reject) {
    let script2 = document.createElement('script')
    script2.type = 'text/javascript'
    script2.src = '//webapi.amap.com/ui/1.0/main-async.js'
    script2.onerror = reject
    script2.onload = function (su) {
      // console.log('script2-------onload', su)
      resolve()
    }
    document.head.appendChild(script2)
  })
  return Promise.all([p1, p2])
    .then(function (result) {
      // console.log('result----------->', result)
      return result[0]
    }).catch(e => {
      console.log(e)
    })
}
