<script setup>
import { RouterView } from "vue-router";
import Header from "./components/Header.vue";
</script>

<template>
  <div class="vue-app pb-10">
    <Header class="mb-10 shadow-xl" />
    <RouterView></RouterView>
  </div>
</template>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>
