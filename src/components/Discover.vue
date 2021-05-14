<template>
  <div class="back shadow">
    <div class="container-fluid">
      <div class="row">
        <div class="col"></div>
        <div class="col">
          <h2>Discover</h2>
        </div>
        <div class="col"></div>
      </div>
      <div class="row">
        <div class="col"></div>
        <div class="col">
          <h6>Select Genre(s) <small>hold ctrl-C to select multiple</small></h6>
          <b-form-select
            v-model="selectedGenres"
            :options="genreOptions"
            multiple
          ></b-form-select>
          <br /><br />
        </div>
        <div class="col"></div>
      </div>
      <div class="row">
        <div class="col">
          <h6>Search Artists</h6>
          <div style="display: flex; flex-direction: row">
            <input
              class="form-control"
              type="search"
              v-model="artistSearchQuery"
              placeholder="Search Artists"
              aria-label="Search Artists"
            />

            <button class="btn btn-success my-2 my-sm-0" @click="searchArtists">
              Search
            </button>
          </div>
          <br />
          <div v-if="fetchedArtists">
            <b-table
              striped
              bordered
              id="my-table"
              :items="artistOptions"
              :head-variant="'dark'"
              :fields="artistFields"
              :per-page="perPage"
              :current-page="currentPage"
              :sort-by.sync="sortBy"
              :sort-desc.sync="sortDesc"
              small
            >
              <template #cell(name)="artist">
                <router-link
                  :to="{ name: 'Artist', params: { id: artist.item.id } }"
                >
                  {{ artist.item.name }}</router-link
                >
              </template>
              <template #cell(selected)="artist">
                <b-form-group>
                  <input
                    type="checkbox"
                    v-model="artist.item.selected"
                    @change="selectArtist(artist.item)"
                  />
                </b-form-group>
              </template>
            </b-table>

            <div>
              <b-pagination
                v-model="currentPage"
                :total-rows="artistRows"
                :per-page="perPage"
                aria-controls="my-table"
              ></b-pagination>
            </div>
          </div>
        </div>
        <div class="col">
          <h6>Search Tracks</h6>
          <div style="display: flex; flex-direction: row">
            <input
              class="form-control"
              type="search"
              v-model="trackSearchQuery"
              placeholder="Search Tracks"
              aria-label="Search Tracks"
            />
            <button class="btn btn-success my-2 my-sm-0" @click="searchTracks">
              Search
            </button>
          </div>
          <br />

          <div v-if="fetchedTracks">
            <b-table
              striped
              bordered
              id="my-table"
              :items="trackOptions"
              :head-variant="'dark'"
              :fields="trackFields"
              :per-page="perPage"
              :current-page="currentPage"
              :sort-by.sync="sortBy"
              :sort-desc.sync="sortDesc"
              small
            >
              <template #cell(name)="track">
                <router-link
                  :to="{ name: 'Track', params: { id: track.item.id } }"
                >
                  {{ track.item.name }}</router-link
                >
              </template>

              <template #cell(artists)="track">
                <span
                  v-for="(artist, index) in track.item.artists"
                  :key="artist.id"
                >
                  <span v-if="index !== 0">, </span>
                  <router-link
                    :to="{ name: 'Artist', params: { id: artist.id } }"
                  >
                    {{ artist.name }}</router-link
                  >
                </span>
              </template>

              <template #cell(album)="track">
                <router-link
                  :to="{ name: 'Album', params: { id: track.item.album.id } }"
                >
                  {{ track.item.album.name }}</router-link
                >
              </template>

              <template #cell(selected)="track">
                <b-form-group>
                  <input
                    type="checkbox"
                    v-model="track.item.selected"
                    @change="selectTrack(track.item)"
                  />
                </b-form-group>
              </template>
            </b-table>

            <div>
              <b-pagination
                v-model="currentPage"
                :total-rows="trackRows"
                :per-page="perPage"
                aria-controls="my-table"
              ></b-pagination>
            </div>
          </div>
        </div>
      </div>

      <div class="row">
        <div class="col">
          <div v-if="selectedArtists.length > 0">
            <h6>Selected Artists</h6>
            <b-list-group>
              <b-list-group-item
                class="d-flex justify-content-between align-items-center"
                v-for="artist in selectedArtists"
                :key="artist.id"
              >
                <router-link
                  :to="{ name: 'Artist', params: { id: artist.id } }"
                >
                  {{ artist.name }}</router-link
                >
                <b-badge variant="danger" pill>X</b-badge>
              </b-list-group-item>
            </b-list-group>
          </div>
        </div>
        <div class="col">
          <div v-if="selectedTracks.length > 0">
            <h6>Selected Tracks</h6>
            <b-list-group>
              <b-list-group-item
                class="d-flex justify-content-between align-items-center"
                v-for="track in selectedTracks"
                :key="track.id"
              >
                <router-link :to="{ name: 'Track', params: { id: track.id } }">
                  {{ track.name }}</router-link
                >
                <b-badge variant="danger" pill>X</b-badge>
              </b-list-group-item>
            </b-list-group>
          </div>
        </div>
        <div class="col">
          <div v-if="selectedGenres.length > 0">
            <h6>Selected Genres</h6>
            <b-list-group>
              <b-list-group-item
                class="d-flex justify-content-between align-items-center"
                v-for="(genre, index) in selectedGenres"
                :key="index"
              >
                {{ genreOptions.find(g => g.value === genre)["text"] }}
                <b-badge variant="danger" pill>X</b-badge>
              </b-list-group-item>
            </b-list-group>
          </div>
        </div>
      </div>

      <div class="row">
        <div class="col"><br /><br /></div>
      </div>

      <div class="row">
        <div class="col"></div>
        <div class="col">
          <button class="btn btn-success my-2 my-sm-0" @click="discover">
            Discover
          </button>
        </div>
        <div class="col"></div>
      </div>

      <div class="row">
        <div class="col"><br /><br /></div>
      </div>

      <div class="row">
        <div class="col">
          <div v-if="fetchedDiscovered">
            <b-table
              striped
              bordered
              id="my-table"
              :items="discoveredTracks"
              :head-variant="'dark'"
              :fields="discoveredFields"
              :per-page="perPage"
              :current-page="currentPage"
              :sort-by.sync="sortBy"
              :sort-desc.sync="sortDesc"
              small
            >
              <template #cell(name)="track">
                <router-link
                  :to="{ name: 'Track', params: { id: track.item.id } }"
                >
                  {{ track.item.name }}</router-link
                >
              </template>

              <template #cell(artists)="track">
                <span
                  v-for="(artist, index) in track.item.artists"
                  :key="artist.id"
                >
                  <span v-if="index !== 0">, </span>
                  <router-link
                    :to="{ name: 'Artist', params: { id: artist.id } }"
                  >
                    {{ artist.name }}</router-link
                  >
                </span>
              </template>

              <template #cell(album)="track">
                <router-link
                  :to="{ name: 'Album', params: { id: track.item.album.id } }"
                >
                  {{ track.item.album.name }}</router-link
                >
              </template>
            </b-table>

            <div>
              <b-pagination
                v-model="currentPage"
                :total-rows="discoveredRows"
                :per-page="perPage"
                aria-controls="my-table"
              ></b-pagination>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
export default {
  name: "Discover",
  data: function() {
    return {
      selectedGenres: [],
      genreOptions: [],
      artistSearchQuery: null,
      fetchedArtists: false,
      fetchedTracks: false,
      currentPage: 1,
      perPage: 10,
      artistFields: [],
      trackFields: [],
      trackSearchQuery: null,
      artistOptions: [],
      selectedArtists: [],
      trackOptions: [],
      selectedTracks: [],
      discoveredTracks: [],
      discoveredFields: [],
      fetchedDiscovered: false,
      sortBy: "popularity",
      sortDesc: true
    };
  },
  async mounted() {
    let response = await axios.get("http://localhost:5000/genres");
    let counter = 0;
    if (response.data) {
      response.data.genres.forEach(genre => {
        this.genreOptions.push({ value: counter, text: genre });
        counter += 1;
      });
    }
  },
  methods: {
    getLength(length) {
      // Thanks to https://stackoverflow.com/questions/21294302/converting-milliseconds-to-minutes-and-seconds-with-javascript
      const minutes = Math.floor(length / 60000);
      const seconds = ((length % 60000) / 1000).toFixed(0);
      return minutes + ":" + (seconds < 10 ? "0" : "") + seconds;
    },
    async searchArtists() {
      let response = await axios.get(
        `http://localhost:5000/search/${this.artistSearchQuery}/artists`
      );
      const artists = [];
      response.data.artists.items.forEach(element => {
        artists.push(element);
      });
      this.parseArtists(artists);
    },
    parseArtists(artists) {
      this.artistOptions = [];
      const items = artists.map(artist => {
        if (artist) {
          return {
            name: artist["name"],
            popularity: artist["popularity"],
            id: artist.id,
            selected: false
          };
        }
        return null;
      });
      items.forEach(item => {
        if (item !== null) {
          this.artistOptions.push(item);
        }
      });
      this.artistFields = [
        { key: "name" },
        { key: "popularity" },
        { key: "selected" }
      ];
      this.fetchedArtists = true;
    },
    selectArtist(artist) {
      if (artist.selected) {
        this.selectedArtists.push({ name: artist.name, id: artist.id });
      }
    },
    selectTrack(track) {
      if (track.selected) {
        this.selectedTracks.push({ name: track.name, id: track.id });
      }
    },
    async searchTracks() {
      let response = await axios.get(
        `http://localhost:5000/search/${this.trackSearchQuery}/tracks`
      );
      const tracks = [];
      response.data.tracks.items.forEach(element => {
        tracks.push(element);
      });
      this.parseTracks(tracks);
    },
    async discover() {
      let response = await axios.get(`http://localhost:5000/discover`, {
        params: {
          seed_artists: this.selectedArtists.map(artist => artist.id).join("&"),
          seed_tracks: this.selectedTracks.map(track => track.id).join("&"),
          seed_genres: this.selectedGenres.map(genre => genre).join("&")
        }
      });
      const tracks = [];
      response.data.tracks.forEach(element => {
        tracks.push(element);
      });

      this.parseDiscovery(tracks);
    },
    parseTracks(tracks) {
      this.trackOptions = [];
      const items = tracks.map(track => {
        if (tracks) {
          return {
            name: track["name"],
            artists: track.artists,
            id: track.id,
            popularity: track.popularity,
            selected: false,
            album: track.album
          };
        }
        return null;
      });
      items.forEach(item => {
        if (item !== null) {
          this.trackOptions.push(item);
        }
      });
      this.trackFields = [
        { key: "name" },
        { key: "artists" },
        { key: "popularity" },
        { key: "album" },
        { key: "selected" }
      ];
      this.fetchedTracks = true;
    },
    parseDiscovery(tracks) {
      this.trackOptions = [];
      const items = tracks.map(track => {
        if (tracks) {
          return {
            name: track["name"],
            artists: track.artists,
            id: track.id,
            popularity: track.popularity,
            album: track.album
          };
        }
        return null;
      });
      items.forEach(item => {
        if (item !== null) {
          this.discoveredTracks.push(item);
        }
      });

      this.discoveredFields = [
        { key: "name" },
        { key: "artists" },
        { key: "popularity" },
        { key: "album" }
      ];
      this.fetchedDiscovered = true;
    },
    formatGenreForLink(genre) {
      const formattedGenre = genre.replace(/(^\w|\s\w)/g, m => m.toUpperCase());
      formattedGenre.replace(" ", "%20");
      return formattedGenre;
    },

    formatGenreName(genre) {
      return genre.replace(/(^\w|\s\w)/g, m => m.toUpperCase());
    }
  },
  computed: {
    // Convert e.g. short_term to Last 4 weeks
    formatPeriod: function() {
      let period = "";
      switch (this.show) {
        case "short_term":
          period = "last 4 weeks";
          break;
        case "medium_term":
          period = "last 6 months";
          break;
        case "long_term":
          period = "all-time";
          break;
      }
      return period;
    },
    artistRows() {
      return this.artistOptions.length;
    },
    trackRows() {
      return this.trackOptions.length;
    },
    discoveredRows() {
      return this.discoveredTracks.length;
    }
  }
};
</script>

<style></style>
