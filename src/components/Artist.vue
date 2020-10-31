<template>
  <div>
    <div
      class="container-fluid"
      v-if="!(dataFetched && topTracksFetched && summaryFetched)"
    >
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
      class="container-fluid"
      v-if="dataFetched && topTracksFetched && summaryFetched"
    >
      <div class="row"><br /><br /></div>
      <div class="row">
        <div class="col"></div>
        <div class="col">
          <h2>{{ artist.name }}</h2>
        </div>
        <div class="col"></div>
      </div>
      <div class="row">
        <div class="col">
          <div class="card">
            <div class="card-body">
              <h5 class="card-title">{{ artist.popularity }}</h5>
              <h6 class="card-subtitle mb-2 text-muted">Popularity</h6>
              <p class="card-text"></p>
            </div>
          </div>
        </div>
        <div class="col">
          <div class="card">
            <div class="card-body">
              <h5 class="card-title">
                <span
                  v-for="(artist, index) in artist.relatedArtists"
                  :key="artist.id"
                >
                  <span v-if="index !== 0">, </span>
                  <router-link
                    :to="{ name: 'Artist', params: { id: artist.id } }"
                  >
                    {{ artist.name }}</router-link
                  >
                </span>
              </h5>
              <h6 class="card-subtitle mb-2 text-muted">Related Artists</h6>
              <p class="card-text"></p>
            </div>
          </div>
        </div>
        <div class="col">
          <div class="card">
            <div class="card-body">
              <h5 class="card-title">
                {{ artist.followers.toLocaleString() }}
              </h5>
              <h6 class="card-subtitle mb-2 text-muted">Followers</h6>
              <p class="card-text"></p>
            </div>
          </div>
        </div>
      </div>
      <div class="row"><br /><br /></div>
      <div class="row">
        <div class="col">
          <h3>Top Tracks</h3>
          <table class="table table-striped table-bordered">
            <thead class="thead-dark">
              <tr>
                <th scope="col">Title</th>
                <th scope="col">Popularity</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="track in topTracks" :key="track.id">
                <td>
                  <router-link
                    :to="{ name: 'Track', params: { id: track.id } }"
                  >
                    {{ track.name }}</router-link
                  >
                </td>
                <td>{{ track.popularity }}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="col" v-if="summary.length > 0">
          <div>
            <h3>Summary</h3>
            <p v-text="summary"></p>
          </div>
        </div>
        <div class="col">
          <img :src="artist.image.url" class="img-fluid" alt="Album photo" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
export default {
  name: "Artist",
  props: ["id"],
  data() {
    return {
      artist: {},
      dataFetched: false,
      topTracksFetched: false,
      summaryFetched: false,
      summary: "",
      topTracks: [],
      loading: false
    };
  },
  mounted() {
    this.getData();
  },
  methods: {
    isMusicRelated(content) {
      content = content.toString();
      return (
        content.includes("music") ||
        content.includes("band") ||
        content.includes("artist") ||
        content.includes("song") ||
        content.includes("composer")
      );
    },
    getData() {
      this.loading = true;
      axios
        .get(`http://localhost:5000/artist/${this.$route.params.id}`)
        .then(resp => {
          console.log(resp);
          this.artist = resp.data;
          this.artist.name = resp.data.name;
          this.artist.relatedArtists = [];
          this.artist.popularity = resp.data.popularity;
          this.artist.genres = [];
          this.artist.followers = resp.data.followers.total;
          this.artist.image = resp.data.images[0];
          resp.data.genres.forEach(genre =>
            this.artist.genres.push(
              genre.replace(/(^\w|\s\w)/g, m => m.toUpperCase())
            )
          );
          const nameToSearch = this.artist.name.replace(" ", "%20");
          axios
            .get(`http://localhost:5000/${nameToSearch}/summary`)
            .then(resp => {
              if (this.isMusicRelated(resp.data)) {
                // Strip out annoying titles like '== Background =='
                this.summary = resp.data.replace(
                  /\s[=]{2,3}\s[^]*\s[=]{2,3}\s/g,
                  ""
                );
              } else {
                this.summary = "";
              }
              this.summaryFetched = true;
            });

          axios
            .get(
              `http://localhost:5000/artist/${this.$route.params.id}/related`
            )
            .then(resp =>
              resp.data.artists.forEach(artist =>
                this.artist.relatedArtists.push(artist)
              )
            );

          this.dataFetched = true;
        });

      axios
        .get(`http://localhost:5000/artist/${this.$route.params.id}/top-tracks`)
        .then(resp => {
          resp.data.tracks.forEach(track => this.topTracks.push(track));
          this.topTracksFetched = true;
        });
      this.loading = false;
    }
  },
  computed: {
    // thanks to https://github.com/vuejs/vue-router/issues/311
    getFullPath() {
      return this.$route.path;
    }
  },
  watch: {
    getFullPath() {
      this.dataFetched = false;
      this.summaryFetched = false;
      this.topTracksFetched = false;
      this.getData();
    }
  }
};
</script>

<style scoped></style>
