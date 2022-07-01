<template>
  <button
    @click="reset"
    class="bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border mb-4 border-blue-500 hover:border-transparent rounded"
  >
    <router-link to="/">Back to Home</router-link>
  </button>
  <div class="flex">
    <YoutubeFilter
      class="w-2/12"
      :play-list-id="playListId"
      :errorsList="errorsList"
      @submit="submit"
    />
    <div class="grid grid-cols-4 gap-8 w-10/12 pr-20">
      <div v-for="video in videos" :key="video.id">
        <IFrameLazyLoadVue
          :src="`https://www.youtube.com/embed/watch?v=x0fSBAgBrOQ&list=${video.id}`"
          :id="video.id"
          :snippet="video.snippet"
          :play-list-id="playListId"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import YoutubeFilter from "./YoutubeFilter.vue";
import IFrameLazyLoadVue from "./IframeLoading.vue";
import { YoutubeVue3 } from "youtube-vue3";
import { onMounted, ref } from "vue";

const videos = ref([]);
const errorsList = ref([]);
const loading = ref(false);
const playListId = ref("PL_-VfJajZj0U9nEXa4qyfB4U5ZIYCMPlz");

const defaultValue = {
  part: ["id", "snippet", "contentDetails", "status"],
  playlistId: playListId.value,
  id: "",
  maxResults: 10,
};

const authenticate = () => {
  return gapi.auth2
    .getAuthInstance()
    .signIn({
      scope: "https://www.googleapis.com/auth/youtube.readonly",
    })
    .then(
      function () {
        console.log("Sign-in successful");
      },
      function (err) {
        console.error("Error signing in", err);
      }
    );
};

const loadClient = async () => {
  await gapi.client.setApiKey("AIzaSyApgTHh4YvaItbXw42i_ggLM1CGpHgB0dQ");
  await gapi.client.load("https://www.googleapis.com/discovery/v1/apis/youtube/v3/rest");

  Object.keys(defaultValue).forEach((key) => {
    if (!defaultValue[key]) {
      delete defaultValue[key];
    }
  });
  getVideosList(defaultValue);
};

const getVideosList = async (payload) => {
  try {
    loading.value = true;
    const data = await gapi.client.youtube.playlistItems.list(payload);

    if (!data.result.error) {
      videos.value = data.result.items;
      loading.value = false;
      return;
    }

    loading.value = false;
    errorsList.value = data.result.error.errors;
  } catch (error) {
    loading.value = false;
    errorsList.value = error.result.error.errors;
  }
};

const submit = (value) => {
  Object.keys(value).forEach((key) => {
    if (!value[key]) {
      delete value[key];
    }
  });

  getVideosList(value);
};

onMounted(() => {
  gapi.load("client:auth2", function () {
    gapi.auth2.init({
      client_id:
        "700083678766-7v0ddu3ik1supaucr6jmt5oir9gf0q6n.apps.googleusercontent.com",
    });

    authenticate().then(loadClient);
  });
});
</script>

<style lang="scss"></style>
