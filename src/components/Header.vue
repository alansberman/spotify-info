<template>
  <div>
    <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
      <span class="navbar-brand">Spotify Info</span>
      <button
        class="navbar-toggler"
        type="button"
        data-toggle="collapse"
        data-target="#navbarNavDropdown"
        aria-controls="navbarNavDropdown"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarNavDropdown">
        <ul class="navbar-nav">
          <li class="nav-item">
            <div class="nav-link">
              <router-link to="/">Home</router-link>
            </div>
          </li>
          <li class="nav-item">
            <div class="nav-link">
              <router-link to="/about">About</router-link>
            </div>
          </li>
          <li class="nav-item">
            <div class="nav-link">
              <router-link to="/top-tracks">My Top Tracks</router-link>
            </div>
          </li>
          <li class="nav-item">
            <div class="nav-link">
              <router-link to="/top-artists">My Top Artists</router-link>
            </div>
          </li>
          <li class="nav-item">
            <div class="nav-link">
              <router-link to="/search">Search</router-link>
            </div>
          </li>
          <li class="nav-item">
            <div class="nav-link">
              <router-link to="/discover">Discover</router-link>
            </div>
          </li>
          <li class="nav-item">
            <div class="nav-link">
              <router-link to="/glossary">Glossary</router-link>
            </div>
          </li>
        </ul>
      </div>
      <span class="navbar-text">
        <div v-if="isCurrentlyPlaying && fetchedCurrentlyPlaying">
          <span style="color: #3eaf7c">Currently Playing:</span>
          <router-link
            :to="{ name: 'Track', params: { id: currentlyPlayingTrack.id } }"
          >
            {{ currentlyPlayingTrack.name }}</router-link
          >
          -
          <span
            v-for="(artist, index) in currentlyPlayingTrack.artists"
            :key="artist.id"
          >
            <span v-if="index !== 0">, </span>
            <router-link :to="{ name: 'Artist', params: { id: artist.id } }">
              {{ artist.name }}</router-link
            >
          </span>
        </div>
      </span>
      <div>w</div>
      <div v-if="isLoggedIn">
        <button
          class="btn btn-outline-success my-2 my-sm-0"
          v-on:click="logout"
        >
          Logout
        </button>
      </div>
      <div v-else>
        <button
          class="btn btn-outline-success my-2 my-sm-0"
          v-on:click="logout"
        >
          Login
        </button>
      </div>
    </nav>
  </div>
</template>

<script>
import _ from "lodash";

import axios from "axios";
export default {
  name: "Header.vue",
  data() {
    return {
      currentlyPlayingTrack: {},
      currentName: "",
      fetchedCurrentlyPlaying: false,
      isCurrentlyPlaying: false,
      refreshTime: Number,
      timeRemaining: Number
    };
  },
  async mounted() {
    this.fetchCurrentlyPlaying();
  },
  watch: {
    currentlyPlayingTrack: function() {
      _.debounce(this.fetchCurrentlyPlaying, 500);
    }
  },
  computed: {
    isLoggedIn() {
      return this.$store.state.jwt && this.$store.state.jwt.length > 0;
    }
  },
  methods: {
    async fetchCurrentlyPlaying() {
      let response = await axios.get(`http://localhost:5000/currently-playing`);
      if (response.data) {
        if (response.data.item) {
          this.currentlyPlayingTrack = response.data.item;
          this.currentName = this.currentlyPlayingTrack.name;
          this.isCurrentlyPlaying = response.data.is_playing;
          if (this.isCurrentlyPlaying) {
            this.refreshTime =
              new Date().getTime() +
              (this.currentlyPlayingTrack.duration_ms -
                response.data.progress_ms);
            this.fetchedCurrentlyPlaying = true;
            this.refreshCurrentlyPlaying();
          }
        }
      }
    },

    async logout() {
      await axios.get(`http://localhost:8001/auth/logout`, {
        headers: {
          Authorization: "Bearer " + this.$store.state.jwt
        }
      });
      this.$store.commit("removeToken");

      this.$router.push({ name: "Login" });
    },

    refreshCurrentlyPlaying() {
      const func = setInterval(() => {
        const now = new Date().getTime();
        this.timeRemaining = this.refreshTime - now;
        if (this.timeRemaining < 0) {
          clearInterval(func);
          this.fetchCurrentlyPlaying();
        }
      }, 1000);
    }
  }
};
</script>

<style scoped>
.navbar-dark .navbar-brand {
  color: #3eaf7c;
}

.router-link-exact-active,
.router-link-active,
a {
  color: #ffffff;
  cursor: pointer;
}
</style>
