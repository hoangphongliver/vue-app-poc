<template>
  <div v-show="!isLoading"><div :id="id"></div></div>
  <div class="h-[200px] bg-slate-200 w-full animate-pulse" v-show="isLoading"></div>
  <div v-show="!isLoading">
    <button class="mt-2 px-2 py-1 rounded-sm bg-green-400 text-white mx-2" @click="play">
      Play
    </button>
    <button
      class="mt-2 px-2 py-1 rounded-sm bg-orange-500 text-white mx-2"
      @click="pause"
    >
      Pause
    </button>
    <button class="mt-2 px-2 py-1 rounded-sm bg-indigo-500 text-white mx-2" @click="stop">
      Stop
    </button>
    <button class="mt-2 px-2 py-1 rounded-sm bg-red-500 text-white mx-2" @click="prev">
      Prev
    </button>
    <button class="mt-2 px-2 py-1 rounded-sm bg-yellow-700 text-white mx-2" @click="next">
      Next
    </button>
  </div>
</template>

<script>
export default {
  name: "IFrameLazyLoad",
  props: {
    src: {
      type: String,
      default: "",
    },
    id: {
      type: String,
      default: "",
    },
    snippet: {
      type: Object,
      default: () => {},
    },
    playListId: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      isLoading: true,
      player: null,
    };
  },
  mounted() {
    this.player = new YT.Player(this.id, {
      height: "200",
      width: "100%",
      videoId: this.id,
      events: {
        onReady: this.onPlayerReady,
      },
    });
  },
  methods: {
    onPlayerReady() {
      this.isLoading = false;
    },

    play() {
      this.player.playVideo();
    },

    stop() {
      this.player.stopVideo();
    },

    next() {
      this.player.nextVideo();
    },

    prev() {
      this.player.previousVideo();
    },

    pause() {
      this.player.pauseVideo();
    },
  },
};
</script>

<style></style>
