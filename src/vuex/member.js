import { getStore, setStore, removeStrore } from '../config/mUtil.js'
const state = {
  currentMember: null,
  members: []
};

const getters = {
  getCurrentMember() {
    if (!state.currentMember) {
      return JSON.parse(getStore('currentMember')) || {};
    }
    return state.currentMember
  },
  getMembers() {
    if (state.members.length < 1) {
      state.members = JSON.parse(getStore('members')) || {};
    }
    return state.members
  }
}

const mutations = {

};

const actions = {
  changeCurrentMember({ commit }, view) {
    setStore('currentMember', view)
    state.currentMember = JSON.parse(JSON.stringify(view));
  },
  changeMembers({ commit }, view) {
    setStore('members', view)
    state.members = JSON.parse(JSON.stringify(view))
  },
};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
};
