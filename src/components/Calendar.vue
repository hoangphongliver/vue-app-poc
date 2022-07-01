<template>
  <button
    @click="reset"
    class="bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border mb-4 border-blue-500 hover:border-transparent rounded"
  >
    <router-link to="/">Back to Home</router-link>
  </button>
  <div class="container mx-auto">
    <div class="flex">
      <div class="mb-3 mr-20 w-2/12">
        <label
          for="mostPopular"
          class="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-400 text-left"
        >
          Search by Date
        </label>
        <input
          v-model="date"
          id="Id"
          type="date"
          class="mb-3 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        />

        <div class="text-indigo-500 text-left mb-10">
          Events on: {{ dayjs(date).format("YYYY-MMM-DD") }}
        </div>

        <button
          class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full mb-6"
          @click="submit"
        >
          Submit
        </button>

        <span v-if="errorMessage" class="text-red-600 text-sm text-left">{{
          errorMessage
        }}</span>
      </div>

      <div class="w-8/12 text-left" v-if="events.length && !loading">
        <div v-for="event in events" :key="event.id">
          <div
            v-if="event.creator?.displayName"
            class="py-4 px-6 border border-gray-300 rounded-md mb-10"
          >
            <div class="my-2">
              <span class="font-bold">Creator Name</span>:
              {{ event.creator?.displayName }}
            </div>
            <div class="my-2">
              <span class="font-bold">Creator Email</span>: {{ event.creator?.email }}
            </div>
            <div class="my-2">
              <span class="font-bold">Start at</span>:
              <span class="text-red-600">
                {{ dayjs(event.start?.dateTime).format("DD MMM, YYYY HH:mm") }}
              </span>
            </div>
            <div class="my-2">
              <span class="font-bold">End at</span>:
              <span class="text-red-600">
                {{ dayjs(event.end?.dateTime).format("DD MMM, YYYY HH:mm") }}
              </span>
            </div>
            <div class="my-2">
              <span class="font-bold">Location</span>: {{ event?.location || "-" }}
            </div>
            <div class="my-2 break-all">
              <span class="font-bold">Description</span>: {{ event?.description || "-" }}
            </div>
            <div>
              <a :href="event.htmlLink" class="break-all">
                <span class="font-bold">Event link:</span>
                <span class="text-indigo-500">{{ event?.htmlLink }} </span>
              </a>
            </div>

            <div class="my-2 break-all">
              <span class="font-bold">Members:</span>
              <span
                v-for="member in event?.attendees"
                :key="member.email"
                class="text-indigo-500"
              >
                {{ member.email }},
              </span>
            </div>
          </div>
        </div>
      </div>

      <div
        v-if="!events.length && !loading"
        class="p-4 border border-gray-300 rounded-md w-full"
      >
        No event
      </div>
      <div v-if="loading" class="w-full">Loading..........</div>
    </div>
  </div>
</template>

<script setup>
import YoutubeFilter from "./YoutubeFilter.vue";
import IFrameLazyLoadVue from "./IframeLoading.vue";
import { YoutubeVue3 } from "youtube-vue3";
import { ref } from "vue";
import dayjs from "dayjs";

const events = ref([]);
const loading = ref(false);
const date = ref(new Date().toISOString());
const calendarId = ref("");
const errorMessage = ref("");

const defaultValue = {
  calendarId: calendarId.value,
  maxResults: 10,
  singleEvents: true,
  orderBy: "startTime",
};

const authenticate = () => {
  return gapi.auth2
    .getAuthInstance()
    .signIn({
      scope:
        "https://www.googleapis.com/auth/calendar https://www.googleapis.com/auth/calendar.events https://www.googleapis.com/auth/calendar.events.readonly https://www.googleapis.com/auth/calendar.readonly",
    })
    .then(
      function (e) {
        const email = e.getBasicProfile().getEmail();
        calendarId.value = email;
      },
      function (err) {
        console.error("Error signing in", err);
      }
    );
};

const loadClient = async () => {
  await gapi.client.setApiKey("AIzaSyApgTHh4YvaItbXw42i_ggLM1CGpHgB0dQ");
  await gapi.client.load(
    "https://content.googleapis.com/discovery/v1/apis/calendar/v3/rest"
  );

  getEventsList(defaultValue);
};

const getEventsList = async (payload) => {
  console.log(1);
  try {
    loading.value = true;
    console.log(2);
    const data = await gapi.client.calendar.events.list({
      calendarId: calendarId.value,
      timeMin: dayjs(date.value).format("YYYY-MM-DD") + "T00:00:00.344Z",
      timeMax: dayjs(date.value).format("YYYY-MM-DD") + "T23:59:59.344Z",
      maxResults: 20,
    });
    console.log(3);
    if (!data.result.error) {
      events.value = data.result.items;
      loading.value = false;
      return;
    }

    loading.value = false;
    // errorsList.value = data.result.error.errors;
  } catch (error) {
    loading.value = false;
    errorMessage.value = error.result.error.message;
  }
};

const submit = (value) => {
  getEventsList(value);
};

gapi.load("client:auth2", function () {
  gapi.auth2.init({
    client_id: "700083678766-7v0ddu3ik1supaucr6jmt5oir9gf0q6n.apps.googleusercontent.com",
    scope: "email profile openid",
    plugin_name: "App Name that you used in google developer console API",
  });

  authenticate().then(loadClient);
});
</script>

<style lang="scss"></style>
