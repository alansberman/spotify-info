<template>
  <div>
    <div
      class="container-fluid"
      v-if="fetchedLongTerm && fetchedMediumTerm && fetchedLongTerm"
    >
      <div class="row"><br /><br /></div>
      <div class="row">
        <div class="col"></div>
        <div class="col">
          <h2>My Top Tracks</h2>
        </div>
        <div class="col"></div>
      </div>
      <div class="row">
        <br /><br />
        <div class="col"></div>
        <div class="col">
          <div class="btn-group" role="group" aria-label="Basic example">
            <button
              type="button"
              class="btn btn-secondary"
              @click="filterTracks('short')"
            >
              Short-Term
            </button>
            <button
              type="button"
              class="btn btn-secondary"
              @click="filterTracks('medium')"
            >
              Medium-Term
            </button>
            <button
              type="button"
              class="btn btn-secondary"
              @click="filterTracks('long')"
            >
              Long-Term
            </button>
          </div>

          <br /><br />
        </div>
        <div class="col"></div>
      </div>
      <div class="row">
        <table class="table table-striped table-bordered">
          <thead class="thead-dark">
            <tr>
              <th scope="col">Title</th>
              <th scope="col">Artists</th>
              <th scope="col">Album</th>
              <th scope="col">Duration</th>
              <th scope="col">Popularity</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="track in tracksToDisplay" :key="`short.${track.id}`">
              <td>
                <router-link :to="{ name: 'Track', params: { id: track.id } }">
                  {{ track.name }}</router-link
                >
              </td>
              <td>
                <span v-for="(artist, index) in track.artists" :key="artist.id">
                  <span v-if="index !== 0">, </span>
                  <router-link
                    :to="{ name: 'Artist', params: { id: artist.id } }"
                  >
                    {{ artist.name }}</router-link
                  >
                </span>
              </td>
              <td>
                {{ track.album.name }}
              </td>
              <td>{{ getLength(track.duration_ms) }}</td>
              <td>{{ track.popularity }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
export default {
  name: "TopTracks",
  data: function() {
    return {
      tracks: [],
      tracksToDisplay: [],
      shortTermTracks: [],
      show: "short",
      mediumTermTracks: [],
      longTermTracks: [],
      fetchedShortTerm: false,
      fetchedMediumTerm: false,
      fetchedLongTerm: false
    };
  },
  mounted() {
    axios.get("http://localhost:5000/my-top-tracks/short_term").then(resp => {
      resp.data.items.forEach(track => {
        this.tracks.push(track);
        this.tracksToDisplay.push(track);
        this.shortTermTracks.push(track);
      });
      this.fetchedShortTerm = true;
    });

    axios.get("http://localhost:5000/my-top-tracks/medium_term").then(resp => {
      resp.data.items.forEach(track => {
        this.tracks.push(track);
        this.mediumTermTracks.push(track);
      });
      this.fetchedMediumTerm = true;
    });

    axios.get("http://localhost:5000/my-top-tracks/long_term").then(resp => {
      resp.data.items.forEach(track => {
        this.tracks.push(track);
        this.longTermTracks.push(track);
      });
      this.fetchedLongTerm = true;
    });
  },
  methods: {
    getLength(length) {
      // Thanks to https://stackoverflow.com/questions/21294302/converting-milliseconds-to-minutes-and-seconds-with-javascript
      const minutes = Math.floor(length / 60000);
      const seconds = ((length % 60000) / 1000).toFixed(0);
      return minutes + ":" + (seconds < 10 ? "0" : "") + seconds;
    },
    filterTracks(period) {
      switch (period) {
        case "short":
          this.tracksToDisplay = this.shortTermTracks;
          return;
        case "medium":
          this.tracksToDisplay = this.mediumTermTracks;
          return;
        case "long":
          this.tracksToDisplay = this.longTermTracks;
          return;
      }
    }
  }
};
</script>

<style scoped></style>
