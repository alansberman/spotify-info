<template>
  <h4>Congratulations! You have authenticated</h4>
</template>

<script>
export default {
  name: "Callback.vue",
  mounted() {
    console.log("woo");
    console.log(this.$route.path);
    this.$router.push({ name: "Home" });
  }
};
</script>

<style></style>
