<style lang="scss" src="@/styles/components/templates/HomeTemplate.scss" scoped></style>

<template>
  <div class="home-template">
    <header-template class="home-template-header">
      <template v-slot:content>
        <slot name="header"></slot>
      </template>
    </header-template>
    <main class="home-template-main">
      <slot name="main"></slot>
    </main>
    <div class="home-template-footer">
      <navigation-bar />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import HeaderTemplate from '@/components/templates/HeaderTemplate.vue';
import NavigationBar from '@/components/organisms/NavigationBar.vue';

export default defineComponent({
  name: 'HomeTemplate',
  components: { HeaderTemplate, NavigationBar },
  setup() {
    return {};
  },
});
</script>
