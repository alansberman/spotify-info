<template>
  <div class="bg-light">
    <div class="container-fluid" v-if="!summaryFetched">
      <div class="row">
        <div class="col"></div>
        <div class="col">
          <br /><br /><br /><br /><br />
          <div class="spinner-border text-success" role="status"></div>
        </div>
        <div class="col"></div>
      </div>
    </div>
    <div class="container-fluid" v-if="summaryFetched">
      <div class="row">
        <div class="col"></div>
        <div class="col">
          <br /><br />
          <h2>{{ genreName }}</h2>
          <br /><br />
        </div>
        <div class="col"></div>
      </div>
      <div class="row">
        <div class="col">
          <p v-text="summary"></p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
export default {
  name: "Genre",
  props: ["name"],
  data() {
    return {
      summaryFetched: false,
      summary: ""
    };
  },
  async mounted() {
    let response = await axios.get(
      `http://localhost:5000/${this.$route.params.name}/summary`
    );
    if (typeof response.data === "string") {
      // Strip out annoying titles like '== Background =='
      this.summary = response.data.replace(/\s[=]{2,3}\s[^]*\s[=]{2,3}\s/g, "");
    } else {
      this.summary = "Unable to fetch genre information.";
    }
    this.summaryFetched = true;
  },
  computed: {
    genreName: function() {
      return this.$route.params.name.replace(/(^\w|\s\w)/g, m =>
        m.toUpperCase()
      );
    }
  }
};
</script>

<style scoped></style>
