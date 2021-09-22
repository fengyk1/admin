import Http from './http'
import {httpUrl} from '../constants'

import { getStorage } from '../utils/storage'


export default new Http({
  baseURL: httpUrl,
  timeout:1000,
  headers:{
    'Content-Type': 'application/json;charset=utf-8',
    'token': getStorage('token')
  }
})
