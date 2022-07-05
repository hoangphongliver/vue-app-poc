<template>
  <div class="container mx-auto">
    <div class="grid grid-cols-4 gap-8" v-if="chanelSubcrition.length">
      <div v-for="channel in chanelSubcrition" :key="channel.id">
        <img class="mx-auto mb-5 rounded-full h-60 w-60" :src="channel.avatar" alt="" />
        <p class="max-h-24 h-24 overflow-hidden mb-4">{{ channel.description }}...</p>
        <div @click="onVisitChannel(channel.channelId)" class="btn-visit rounded-xl">
          {{ channel.name }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import YoutubeFilter from "./YoutubeFilter.vue";
import IFrameLazyLoadVue from "./IframeLoading.vue";
import { YoutubeVue3 } from "youtube-vue3";
import { onMounted, ref } from "vue";
import useStore from "../store";
import { useRouter } from "vue-router";

const chanelSubcrition = ref([]);
const errorsList = ref([]);
const loading = ref(false);
const playListId = ref("PL_-VfJajZj0U9nEXa4qyfB4U5ZIYCMPlz");
const { saveUser } = useStore();
const itemPerPage = ref(20);
const pageToken = ref("");
const router = useRouter();

const defaultValue = {
  part: ["contentDetails", "id", "snippet"],
  maxResults: itemPerPage.value,
  mine: true,
  ...(pageToken && { pageToken: pageToken.value }),
};

const authenticate = () => {
  return gapi.auth2
    .getAuthInstance()
    .signIn({
      scope: "https://www.googleapis.com/auth/youtube.readonly",
    })
    .then(
      function (e) {
        loadClient();
        const userName = e.getBasicProfile().getName();
        saveUser(userName);
        console.log("Sign-in successful");
      },
      function (err) {
        console.error("Error signing in", err);
      }
    );
};

const loadClient = async () => {
  loading.value = true;
  await gapi.client.setApiKey("AIzaSyApgTHh4YvaItbXw42i_ggLM1CGpHgB0dQ");
  await gapi.client.load("https://www.googleapis.com/discovery/v1/apis/youtube/v3/rest");

  Object.keys(defaultValue).forEach((key) => {
    if (!defaultValue[key]) {
      delete defaultValue[key];
    }
  });
  getSubcriptionsList(defaultValue);
};
const onVisitChannel = (channelId) => {
  router.push(`/subscription/videos/${channelId}`);
};
const getSubcriptionsList = async (payload) => {
  try {
    loading.value = true;
    const data = await gapi.client.youtube.subscriptions.list(payload);
    if (!data.result.error) {
      chanelSubcrition.value = data.result.items.map((item) => ({
        channelId: item.snippet.resourceId.channelId,
        name: item.snippet.title,
        avatar: item.snippet.thumbnails.medium.url,
        description: item.snippet.description,
      }));
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

  getSubcriptionsList(value);
};

onMounted(async () => {
  gapi.load("client:auth2", async function () {
    gapi.auth2.init({
      client_id:
        "700083678766-7v0ddu3ik1supaucr6jmt5oir9gf0q6n.apps.googleusercontent.com",
      scope: "email profile openid",
      plugin_name: "App Name that you used in google developer console API",
    });

    loading.value = true;
    const authInstance = await gapi.auth2.getAuthInstance();

    if (!authInstance.isSignedIn.get()) {
      loading.value = false;
      authenticate();
    } else {
      const userName = await authInstance.currentUser.get().getBasicProfile().getName();
      saveUser(userName);
      loadClient();
    }
  });
});
</script>

<style lang="scss">
.btn-visit {
  cursor: pointer;
  background-color: seagreen;
  border: none;
  color: white;
  padding: 13px 32px;
  text-align: center;
  font-size: 16px;
  margin: 4px 2px;
  transition: 0.3s;
}
</style>
