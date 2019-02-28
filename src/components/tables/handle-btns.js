const btns = {
  delete: (h, params, vm) => {
    return h('Poptip', {
      props: {
        confirm: true,
        title: '你确定要解绑此学生吗?'
      },
      on: {
        'on-ok': () => {
          vm.$emit('on-delete', params)
          vm.$emit('input', params.tableData.filter((item, index) => index !== params.row.initRowIndex))
        }
      }
    }, [
      h('Button', {
        props: {
          type: 'success'
        }
      }, [
        h('Icon', {
          props: {
            type: 'md-trash',
            size: 20
          }
        })
      ])
    ])
  }
}

export default btns
