<template>
  <div class="container mx-auto">
    <div class="border border-gray-300 rounded-full bg-white flex mb-4 w-11/12">
      <input
        v-model="searchTerm"
        type="text"
        placeholder="Search...."
        class="w-full rounded-tl-full rounded-bl-full py-2 px-4"
      />
      <button
        class="bg-red-600 text-white rounded-tr-full rounded-br-full hover:bg-red-300 py-2 px-4"
        @click="onSearch"
      >
        <p class="font-semibold text-base uppercase">Search</p>
      </button>
    </div>

    <!-- BUY ME A PIZZA AND HELP SUPPORT OPEN-SOURCE RESOURCES -->
    <div
      class="flex items-end justify-end fixed bottom-0 right-0 mb-4 mr-4 z-10"
    >
      <div>
        <a
          title="Buy me a pizza"
          href="https://www.buymeacoffee.com/Dekartmc"
          target="_blank"
          class="block w-16 h-16 rounded-full transition-all shadow hover:shadow-lg transform hover:scale-110 hover:rotate-12"
        >
          <img
            class="object-cover object-center w-full h-full rounded-full"
            src="https://img.icons8.com/emoji/48/000000/pizza-emoji.png"
          />
        </a>
      </div>
    </div>
    <div class="grid grid-cols-4 gap-8 pr-20" v-if="videos.length">
      <div
        v-for="video in videos"
        :key="video.id"
        :class="{ hidden: !video.id.videoId }"
      >
        <IFrameLazyLoadVue
          :src="`https://www.youtube.com/embed/watch?v=x0fSBAgBrOQ&list=${video.id.videoId}`"
          :id="video.id.videoId"
          v-if="video.id.videoId"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import IFrameLazyLoadVue from "./IframeLoading.vue";
import { onMounted, ref } from "vue";
import useStore from "../store";
import { useRoute } from "vue-router";

const videos = ref([]);
const errorsList = ref([]);
const loading = ref(false);
const playListId = ref("PL_-VfJajZj0U9nEXa4qyfB4U5ZIYCMPlz");
const { saveUser } = useStore();
const route = useRoute();
const searchTerm = ref("");

const defaultValue = {
  part: ["id"],
  maxResults: 20,
  type: 'video'
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
  await gapi.client.load(
    "https://www.googleapis.com/discovery/v1/apis/youtube/v3/rest"
  );

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
    const data = await gapi.client.youtube.search.list(payload);

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

const onSearch = () => {
  const value = {
    ...defaultValue,
    q: searchTerm.value,
  };

  submit(value);
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
      const userName = await authInstance.currentUser
        .get()
        .getBasicProfile()
        .getName();
      saveUser(userName);
      loadClient();
    }
  });
});
</script>

<style lang="scss"></style>
