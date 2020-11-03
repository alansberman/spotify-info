<template>
  <div>
    <div
      class="container-fluid"
      v-if="
        !(detailsFetched && analysisFetched && featuresFetched && lyricsFetched)
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
        detailsFetched && analysisFetched && featuresFetched && lyricsFetched
      "
    >
      <br />

      <div class="row">
        <div class="col">
          <div class="btn-group dropright">
            <button
              class="btn btn-success dropdown-toggle"
              type="button"
              id="dropdownMenuButton"
              data-toggle="dropdown"
              aria-haspopup="true"
              aria-expanded="false"
            >
              Add to Playlist
            </button>
            <div class="dropdown-menu" aria-labelledby="dropdownMenuButton">
              <div v-for="playlist in playlists" :key="playlist.id">
                <!-- <a class="dropdown-item" href="#">{{ playlist.name }}</a> -->
                <div
                  class="dropdown-item"
                  style="cursor: pointer;"
                  @click="addToPlaylist(playlist)"
                >
                  {{ playlist.name }}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="col">
          <h3>
            {{ track.name }} -
            <span v-for="(artist, index) in track.artists" :key="artist.id">
              <span v-if="index !== 0">, </span>
              <router-link :to="{ name: 'Artist', params: { id: artist.id } }">
                {{ artist.name }}</router-link
              >
            </span>
          </h3>
          <h4>
            off the {{ formatReleaseDate }} album "<router-link
              :to="{ name: 'Album', params: { id: track.album.id } }"
              >{{ track.album.name }}</router-link
            >"
          </h4>
        </div>
        <div class="col">
          <div class="btn-group dropright">
            <button
              class="btn btn-success dropdown-toggle"
              type="button"
              id="dropdownMenuButton"
              data-toggle="dropdown"
              aria-haspopup="true"
              aria-expanded="false"
            >
              Compare to Playlist
            </button>
            <div class="dropdown-menu" aria-labelledby="dropdownMenuButton">
              <div v-for="playlist in playlists" :key="playlist.id">
                <!-- <a class="dropdown-item" href="#">{{ playlist.name }}</a> -->
                <div
                  class="dropdown-item"
                  style="cursor: pointer;"
                  @click="showModal(playlist)"
                >
                  {{ playlist.name }}
                </div>
              </div>
            </div>
          </div>
          <!-- <button
            type="button"
            class="btn btn-success"
            data-toggle="modal"
            data-target="#compareModal"
          >
            Compare With My Listening Habits
          </button> -->
          <b-modal v-model="modalShow" :title="modalTitle">
            <table class="table table-striped table-bordered">
              <thead class="thead-dark">
                <tr>
                  <th scope="col">Feature</th>
                  <th scope="col">Track Value</th>
                  <th scope="col">Playlist Average Value</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Acousticness</td>
                  <td>
                    <b-progress show-progress>
                      <b-progress-bar
                        :value="track.acousticness.toFixed(2) * 100"
                        variant="success"
                      ></b-progress-bar>
                    </b-progress>
                  </td>
                  <td>
                    <b-progress show-progress>
                      <b-progress-bar
                        :value="playlistCompared.acousticness_average"
                        variant="success"
                      ></b-progress-bar>
                    </b-progress>
                  </td>
                </tr>
                <tr>
                  <td>Danceability</td>
                  <td>
                    <b-progress show-progress>
                      <b-progress-bar
                        :value="track.danceability.toFixed(2) * 100"
                        variant="success"
                      ></b-progress-bar>
                    </b-progress>
                  </td>
                  <td>
                    <b-progress show-progress>
                      <b-progress-bar
                        :value="playlistCompared.danceability_average"
                        variant="success"
                      ></b-progress-bar>
                    </b-progress>
                  </td>
                </tr>
                <tr>
                  <td>Energy</td>
                  <td>
                    <b-progress show-progress>
                      <b-progress-bar
                        :value="track.energy.toFixed(2) * 100"
                        variant="success"
                      ></b-progress-bar>
                    </b-progress>
                  </td>
                  <td>
                    <b-progress show-progress>
                      <b-progress-bar
                        :value="playlistCompared.energy_average"
                        variant="success"
                      ></b-progress-bar>
                    </b-progress>
                  </td>
                </tr>
                <tr>
                  <td>Instrumentalness</td>
                  <td>
                    <b-progress show-progress>
                      <b-progress-bar
                        :value="track.instrumentalness.toFixed(2) * 100"
                        variant="success"
                      ></b-progress-bar>
                    </b-progress>
                  </td>
                  <td>
                    <b-progress show-progress>
                      <b-progress-bar
                        :value="playlistCompared.instrumentalness_average"
                        variant="success"
                      ></b-progress-bar>
                    </b-progress>
                  </td>
                </tr>
                <tr>
                  <td>Liveness</td>
                  <td>
                    <b-progress show-progress>
                      <b-progress-bar
                        :value="track.liveness.toFixed(2) * 100"
                        variant="success"
                      ></b-progress-bar>
                    </b-progress>
                  </td>
                  <td>
                    <b-progress show-progress>
                      <b-progress-bar
                        :value="playlistCompared.liveness_average"
                        variant="success"
                      ></b-progress-bar>
                    </b-progress>
                  </td>
                </tr>

                <tr>
                  <td>Speechiness</td>
                  <td>
                    <b-progress show-progress>
                      <b-progress-bar
                        :value="track.speechiness.toFixed(2) * 100"
                        variant="success"
                      ></b-progress-bar>
                    </b-progress>
                  </td>
                  <td>
                    <b-progress show-progress>
                      <b-progress-bar
                        :value="playlistCompared.speechiness_average"
                        variant="success"
                      ></b-progress-bar>
                    </b-progress>
                  </td>
                </tr>
                <tr>
                  <td>Valence</td>
                  <td>
                    <b-progress show-progress>
                      <b-progress-bar
                        :value="track.valence.toFixed(2) * 100"
                        variant="success"
                      ></b-progress-bar>
                    </b-progress>
                  </td>
                  <td>
                    <b-progress show-progress>
                      <b-progress-bar
                        :value="playlistCompared.valence_average"
                        variant="success"
                      ></b-progress-bar>
                    </b-progress>
                  </td>
                </tr>
              </tbody>
            </table>
          </b-modal>
        </div>
      </div>

      <div class="row">
        <div class="col"></div>
        <div class="col">
          <br />
          <div
            class="alert alert-success alert-dismissible fade show"
            role="alert"
            v-if="addedTrack"
          >
            Added track to {{ playlistAddedTo }}
            <button
              type="button"
              class="close"
              data-dismiss="alert"
              aria-label="Close"
              @click="addedTrack = false"
            >
              <span aria-hidden="true">&times;</span>
            </button>
          </div>

          <div
            class="alert alert-danger alert-dismissible fade show"
            role="alert"
            v-if="!addedTrack & playlistAddedTo"
          >
            Failed to add track to {{ playlistAddedTo }}
            <button
              type="button"
              class="close"
              data-dismiss="alert"
              aria-label="Close"
              @click="addedTrack = false"
            >
              <span aria-hidden="true">&times;</span>
            </button>
          </div>

          <br /><br />
        </div>
        <div class="col"></div>
      </div>

      <div class="row">
        <div class="col">
          <table class="table table-striped table-bordered">
            <thead class="thead-dark">
              <tr>
                <th scope="col">Feature</th>
                <th scope="col">Value</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Key</td>
                <td>
                  <div v-html="getFullKey"></div>
                  <small>Confidence: {{ track.key_confidence }}</small>
                </td>
              </tr>
              <tr>
                <td>Tempo</td>
                <td>
                  {{ track.tempo.toFixed(0) }} BPM
                  <small>Confidence: {{ getBeatConfidence }}</small>
                </td>
              </tr>
              <tr>
                <td>Time Signature</td>
                <td>
                  <div
                    v-html="
                      `<sup>${track.time_signature}</sup>&frasl;<sub>4</sub>`
                    "
                  ></div>
                  <small
                    >Confidence: {{ track.time_signature_confidence }}</small
                  >
                </td>
              </tr>
              <tr>
                <td>Acousticness</td>
                <td>
                  <b-progress show-progress>
                    <b-progress-bar
                      :value="getProgressValue('acousticness')"
                      variant="success"
                    ></b-progress-bar>
                  </b-progress>
                </td>
              </tr>
              <tr>
                <td>Danceability</td>
                <td>
                  <b-progress show-progress>
                    <b-progress-bar
                      :value="getProgressValue('danceability')"
                      variant="success"
                    ></b-progress-bar>
                  </b-progress>
                </td>
              </tr>
              <tr>
                <td>Energy</td>
                <td>
                  <b-progress show-progress>
                    <b-progress-bar
                      :value="getProgressValue('energy')"
                      variant="success"
                    ></b-progress-bar>
                  </b-progress>
                </td>
              </tr>
              <tr>
                <td>Instrumentalness</td>
                <td>
                  <b-progress
                    show-progress
                    v-if="getProgressValue('instrumentalness') > 0"
                  >
                    <b-progress-bar
                      :value="getProgressValue('instrumentalness')"
                      variant="success"
                    ></b-progress-bar>
                  </b-progress>
                  <div v-else>{{ track.instrumentalness.toFixed(2) }}</div>
                </td>
              </tr>
              <tr>
                <td>Liveness</td>
                <td>
                  <b-progress show-progress>
                    <b-progress-bar
                      :value="getProgressValue('liveness')"
                      variant="success"
                    ></b-progress-bar>
                  </b-progress>
                </td>
              </tr>
              <tr>
                <td>Loudness</td>
                <td>{{ track.loudness.toFixed(2) }} dB</td>
              </tr>

              <tr>
                <td>Speechiness</td>
                <td>
                  <b-progress show-progress>
                    <b-progress-bar
                      :value="getProgressValue('speechiness')"
                      variant="success"
                    ></b-progress-bar>
                  </b-progress>
                </td>
              </tr>
              <tr>
                <td>Valence</td>
                <td>
                  <b-progress show-progress>
                    <b-progress-bar
                      :value="getProgressValue('valence')"
                      variant="success"
                    ></b-progress-bar>
                  </b-progress>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="col" v-if="lyrics.length > 0">
          <div>
            <h3>Lyrics</h3>
            <div class="overflow-auto" style="height: 600px; width: 600px">
              <div v-for="(line, index) in lyrics" :key="index">{{ line }}</div>
            </div>
          </div>
        </div>
        <div class="col">
          <h4>Album Cover</h4>
          <img :src="track.image.url" class="img-fluid" alt="Album photo" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
export default {
  name: "Track",
  props: ["id"],
  data() {
    return {
      track: {},
      detailsFetched: false,
      addedTrack: false,
      failedToAddTrack: false,
      featuresFetched: false,
      playlistAddedTo: String,
      analysisFetched: false,
      lyricsFetched: false,
      playlistCompared: {},
      summary: "",

      features: [
        "acousticness",
        "danceability",
        "energy",
        "liveness",
        "speechiness",
        "instrumentalness",
        "valence"
      ],
      lyrics: [],
      modalShow: false,
      modalTitle: "",
      playlists: [],
      fullKey: String,
      beatConfidences: []
    };
  },
  mounted() {
    this.getData();
  },
  methods: {
    async getData() {
      let resp = await axios.get(
        `http://localhost:5000/track/${this.$route.params.id}/details`
      );
      this.track.popularity = resp.data.popularity;
      this.track.name = resp.data.name;
      this.track.id = resp.data.uri;
      this.track.image = resp.data.album.images[0];
      this.track.album = resp.data.album;
      this.track.artist_id = resp.data.artists[0].id;
      this.track.artists = [];
      resp.data.artists.forEach(artist => this.track.artists.push(artist));

      resp = await axios.get(
        `http://localhost:5000/album/${this.track.album.id}`
      );
      this.track.album_genres = [];
      // thanks https://stackoverflow.com/questions/32589197/how-can-i-capitalize-the-first-letter-of-each-word-in-a-string-using-javascript
      resp.data.genres.forEach(genre =>
        this.track.album_genres.push(
          genre.replace(/(^\w|\s\w)/g, m => m.toUpperCase())
        )
      );
      this.track.album_popularity = resp.data.popularity;
      this.track.album_release_date = resp.data.release_date;

      // Remove e.g. - 2006 Remaster
      let nameToSearch = this.track.name.split("-")[0];
      nameToSearch = nameToSearch.replace(/\s/g, "%20");
      const artistNameToSearch = this.track.artists[0].name.replace(" ", "%20");

      resp = await axios.get(
        `http://localhost:5000/track/${nameToSearch}/artist/${artistNameToSearch}/lyrics`
      );
      if (resp.data.lyrics) {
        this.lyrics = resp.data.lyrics.split("\n");
      }
      this.lyricsFetched = true;

      this.detailsFetched = true;
      resp = await axios.get(
        `http://localhost:5000/track/${this.$route.params.id}/audio-analysis`
      );
      this.track.bars = resp.data.bars.length;
      this.track.beats = resp.data.beats.length;
      resp.data.beats.forEach(beat => {
        this.beatConfidences.push(beat.confidence);
      });
      this.track.sections = resp.data.sections.length;
      this.track.segments = resp.data.segments.length;
      this.track.tatums = resp.data.tatums.length;
      this.track.tempo_confidence = resp.data.track.tempo_confidence;
      this.track.key_confidence = resp.data.track.key_confidence;
      this.track.time_signature_confidence =
        resp.data.track.time_signature_confidence;
      this.analysisFetched = true;
      resp = await axios.get(
        `http://localhost:5000/track/${this.$route.params.id}/audio-features`
      );
      this.track.acousticness = resp.data[0].acousticness;
      this.track.danceability = resp.data[0].danceability;
      this.track.energy = resp.data[0].energy;
      this.track.key = resp.data[0].key;
      this.track.liveness = resp.data[0].liveness;
      this.track.loudness = resp.data[0].loudness;
      this.track.mode = resp.data[0].mode;
      this.track.speechiness = resp.data[0].speechiness;
      this.track.tempo = resp.data[0].tempo;
      this.track.instrumentalness = resp.data[0].instrumentalness;
      this.track.time_signature = resp.data[0].time_signature;
      this.track.valence = resp.data[0].valence;
      this.featuresFetched = true;

      // Get playlists
      resp = await axios.get("http://localhost:5000/playlists");
      resp.data.items.forEach(pl => {
        if (pl.owner.display_name === "Alan Berman") {
          this.playlists.push(pl);
        }
      });
      this.fetchedData = true;
    },

    getKey() {
      switch (this.track.key) {
        case 0:
          return "C";
        case 1:
          return "C&sharp;/D&flat;";
        case 2:
          return "D";
        case 3:
          return "D&sharp;/E&flat;";
        case 4:
          return "E";
        case 5:
          return "F";
        case 6:
          return "F&sharp;/G&flat;";
        case 7:
          return "G";
        case 8:
          return "G&sharp;/A&flat;";
        case 9:
          return "A";
        case 10:
          return "A&sharp;/B&flat;";
        case 11:
          return "B";
      }
    },

    getProgressValue(property) {
      return this.track[property].toFixed(2) * 100;
    },

    async showModal(playlist) {
      this.modalShow = true;
      this.modalTitle = `Comparison with ${playlist.name}`;
      this.playlistCompared = await axios.get(
        `http://localhost:5000/playlist/${playlist.id}/features`
      );
      this.features.forEach(feature => {
        const data = this.playlistCompared.data
          .map(track => track[feature])
          .sort();
        // console.log(data);
        this.playlistCompared[feature + "_average"] =
          (data.reduce((total, curr) => total + curr, 0) / data.length).toFixed(
            2
          ) * 100;
      });
    },

    async addToPlaylist(playlist) {
      try {
        await axios.get(
          `http://localhost:5000/playlist/${playlist.id}/add-track/${this.track.id}`
        );
        this.addedTrack = true;
        this.playlistAddedTo = playlist.name;
      } catch (e) {
        this.playlistAddedTo = playlist.name;
        this.failedToAddTrack = true;
      }
    }
  },
  computed: {
    getFullKey() {
      const mood = this.track.mode === 1 ? "Maj" : "Min";
      return this.getKey() + " " + mood;
    },

    isMusicRelated: function(content) {
      content = content.toString();
      return (
        content.includes("music") ||
        content.includes("band") ||
        content.includes("artist") ||
        content.includes("song") ||
        content.includes("composer")
      );
    },

    getBeatConfidence() {
      return (
        this.beatConfidences.reduce((acc, curr) => acc + curr, 0) /
        this.beatConfidences.length
      ).toFixed(2);
    },

    formatReleaseDate() {
      return this.track.album.release_date.split("-")[0];
    }
  }
};
</script>

<style scoped>
.list-group {
  margin: 2px;
}

.btn-success {
  background-color: #3eaf7c;
}
</style>
