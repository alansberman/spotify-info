<template>
  <div>
    <div
      class="container-fluid"
      v-if="!(fetchedLongTerm && fetchedMediumTerm && fetchedLongTerm)"
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
      v-if="fetchedLongTerm && fetchedMediumTerm && fetchedLongTerm"
    >
      <div class="row"><br /><br /></div>
      <div class="row">
        <div class="col"></div>
        <div class="col">
          <h2>My Top Artists</h2>
        </div>
        <div class="col"></div>
      </div>
      <div class="row">
        <br /><br />
        <div class="col"></div>
        <div class="col">
          <button
            type="button"
            class="btn btn-success"
            @click="filterArtists('short')"
          >
            Last 4 weeks
          </button>
          &nbsp;
          <button
            type="button"
            class="btn btn-success"
            @click="filterArtists('medium')"
          >
            Last 6 months
          </button>
          &nbsp;
          <button
            type="button"
            class="btn btn-success"
            @click="filterArtists('long')"
          >
            All-time
          </button>

          <br /><br />
        </div>
        <div class="col"></div>
      </div>
      <div class="row">
        <table class="table table-striped table-bordered">
          <thead class="thead-dark">
            <tr>
              <th scope="col">Name</th>
              <th scope="col">Genres</th>
              <th scope="col">Popularity</th>
              <th scope="col">Followers</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="artist in artistsToDisplay" :key="`short.${artist.id}`">
              <td>
                <router-link
                  :to="{ name: 'Artist', params: { id: artist.id } }"
                >
                  {{ artist.name }}</router-link
                >
              </td>

              <td>
                <span
                  v-for="(genre, index) in artist.genres"
                  :key="`genre.${genre}`"
                >
                  <span v-if="index !== 0">, </span>
                  <router-link
                    :to="{
                      name: 'Genre',
                      params: { name: formatGenreForLink(genre) }
                    }"
                  >
                    {{ formatGenreName(genre) }}</router-link
                  >
                </span>
              </td>
              <td>
                <b-progress show-progress>
                  <b-progress-bar
                    :value="artist.popularity"
                    variant="success"
                  ></b-progress-bar>
                </b-progress>
              </td>
              <td>{{ artist.followers.total.toLocaleString() }}</td>
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
  name: "TopArtists",
  data: function() {
    return {
      artists: [],
      artistsToDisplay: [],
      shortTermArtists: [],
      show: "short",
      mediumTermArtists: [],
      longTermArtists: [],
      fetchedShortTerm: false,
      fetchedMediumTerm: false,
      fetchedLongTerm: false
    };
  },
  async mounted() {
    let response = await axios.get(
      "http://localhost:5000/my-top-artists/short_term"
    );
    response.data.items.forEach(artist => {
      this.artists.push(artist);
      this.shortTermArtists.push(artist);
      this.artistsToDisplay.push(artist);
    });
    this.fetchedShortTerm = true;

    response = await axios.get(
      "http://localhost:5000/my-top-artists/medium_term"
    );
    response.data.items.forEach(artist => {
      this.artists.push(artist);
      this.mediumTermArtists.push(artist);
    });
    this.fetchedMediumTerm = true;

    response = await axios.get(
      "http://localhost:5000/my-top-artists/long_term"
    );
    response.data.items.forEach(artist => {
      this.artists.push(artist);
      this.longTermArtists.push(artist);
    });
    this.fetchedLongTerm = true;
  },
  methods: {
    getLength(length) {
      // Thanks to https://stackoverflow.com/questions/21294302/converting-milliseconds-to-minutes-and-seconds-with-javascript
      const minutes = Math.floor(length / 60000);
      const seconds = ((length % 60000) / 1000).toFixed(0);
      return minutes + ":" + (seconds < 10 ? "0" : "") + seconds;
    },
    filterArtists(period) {
      switch (period) {
        case "short":
          this.artistsToDisplay = this.shortTermArtists;
          return;
        case "medium":
          this.artistsToDisplay = this.mediumTermArtists;
          return;
        case "long":
          this.artistsToDisplay = this.longTermArtists;
          return;
      }
    },
    formatGenreForLink(genre) {
      const formattedGenre = genre.replace(/(^\w|\s\w)/g, m => m.toUpperCase());
      formattedGenre.replace(" ", "%20");
      return formattedGenre;
    },
    formatGenreName(genre) {
      return genre.replace(/(^\w|\s\w)/g, m => m.toUpperCase());
    }
  }
};
</script>

<style scoped>
.btn-success {
  background-color: #3eaf7c;
}
</style>
