<template>
  <div v-if="detailsFetched && analysisFetched && featuresFetched">
    <div class="container-fluid">
      <br />

      <div class="row">
        <div class="col"></div>
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
            Off the {{ formatReleaseDate }} album "<router-link
              :to="{ name: 'Album', params: { id: track.album.id } }"
              >{{ track.album.name }}</router-link
            >"
          </h4>
        </div>
        <div class="col"></div>
      </div>

      <div class="row"><br /><br /><br /></div>

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
                  {{ getFullKey }}
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
                  {{ track.time_signature }}/4
                  <small
                    >Confidence: {{ track.time_signature_confidence }}</small
                  >
                </td>
              </tr>
              <tr>
                <td>Acousticness</td>
                <td>{{ track.acousticness }}</td>
              </tr>
              <tr>
                <td>Danceability</td>
                <td>{{ track.danceability }}</td>
              </tr>
              <tr>
                <td>Energy</td>
                <td>{{ track.energy }}</td>
              </tr>
              <tr>
                <td>Liveness</td>
                <td>{{ track.liveness }}</td>
              </tr>
              <tr>
                <td>Loudness</td>
                <td>{{ track.loudness.toFixed(0) }} dB</td>
              </tr>
              <tr>
                <td>Speechiness</td>
                <td>{{ track.speechiness }}</td>
              </tr>
              <tr>
                <td>Valence</td>
                <td>{{ track.valence }}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="col">
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
      featuresFetched: false,
      analysisFetched: false,
      fullKey: String,
      beatConfidences: []
    };
  },
  mounted() {
    axios
      .get(`http://localhost:5000/track/${this.$route.params.id}/details`)
      .then(resp => {
        this.track.popularity = resp.data.popularity;
        this.track.name = resp.data.name;
        this.track.image = resp.data.album.images[0];
        this.track.album = resp.data.album;
        this.track.artist_id = resp.data.artists[0].id;
        this.track.artists = [];
        resp.data.artists.forEach(artist => this.track.artists.push(artist));

        axios
          .get(`http://localhost:5000/album/${this.track.album.id}`)
          .then(resp => {
            this.track.album_genres = [];
            // thanks https://stackoverflow.com/questions/32589197/how-can-i-capitalize-the-first-letter-of-each-word-in-a-string-using-javascript
            resp.data.genres.forEach(genre =>
              this.track.album_genres.push(
                genre.replace(/(^\w|\s\w)/g, m => m.toUpperCase())
              )
            );
            this.track.album_popularity = resp.data.popularity;
            this.track.album_release_date = resp.data.release_date;
          });
        this.detailsFetched = true;
      });
    axios
      .get(
        `http://localhost:5000/track/${this.$route.params.id}/audio-analysis`
      )
      .then(resp => {
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
      });
    axios
      .get(
        `http://localhost:5000/track/${this.$route.params.id}/audio-features`
      )
      .then(resp => {
        this.track.acousticness = resp.data[0].acousticness;
        this.track.danceability = resp.data[0].danceability;
        this.track.energy = resp.data[0].energy;
        this.track.key = resp.data[0].key;
        this.track.liveness = resp.data[0].liveness;
        this.track.loudness = resp.data[0].loudness;
        this.track.mode = resp.data[0].mode;
        this.track.speechiness = resp.data[0].speechiness;
        this.track.tempo = resp.data[0].tempo;
        this.track.time_signature = resp.data[0].time_signature;
        this.track.valence = resp.data[0].valence;
        this.featuresFetched = true;
      });
  },
  methods: {
    getKey() {
      switch (this.track.key) {
        case 0:
          return "C";
        case 1:
          return "C#/Db";
        case 2:
          return "D";
        case 3:
          return "D#/Eb";
        case 4:
          return "E";
        case 5:
          return "F";
        case 6:
          return "F#/Gb";
        case 7:
          return "G";
        case 8:
          return "G#/Ab";
        case 9:
          return "A";
        case 10:
          return "A#/Bb";
        case 11:
          return "B";
      }
    }
  },
  computed: {
    getFullKey() {
      const mood = this.track.mode === 1 ? "Maj" : "Min";
      return this.getKey() + " " + mood;
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
</style>
