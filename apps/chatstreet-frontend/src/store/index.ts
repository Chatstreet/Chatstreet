import { createStore } from 'vuex';

export interface State {
    test: string;
}

export default createStore<State>({
  getters: {
    test: (state) => state.test,
  },

  state: {
    test: 'wer',
  },

  mutations: {
    test(state) {
      state.test = 'weret';
    },
  },

  actions: {
    test({ commit }, input) {
      this.dispatch('test');
    },
  },
});
