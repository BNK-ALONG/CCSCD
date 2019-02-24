<template>
  <div>
    <span style="font-size: 18px;">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;在{{location}}</span>
    <span class="slider-text">半径：<span style="font-size: 35px;">{{slider_radius}} </span>米</span>
    <!-- 滑块和图标的封装 -->
    <div class="slider-div">
      <!-- 减号图标 -->
      <div class="slider-icon">
        <Icon type="md-remove"
              @click.native="handleSRadiusDown" />
      </div>
      <!-- 半径的滑块 -->
      <Slider v-model="slider_radius"
              show-tip="always"
              :max="radius_max"
              :min="radius_min"
              @on-change="radius"
              style="flex: 1;max-width: calc(100% - (24px*2) - (12px*2));margin-left: 12px;">
      </Slider>
      <!-- 加号图标 -->
      <div class="slider-icon m-l-12">
        <Icon type="md-add"
              @click.native="handleSRadiusUp" />
      </div>
    </div>

    <span class="slider-text">时间间隔：<span style="font-size: 35px;">{{slider_interval}} </span> 分钟</span>
    <!-- 滑块和图标的封装 -->
    <div class="slider-div">
      <!-- 减号图标 -->
      <div class="slider-icon">
        <Icon type="md-remove"
              @click.native="handleSIntervalDown" />
      </div>
      <!-- 时间间隔的滑块 -->
      <Slider v-model="slider_interval"
              show-tip="always"
              :max="interval_max"
              :min="interval_min"
              @on-change="interval"
              style="flex: 1;max-width: calc(100% - (24px*2) - (12px*2));margin-left: 12px;">
      </Slider>
      <!-- 加号图标 -->
      <div class="slider-icon m-l-12">
        <Icon type="md-add"
              @click.native="handleSIntervalUp" />
      </div>
    </div>
    <div class="location-remask slider-text">
      <Input v-model="locationRemark"
             size="large"
             element-id="location-input"
             prefix="ios-navigate-outline"
             placeholder="备注此签到的教室"
             style="width: 488px;height:36px;"
             @on-blur="handleInputValue" /></div>
  </div>
</template>
<script>
export default {
  name: 'slider',
  data () {
    return {
      interval_max: 60,
      interval_min: 3,
      radius_max: 100,
      radius_min: 5,
      slider_radius: 20,
      slider_interval: 5,
      isSubmit: false,
      locationRemark: ''
    }
  },
  props: {
    location: {
      type: String,
      default: '在此位置'
    }
  },
  mounted () {
    this.$emit('getRadius', this.slider_radius)
    this.$emit('getInterval', this.slider_interval)

  },
  methods: {

    radius () {
      this.$emit('getRadius', this.slider_radius)
      // console.log('子组件---半径：', this.slider_radius)
    },
    interval () {
      this.$emit('getInterval', this.slider_interval)
      // console.log('子组件---时间间隔：', this.slider_interval)
    },
    // 点击加号图标，滑块增加10
    handleSRadiusUp () {
      let step = 10
      if (this.slider_radius + step > this.radius_max) {
        this.slider_radius = this.radius_max
      } else {
        this.slider_radius += step
      }
      this.$emit('getRadius', this.slider_radius)
      // console.log('子组件签到半径是：', this.slider_radius)
    },
    // 点击减号图标，滑块减少10
    handleSRadiusDown () {
      let step = 10
      if (this.slider_radius - step < this.radius_min) {
        this.slider_radius = this.radius_min
      } else {
        this.slider_radius -= step
      }
      this.$emit('getRadius', this.slider_radius)
      // console.log('子组件签到半径是：', this.slider_radius)
    },
    // 点击加号图标，滑块增加5
    handleSIntervalUp () {
      let step = 5
      if (this.slider_interval + step > this.interval_max) {
        this.slider_interval = this.interval_max
      } else {
        this.slider_interval += step
      }
      this.$emit('getInterval', this.slider_interval)
      // console.log('子组件的时间间隔是：', this.slider_interval)
    },
    // 点击减号图标，滑块减少5
    handleSIntervalDown () {
      let step = 5
      if (this.slider_interval - step < this.interval_min) {
        this.slider_interval = this.interval_min
      } else {
        this.slider_interval -= step
      }
      this.$emit('getInterval', this.slider_interval)
      // console.log('子组件的时间间隔是：', this.slider_interval)
    },
    // 输入框失去焦点时，获取input的值
    handleInputValue () {
      this.$emit('locationRemark', this.locationRemark)
    }
  }
}
</script>
<style>
.slider-icon {
  font-size: 24px;
  /* flex子元素平均分栏 */
  -webkit-flex: 1;
  -ms-flex: 1;
  flex: 1;
  max-width: fit-content;
  cursor: pointer;
}
.m-l-12 {
  margin-left: 12px;
}
.slider-div {
  display: flex;
  align-items: flex-start;
  margin-top: 28px;
}
.slider-text {
  /* 父元素-横向排列（主轴） */
  display: -webkit-box;
  display: -ms-flexbox; /* TWEENER - IE 10 */
  /*display: -webkit-flex; /*NEW - Chrome
  display: flex;  这个会使得所有的子元素无论大小中心都处在主轴上*/
  /* 父元素-横向换行 */
  /* -webkit-flex-wrap: wrap;
  -moz-flex-wrap: wrap;
  -ms-flex-wrap: wrap;
  -o-flex-wrap: wrap;
  flex-wrap: wrap; */

  /* 父元素-水平居中（主轴是横向才生效） */
  -webkit-justify-content: center;
  -moz-justify-content: center;
  -ms-justify-content: center;
  -o-justify-content: center;
  justify-content: center;
  align-items: center;
  /* 其它取值如下：
    align-items     主轴原点方向对齐，即中心点在主轴上对齐
    flex-end        主轴延伸方向对齐
    space-between   等间距排列，首尾不留白
    space-around    等间距排列，首尾留白
   */
  font-size: 18px;
}
/* 自定义滑块的样式 */
.ivu-slider-button:hover {
  border-color: #57a3f3 !important;
}
.ivu-slider-button {
  background-color: #57a3f3 !important;
}
.ivu-slider-button-dragging {
  border-color: #57a3f3 !important;
}
/* 地点备注 */
.location-remask {
  margin-top: 5%;
  width: 100%;
  height: auto;
  font-size: 18px;
}
#location-input {
  border-radius: 13px;
  border: 1.5px solid #57a3f3;
}
#location-input:focus {
  border: none;
}
.ivu-input-wrapper-large .ivu-input-prefix i {
  font-size: 24px !important;
}
</style>
