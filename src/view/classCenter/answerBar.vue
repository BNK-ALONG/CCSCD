<template>

  <Card title="本课程的提问热榜"
        style="margin-top:20px;">
    <chart-cate :option="option"
                :style="{height: `${height}px`}"></chart-cate>
  </Card>

</template>
<script>
import { ChartCate } from '_c/charts'

export default {
  name: 'AnswerBar',
  components: {
    ChartCate
  },
  props: {
    option: {
      type: Object,
      default: () => { }
    },
    height: {
      type: Number,
      default: 250
    }
  },

}
</script>