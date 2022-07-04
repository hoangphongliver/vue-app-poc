<template>
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
      <div class="text-center flex items-center justify-center w-full" v-if="loading">
        <button type="button" disabled class="mr-5">
          <svg
            role="status"
            class="w-8 h-8 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
            viewBox="0 0 100 101"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
              fill="currentColor"
            />
            <path
              d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
              fill="currentFill"
            />
          </svg>
        </button>
        <span> Loading events....</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import YoutubeFilter from "./YoutubeFilter.vue";
import IFrameLazyLoadVue from "./IframeLoading.vue";
import { YoutubeVue3 } from "youtube-vue3";
import { ref } from "vue";
import dayjs from "dayjs";
import { useCookies } from "vue3-cookies";
import useStore from "../store";

const { cookies } = useCookies();
const events = ref([]);
const loading = ref(true);
const date = ref(new Date().toISOString());
const calendarId = ref("");
const errorMessage = ref("");
const { saveUser } = useStore();

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
        const userName = e.getBasicProfile().getName();
        calendarId.value = email;

        saveUser(userName);
        loadClient();
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
  try {
    const data = await gapi.client.calendar.events.list({
      calendarId: calendarId.value,
      timeMin: dayjs(date.value).format("YYYY-MM-DD") + "T00:00:00.344Z",
      timeMax: dayjs(date.value).format("YYYY-MM-DD") + "T23:59:59.344Z",
      maxResults: 20,
    });
    if (!data.result.error) {
      events.value = data.result.items.filter((i) => i.status !== "cancelled");
      loading.value = false;
      return;
    }

    loading.value = false;
  } catch (error) {
    loading.value = false;
    errorMessage.value = error.result.error.message;
  }
};

const submit = (value) => {
  getEventsList(value);
};

gapi.load("client:auth2", async function () {
  gapi.auth2.init({
    client_id: "700083678766-7v0ddu3ik1supaucr6jmt5oir9gf0q6n.apps.googleusercontent.com",
    scope: "email profile openid",
    plugin_name: "App Name that you used in google developer console API",
  });

  loading.value = true;
  const authInstance = await gapi.auth2.getAuthInstance();

  if (!authInstance.isSignedIn.get()) {
    loading.value = false;
    authenticate();
  } else {
    const email = await authInstance.currentUser.get().getBasicProfile().getEmail();
    const userName = await authInstance.currentUser.get().getBasicProfile().getName();
    saveUser(userName);
    calendarId.value = email;
    loadClient();
  }
});
</script>

<style lang="scss"></style>
