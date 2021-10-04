<template>
  <div>
    <BaseHeader />
    <AsideMenu />
    <v-main>
      <v-container>
        <section class="containerDefault">
          <div class="backgroundGreen"></div>
        <Nuxt />
        </section>
      </v-container>
    </v-main>
  </div>
</template>

<script>
import BaseHeader from '@/components/ui/BaseHeader.vue'
import AsideMenu from '@/components/ui/AsideMenu.vue'

export default {
  components: {
    AsideMenu,
    BaseHeader,
  },
  middleware: 'auth',
}
</script>

<style>
.containerDefault {
  padding-top: 5rem;
  padding-left: 15rem;
      background: var(--background-color);
}

.backgroundGreen {
  position: absolute;
  top: 4rem;
  width: 100%;
  height: 15rem;
  background:#2dce89;
  z-index: 1;
}
</style>
