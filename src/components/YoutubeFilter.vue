<template>
  <div class="px-6 text-left">
    <h1 class="font-bold mb-3">Request parameters</h1>

    <div>
      <div class="mb-3">
        <label
          for="mostPopular"
          class="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-400"
        >
          Playlists Id
        </label>
        <input
          v-model="form.playlistId"
          id="Id"
          class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        />
      </div>

      <div class="mb-3">
        <label
          for="Id"
          class="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-400"
        >
          Video Id
        </label>
        <input
          v-model="form.id"
          id="Id"
          class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        />
      </div>

      <!-- <div class="mb-3">
        <label
          for="maxResults"
          class="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-400"
        >
          maxResults
        </label>
        <input
          v-model="form.maxResults"
          id="maxResults"
          class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        />
      </div> -->

      <div class="grid grid-cols-2 gap-4 mt-10">
        <button
          @click="reset"
          class="bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded"
        >
          Reset
        </button>

        <button
          @click="submit"
          class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Button
        </button>
      </div>

      <div v-if="errorsList.length" class="mt-10">
        <p v-for="(error, index) in errorsList" :key="index" class="text-red-600 text-sm">
          {{ error.message }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";

const emit = defineEmits(["submit"]);
const props = defineProps({
  errorsList: {
    type: Array,
    default: () => [],
  },
  playListId: {
    type: String,
    default: "",
  },
});

const defaultValue = {
  playlistId: props.playListId,
  id: "",
  maxResults: 20,
};

const form = ref(JSON.parse(JSON.stringify(defaultValue)));

const reset = () => {
  form.value = defaultValue;
  emit("submit", form.value);
};

const submit = () => {
  emit("submit", form.value);
};
</script>

<style></style>
