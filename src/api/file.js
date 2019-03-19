import axios from '@/libs/api.request'

// 从后台获取文件列表
export const getFileList = () => {
  return axios.request({
    url: '/documents/file_info',
    method: 'post'
  })
}

// 文件的导入或者分享接口
export const ShareOrImport = ({
  statusType,
  file_name_uuid,
  status
}) => {
  if (statusType == '分享') {
    var ShareStatus = status
    return axios.request({
      url: '/documents/share_file',
      method: 'post',
      data: {
        file_name_uuid,
        ShareStatus
      }
    })
  } else {
    var NowStatus = status
    return axios.request({
      url: '/documents/file_into',
      method: 'post',
      data: {
        file_name_uuid,
        NowStatus
      }
    })
  }
}

// 下载文件流
export const downloadBlob = (data, file) => {
  if (!data) {
    return
  }
  let url = window.URL.createObjectURL(new Blob([data]))
  let link = document.createElement('a')
  link.style.display = 'none'
  link.href = url
  link.setAttribute('download', file)
  document.body.appendChild(link)
  link.click()
}

// 批量下载和删除
export const DownloadOrDelete = ({
  type,
  file_name_uuid
}) => {
  if (type === '下载') {
    return axios.request({
      url: '/documents/download_file',
      method: 'post',
      // 请求返回的类型要设置为arraybuffer或者blob
      responseType: 'blob',
      data: {
        file_name_uuid
      }
    })
  } else {
    return axios.request({
      url: '/documents/delete_file',
      method: 'post',
      data: {
        file_name_uuid
      }
    })
  }
}

// 获取学生信息
export const getTableData = () => {
  return axios.request({
    url: '/documents/student_info',
    method: 'post'
  })
}

// 解绑学生
export const deleteStu = ({
  stuid
}) => {
  return axios.request({
    url: '/documents/delete_student',
    method: 'post',
    data: {
      stuid
    }
  })
}

// 获取下载学生模板的文件流
export const downloadStuModel = () => {
  return axios.request({
    url: '/documents/student_model',
    method: 'post',
    responseType: 'blob'
  })
}


// 文件下载量
export const downloadNumber = () => {
  return axios.request({
    url: '/documents/download_file_num',
    method: 'post'
  })
}
