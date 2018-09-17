import modelExtend from 'dva-model-extend'
import _ from 'lodash'
import action from '../../utils/action'
import { model } from '../common'
import { packetGet, packetExtra, packetGrab, packetAssist } from './service'
import delay from "../../utils/delay"

export default modelExtend(model, {
  namespace: 'redPacket',
  state: {
    sharePacket: null,
    packet: null,
  },
  reducers: {},
  effects: {
    *init({ payload }, { call, put }) {
      yield put(action('get'))
    },
    *get({ payload }, { call, put, select }) {
      const sharePacket = yield select(state => state.redPacket.sharePacket)
      const { data } = yield call(packetGet, sharePacket && sharePacket.packetNo)
      yield put(action('save', { packet: data }))
    },
    *grab({ payload }, { call, put }) {
      yield call(packetGrab, payload)
    },
    *clearShare({ payload }, { call, put, select }) {
      const redPacket = yield select(state => state.redPacket)
      const packet = _.cloneDeep(redPacket.packet)
      if (packet.infoView) {
        delete packet.infoView
      }
      yield put(
        action('save', {
          packet,
          sharePacket: null,
        })
      )
    },
    *assist({ payload }, { call, put, select }) {
      const sharePacket = yield select(state => state.redPacket.sharePacket)
      yield call(packetAssist, sharePacket && sharePacket.packetNo)
    },
    *extra({ payload }, { call, put }) {
      const res = yield call(packetExtra, 2)
      yield put(
        action('save', {
          packet: {
            assistRecords: [],
            canGrap: false,
            detailViews: [],
            recordView: {
              packetNo: res.data,
              status: 2,
            },
          },
        })
      )
    },
  },
})
