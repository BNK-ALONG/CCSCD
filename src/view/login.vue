<template>
  <div id="particles">
    <div class="container-login100"
         style="width:auto">
      <div class="wrap-login100">
        <div class="login100-form validate-form">

          <span class="login100-form-title">登录</span>

          <div class="wrap-input100 validate-input"
               data-validate="请输入用户名"
               style="margin-bottom:23px;">
            <span class="label-input100">用户名</span>
            <Icon type="ios-contact"
                  :custom='IconUser' />
            <input class="input100 input_user"
                   type="text"
                   v-model="userid"
                   placeholder="请输入用户名"
                   autocomplete="off"
                   @focus="IconUserFocus"
                   @blur="IconUserBlur">

            <span class="focus-input100"></span>
          </div>

          <div class="wrap-input100 validate-input"
               data-validate="请输入密码">
            <span class="label-input100">密码</span>
            <Icon type="ios-lock"
                  :custom='IconPassword' />
            <input class="input100 input_password"
                   type="password"
                   v-model="password"
                   placeholder="请输入密码"
                   @focus="IconPasswordFocus"
                   @blur="IconPasswordFBlur">

            <span class="focus-input100"></span>
          </div>

          <div class="text-right">
            <a href="javascript:">忘记密码？</a>
          </div>

          <div class="container-login100-form-btn">
            <div class="wrap-login100-form-btn">
              <div class="login100-form-bgbtn"></div>
              <button class="login100-form-btn"
                      style="letter-spacing:20px;"
                      @click="handleLoginSubmit">登 录</button>
            </div>
          </div>

          <div class="txt1">
            <span>第三方登录</span>
          </div>

          <div class="flex-c-m">
            <div class="login100-social-item bg1"
                 @click="handleOtherLogin">
            </div>
            <div class="login100-social-item bg2"
                 @click="handleOtherLogin">
            </div>
            <div class="login100-social-item bg3"
                 @click="handleOtherLogin">
            </div>
          </div>

        </div>
        <div class="container-login100-form-btn"
             style="width: 150px;margin-left: 120px;margin-top: 20px;height: 40p">
          <div class="wrap-login100-form-btn">
            <div class="login100-form-bgbtn"></div>
            <button class="login100-form-btn"
                    style="font-size:18px"
                    @click="handleRegisterBtn">注 册</button>
          </div>
        </div>
      </div>
    </div>
    <Modal v-model="modal1"
           footer-hide>
      <span slot="header"
            class="registerHeader">
        <Icon custom='icon_register_title'
              type="ios-information-circle" />
        <span style="margin-left:10px;">注册</span>
      </span>
      <Form ref="formCustom"
            :model="formCustom"
            :rules="ruleCustom"
            :label-width="80"
            autocomplete='on'
            style="margin-top:10px;">
        <FormItem prop="user">
          <Icon type="md-person"
                slot="label"
                custom='icon_register_info' />
          <Input type="text"
                 clearable
                 v-model="formCustom.user"
                 placeholder="用户名" />
        </FormItem>
        <FormItem prop="passwd">
          <Icon type="md-lock"
                slot="label"
                custom='icon_register_info' />
          <Input type="password"
                 clearable
                 v-model="formCustom.passwd"
                 placeholder='密码' />
        </FormItem>
        <FormItem prop="passwdCheck">
          <Icon type="md-lock"
                slot="label"
                custom='icon_register_info' />
          <Input type="password"
                 clearable
                 v-model="formCustom.passwdCheck"
                 placeholder='确认密码' />
        </FormItem>
        <FormItem prop="tel">
          <Icon type="md-call"
                slot="label"
                custom='icon_register_info' />
          <Input type="text"
                 clearable
                 v-model="formCustom.tel"
                 placeholder="手机号" />
        </FormItem>
        <FormItem prop="name">
          <Icon type="ios-person"
                slot="label"
                custom='icon_register_info' />
          <Input type="text"
                 clearable
                 v-model="formCustom.name"
                 placeholder="姓名" />
        </FormItem>
        <FormItem prop="email">
          <Icon type="md-mail"
                slot="label"
                custom='icon_register_info' />
          <Input v-model="formCustom.email"
                 clearable
                 placeholder="邮箱" />
        </FormItem>
        <FormItem prop="ads">
          <Icon type="ios-navigate"
                slot="label"
                custom='icon_register_info' />
          <Input type="text"
                 clearable
                 v-model="formCustom.ads"
                 placeholder="单位" />
        </FormItem>
        <FormItem style="text-align: center;">
          <Button type="primary"
                  @click="handleRegisterSubmit('formCustom')">注册</Button>
          <Button @click="handleRegisterReset('formCustom')"
                  style="margin-left: 40px">一键清空</Button>
        </FormItem>
      </Form>
    </Modal>
  </div>
</template>
<script>
import { mapActions } from 'vuex'
import particles from 'particles.js'
import particlesJSON from 'particles.js/demo/particles.json'
// import registerFrom from '@/components/register'
import {
  login,
  register
} from '@/api/user'

export default {
  name: 'login',
  data () {
    const emailFormat = /^(\w+\.?)*\w+@(?:\w+\.)\w+$/
    const telFormat = /^1[345789]\d{9}$/
    //validatePass和validatePassCheck验证条件：1.不能为空 2.两者必须相等
    const validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('密码不能为空！'));
      } else {
        if (this.formCustom.passwdCheck !== '') {
          // 对第二个密码框单独验证
          this.$refs.formCustom.validateField('passwdCheck');
        }
        callback();
      }
    };
    const validatePassCheck = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码！'));
      } else if (value !== this.formCustom.passwd) {
        callback(new Error('两次密码不匹配！'));
      } else {
        callback();
      }
    };
    //手机号验证
    const validateTel = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('手机号不能为空！'));
      } else if (!telFormat.test(value)) {
        callback(new Error('手机号格式不正确！'))
      } else {
        callback();
      }
    }
    //邮箱验证
    const validateEmail = (rule, value, callback) => {
      if (!value) {
        callback(new Error('邮箱不能为空'))
      }
      if (!emailFormat.test(value)) {
        callback(new Error('请输入正确的邮箱!'))
      } else {
        callback()
      }
    }
    return {
      // 登录表单：
      userid: '', //用户名
      password: '',//密码
      IconUser: 'icon_ios-contact  icon_color_blur',   //用户名图标的默认样式
      IconPassword: 'icon_ios-lock  icon_color_blur',  //密码的默认样式
      //注册表单：
      modal1: false,
      formCustom: {
        user: '', //用户名
        passwd: '', //密码
        passwdCheck: '',  //确认密码
        tel: '', //手机号
        email: '',  //邮箱
        ads: '',//单位
        name: ''
      },
      //注册信息的校验

      ruleCustom: {
        user: [
          { required: true, message: '用户名不能为空！', trigger: 'blur' }
        ],
        passwd: [
          { required: true, validator: validatePass, trigger: 'blur' }
        ],
        passwdCheck: [
          { required: true, validator: validatePassCheck, trigger: 'blur' }
        ],
        tel: [
          { required: true, validator: validateTel, trigger: 'blur' }
        ],
        email: [
          { required: true, validator: validateEmail, trigger: 'blur' }
        ]
      }
    }
  },
  //生命周期函数
  mounted () {
    this.initParticles()  //调用粒子动画方法
  },

  methods: {
    //注册一个action
    // ...mapActions([
    //   'login',
    //   'register'
    // ]),
    initParticles () {
      window.particlesJS("particles", particlesJSON)
    },
    //用户名输入框获取焦点后图标的变化
    IconUserFocus () {
      this.IconUser = 'icon_ios-contact  icon_color_focus'
    },
    //用户名输入框失去焦点后图标的变化
    IconUserBlur () {
      this.IconUser = 'icon_ios-contact  icon_color_blur'
    },
    //密码输入框获取焦点后图标的变化
    IconPasswordFocus () {
      this.IconPassword = 'icon_ios-lock  icon_color_focus'
    },
    //密码输入框失去焦点后图标的变化
    IconPasswordFBlur () {
      this.IconPassword = 'icon_ios-lock  icon_color_blur'
    },
    //提交登陆信息，并调用login()方法
    handleLoginSubmit () {
      if (!this.userid || !this.password) {
        this.$Modal.warning({
          title: '登陆错误',
          content: '请输入用户名和密码！'
        })
      } else {
        //登录时弹出加载框，但由于连接服务器太快，没有必要了
        // const loadings = this.$Message.loading({
        //   content: '用户信息验证中...',
        //   duration: 0
        // })
        login({
          userName: this.userid,
          password: this.password
        }).then(res => {
          const message = res.message
          const status = res.status
          if (status === 200) {
            this.$router.push({
              name: 'course_list',
              //以参数的形式将用户名传到课堂页（course_list）
              query: {
                userName: this.userid
              }
            })
            //登陆成功时候，把message打印出来
            this.$Message.success(message)
          } else {
            this.$Modal.error({
              title: '登录失败',
              content: message
            })
          }
        }).catch(error => {
          this.$Modal.error({
            title: '错误！',
            content: error
          })
        })
      }
    },
    //第三方登录方法
    handleOtherLogin () {
      this.$Modal.warning({
        title: '此路不通！',
        content: '第三方登录尚未开发，敬请期待！'
      })
    },
    //点击注册按钮弹出对话框
    handleRegisterBtn () {
      this.modal1 = true
    },
    //提交注册信息
    handleRegisterSubmit (name) {
      this.$refs[name].validate((valid) => {
        if (valid) {
          register({
            userName: this.formCustom.user,
            password: this.formCustom.passwd,
            name: this.formCustom.name,
            workplace: this.formCustom.ads,
            number: this.formCustom.tel,
            email: this.formCustom.email
          }).then(res => {
            const message = res.message
            const status = res.status
            if (status === 200) {

              this.$router.push({
                name: 'index',
                //以参数的形式将用户名传到课堂页（index）
                query: {
                  userName: this.formCustom.user
                }
              })
              this.$Message.success(message)
            } else {
              this.$Modal.error({
                title: '注册失败！',
                content: message
              })
            }

          }).catch(error => {
            this.$Modal.error({
              title: '错误！',
              content: error
            })
          })
        } else {
          this.$Message.error('注册失败！');
        }
      })
    },
    //清空注册输入框
    handleRegisterReset (name) {
      this.$refs[name].resetFields();
    }
  }
}
</script>
<style>
@import "./../../static/css/main.css";
</style>
