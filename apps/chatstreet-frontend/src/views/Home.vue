<style lang="scss" src="../styles/views/Home.scss" scoped></style>

<template>
  <main>
    <header></header>
    <h1>Hello and Welcome to Chatstreet</h1>
    <h3>
      The safest and best messenger on the markt. The only people on the world who knows about the
      chat is you and you chatpartner
    </h3>
    <footer>
      <p>Made by David and Loris</p>
    </footer>
  </main>
</template>

<script lang="ts">
import {
  computed, defineComponent, onMounted, PropType, ref, watch,
} from 'vue';
import store from '@/store';

export default defineComponent({
  name: 'Home',
  setup() {
    return {};
  },
});
</script>
