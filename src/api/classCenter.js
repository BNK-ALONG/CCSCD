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

// 获取历史公告、草稿箱公告和历史答疑的数据
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
    responseType: 'blob',
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

// 上课
export const startClass = ({
  brief,
  title
}) => {
  return axios.request({
    url: '/class_center/start_lesson',
    method: 'post',
    data: {
      brief,
      title
    }
  })
}

// 下课
export const endClass = () => {
  return axios.request({
    url: '/class_center/end_lesson',
    method: 'post'
  })
}
// 随机点人，返回学号和姓名
export const randomStu = () => {
  return axios.request({
    url: '/class_center/random_call',
    method: 'post'
  })
}

// 读秒统计
export const getDuration = () => {
  return axios.request({
    url: '/class_center/get_duration',
    method: 'post'
  })
}
// 获取高频词汇
export const topWord = () => {
  return axios.request({
    url: '/class_center/high_frequency_word',
    method: 'post'
  })
}
// 课堂章节
export const getChapters = () => {
  return axios.request({
    url: '/class_center/get_lesson',
    method: 'post'
  })
}

// 编写答案
export const saveAnswers = ({
  title,
  answer
}) => {
  return axios.request({
    url: '/class_center/put_answer',
    method: 'post',
    data: {
      title,
      answer
    }
  })
}

// 删除答案
export const delAnswers = ({
  answer_id
}) => {
  return axios.request({
    url: '/class_center/delete_answer',
    method: 'post',
    data: {
      answer_id
    }
  })
}


// 进度提示
export const progressPrompt = () => {
  return axios.request({
    url: '/class_center/prompt_message',
    method: 'post'
  })
}


// 创建一节课
export const addChapter = ({
  title,
  brief
}) => {
  return axios.request({
    url: '/class_center/add_chapter',
    method: 'post',
    data: {
      title,
      brief
    }
  })
}

// 删除一节课
export const deleteChapter = ({
  lesson_id
}) => {
  return axios.request({
    url: '/class_center/delete_chapter',
    method: 'post',
    data: {
      lesson_id
    }
  })
}
