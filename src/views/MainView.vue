<template>
  <MainHeader class="main-header" />
  <CommandBox class="command-box" />
</template>

<script>
import MainHeader from '@/components/MainHeader.vue';
import CommandBox from '@/components/CommandBox.vue';

export default {
  name: 'MainView',
  components: {
    MainHeader,
    CommandBox
  },
};
</script>

<style lang="scss">
.main-header {
  height: 15vh;  // 뷰포트의 높이의 10%
}

.command-box {
  height: 85vh;  // 뷰포트의 높이의 90%
}
</style>
