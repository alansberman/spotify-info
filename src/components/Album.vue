<template>
  <div>
    <div class="container-fluid" v-if="!dataFetched">
      <div class="row">
        <div class="col"></div>
        <div class="col">
          <br /><br /><br /><br /><br />
          <div class="spinner-border text-success" role="status"></div>
        </div>
        <div class="col"></div>
      </div>
    </div>

    <div class="container-fluid" v-if="dataFetched">
      <div class="row"><br /><br /></div>
      <div class="row">
        <div class="col"></div>
        <div class="col">
          <h2>
            {{ album.name }} ({{ formatReleaseDate }}) -
            <span v-for="(artist, index) in album.artists" :key="artist.id">
              <span v-if="index !== 0">, </span>
              <router-link :to="{ name: 'Artist', params: { id: artist.id } }">
                {{ artist.name }}</router-link
              >
            </span>
          </h2>
        </div>
        <div class="col"></div>
      </div>
      <div class="row">
        <div class="col">
          <div class="card">
            <div class="card-body">
              <h5 class="card-title">
                <b-progress show-progress>
                  <b-progress-bar
                    :value="album.popularity"
                    variant="success"
                  ></b-progress-bar>
                </b-progress>
              </h5>
              <h6 class="card-subtitle mb-2 text-muted">Popularity</h6>
              <p class="card-text"></p>
            </div>
          </div>
        </div>
        <div class="col" v-if="album.genres.length > 0">
          <div class="card">
            <div class="card-body">
              <h5 class="card-title">
                {{ album.genres.join(", ") }}
              </h5>
              <h5 class="card-title">N/A</h5>
              <h6 class="card-subtitle mb-2 text-muted">Genres</h6>
              <p class="card-text"></p>
            </div>
          </div>
        </div>
        <div class="col">
          <div class="card">
            <div class="card-body">
              <h5 class="card-title">{{ formatAlbumType }}</h5>
              <h6 class="card-subtitle mb-2 text-muted">Album Type</h6>
              <p class="card-text"></p>
            </div>
          </div>
        </div>
      </div>
      <div class="row"><br /><br /></div>
      <div class="row">
        <div class="col">
          <h3>Tracklist</h3>
          <table class="table table-striped table-bordered">
            <thead class="thead-dark">
              <tr>
                <th scope="col">Title</th>
                <th scope="col">Artists</th>
                <th scope="col"><i class="far fa-clock"></i></th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="track in tracks" :key="track.id">
                <td>
                  <router-link
                    :to="{ name: 'Track', params: { id: track.id } }"
                  >
                    {{ track.name }}</router-link
                  >
                </td>
                <td>
                  <span
                    v-for="(artist, index) in track.artists"
                    :key="artist.id"
                  >
                    <span v-if="index !== 0">, </span>
                    <router-link
                      :to="{ name: 'Artist', params: { id: artist.id } }"
                    >
                      {{ artist.name }}</router-link
                    >
                  </span>
                </td>
                <td>{{ getLength(track.duration_ms) }}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="col">
          <div v-if="summary.length > 0">
            <h3>Summary</h3>
            <p v-text="summary"></p>
          </div>
        </div>
        <div class="col">
          <h3>Album Cover</h3>
          <img :src="album.image.url" class="img-fluid" alt="Album photo" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
export default {
  name: "Album",
  props: ["id"],
  data() {
    return {
      album: {},
      summary: "",
      dataFetched: false,
      tracks: []
    };
  },
  async mounted() {
    let response = await axios.get(
      `http://localhost:5000/album/${this.$route.params.id}`
    );

    this.album.name = response.data.name;
    this.album.type = response.data.album_type.replace(/(^\w|\s\w)/g, m =>
      m.toUpperCase()
    );
    this.album.popularity = response.data.popularity;
    this.album.genres = [];
    this.album.release_date = response.data.release_date;
    this.album.image = response.data.images[0];
    response.data.genres.forEach(genre =>
      this.album.genres.push(genre.replace(/(^\w|\s\w)/g, m => m.toUpperCase()))
    );
    this.album.artists = [];
    response.data.artists.forEach(artist => this.album.artists.push(artist));
    response.data.tracks.items.forEach(track => this.tracks.push(track));

    const nameToSearch = this.album.name.replace(" ", "%20");
    response = await axios.get(`http://localhost:5000/${nameToSearch}/summary`);
    if (this.isMusicRelated(response.data)) {
      this.summary = response.data;
    } else {
      this.summary = "";
    }

    this.dataFetched = true;
  },
  computed: {
    formatReleaseDate() {
      return this.album.release_date.split("-")[0];
    },
    formatAlbumType() {
      return this.album.type === "Album" ? "Full-length" : this.album.type;
    }
  },
  methods: {
    getLength(length) {
      // Thanks to https://stackoverflow.com/questions/21294302/converting-milliseconds-to-minutes-and-seconds-with-javascript
      const minutes = Math.floor(length / 60000);
      const seconds = ((length % 60000) / 1000).toFixed(0);
      return minutes + ":" + (seconds < 10 ? "0" : "") + seconds;
    },
    isMusicRelated(content) {
      content = content.toString();
      return (
        content.includes("music") ||
        content.includes("band") ||
        content.includes("artist") ||
        content.includes("song") ||
        content.includes("composer")
      );
    }
  }
};
</script>

<style scoped></style>
