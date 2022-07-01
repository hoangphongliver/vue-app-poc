export const routes = [
  {
    name: "Home",
    path: "/",
    component: () =>
      import(
        /* webpackChunkName: "Register" */ "../components/Home.vue"
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
    name: "Calendar",
    path: "/calendar",
    component: () =>
      import(/* webpackChunkName: "calendar" */ "../components/Calendar.vue"),
  },
];
