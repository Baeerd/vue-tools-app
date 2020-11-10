import { getConfigData, downLoadTemplate, getTables, generatorCode, getTableDetail, getJdbcConfig, saveJdbcConfig } from '@/api/generator/generator'

const state = {
}


const actions = {
  // user login
  getConfigData() {
    return new Promise((resolve, reject) => {
      getConfigData().then(response => {
        resolve(response)
      }).catch(error => {
        reject(error)
      })
    })
  },

  downLoadTemplate({ commit }, fileName) {
    return new Promise((resolve, reject) => {
      downLoadTemplate(fileName).then(response => {
        resolve(response)
      }).catch(error => {
        reject(error)
      })
    })
  },

  getTables({ commit }, params) {
    return new Promise((resolve, reject) => {
      getTables(params).then(response => {
        resolve(response)
      }).catch(error => {
        reject(error)
      })
    })
  },

  generatorCode({ commit }, params) {
    return new Promise((resolve, reject) => {
      generatorCode(params).then(response => {
        resolve(response)
      }).catch(error => {
        reject(error)
      })
    })
  },

  getTableDetail({ commit }, params) {
    return new Promise((resolve, reject) => {
      getTableDetail(params).then(response => {
        resolve(response)
      }).catch(error => {
        reject(error)
      })
    })
  },

  getJdbcConfig({ commit }, params) {
    return new Promise((resolve, reject) => {
      getJdbcConfig(params).then(response => {
        resolve(response)
      }).catch(error => {
        reject(error)
      })
    })
  },

  saveJdbcConfig({ commit }, params) {
    return new Promise((resolve, reject) => {
      saveJdbcConfig(params).then(response => {
        resolve(response)
      }).catch(error => {
        reject(error)
      })
    })
  },

}

export default {
  namespaced: true,
  actions
}

