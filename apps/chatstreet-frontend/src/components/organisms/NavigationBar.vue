<style lang="scss" src="@/styles/components/organisms/NavigationBar.scss" scoped></style>

<template>
  <div class="navigation-backround-shape" :style="navigationIndentStyleVariable">
    <div class="pseudo-corner-top-left" />
    <div class="pseudo-corner-top-right" />
    <div class="pseudo-corner-bottom" />
    <div class="pseudo-navigation-background" />
  </div>
  <nav class="navigation-bar">
    <ol class="navigation-bar-list">
      <!-- Maybe outsource to component in future -->
      <li
        class="list-element"
        @click="handleConfluenceClick"
        :class="navigationActiveConfluenceClassModifier"
      >
        <span class="list-element-icon icon-confluence" />
        <label class="list-element-label">Confluence</label>
      </li>
      <li
        class="list-element"
        @click="handleThemesClick"
        :class="navigationActiveThemesClassModifier"
      >
        <span class="list-element-icon icon-themes" />
        <label class="list-element-label">Themes</label>
      </li>
      <li
        class="list-element"
        @click="handleSettingsClick"
        :class="navigationActiveSettingsClassModifier"
      >
        <span class="list-element-icon icon-settings" />
        <label class="list-element-label">Settings</label>
      </li>
    </ol>
  </nav>
</template>

<script lang="ts">
import router from '@/router';
import { defineComponent, ComputedRef, computed } from 'vue';
import { useRoute, RouteLocationNormalizedLoaded } from 'vue-router';

type ActiveNavigationType = 'confluence' | 'themes' | 'settings';

export default defineComponent({
  name: 'NavigationBar',
  setup() {
    const route: RouteLocationNormalizedLoaded = useRoute();
    const active: ComputedRef<ActiveNavigationType> = computed(
      (): ActiveNavigationType => route.hash.split('#').pop() as ActiveNavigationType,
    );
    const isConfluence: ComputedRef<boolean> = computed(
      (): boolean => active.value === 'confluence',
    );
    const isThemes: ComputedRef<boolean> = computed((): boolean => active.value === 'themes');
    const isSettings: ComputedRef<boolean> = computed((): boolean => active.value === 'settings');
    const navigationIndentStyleVariable: ComputedRef<string> = computed((): string => {
      switch (true) {
        case isConfluence.value:
          return '--indent-position: 20%';
        case isThemes.value:
          return '--indent-position: 50%';
        case isSettings.value:
          return '--indent-position: 80%';
        default:
          return '';
      }
    });
    const navigationActiveConfluenceClassModifier: ComputedRef<string> = computed((): string => (isConfluence.value ? 'list-element--active' : ''));
    const navigationActiveThemesClassModifier: ComputedRef<string> = computed((): string => (isThemes.value ? 'list-element--active' : ''));
    const navigationActiveSettingsClassModifier: ComputedRef<string> = computed((): string => (isSettings.value ? 'list-element--active' : ''));
    const handleConfluenceClick = (): void => {
      router.push({ hash: '#confluence' });
    };
    const handleThemesClick = (): void => {
      router.push({ hash: '#themes' });
    };
    const handleSettingsClick = (): void => {
      router.push({ hash: '#settings' });
    };
    return {
      handleConfluenceClick,
      handleThemesClick,
      handleSettingsClick,
      navigationActiveConfluenceClassModifier,
      navigationActiveThemesClassModifier,
      navigationActiveSettingsClassModifier,
      navigationIndentStyleVariable,
      isConfluence,
      isThemes,
      isSettings,
    };
  },
});
</script>
