<template>
  <div class="test">
    <div id="container"
         class="map"
         tabindex="0"></div>
    <div id="pickerBox">
      <!-- 原高德地图的搜索框组件 -->
      <!-- <div>
        <input id="pickerInput"
               placeholder="输入关键字选取签到地点" />
      </div> -->

      <!-- vue-amap 的搜索组件 -->
      <div class="el-vue-search-box-container search-box">
        <div class="search-box-wrapper">
          <input type="text"
                 id="pickerInput" />
          <span class="search-btn">搜索</span>
        </div>
      </div>

      <!-- iview的搜索框组件 -->
      <!-- <Input element-id="pickerInput"
             search
             enter-button="搜索"
             placeholder="输入关键字选取签到地点" /> -->
    </div>

    <!-- <Input search
             enter-button
             placeholder="输入关键字选取签到地点" /> -->
    <div id="poiInfo"></div>
  </div>
</template>
<script>
import MapLoader from '@/assets/js/AMap.js'
import slider from '_c/slider'

export default {
  name: 'test',
  components: { slider },
  data () {
    return {
      map: null,
      sign_raduis: 20,
      sign_interval: 5,
      locationRemark: ''
      // pickerInput: 'pickerInput'
    }
  },
  mounted () {
    let that = this
    MapLoader().then(AMap => {
      that.map = new AMap.Map('container', {
        // 地图中心点坐标值
        center: [114.335422, 30.5114957],
        // zoom缩放级别
        zoom: 17,
        zooms: [3, 20],
        expandZoomRange: true
      })
      // 单击地图时获取点的坐标值
      initAMapUI()// 初始化高德地图的UI组件库
      // 加载PoiPicker搜索输入框提示的UI组件
      AMapUI.loadUI(['misc/PoiPicker'], function (PoiPicker) {
        var poiPicker = new PoiPicker({
          // city:'北京',
          input: 'pickerInput'
        })
        // 初始化poiPicker
        poiPickerReady(poiPicker)
      })
      // 初始化地理编码与逆地理编码类
      var geocoder = new AMap.Geocoder({
        radius: 5, // 范围，单位：米，默认：500
        extensions: 'all' // 逆地理编码时，返回信息的详略，默认为base
      })

      function promise (lnglat) {
        return new Promise((resolve, reject) => {
          geocoder.getAddress(lnglat, function (status, result) {
            if (status === 'complete' && result.regeocode) {
              let pois = result.regeocode.pois
              if (pois.length) {
                let poiName = pois[pois.length - 1].name
                resolve(poiName)
              } else {
                reject(new Error('请选择有标志性的地标或有图标的建筑！'))
              }
            } else {
              reject(JSON.stringify(result))
            }
          })
        })
      }

      function getSignData (lnglat) {
        promise(lnglat).then(poiName => {
          that.$Modal.confirm({
            title: '定位确定',
            width: 600,
            okText: '发布签到',
            // content: '确定在：<br>' + poiName + '<br>进行签到吗？'
            render: (h) => {
              return h(slider, {
                props: {
                  location: poiName
                },
                on: {
                  getRadius: (radius) => {
                    that.sign_radius = radius
                  },
                  getInterval: (interval) => {
                    that.sign_interval = interval
                  },
                  locationRemark: (locationRemark) => {
                    that.locationRemark = locationRemark
                  }
                }
              })
            },
            onOk: () => {
              // 如果用户没有备注则，自动备注为在地图上选址的地标
              if (that.locationRemark === '') {
                console.log('父备注:', poiName)
              } else {
                console.log('父备注:', that.locationRemark)
              }
              console.log('父组件---半径：', that.sign_radius)
              console.log('父组件---时间间隔：', that.sign_interval)

              // 提交签到数据到后台
            }

          })
        }).catch(error => {
          that.$Modal.error({
            title: '定位错误',
            content: error
          })
        })
      }
      /*       function getPoiName (lnglat) {
              geocoder.getAddress(lnglat, function (status, result) {
                if (status === 'complete' && result.regeocode) {
                  let pois = result.regeocode.pois
                  let poiName = pois[pois.length - 1].name
                  // return poisName
                  console.log(poiName)
                  that.locationName = poiName
                  console.log(that.locationName)
                } else {
                  console.log(JSON.stringify(result))
                }
              })
              // return poisName
            } */
      var marker = new AMap.Marker({
        map: that.map,
        animation: 'AMAP_ANIMATION_NONE',
        draggable: true,
        title: '拖动标定可选址'

        // raiseOnDrag: true //点标记有离地的效果
        // offset: new AMap.Pixel(-13, -30)
      })
      var circle = new AMap.Circle({
        map: that.map
      })
      // 定义和加载poiPicker
      function poiPickerReady (poiPicker) {
        window.poiPicker = poiPicker
        // 实例一个高德地图的信息窗体对象
        // var infoWindow = new AMap.InfoWindow({
        //   offset: new AMap.Pixel(0, -20)
        // })
        // 输入关键词，实时提示定位
        poiPicker.on('poiPicked', function (poiResult) {
          var poi = poiResult.item
          // 搜索结果POI信息的变量初始化
          // var source = poiResult.source
          // var info = {
          //   source: source,
          //   id: poi.id,
          //   name: poi.name,
          //   location: poi.location.toString(),
          //   address: poi.address
          // }
          that.locationName = poi.name
          // console.log(that.locationName)

          marker.setPosition(poi.location)
          circle.setCenter(poi.location)
          circle.setRadius(20)
          // 搜索结果POI信息的展示
          // infoWindow.setMap(that.map)
          // infoWindow.setPosition(poi.location)
          // infoWindow.setContent('POI信息: <pre>' + JSON.stringify(info, null, 2) + '</pre>')
          // infoWindow.open(that.map, marker.getPosition())
          that.map.setCenter(marker.getPosition())
          that.map.setZoom(20)
          getSignData(marker.getPosition())
        })
        // 默认的搜索关键词，为了界面好看，暂时不启用
        // poiPicker.onCityReady(function () {
        //   poiPicker.suggest('大学')
        // })
      }
      // 点击地图实例 点标记和圆移动
      that.map.on('click', function (e) {
        // console.log('点击了地图中的：', e.lnglat.toString())
        marker.setPosition(e.lnglat)
        circle.setCenter(marker.getPosition())
        circle.setRadius(10)
        that.map.setZoom(20)
        that.map.setCenter(e.lnglat)
        // getPoiName(e.lnglat)
        getSignData(e.lnglat)
      })
      // 拖拽点标记，圆和地图中心随之移动
      marker.on('dragend', function (e) {
        let lnglat = marker.getPosition()
        circle.setCenter(lnglat)
        circle.setRadius(10)
        that.map.setCenter(lnglat)
        that.map.setZoom(20)
        getSignData(lnglat)
        // console.log(JSON.stringify(e.lnglat))
        // promise(lnglat).then(poiName => {
        //   that.$Modal.confirm({
        //     title: '定位确定',
        //     content: '确定在：<br>' + poiName + '<br>进行签到吗？'
        //   })
        // }).catch(error => {
        //   that.$Modal.error({
        //     title: '定位错误',
        //     content: error
        //   })
        // })
      })
    }, e => {
      console.log('地图加载失败', e)
    })
  }
}
</script>
<style>
.vuep-scoped-3 .search-box {
  /* position: absolute; */
  position: fixed;
  top: 25px;
  right: 20px;
}
.el-vue-search-box-container {
  /* position: relative; */
  height: 45px;
  background: #fff;
  box-shadow: 0 2px 2px rgba(0, 0, 0, 0.15);
  border-radius: 2px 3px 3px 2px;
  z-index: 10;
}
.search-box-wrapper {
  position: absolute;
  display: flex;
  align-items: center;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
}
input {
  flex: 1;
  height: 20px;
  line-height: 20px;
  letter-spacing: 0.5px;
  font-size: 14px;
  text-indent: 10px;
  box-sizing: border-box;
  border: none;
  outline: none;
  background-color: white;
  background-color: transparent;
  /* 让input输入框在输入时不会被浏览器改变颜色 */
  /* 背景色透明  生效时长  过渡效果  启用时延迟的时间 */
  transition: background-color 50000s ease-in-out 0s;
}
.search-btn {
  width: 45px;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  cursor: pointer;
  color: #34495e;
  font-size: 15px;
}
.test,
#container {
  width: 100%;
  height: 100%;
  margin: 0px;
  font-size: 13px;
}

#pickerBox {
  position: absolute;
  /* z-index: 9999; */
  top: 20%;
  right: 30px;
  width: 300px;
}

/* #pickerInput {
 width: 100%;
  padding: 5px 5px;
  height: 30px;
  line-height: 50px;
  border: 1px solid rgba(34, 43, 95, 0.79);
  background: rgba(21, 24, 68, 0.5);
  display: inline-block;
  width: 100%;
  color: #fff;
  box-sizing: border-box;
  border-radius: 40px;
  text-align: center;
  font-size: 18px !important;
  transition: all 0.4s;
}*/

#poiInfo {
  background: #fff;
}

.amap_lib_placeSearch .poibox.highlight {
  background-color: #cae1ff;
}

.amap_lib_placeSearch .poi-more {
  display: none !important;
}
.amap-ui-poi-picker-sugg-container .dock-bottom {
  top: 35px !important;
}
</style>
