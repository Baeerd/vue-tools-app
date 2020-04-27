import request from '@/utils/request'

export function getConfigData(data) {
  return request({
    url: '/generator/getConfigData',
    method: 'get',
    data
  })
}

export function downLoadTemplate(data) {
  return request({
    url: '/generator/downLoadTemplate/'+data,
    method: 'post',
    responseType: 'blob'
  })
}

export function getTables(data) {
  return request({
    url: '/generator/getTables',
    method: 'post',
    data
  })
}

export function generatorCode(data) {
  console.log(data);
  return request({
    url: '/generator/generatorCode',
    method: 'post',
    responseType: 'blob',
    data
  })
}
