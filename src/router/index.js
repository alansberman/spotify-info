import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../views/Home.vue";
import Playlist from "../components/Playlist";
import Track from "../components/Track";
import TopTracks from "../components/TopTracks";
import TopArtists from "../components/TopArtists";
import Artist from "../components/Artist";
import Album from "../components/Album";
import Glossary from "../components/Glossary";
import Genre from "../components/Genre";
Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home
  },
  {
    path: "/top-tracks",
    name: "TopTracks",
    component: TopTracks
  },
  {
    path: "/top-artists",
    name: "TopArtists",
    component: TopArtists
  },
  {
    path: "/glossary",
    name: "Glossary",
    component: Glossary
  },
  {
    path: "/playlist/:id",
    name: "Playlist",
    component: Playlist,
    props: true
  },
  {
    path: "/genre/:name",
    name: "Genre",
    component: Genre,
    props: true
  },
  {
    path: "/album/:id",
    name: "Album",
    component: Album,
    props: true
  },
  {
    path: "/track/:id",
    name: "Track",
    component: Track,
    props: true
  },
  {
    path: "/artist/:id",
    name: "Artist",
    component: Artist,
    props: true
  },
  {
    path: "/about",
    name: "About",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/About.vue")
  }
];

const router = new VueRouter({
  routes,
  mode: "history"
});

export default router;
