<template>
  <div class="back shadow">
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
          <h2>My Top Tracks ({{ formatPeriod }})</h2>
        </div>
        <div class="col"></div>
      </div>
      <div class="row" v-if="charts.length > 0">
        <div class="col">
          <h6>Acousticness</h6>
          <h5>
            <b-progress show-progress>
              <b-progress-bar
                :value="averages.acousticness * 100"
                variant="success"
              ></b-progress-bar>
            </b-progress>
          </h5>
        </div>
        <div class="col">
          <h6>Danceability</h6>
          <h5>
            <b-progress show-progress>
              <b-progress-bar
                :value="averages.danceability * 100"
                variant="success"
              ></b-progress-bar>
            </b-progress>
          </h5>
        </div>
        <div class="col">
          <h6>Energy</h6>
          <h5>
            <b-progress show-progress>
              <b-progress-bar
                :value="averages.energy * 100"
                variant="success"
              ></b-progress-bar>
            </b-progress>
          </h5>
        </div>
        <div class="col">
          <h6>Liveness</h6>
          <h5>
            <b-progress show-progress>
              <b-progress-bar
                :value="averages.liveness * 100"
                variant="success"
              ></b-progress-bar>
            </b-progress>
          </h5>
        </div>
        <div class="col">
          <h6>Speechiness</h6>
          <h5>
            <b-progress show-progress>
              <b-progress-bar
                :value="averages.speechiness * 100"
                variant="success"
              ></b-progress-bar>
            </b-progress>
          </h5>
        </div>
        <div class="col">
          <h6>Instrumentalness</h6>
          <h5>
            <b-progress show-progress>
              <b-progress-bar
                :value="averages.instrumentalness * 100"
                variant="success"
              ></b-progress-bar>
            </b-progress>
          </h5>
        </div>
        <div class="col">
          <h6>Valence</h6>
          <h5>
            <b-progress show-progress>
              <b-progress-bar
                :value="averages.valence * 100"
                variant="success"
              ></b-progress-bar>
            </b-progress>
          </h5>
          <br /><br />
        </div>
      </div>
      <div class="row">
        <div class="col"></div>
        <div class="col">
          <button
            type="button"
            class="btn btn-success"
            @click="showFeatureGraphs = !showFeatureGraphs"
          >
            <span v-if="showFeatureGraphs">Hide</span>
            <span v-else>Show</span>
            <span> Characteristics Graphs</span>
          </button>
          <br />
          <br />
        </div>
        <div class="col"></div>
      </div>
      <div class="row">
        <div class="col"></div>
        <div class="col">
          <h4 v-if="charts.length > 0 && showFeatureGraphs">
            Characteristics of My Top Tracks ({{ formatPeriod }})
          </h4>
        </div>
        <div class="col"></div>
      </div>
      <div class="row" v-if="showFeatureGraphs">
        <div v-for="(chart, index) in charts" :key="chart.id" class="col">
          <h5 v-if="chart.fetched">
            {{
              features[index].charAt(0).toUpperCase() + features[index].slice(1)
            }}
          </h5>
          <div style="width: 500px; height: 500px;">
            <Chart
              v-if="chart.fetched"
              :chartdata="chart.chartdata"
              :options="chartOptions"
            />
          </div>
        </div>
      </div>
      <div class="row">
        <br /><br />
        <div class="col"></div>
        <div class="col">
          <button
            type="button"
            class="btn btn-success"
            @click="filterTracks('short_term')"
          >
            Last 4 weeks
          </button>
          &nbsp;
          <button
            type="button"
            class="btn btn-success"
            @click="filterTracks('medium_term')"
          >
            Last 6 months
          </button>
          &nbsp;
          <button
            type="button"
            class="btn btn-success"
            @click="filterTracks('long_term')"
          >
            All-time
          </button>

          <br /><br />
        </div>
        <div class="col"></div>
      </div>
      <div class="row">
        <table
          class="table table-striped table-bordered"
          style="margin: 13px 13px"
        >
          <thead class="thead-dark">
            <tr>
              <th scope="col">Title</th>
              <th scope="col">Artists</th>
              <th scope="col">Album</th>
              <th scope="col">Duration</th>
              <th scope="col">Popularity</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="track in tracksToDisplay" :key="`short.${track.id}`">
              <td>
                <router-link :to="{ name: 'Track', params: { id: track.id } }">
                  {{ track.name }}</router-link
                >
              </td>
              <td>
                <span v-for="(artist, index) in track.artists" :key="artist.id">
                  <span v-if="index !== 0">, </span>
                  <router-link
                    :to="{ name: 'Artist', params: { id: artist.id } }"
                  >
                    {{ artist.name }}</router-link
                  >
                </span>
              </td>
              <td>
                <router-link
                  :to="{ name: 'Album', params: { id: track.album.id } }"
                  >{{ track.album.name }}</router-link
                >
              </td>
              <td>{{ getLength(track.duration_ms) }}</td>
              <td>{{ track.popularity }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import Chart from "./Chart";

export default {
  name: "TopTracks",
  components: { Chart },
  data: function() {
    return {
      tracks: [],
      tracksToDisplay: [],
      shortTermTracks: [],
      mediumTermTracks: [],
      longTermTracks: [],
      show: "short_term",
      showFeatureGraphs: false,
      averages: {
        acousticness: 0,
        danceability: 0,
        energy: 0,
        liveness: 0,
        speechiness: 0,
        instrumentalness: 0,
        valence: 0
      },

      features: [
        "acousticness",
        "danceability",
        "energy",
        "liveness",
        "speechiness",
        "instrumentalness",
        "valence"
      ],
      fetchedShortTerm: false,
      fetchedMediumTerm: false,
      chartFetched: false,
      fetchedLongTerm: false,
      charts: [],
      chartdata: {
        labels: [],
        datasets: []
      },
      chartOptions: {
        responsive: true,
        maintainAspectRatio: false,
        legend: {
          display: false
        },
        scales: {
          xAxes: [
            {
              gridLines: {
                display: false
              }
            }
          ],
          yAxes: [
            {
              gridLines: {
                display: false
              }
            }
          ]
        }
      }
    };
  },
  async mounted() {
    this.fetchData();
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
    }
  },
  methods: {
    getLength(length) {
      // Thanks to https://stackoverflow.com/questions/21294302/converting-milliseconds-to-minutes-and-seconds-with-javascript
      const minutes = Math.floor(length / 60000);
      const seconds = ((length % 60000) / 1000).toFixed(0);
      return minutes + ":" + (seconds < 10 ? "0" : "") + seconds;
    },
    async filterTracks(period) {
      switch (period) {
        case "short_term":
          this.tracksToDisplay = this.shortTermTracks;
          break;
        case "medium_term":
          this.tracksToDisplay = this.mediumTermTracks;
          break;
        case "long_term":
          this.tracksToDisplay = this.longTermTracks;
          break;
      }
      if (this.show !== period) {
        if (this.showFeatureGraphs) {
          this.showFeatureGraphs = false;
        }
        this.charts = [];
        this.fetchCharts();
        this.show = period;
      }
    },
    async fetchData() {
      let response = await axios.get(
        "http://localhost:5000/my-top-tracks/short_term"
      );
      response.data.items.forEach(track => {
        this.tracks.push(track);
        this.tracksToDisplay.push(track);
        this.shortTermTracks.push(track);
      });

      this.fetchedShortTerm = true;

      this.fetchCharts();

      response = await axios.get(
        "http://localhost:5000/my-top-tracks/medium_term"
      );

      response.data.items.forEach(track => {
        this.tracks.push(track);
        this.mediumTermTracks.push(track);
      });
      this.fetchedMediumTerm = true;

      response = await axios.get(
        "http://localhost:5000/my-top-tracks/long_term"
      );
      response.data.items.forEach(track => {
        this.tracks.push(track);
        this.longTermTracks.push(track);
      });
      this.fetchedLongTerm = true;
    },
    async setUpChart(feature) {
      try {
        let response = await axios.get(
          `http://localhost:5000/my-top-tracks/${this.show}/features`
        );
        const data = response.data.map(track => track[feature]).sort();
        this.averages[feature] = (
          data.reduce((total, curr) => total + curr, 0) / data.length
        ).toFixed(2);
        const chart = {};
        chart.chartdata = {};
        chart.chartdata.labels = Array(50).fill("");
        chart.chartdata.datasets = [
          {
            backgroundColor: "#3eaf7c",
            borderColor: "#9bdcbe",
            barPercentage: 1,
            categoryPercentage: 1,
            data: data,
            label: [""]
          }
        ];
        chart.name = feature.charAt(0).toUpperCase() + feature.slice(1);
        chart.id = feature;
        chart.fetched = true;
        return chart;
      } catch (e) {
        console.log(e);
        return null;
      }
    },
    async fetchCharts() {
      for (const feature of this.features) {
        const chart = await this.setUpChart(feature);
        if (chart) {
          this.charts.push(chart);
        }
      }
    }
  }
};
</script>

<style scoped>
.btn-success {
  background-color: #3eaf7c;
}
</style>
