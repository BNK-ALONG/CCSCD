<template>
  <div class="drag-list-wrapper">
    <div class="drag-list-con con1">
      <slot name="left-title"></slot>
      <draggable class="drop-box1"
                 :class="dropConClass.left"
                 :options="leftOptions"
                 :value="list1"
                 @input="handleListChange($event, 'left')"
                 @end="handleEnd($event)">
        <div class="drag-list-item"
             v-for="(itemLeft, index) in list1"
             :key="`drag_li1_${index}`">
          <slot name="left"
                :itemLeft="itemLeft"
                :index="index"></slot>
        </div>
      </draggable>
    </div>
    <Divider type="vertical">可拖拽进行修改</Divider>
    <div class="drag-list-con con2">
      <slot name="right-title"></slot>
      <draggable class="drop-box2"
                 :class="dropConClass.right"
                 :options="rightOptions"
                 :value="list2"
                 @input="handleListChange($event, 'right')"
                 @end="handleEnd($event)">
        <div class="drag-list-item"
             v-for="(itemRight, index) in list2"
             :key="`drag_li2_${index}`">
          <slot name="right"
                :itemRight="itemRight">{{ itemRight }}</slot>
        </div>
      </draggable>

    </div>
  </div>

</template>
<script>
import draggable from 'vuedraggable'
export default {
  name: 'DragList',
  components: {
    draggable
  },
  props: {
    list1: {
      type: Array,
      required: true
    },
    list2: {
      type: Array,
      default: () => []
    },
    dropConClass: {
      type: Object,
      default: () => ({})
    }
  },
  data () {
    return {
      leftOptions: { group: 'drag_list', sort: true, disabled: false },
      rightOptions: { group: 'drag_list', sort: true, disabled: false }
    }
  },
  methods: {
    handleListChange (value, type) {
      if (type === 'left') this.$emit('update:list1', value)
      else this.$emit('update:list2', value)
    },
    handleEnd (event) {
      this.$emit('on-change', {
        oldIndex: event.oldIndex,
        newIndex: event.newIndex
      })
    }
  }
}
</script>
<style lang="less">
.drag-list-wrapper {
  height: 100%;
  .drag-list-con {
    width: 45%;
  }
  .con1 {
    float: left;
  }
  .con2 {
    float: right;
  }
}
.ivu-card-body {
  .drop-box {
    border: none !important;
    height: auto !important;
  }
}
.drag-box-card {
  height: auto !important;
  width: 70% !important;
  margin-left: 15%;
  .ivu-divider {
    top: 20px;
    width: 2px;
    height: 10em;
  }
  .ivu-divider-inner-text {
    padding: 0 8px !important;
  }
}
</style>
