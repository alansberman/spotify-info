<template>
  <div>
    <table
      class="table table-bordered table-sm table-striped"
      v-if="tracks.length > 0"
    >
      <thead class="thead-dark">
        <tr>
          <th scope="col">Title</th>
          <th scope="col">Artist</th>
          <th scope="col">Album</th>
          <th scope="col">Length</th>
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
    return { tracks: [] };
  },
  mounted() {
    axios
      .get(`http://localhost:5000/playlist/${this.$route.params.id}`)
      .then(resp => {
        resp["data"]["items"].forEach(t => this.tracks.push(t["track"]));
      });
  },
  methods: {
    getLength(length) {
      // Thanks to https://stackoverflow.com/questions/21294302/converting-milliseconds-to-minutes-and-seconds-with-javascript
      const minutes = Math.floor(length / 60000);
      const seconds = ((length % 60000) / 1000).toFixed(0);
      return minutes + ":" + (seconds < 10 ? "0" : "") + seconds;
    }
  }
};
</script>

<style scoped></style>
