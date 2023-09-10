import { createStore } from "vuex";

export default createStore({
  state: {
    deviceList: [],
    options: [
      {
        value: "connect",
        text: "연결",
        valid:
          /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/,
      },
      { value: "dialog", text: "발화", valid: /^[가-힣a-zA-Z0-9\s]{1,30}$/},
      { value: "text", text: "텍스트", valid: /^.{1,50}$/ },
    ],
    theme: 'light'
  },
  getters: {
    getDeviceList: (state) => state.deviceList,
    getOptions: (state) => state.options,
    isValidCommand: (state) => (optionValue, command) => {
      const currentOption = state.options.find(option => option.value === optionValue);
      return currentOption ? currentOption.valid.test(command) : true;
    },
    getCurrentTheme(state) {
      return state.theme;
    }
  },
  mutations: {
    ADD_DEVICE(state, deviceObject) {
      state.deviceList.push(deviceObject);
    },
    toggleTheme(state) {
      state.theme = state.theme === 'light' ? 'dark' : 'light';
    }
  },
  actions: {
    addDevice({ commit }, deviceObject) {
      commit('ADD_DEVICE', deviceObject);
    }
  },
  modules: {},
});
