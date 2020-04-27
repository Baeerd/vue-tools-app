import { getConfigData, downLoadTemplate, getTables, generatorCode } from '@/api/generator/generator'

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

  generatorCode({ commit }, tableName) {
    return new Promise((resolve, reject) => {
      generatorCode({'tableName':tableName}).then(response => {
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

