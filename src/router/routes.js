export const routes = [
  {
    name: "Home",
    path: "/",
    component: () =>
      import(/* webpackChunkName: "Register" */ "../components/Home.vue"),
  },
  {
    name: "Subscription",
    path: "/subscription",
    component: () =>
      import(
        /* webpackChunkName: "Register" */ "../components/YoutubeSubcription.vue"
      ),
  },
  {
    name: "Subcription",
    path: "/subscription/videos/:channelId",
    component: () =>
      import(
        /* webpackChunkName: "Register" */ "../components/SubscriptionVideos.vue"
      ),
  },
  {
    name: "Youtube",
    path: "/youtube",
    component: () =>
      import(
        /* webpackChunkName: "Register" */ "../components/YoutubeVideo.vue"
      ),
  },
  {
    name: "YoutubeSearch",
    path: "/search",
    component: () =>
      import(
        /* webpackChunkName: "Register" */ "../components/YoutubeSearch.vue"
      ),
  },
  {
    name: "Calendar",
    path: "/calendar",
    component: () =>
      import(/* webpackChunkName: "calendar" */ "../components/Calendar.vue"),
  },
];
