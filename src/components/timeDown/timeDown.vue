<template>
  <div>
    <svg viewBox="0 0 200 200"
         :width="width"
         :height="width">
      <circle cx="100"
              cy="100"
              :r="100 - border / 2"
              fill="none"
              :opacity="opacityEnd"
              :stroke="colorEnd"
              :stroke-width="border" />
      <circle cx="100"
              cy="100"
              :r="100 - border / 2"
              fill="none"
              transform="rotate(270,100,100)"
              :stroke="color"
              :stroke-width="border"
              :stroke-dasharray="dashLen"
              :stroke-dashoffset="dashOffset"
              style="transition: stroke-dashoffset 0.4s;stroke-linecap: round;" />

      <text v-if="isEnd"
            x="100"
            y="100"
            text-anchor="middle"
            :font-size="fontSize + 5"
            :fill="color">
        {{ countDown }}
      </text>
      <text v-if="isEnd"
            x="100"
            y="150"
            text-anchor="middle"
            :font-size="fontSize"
            fill="rgb(81, 90, 110)">
        剩余
      </text>
      <text v-else
            x="100"
            y="100"
            text-anchor="middle"
            :font-size="fontSize"
            fill="rgb(81, 90, 110)">
        签到结束
      </text>

    </svg>
  </div>
</template>

<script>
export default {
  name: 'timeDown',
  props: {
    setTimer: {
      type: Number,
      required: true,
      default: 5 * 60 * 1000
    },
    width: {
      type: Number,
      default: 200
    },
    border: {
      type: Number,
      default: 8
    },
    color: {
      type: String,
      default: '#fcaa55'
    },
    fontSize: {
      type: Number,
      default: 30
    }
  },
  data () {
    return {
      timeLeft: this.setTimer,
      dashLen: (100 - this.border / 2) * Math.PI * 2
    }
  },
  computed: {
    isEnd () {
      return this.timeLeft <= 0 ? false : true

    },
    colorEnd () {
      return this.timeLeft <= 0 ? '#5cb85c' : 'rgb(234, 238, 242)'
    },
    opacityEnd () {
      return this.timeLeft <= 0 ? 1 : 0.4
    },
    countDown () {
      let time = this.timeLeft
      if (time <= 0) {
        this.colorEnd = '#5cb85c'
        this.opacityEnd = 1
        this.isEnd = false
        return '00:00:00'
      } else {
        let result = []
        result.push(Math.floor(time / 3.6e+6))
        result.push(Math.floor(time % 3.6e+6 / 60000))
        result.push(Math.floor(time % 60000 / 1000))
        return result.map(x => x < 10 ? '0' + x : x).join(':')
      }
    },
    dashOffset () {
      return this.dashLen - this.timeLeft / this.setTimer * this.dashLen
    }
  },
  mounted () {
    this.lastDate = Date.now()
    this.interval = setInterval(() => {
      let curDate = Date.now()
      let diff = Math.round((curDate - this.lastDate) / 1000) * 1000
      this.timeLeft -= diff
      if (this.timeLeft <= 0) {
        clearInterval(this.interval)
      }
      if (diff >= 1000) {
        this.lastDate = curDate
      }
    }, 1000)
  }
}
</script>