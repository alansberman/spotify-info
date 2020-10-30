<template>
  <div>
    <div class="container-fluid" v-if="dataFetched && topTracksFetched">
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
              <h5 class="card-title">{{ artist.genres.join(", ") }}</h5>
              <h6 class="card-subtitle mb-2 text-muted">Genres</h6>
              <p class="card-text"></p>
            </div>
          </div>
        </div>
        <div class="col">
          <div class="card">
            <div class="card-body">
              <h5 class="card-title">{{ artist.followers }}</h5>
              <h6 class="card-subtitle mb-2 text-muted">Followers</h6>
              <p class="card-text"></p>
            </div>
          </div>
        </div>
      </div>
      <div class="row"><br /><br /></div>
      <div class="row">
        <div class="col">
          <h3>Top 10 Tracks</h3>
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
      topTracks: []
    };
  },
  mounted() {
    axios
      .get(`http://localhost:5000/artist/${this.$route.params.id}`)
      .then(resp => {
        this.artist.name = resp.data.name;
        this.artist.popularity = resp.data.popularity;
        this.artist.genres = [];
        this.artist.followers = resp.data.followers.total;
        this.artist.image = resp.data.images[0];
        resp.data.genres.forEach(genre =>
          this.artist.genres.push(
            genre.replace(/(^\w|\s\w)/g, m => m.toUpperCase())
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
  }
};
</script>

<style scoped></style>
