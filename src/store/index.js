import { defineStore } from "pinia";

const useStore = defineStore("storeIndex", {
  state: () => {
    return {
      user: "",
    };
  },
  actions: {
    saveUser(user) {
      this.user = user;
    },
  },
});

export default useStore;
