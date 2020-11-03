<template>
  <div>
    <div class="container-fluid" v-if="!fetchedData">
      <div class="row">
        <div class="col"></div>
        <div class="col">
          <br /><br /><br /><br /><br />
          <div class="spinner-border text-success" role="status"></div>
        </div>
        <div class="col"></div>
      </div>
    </div>

    <div class="container-fluid" v-if="fetchedData">
      <div class="row">
        <br />
        <br />
      </div>
      <div class="row">
        <div class="col"></div>
        <div class="col">
          <h2>My Playlists</h2>
        </div>
        <div class="col"></div>
      </div>
      <div class="row">
        <br />
        <br />
      </div>
      <div class="row">
        <Playlist v-if="isPlaylist" />
      </div>
      <div class="row">
        <table class="table table-striped table-bordered" v-if="!isPlaylist">
          <thead class="thead-dark">
            <tr>
              <th scope="col">Playlist</th>
              <th scope="col">Owner</th>
              <th scope="col">Length</th>
              <th scope="col">Collaborative</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="p in playlists" :key="p.id">
              <td>
                <router-link :to="{ name: 'Playlist', params: { id: p.id } }">{{
                  p.name
                }}</router-link>
              </td>
              <td>{{ p.owner.display_name }}</td>
              <td>{{ p.tracks.total }}</td>
              <td>{{ p.collaborative ? "Yes" : "No" }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import Playlist from "./Playlist";
export default {
  name: "Home",
  components: { Playlist },
  data: function() {
    return {
      playlist: "",
      playlists: [],
      fetchedData: false
    };
  },
  async mounted() {
    let resp = await axios.get("http://localhost:5000/playlists");
    resp["data"]["items"].forEach(pl => this.playlists.push(pl));
    this.fetchedData = true;
  },
  computed: {
    isPlaylist() {
      return this.$route.name.toLowerCase().includes("playlist");
    }
  },
  methods: {}
};
</script>

<style scoped>
table {
  margin: 20px 20px;
}
</style>
