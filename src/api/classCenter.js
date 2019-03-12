import axios from '@/libs/api.request'

// 获取词云的单词数据
export const wordCloud = () => {
  return axios.request({
    url: '/class_center/word_cloud',
    method: 'post'
  })
}

// 直接发布新公告
export const sendNewNotice = ({
  content,
  title
}) => {
  return axios.request({
    url: '/documents/push_notice',
    method: 'post',
    data: {
      content,
      title
    }
  })
}

// 获取历史公告和草稿箱公告的数据
export const getAllNotice = () => {
  return axios.request({
    url: '/documents/notice_info',
    method: 'post'
  })
}

// 删除历史公告
export const delNoticeById = ({
  notice_uid
}) => {
  return axios.request({
    url: '/documents/delete_notice',
    method: 'post',
    data: {
      notice_uid
    }
  })
}

// 保存为草稿箱公告
export const saveDraftNotice = ({
  title,
  content
}) => {
  return axios.request({
    url: '/documents/put_notice',
    method: 'post',
    data: {
      title,
      content
    }
  })
}

//发布草稿箱的公告
export const sendDraftNotice = ({
  notice_uid
}) => {
  return axios.request({
    url: '/documents/change_notice',
    method: 'post',
    data: {
      notice_uid
    }
  })
}

// 展示导入文件
export const showFileList = () => {
  return axios.request({
    url: '/class_center/file_info',
    method: 'post'
  })
}
// 点击展示按钮
export const showOneFile = ({
  file_name_uuid
}) => {
  return axios.request({
    url: '/class_center/show_file',
    method: 'post',
    data: {
      file_name_uuid
    }
  })
}
// 导出文件
export const exportFile = ({
  file_name_uuid
}) => {
  return axios.request({
    url: '/class_center/file_out',
    method: 'post',
    data: {
      file_name_uuid
    }
  })
}

// 读秒统计
export const getDuration = () => {
  return axios.request({
    url: '/class_center/get_duration',
    method: 'post'
  })
}
