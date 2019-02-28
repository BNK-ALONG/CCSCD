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
