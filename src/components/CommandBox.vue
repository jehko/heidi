<template>
  <div :class="`container theme-${getCurrentTheme}`">
    <form @submit.prevent="confirm">
      <div class="input-container">
        <select class="select-box" v-model="selectedOption">
          <option v-for="option in getOptions" :key="option.value" :value="option.value">
            {{ option.text }}
          </option>
        </select>
        <input type="text" class="input-box" v-model="command" placeholder="여기에 입력하세요" @blur="validateInput" />
        <button type="submit" class="confirm-button">확인</button>
      </div>
    </form>
  </div>
</template>


<script>
import { mapActions, mapGetters, mapMutations } from 'vuex';
import { debounce } from 'lodash';
const { ipcRenderer } = require('electron');

export default {
  name: 'CommandBox',
  computed: {
    ...mapGetters(['getOptions', 'isValidCommand', 'getCurrentTheme']),
  },
  data() {
    return {
      command: '',
      selectedOption: null
    };
  },
  methods: {
    ...mapActions(['addDevice']),
    ...mapMutations(['toggleTheme']),
    confirm: debounce(function() {
      if (!this.isValidCommand(this.selectedOption, this.command)) {
        alert("유효하지 않은 입력입니다!");
        this.command = '';
        return;
      }
      ipcRenderer.send('execute-command', this.getCommand(this.selectedOption, this.command));
      console.log(`입력한 내용: `, this.getCommand(this.selectedOption, this.command));
    }, 500),
    getCommand(optionValue, command) {
      switch(optionValue) {
        case 'connect':
          return `adb connect ${command}`;
        case 'dialog':
          return `adb shell am broadcast -a "kt.action.voicecommand.asr" --es "kwsText" ${command} --es "gender" "0" --es "resultCode" "0" --es "age" "adult" com.kt.gigagenie.mc`;
        case 'text':
          var escapeCommand = command.replaceAll(" ", "%s");
          console.log(escapeCommand);
          return `adb shell input text "${escapeCommand}"`;
        default:
          return `${command}`;
      }
    },
    getDeviceList() {
      console.log('getDeviceList');
      const command = `adb devices -l`;
      ipcRenderer.send('execute-command-sync', command);
    }
  },
  mounted() {
    if (this.getOptions && this.getOptions.length > 0) {
      this.selectedOption = this.getOptions[0].value;
    }
  },
  created() {
    ipcRenderer.on('command-execution-result', (event, result) => {
      console.log(event, result);
      if (result.error) {
        this.commandError = result.error;
        console.error(`${this.$options.name}:: Command failed: ${result.error}`);
        return;
      }
      console.log(`${this.$options.name}:: Command succeeded: ${result.message}`);
    });

    this.getDeviceList();
  }
};
</script>

<style lang="scss">
.container {
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: var(--primary-color);

  .input-container {
    display: flex;
    flex-direction: row;
    align-items: center;
  }
 
  .select-box, .input-box, .confirm-button {
    box-sizing: border-box;
    border-radius: 5px;
    font-size: 14px;
  }

  .select-box {
    padding: 0 1vw 0 1vw;
    margin-right: 1vw;
    width: 10vw;
    height: 6vh;
    min-width: 10vw;
    border: 1px solid #ccc;
  }

  .input-box {
    padding: 0 1vw 0 1vw;
    width: 40vw;
    height: 6vh;
    border: 1px solid #ccc;
  }

  .confirm-button {
    width: 8vw;
    height: 6vh;
    border: none;
    background-color: var(--secondary-color);
    color: var(--primary-color);
    cursor: pointer;

    &:hover {
      background-color: var(--hover-color);
    }
  }
}
</style>
