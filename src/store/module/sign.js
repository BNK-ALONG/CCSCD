import {
  nowSignRecord
} from '@/api/sign'
export default {
  state: {
    signedList: [],
    unSignList: [],
    timeDown: 0
  },
  mutations: {
    setSignedList(state, list) {
      state.signedList = list
    },
    setUnSignList(state, list) {
      state.unSignList = list
    },
    setTimeDown(state, time) {
      state.timeDown = time
    }
  },
  actions: {
    getNowSignRecord({
      commit
    }) {
      return new Promise((resolve, reject) => {
        nowSignRecord().then(res => {
          if (res.status === 200) {
            commit("setSignedList", res.signed_record)
            commit("setUnSignList", res.unsigned_record)
            resolve()
          } else {
            reject(res.message)
          }
        }).catch(err => {
          reject(err)
        })
      })

    }
  }
}
