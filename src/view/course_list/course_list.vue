<template>
  <div style="width:100%;height:100%;">
    <!-- 导航栏 -->
    <Layout class="layout">
      <Header>
        <Dropdown style="margin-left:1260px;"
                  placement='bottom-start'
                  @on-click="logout">
          <Button type="primary">
            {{userName}}
            <Icon type="ios-arrow-down"></Icon>
          </Button>
          <DropdownMenu slot="list">
            <DropdownItem>个人资料</DropdownItem>
            <DropdownItem disabled>消息</DropdownItem>
            <DropdownItem divided
                          name='logout'>退出登录</DropdownItem>
          </DropdownMenu>
        </Dropdown>
        <span style="margin-left: 30px;"></span>
        <Button type="warning"
                @click="handleBtnRegister">注册</Button>
      </Header>
    </Layout>
    <!-- 内容栏 -->
    <Content class="content">
      <div class="content_div">
        <Icon type="ios-book" />
        <span style="margin-left: 15px;"></span>
        <span>我的课堂</span>
      </div>
    </Content>
    <!-- 课堂列表 -->
    <div class='class_card'>
      <class-card v-for="(classCard,index) in classCards"
                  :key="index"
                  :index="index"
                  :cards="classCards"
                  @deleteCard="deleteCard"></class-card>
    </div>
    <div class="btn_add">
      <Poptip trigger="hover"
              :title="title"
              word-wrap
              width="180"
              placement='top'
              popper-class='poptip_content'>
        <span slot="content"
              style="font-size:16px;">{{content}}</span>
        <Button type="primary"
                shape="circle"
                icon="md-add"
                AddClass-icon="my-add-size"
                style="width:56px;height:56px;font-size: 30px;"
                @click="handleAddClass"></Button>
      </Poptip>
    </div>
    <Modal v-model="modal1"
           footer-hide>
      <span slot="header"
            class="registerHeader">
        <Icon custom='icon_register_title'
              type="ios-information-circle" />
        <span style="margin-left:10px;">添加课堂</span>
      </span>
      <Form ref="formAddClass"
            :model="formAddClass"
            :rules="ruleAddClass"
            :label-width="80"
            autocomplete='on'
            style="margin-top:10px;width:400px;">

        <FormItem prop="className">
          <Icon type="ios-bookmark"
                slot="label"
                custom='icon_classAdd_info' />
          <Input type="text"
                 clearable
                 v-model="formAddClass.className"
                 placeholder="课堂名称" />
        </FormItem>

        <FormItem prop="classIntro">
          <Icon type="md-help"
                slot="label"
                custom='icon_classAdd_info' />
          <Input type="textarea"
                 :autosize="true"
                 clearable
                 v-model="formAddClass.classIntro"
                 placeholder='课堂简介' />
        </FormItem>
        <FormItem prop="classTime">
          <Icon type="md-clock"
                slot="label"
                custom='icon_classAdd_info' />
          <DatePicker type="month"
                      placeholder="选择开课时间"
                      v-model="formAddClass.classTime"
                      @on-change="getClassAddTime"
                      style="width: 200px"></DatePicker>
        </FormItem>
        <FormItem style="text-align: center;">
          <Button type="primary"
                  @click="handleAddClassSubmit('formAddClass')">保存</Button>
          <Button @click="handleReset('formAddClass')"
                  style="margin-left: 40px">一键清空</Button>
        </FormItem>
      </Form>
    </Modal>
  </div>
</template>
<script>
import ClassCard from '@/components/classCard'
import { getClassInfo, classAdd } from '@/api/user'
import { mapActions } from 'vuex'
import { forClassTime } from '@/libs/util'
export default {
  name: "course_list",
  components: {
    ClassCard
  },
  data () {
    return {
      //添加课程列表
      cards: [],
      //添加按钮的气泡提示
      title: '添加课程',
      content: '点击此按钮填写添加课程的信息',

      //是否弹出课程添加的填写信息对话框
      modal1: false,
      //添加课程的信息
      formAddClass: {
        className: '',
        classIntro: '',
        classTime: ''
      },
      ruleAddClass: {
        //课堂名称校验
        className: [
          { required: true, message: '课堂名称不能为空！', trigger: 'blur' }
        ],
        //课堂简介校验
        classIntro: [
          // { required: true, message: '请填写课堂简介', trigger: 'blur' },
          { type: 'string', max: 100, message: '课堂简介不能超过200个字符！', trigger: 'blur' }
        ],
        //开课时间检验
        classTime: [
          { required: true, message: '请选择开课时间', trigger: 'blur', pattern: /.+/ }
        ],

      },
      //开学时间
      classAddTime: '',
      ClassAddYear: '',
      ClassAddMonth: ''
    }
  },
  computed: {
    userName () {
      return this.$store.state.user.token
    },
    classCards () {
      return this.cards
    }
  },
  mounted () {
    this.getClassInfo().then(courseList => {
      this.cards = courseList
    }).catch(error => {
      this.$Modal.error({
        title: '获取课堂列表信息错误！',
        content: error
      })
    })
  },

  methods: {
    //引进action里的方法
    ...mapActions([
      'getClassInfo',
      'logout',
      'handleLogOut'
    ]),


    //退出登录
    logout (name) {
      // 获取下拉列表中name为logout的选项的事件
      if (name === 'logout') {
        this.$Modal.confirm({
          title: '确定退出微云课堂吗',
          onOk: () => {
            //清除本地缓存的Token
            this.handleLogOut().then(res => {
              this.$router.push({
                name: 'login'
              })
              this.$Message.success(res)
            }).catch(error => {
              this.$Message.error(error)
            })

          }
        })
      }
    },
    handleAddClass () {
      this.modal1 = true
    },
    handleAddClassSubmit (name) {
      this.$refs[name].validate((valid) => {
        if (valid) {
          this.modal1 = false
          classAdd({
            get_course_name: this.formAddClass.className.trim(),
            start_time: this.classAddTime,
            brief: this.formAddClass.classIntro
          }).then(res => {
            const message = res.message
            const status = res.status
            if (status === 200) {
              this.cards.push({
                className: this.formAddClass.className.trim(),
                classIntro: this.formAddClass.classIntro,
                classYear: this.ClassAddYear,
                classMonth: this.ClassAddMonth
              })
              this.$Message.success(message)
            } else {
              this.$Modal.error({
                title: '添加失败',
                content: message
              })
            }
          }).catch(error => {
            this.$Modal.error({
              title: '错误！',
              content: error
            })
          })
          // this.$Message.success('添加成功！');
        } else {
          this.$Message.error('添加失败！');
        }
      })
    },
    //清空添加课程的填写信息
    handleReset (name) {
      this.$refs[name].resetFields();
    },
    //添加课程-获取输入框的开学日期
    getClassAddTime (daterange) {
      this.classAddTime = daterange
      this.ClassAddYear = forClassTime(daterange)[0]
      this.ClassAddMonth = forClassTime(daterange)[1]
    },
    //删除课堂
    deleteCard (index) {
      this.cards.splice(index, 1)
    },
    //注册按钮——跳转到登录页面
    handleBtnRegister () {
      this.$Modal.confirm({
        title: '前往登录页',
        content: '前往登陆页面进行注册——>',
        onOk: () => {
          this.$router.push({
            name: 'login'
          })
        }
      })
    },
  }
}
</script>

<style scoped>
@import "./course_list.css";
</style>

