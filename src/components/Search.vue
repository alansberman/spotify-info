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
              v-on:keyup.enter="search"
              @click="search"
            >
              Go
            </button>
          </div>
        </div>
      </div>
      <div class="col"></div>
    </div>

    <div class="container-fluid" v-if="searching">
      <div class="row">
        <div class="col"></div>
        <div class="col">
          <br /><br /><br /><br /><br />
          <div class="spinner-border text-success" role="status"></div>
        </div>
        <div class="col"></div>
      </div>
    </div>

    <div
      class="row back shadow"
      v-if="
        fetchedTracks && fetchedAlbums && fetchedArtists && fetchedPlaylists
      "
    >
      <div class="col">
        <br />
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
        <br />
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
              <td>
                <b-progress show-progress>
                  <b-progress-bar
                    :value="artist.popularity"
                    variant="success"
                  ></b-progress-bar>
                </b-progress>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="col">
        <br />
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
        <br />
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
      fetchedTracks: false,
      fetchedArtists: false,
      fetchedAlbums: false,
      searching: false,
      fetchedPlaylists: false,
      playlists: []
    };
  },
  methods: {
    async search() {
      this.searching = true;
      this.fetchedTracks = false;
      this.fetchedArtists = false;
      this.fetchedAlbums = false;
      this.fetchedPlaylists = false;

      let response = await axios.get(
        `http://localhost:5000/search/${this.searchQuery}/tracks`
      );
      this.tracks = [];
      response.data.tracks.items.forEach(element => {
        this.tracks.push(element);
      });
      this.fetchedTracks = true;

      response = await axios.get(
        `http://localhost:5000/search/${this.searchQuery}/artists`
      );
      this.artists = [];
      response.data.artists.items.forEach(element => {
        this.artists.push(element);
      });
      this.fetchedArtists = true;

      response = await axios.get(
        `http://localhost:5000/search/${this.searchQuery}/albums`
      );
      this.albums = [];
      response.data.albums.items.forEach(element => {
        this.albums.push(element);
      });
      this.fetchedAlbums = true;

      response = await axios.get(
        `http://localhost:5000/search/${this.searchQuery}/playlists`
      );
      this.playlists = [];
      response.data.playlists.items.forEach(element => {
        this.playlists.push(element);
      });
      this.fetchedPlaylists = true;
      this.searching = false;
    }
  }
};
</script>

<style scoped></style>
