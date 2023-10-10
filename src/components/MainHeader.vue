<template>
  <div :class="`container theme-${getCurrentTheme}`">
    <select class="select-box" v-model="selectedOption">
      <option v-for="device in getDeviceList" :key="device.value" :value="device.value">
        {{ device.text }}
      </option>
    </select>
    <button @click="takeScreenshot">스크린샷</button>
    <button @click="saveLogcat">로그저장</button>
    <button>ADB설정</button>
    <button @click="toggleTheme">테마변경</button>
  </div>
</template>


<script>
import { mapGetters, mapMutations } from 'vuex';
const { ipcRenderer } = require('electron');

export default {
  name: 'MainHeader',
  computed: {
    ...mapGetters(['getDeviceList', 'getCurrentTheme']),
  },
  data() {
    return {
      selectedOption: null
    };
  },
  methods: {
    ...mapMutations(['toggleTheme']),
    getFormattedDate() {
      const date = new Date();
      const year = String(date.getFullYear()).slice(-2);
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');
      const seconds = String(date.getSeconds()).padStart(2, '0');
      return `${year}${month}${day}${hours}${minutes}${seconds}`;
    },
    takeScreenshot() {
      const formattedDate = this.getFormattedDate();
      const screenshotName = `screenshot_${formattedDate}.png`;

      try {
        ipcRenderer.send('execute-command-sync', `adb shell screencap -p /sdcard/${screenshotName}`);
        ipcRenderer.send('execute-command-sync', `adb pull /sdcard/${screenshotName} ./${screenshotName}`);
        ipcRenderer.send('execute-command-sync', `adb shell rm /sdcard/${screenshotName}`);
        alert('스크린샷이 저장되었습니다.');
      } catch (error) {
        console.error(`Error executing command: ${error}`);
        alert('스크린샷 저장에 실패했습니다.');
      }
    },
    saveLogcat() {
      const formattedDate = this.getFormattedDate();
      const logcatName = `logcat_${formattedDate}.log`;

      try {
        ipcRenderer.send('execute-command-sync', `adb logcat -d > ./${logcatName}`);
        alert('로그가 저장되었습니다.');
      } catch (error) {
        console.error(`Error executing command: ${error}`);
        alert('로그 저장에 실패했습니다.');
      }
    },

  },
  mounted() {
  },
};
</script>

<style lang="scss">
.container {
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: var(--primary-color);

  button {
    width: 13vw;
    height: 6vh;
    border: none;
    margin: 0vw 2vw 0vw 2vw;
    background-color: var(--secondary-color);
    color: var(--primary-color);
    cursor: pointer;
    border-radius: 5px;
    font-size: 1em;
    &:hover {
      background-color: var(--hover-color);
    }
  }
}
</style>
