<template>
  <div>
    <div
      class="container-fluid"
      v-if="
        !(
          dataFetched &&
          topTracksFetched &&
          summaryFetched &&
          relatedArtistsFetched
        )
      "
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
      v-if="
        dataFetched &&
          topTracksFetched &&
          summaryFetched &&
          relatedArtistsFetched
      "
    >
      <div class="row"><br /><br /></div>
      <div class="row">
        <div class="col"></div>
        <div class="col">
          <h2>
            <a :href="artist.external_urls.spotify">{{ artist.name }}</a>
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
                    :value="artist.popularity"
                    variant="success"
                  ></b-progress-bar>
                </b-progress>
              </h5>
              <h6 class="card-subtitle mb-2 text-muted">Popularity</h6>
              <div v-if="artist.genre">
                <h5 class="card-title">{{ artist.genre }}</h5>
              </div>
              <div v-if="artist.country">
                <h5 class="card-title">From {{ artist.country }}</h5>
              </div>
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
              <p class="card-text">
                <button type="button" class="btn btn-dark">Follow</button>
              </p>
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
                <td>
                  <b-progress show-progress>
                    <b-progress-bar
                      :value="track.popularity"
                      variant="success"
                    ></b-progress-bar>
                  </b-progress>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="col" v-if="summary.length > 0 || artist.backupSummary">
          <div>
            <h3>Summary</h3>
            <div class="overflow-auto" style="height: 550px; width: 600px">
              <p v-if="summary.length > 0" v-text="summary"></p>
              <p v-else v-text="artist.backupSummary"></p>
            </div>
          </div>
        </div>
        <div class="col">
          <h3>Cover Photo</h3>

          <img
            :src="artist.image.url"
            class="img-fluid"
            alt="Album photo"
            style="height: 550px; width: 600px"
          />
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
      relatedArtistsFetched: false,
      summaryFetched: false,
      summary: "",
      topTracks: []
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
      axios
        .get(`http://localhost:5000/artist/${this.$route.params.id}`)
        .then(resp => {
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
            .get(`http://localhost:5000/artist/${nameToSearch}/info`)
            .then(resp => {
              if (resp.data.artists) {
                const artistResp = resp.data.artists[0];
                this.artist.formedYear = artistResp.intFormedYear;
                this.artist.country = artistResp.strCountry;
                this.artist.genre = artistResp.strGenre;

                this.artist.backupSummary = artistResp.strBiographyEN;
              }
              this.dataFetched = true;
            });

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
        });

      axios
        .get(`http://localhost:5000/artist/${this.$route.params.id}/related`)
        .then(resp => {
          resp.data.artists.forEach(artist =>
            this.artist.relatedArtists.push(artist)
          );
          this.relatedArtistsFetched = true;
        });

      axios
        .get(`http://localhost:5000/artist/${this.$route.params.id}/top-tracks`)
        .then(resp => {
          this.topTracks = [];
          resp.data.tracks.forEach(track => this.topTracks.push(track));
          this.topTracksFetched = true;
        });
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
