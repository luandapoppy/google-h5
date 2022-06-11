import { getStore, removeStrore } from '../config/mUtil.js'
const state = {
  refresh: false,
};

const getters = {
  getRefresh() {
    return state.refresh
  }
}

const mutations = {
  CHANGE_REFRESH: (state, data) => {
    // 清除task相关缓存
    const member = JSON.parse(getStore("currentMember"));
    removeStrore(member.memberId + 'getStuSportTaskList');
    removeStrore(member.memberId + 'getSportTaskList');
    removeStrore(member.memberId + 'getSportTaskCalendarData');
    state.refresh = data;
  },
};

const actions = {
  changeRefresh({ commit }, view) {
    commit("CHANGE_REFRESH", view);
  },
};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
};
