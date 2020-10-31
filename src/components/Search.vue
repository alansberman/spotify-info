<template>
  <div class="container-fluid">
    <div class="row">
      <div class="col"></div>
      <div class="col">
        <br />
        <h2>Search</h2>
        <br />
      </div>
      <div class="col"></div>
    </div>
    <div class="row">
      <div class="col"></div>
      <div class="col">
        <div class="input-group mb-3">
          <input
            type="text"
            v-model="searchQuery"
            class="form-control"
            placeholder="Search songs, artists, playlist and albums"
            aria-label="Recipient's username"
            aria-describedby="button-addon2"
          />
          <div class="input-group-append">
            <button
              class="btn btn-outline-secondary"
              type="button"
              id="button-addon2"
              @click="search"
            >
              Go
            </button>
          </div>
        </div>
      </div>
      <div class="col"></div>
    </div>
    <!-- <div class="row" v-if="searched">
      <div class="col"></div>
      <div class="col">
        <h4>Search results for "{{ searchQuery }}"</h4>
      </div>
      <div class="col"></div>
    </div> -->
    <div class="row" v-if="tracks.length > 0">
      <div class="col">
        <h3>Tracks</h3>
        <table class="table table-striped table-bordered">
          <thead class="thead-dark">
            <tr>
              <th scope="col">Title</th>
              <th scope="col">Artists</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="track in tracks" :key="`short.${track.id}`">
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
            </tr>
          </tbody>
        </table>
      </div>

      <div class="col">
        <h3>Artists</h3>
        <table class="table table-striped table-bordered">
          <thead class="thead-dark">
            <tr>
              <th scope="col">Name</th>
              <th scope="col">Popularity</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="artist in artists" :key="`short.${artist.id}`">
              <td>
                <router-link
                  :to="{ name: 'Artist', params: { id: artist.id } }"
                >
                  {{ artist.name }}</router-link
                >
              </td>
              <td>{{ artist.popularity }}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="col">
        <h3>Albums</h3>
        <table class="table table-striped table-bordered">
          <thead class="thead-dark">
            <tr>
              <th scope="col">Title</th>
              <th scope="col">Artists</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="album in albums" :key="`short.${album.id}`">
              <td>
                <router-link :to="{ name: 'Album', params: { id: album.id } }">
                  {{ album.name }}</router-link
                >
              </td>
              <td>
                <span v-for="(artist, index) in album.artists" :key="artist.id">
                  <span v-if="index !== 0">, </span>
                  <router-link
                    :to="{ name: 'Artist', params: { id: artist.id } }"
                  >
                    {{ artist.name }}</router-link
                  >
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="col">
        <h3>Playlists</h3>
        <table class="table table-striped table-bordered">
          <thead class="thead-dark">
            <tr>
              <th scope="col">Title</th>
              <th scope="col">Length</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="playlist in playlists" :key="playlist.id">
              <td>
                <router-link
                  :to="{ name: 'Playlist', params: { id: playlist.id } }"
                  >{{ playlist.name }}</router-link
                >
              </td>
              <td>{{ playlist.tracks.total }}</td>
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
  name: "Search",
  data() {
    return {
      searchQuery: "",
      artists: [],
      albums: [],
      tracks: [],
      playlists: []
    };
  },
  methods: {
    search() {
      axios
        .get(`http://localhost:5000/search/${this.searchQuery}/tracks`)
        .then(resp => {
          this.tracks = [];
          resp.data.tracks.items.forEach(element => {
            this.tracks.push(element);
          });
        });
      axios
        .get(`http://localhost:5000/search/${this.searchQuery}/artists`)
        .then(resp => {
          this.artists = [];
          resp.data.artists.items.forEach(element => {
            this.artists.push(element);
          });
        });
      axios
        .get(`http://localhost:5000/search/${this.searchQuery}/albums`)
        .then(resp => {
          this.albums = [];
          resp.data.albums.items.forEach(element => {
            this.albums.push(element);
          });
        });
      axios
        .get(`http://localhost:5000/search/${this.searchQuery}/playlists`)
        .then(resp => {
          this.playlists = [];
          resp.data.playlists.items.forEach(element => {
            this.playlists.push(element);
          });
        });
    }
  }
};
</script>

<style scoped></style>
