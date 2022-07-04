<template>
  <nav class="bg-white py-2 md:py-4">
    <div class="container px-4 mx-auto md:flex md:items-center">
      <div class="flex justify-between items-center">
        <router-link to="/" class="font-bold text-xl text-indigo-600">
          Google API POC
        </router-link>

        <button
          class="border border-solid border-gray-600 px-3 py-1 rounded text-gray-600 opacity-50 hover:opacity-75 md:hidden"
          id="navbar-toggle"
        >
          <i class="fas fa-bars"></i>
        </button>
      </div>

      <div
        class="hidden md:flex flex-col md:flex-row md:ml-auto mt-3 md:mt-0 items-center"
        id="navbar-collapse"
      >
        <div class="mr-4">
          Hi <span class="text-green-600">{{ user }}</span>
        </div>
        <button
          @click="signOut"
          href="#"
          class="p-2 lg:px-4 md:mx-2 text-indigo-600 text-center border border-solid border-indigo-600 rounded hover:bg-indigo-600 hover:text-white transition-colors duration-300 mt-1 md:mt-0 md:ml-1"
        >
          Sign Out
        </button>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { storeToRefs } from "pinia";
import { ref } from "vue";
import useStore from "../store";

const { user } = storeToRefs(useStore());
const signOut = async () => {
  const authInstance = await gapi.auth2.getAuthInstance();

  await authInstance.signOut();

  location.reload();
};
</script>

<style></style>
