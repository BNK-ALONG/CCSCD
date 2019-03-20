<template>
  <div class="card">
    <header class="card__thumb">
      <div :style="{background:`#${color}`}"
           class="card-background"><span> {{cards[index].className}}</span></div>
    </header>
    <!-- <Button shape="circle">{{index}}</Button> -->
    <div class="card__date">
      <span class="card__date__day">{{cards[index].classYear}}</span>
      <br />
      <span class="card__date__month">{{cards[index].classMonth}}</span>
    </div>
    <div class="card__body">
      <div class="card__category">{{cards[index].classId}}</div>
      <h2 class="card__title">{{cards[index].className}}</h2>
      <p>课程编号：{{cards[index].classId}}，开学时间：{{cards[index].classTime}}</p>
      <div class="card__description">
        <p>{{cards[index].classIntro}}</p>
        <div class="box_btn">
          <Button type="success"
                  @click="sendClassId(cards[index].classId)">上课</Button>
          <span class="left-dt"></span>
          <Button type="error"
                  @click="modal2 = true">删除</Button>
          <Modal v-model="modal2"
                 width="400"
                 style="top:20%">
            <p slot="header"
               style="color:#f60;text-align:center">
              <Icon type="ios-information-circle"></Icon>
              <span>删除确认</span>
            </p>
            <div style="text-align:center">
              <p>删除课堂之后，所有课堂相关的数据以及文件将被永久删除</p>
              <p>您是否考虑清楚？</p>
            </div>
            <div slot="footer">
              <Button type="error"
                      size="large"
                      long
                      :loading="modal_loading"
                      @click="del">{{btn_text}}</Button>
            </div>
          </Modal>
        </div>
      </div>

    </div>

    <footer class="card__footer">

    </footer>
  </div>
</template>

<script>
import { courseLogin } from '@/api/user'
import { mapActions } from 'vuex'
export default {
  name: "classCard",

  props: {
    index: {
      type: Number,
      required: true,
    },
    cards: {
      classId: {
        type: String,
        required: true
      },
      className: {
        type: String,
        required: true
      },
      classIntro: {
        type: String,
        default: "课堂简介为空，介绍一下",
        required: false
      },
      classYear: {
        type: Number,
        required: true
      },
      classMonth: {
        type: String,
        required: true
      }
    },
    // color: {
    //   type: String
    // }
  },
  data () {
    return {
      modal2: false,
      modal_loading: false,
      btn_text: '忍心删除',
      colorArr: ['4D2C37', 'F4B56B', '9E8C89', 'EADDCE', '3F88EB', '4O4F68', 'D1D9DE', '3AAB87']
    }
  },
  computed: {
    color () {
      let index = Math.floor(Math.random() * this.colorArr.length + 1) - 1
      return this.colorArr[index]
    }
  },
  methods: {
    ...mapActions([
      'getClassName',
      'getQRbs64',
      'getClassNumber'
    ]),
    del () {
      this.modal_loading = true;
      this.btn_text = '删除中...'
      setTimeout(() => {
        // this.modal_loading = true;
        this.modal2 = false;
        this.$Message.success('删除成功！');
        this.$emit('deleteCard', this.index)
      }, 2000);
      setTimeout(() => {
        this.btn_text = '忍心删除'
      }, 2001)
    },
    sendClassId (classId) {
      this.getClassName({ course_id: classId }).then(message => {
        this.getQRbs64()
        this.$router.push({
          name: '_home'
        })
        //课堂登入成功时候，把message打印出来
        this.$Notice.success({
          title: message,
          desc: ''
        })
      }).catch(error => {
        this.$Modal.error({
          title: '课堂进入失败！',
          content: error
        })
      })

    }
  },
}
</script>

<style>
/* @import "./../../../static/css/card.css"; */
@import "./card.css";
</style>
