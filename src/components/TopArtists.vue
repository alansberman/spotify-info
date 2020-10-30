<template>
  <div>
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
          <div class="btn-group" role="group" aria-label="Basic example">
            <button
              type="button"
              class="btn btn-secondary"
              @click="filterArtists('short')"
            >
              Short-Term
            </button>
            <button
              type="button"
              class="btn btn-secondary"
              @click="filterArtists('medium')"
            >
              Medium-Term
            </button>
            <button
              type="button"
              class="btn btn-secondary"
              @click="filterArtists('long')"
            >
              Long-Term
            </button>
          </div>

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
              <td>{{ artist.genres.join(", ") }}</td>
              <td>
                {{ artist.popularity }}
              </td>
              <td>{{ artist.followers.total }}</td>
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
  mounted() {
    axios.get("http://localhost:5000/my-top-artists/short_term").then(resp => {
      resp.data.items.forEach(artist => {
        this.artists.push(artist);
        this.shortTermArtists.push(artist);
        this.artistsToDisplay.push(artist);
      });
      this.fetchedShortTerm = true;
    });

    axios.get("http://localhost:5000/my-top-artists/medium_term").then(resp => {
      resp.data.items.forEach(artist => {
        this.artists.push(artist);
        this.mediumTermArtists.push(artist);
      });
      this.fetchedMediumTerm = true;
    });

    axios.get("http://localhost:5000/my-top-artists/long_term").then(resp => {
      resp.data.items.forEach(artist => {
        this.artists.push(artist);
        this.longTermArtists.push(artist);
      });
      this.fetchedLongTerm = true;
    });
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
    }
  }
};
</script>

<style scoped></style>
