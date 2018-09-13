import modelExtend from 'dva-model-extend'

export const model = {
  reducers: {
    save(state, { payload }) {
      return {
        ...state,
        ...payload,
      }
    },
  },
}

export const listPageModel = modelExtend(model, {
  state: {
    list: [],
    filter: {
      isEnd: false,
      size: 10,
      totalPage: 0,
      page: 1,
      start: 0,
    },
  },
  reducers: {
    saveList(state, { payload }) {
      const { data, filter } = payload
      const { isEnd, items, page } = data
      return {
        ...state,
        list: items,
        filter: {
          isEnd,
          ...state.filter,
          ...page,
        },
      }
    },
  },

})
