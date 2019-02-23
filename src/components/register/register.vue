<template>
  <Modal v-model="modal1"
         footer-hide
         title="注册">
    <Form ref="formCustom"
          :model="formCustom"
          :rules="ruleCustom"
          :label-width="80"
          autocomplete='on'
          style="margin-top:30px;">
      <FormItem label="用户名"
                prop="user">
        <Input type="text"
               v-model="formCustom.user"
               placeholder="用户名"></Input>
      </FormItem>
      <FormItem label="密码"
                prop="passwd">
        <Input type="password"
               v-model="formCustom.passwd"></Input>
      </FormItem>
      <FormItem label="确认密码"
                prop="passwdCheck">
        <Input type="password"
               v-model="formCustom.passwdCheck"></Input>
      </FormItem>
      <FormItem label="手机号"
                prop="tel">
        <Input type="text"
               v-model="formCustom.tel"
               placeholder="手机号"></Input>
      </FormItem>
      <FormItem label="Email"
                prop="email">
        <Input v-model="formCustom.email"
               placeholder="邮箱"></Input>
      </FormItem>
      <FormItem label="单位"
                prop="ads">
        <Input type="text"
               v-model="formCustom.ads"
               placeholder="单位"></Input>
      </FormItem>
      <FormItem>
        <Button type="primary"
                @click="handleSubmit('formCustom')">Submit</Button>
        <Button @click="handleReset('formCustom')"
                style="margin-left: 8px">Reset</Button>
      </FormItem>
    </Form>
  </Modal>
</template>
<script>
export default {
  name: 'registerFrom',
  data () {
    const emailFormat = /^(\w+\.?)*\w+@(?:\w+\.)\w+$/
    const telFormat = /^1[345789]\d{9}$/
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
    const validateTel = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('手机号不能为空！'));
      } else if (!telFormat.test(value)) {
        callback(new Error('手机号格式不正确！'))
      } else {
        callback();
      }
    }
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
    // 模拟异步验证效果
    // setTimeout(() => {
    //   if (!Number.isInteger(value)) {
    //     callback(new Error('Please enter a numeric value'));
    //   } else {
    //     if (value < 18) {
    //       callback(new Error('Must be over 18 years of age'));
    //     } else {
    //       callback();
    //     }
    //   }
    // }, 1000);
    return {
      formCustom: {
        user: '',
        passwd: '',
        passwdCheck: '',
        tel: '',
        email: '',
        ads: ''
      },
      modal1: true,
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
  methods: {
    handleSubmit (name) {
      this.$refs[name].validate((valid) => {
        if (valid) {
          this.$Message.success('注册成功!');
        } else {
          this.$Message.error('注册失败！');
        }
      })
    },
    handleReset (name) {
      this.$refs[name].resetFields();
    }
  }
}
</script>
