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
              <h5 class="card-title">{{ album.popularity }}</h5>
              <h6 class="card-subtitle mb-2 text-muted">Popularity</h6>
              <p class="card-text"></p>
            </div>
          </div>
        </div>
        <div class="col">
          <div class="card">
            <div class="card-body">
              <h5 class="card-title" v-if="album.genres.length > 0">
                {{ album.genres.join(", ") }}
              </h5>
              <h5 class="card-title" v-else>N/A</h5>
              <h6 class="card-subtitle mb-2 text-muted">Genres</h6>
              <p class="card-text"></p>
            </div>
          </div>
        </div>
        <div class="col">
          <div class="card">
            <div class="card-body">
              <h5 class="card-title">{{ album.type }}</h5>
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
                <th scope="col">Duration</th>
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
  mounted() {
    axios
      .get(`http://localhost:5000/album/${this.$route.params.id}`)
      .then(resp => {
        this.album.name = resp.data.name;
        this.album.type = resp.data.album_type.replace(/(^\w|\s\w)/g, m =>
          m.toUpperCase()
        );
        this.album.popularity = resp.data.popularity;
        this.album.genres = [];
        this.album.release_date = resp.data.release_date;
        this.album.image = resp.data.images[0];
        resp.data.genres.forEach(genre =>
          this.album.genres.push(
            genre.replace(/(^\w|\s\w)/g, m => m.toUpperCase())
          )
        );
        this.album.artists = [];
        resp.data.artists.forEach(artist => this.album.artists.push(artist));
        resp.data.tracks.items.forEach(track => this.tracks.push(track));

        const nameToSearch = this.album.name.replace(" ", "%20");
        axios
          .get(`http://localhost:5000/${nameToSearch}/summary`)
          .then(resp => {
            if (this.isMusicRelated(resp.data)) {
              this.summary = resp.data;
            } else {
              this.summary = "";
            }
          });

        this.dataFetched = true;
      });
  },
  computed: {
    formatReleaseDate() {
      return this.album.release_date.split("-")[0];
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
