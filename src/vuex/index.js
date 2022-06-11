import Vue from 'vue'
import Vuex from 'vuex'
import task from './task'
import member from './member'

Vue.use(Vuex);


const store = new Vuex.Store({
  modules: {
    task,
    member
  }
})

export default store