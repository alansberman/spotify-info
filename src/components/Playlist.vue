<template>
  <div class="container-fluid" v-if="dataFetched && fetchedFeatures">
    <div class="row"><br /><br /></div>
    <div class="row">
      <div class="col"></div>
      <div class="col">
        <h2>{{ playlist.name }} - by {{ playlist.owner.display_name }}</h2>
      </div>
      <div class="col"></div>
    </div>
    <div class="row text-center">
      <div class="col"></div>
      <div class="col">
        <h6>Average Characteristics:</h6>
      </div>
      <div class="col"></div>
    </div>
    <div class="row">
      <div class="col">
        <h6>Acousticness</h6>
        <h5>
          <b-progress show-progress>
            <b-progress-bar
              :value="playlistWithFeatures.acousticness_average"
              variant="success"
            ></b-progress-bar>
          </b-progress>
        </h5>
      </div>
      <div class="col">
        <h6>Danceability</h6>
        <h5>
          <b-progress show-progress>
            <b-progress-bar
              :value="playlistWithFeatures.danceability_average"
              variant="success"
            ></b-progress-bar>
          </b-progress>
        </h5>
      </div>
      <div class="col">
        <h6>Energy</h6>
        <h5>
          <b-progress show-progress>
            <b-progress-bar
              :value="playlistWithFeatures.energy_average"
              variant="success"
            ></b-progress-bar>
          </b-progress>
        </h5>
      </div>
      <div class="col">
        <h6>Liveness</h6>
        <h5>
          <b-progress show-progress>
            <b-progress-bar
              :value="playlistWithFeatures.liveness_average"
              variant="success"
            ></b-progress-bar>
          </b-progress>
        </h5>
      </div>
      <div class="col">
        <h6>Speechiness</h6>
        <h5>
          <b-progress show-progress>
            <b-progress-bar
              :value="playlistWithFeatures.speechiness_average"
              variant="success"
            ></b-progress-bar>
          </b-progress>
        </h5>
      </div>
      <div class="col">
        <h6>Instrumentalness</h6>
        <h5>
          <b-progress show-progress>
            <b-progress-bar
              :value="playlistWithFeatures.instrumentalness_average"
              variant="success"
            ></b-progress-bar>
          </b-progress>
        </h5>
      </div>
      <div class="col">
        <h6>Valence</h6>
        <h5>
          <b-progress show-progress>
            <b-progress-bar
              :value="playlistWithFeatures.valence_average"
              variant="success"
            ></b-progress-bar>
          </b-progress>
        </h5>
      </div>
    </div>
    <div class="row"><br /><br /></div>
    <table
      class="table table-bordered table-sm table-striped"
      v-if="tracks.length > 0"
    >
      <thead class="thead-dark">
        <tr>
          <th scope="col">Title</th>
          <th scope="col">Artist</th>
          <th scope="col">Album</th>
          <th scope="col"><i class="far fa-clock"></i></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="track in tracks" :key="track.id">
          <td>
            <router-link :to="{ name: 'Track', params: { id: track.id } }">{{
              track.name
            }}</router-link>
          </td>
          <td>
            <span v-for="(artist, index) in track.artists" :key="artist.id">
              <span v-if="index !== 0">, </span>
              <router-link :to="{ name: 'Artist', params: { id: artist.id } }">
                {{ artist.name }}</router-link
              >
            </span>
          </td>

          <td>
            <router-link
              :to="{ name: 'Album', params: { id: track.album.id } }"
              >{{ track.album.name }}</router-link
            >
          </td>
          <td>{{ getLength(track.duration_ms) }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import axios from "axios";
export default {
  name: "Playlist",
  props: ["id"],
  data() {
    return {
      tracks: [],
      playlist: {},
      playlistWithFeatures: {},
      dataFetched: false,
      fetchedFeatures: false,
      features: [
        "acousticness",
        "danceability",
        "energy",
        "liveness",
        "speechiness",
        "instrumentalness",
        "valence"
      ]
    };
  },
  async mounted() {
    let resp = await axios.get(
      `http://localhost:5000/playlist/${this.$route.params.id}`
    );
    this.playlist = resp.data;
    resp.data.tracks.items.forEach(t => this.tracks.push(t["track"]));
    this.getFeatures();
    this.dataFetched = true;
  },
  methods: {
    getLength(length) {
      // Thanks to https://stackoverflow.com/questions/21294302/converting-milliseconds-to-minutes-and-seconds-with-javascript
      const minutes = Math.floor(length / 60000);
      const seconds = ((length % 60000) / 1000).toFixed(0);
      return minutes + ":" + (seconds < 10 ? "0" : "") + seconds;
    },
    async getFeatures() {
      this.playlistWithFeatures = await axios.get(
        `http://localhost:5000/playlist/${this.$route.params.id}/features`
      );
      this.features.forEach(feature => {
        const data = this.playlistWithFeatures.data
          .map(track => track[feature])
          .sort();

        this.playlistWithFeatures[feature + "_average"] =
          (data.reduce((total, curr) => total + curr, 0) / data.length).toFixed(
            2
          ) * 100;
      });
      this.fetchedFeatures = true;
    }
  }
};
</script>

<style scoped></style>
