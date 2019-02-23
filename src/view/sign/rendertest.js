render(h) {
    return h('div', {
      'class': [this.theme, this.accent],
      attrs: {
        id: 'app'
      }
    }, [
      h(hBtn, {
        'class': ['mdui-color-theme-accent']
      }),
      h('ul', {},
        [
          h('li', {
            'class': {
              'text-danger': true
            },
            style: {
              color: 'red';
            }
          }, 'start'),
          this.users.length ?
          this.users.map((key, index) => {
            return h('li', key)
          }) :
          h('li', 'v-if else 这样写'),
          h('li', 'end')
        ]
      ),
      h(hUl, {
        attrs: {
          users: ['user1', 'user2']
        }
      })
    ]); // return end
  },

  render: (h) => {
    return h('div', {
      style: {
        width: 100 % ,
        height: 100 %
      }
    }, [
      h(slider, {
        props: {
          location: poiName
        },
        on: {
          getRadius: (radius) => {
            that.sign_radius = radius
          },
          getInterval: (interval) => {
            that.sign_interval = interval
          }
        }
      }),
      h('div', )
    ])
    h(slider, {
      props: {
        location: poiName
      },
      on: {
        getRadius: (radius) => {
          that.sign_radius = radius
        },
        getInterval: (interval) => {
          that.sign_interval = interval
        }
      }
    })
  },
