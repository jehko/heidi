<template>
  <!-- <nav>
    <router-link to="/">Main</router-link> |
    <router-link to="/about">About</router-link>
  </nav> -->
  <div class="router-view-container">
    <router-view/>
  </div>
</template>

<style lang="scss">
@import '~normalize.css';

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
}

.router-view-container {
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column; 
  > * {
    width: 100%;
    height: 100%;
  }
}

</style>
