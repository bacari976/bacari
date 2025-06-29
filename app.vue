<template>
  <v-app>
    <v-app-bar app elevation="1" class="app-bar px-4">
      <v-app-bar-title class="text-h5 font-weight-bold">
        <span class="text-indigo-lighten-3">Jean</span> Bacari
      </v-app-bar-title>
      <v-spacer></v-spacer>
      <v-app-bar-nav-icon @click="drawer = !drawer" class="d-flex d-md-none text-white"></v-app-bar-nav-icon>
      <div class="d-none d-md-flex">
        <v-btn v-for="item in menuItems" :key="item.title" :href="item.href" variant="text" class="mx-1 text-white"
          aria-label="Accéder à la section {{ item.title }}">
          {{ item.title }}
        </v-btn>
        <v-btn color="primary" variant="flat" class="ml-4" href="https://calendly.com/bacari-bm" target="_blank"
          aria-label="Réserver un appel">
          Réserver un appel découverte
        </v-btn>
      </div>
    </v-app-bar>

    <v-navigation-drawer v-model="drawer" temporary class="night-drawer">
      <v-list class="pa-0">
        <v-list-item v-for="item in menuItems" :key="item.title" :href="item.href" @click="drawer = false"
          class="text-white">
          <v-list-item-title>{{ item.title }}</v-list-item-title>
        </v-list-item>
        <v-list-item class="pa-4">
          <v-btn block color="accent" variant="flat" class="mt-4" href="https://calendly.com/bacari-bm" target="_blank"
            aria-label="Réserver un appel">
            Je réserve un appel
          </v-btn>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-main>
      <Hero />
      <Services />
      <ClientProof />
      <Pricing />
      <Cta />
      <v-divider class="my-5"></v-divider>
      <AppFooter />
    </v-main>

    <ChatBot />
  </v-app>
</template>

<script setup>
import { ref } from 'vue';
import AppFooter from './components/AppFooter.vue';
import ClientProof from './components/ClientProof.vue';
import Cta from './components/Cta.vue';
import Hero from './components/Hero.vue';
import Pricing from './components/Pricing.vue';
import Services from './components/Services.vue';
import ChatBot from './components/ChatBot.vue';
// @ts-ignore
import { useHead } from '#imports';

const drawer = ref(false);

useHead({
  title: 'Jean Bacari - Ghostwriting',
  meta: [
    { charset: 'utf-8' },
    { name: 'viewport', content: 'width=device-width, initial-scale=1' },
    { name: 'description', content: 'Jean Bacari - Ghostwriting' },
    { name: 'keywords', content: 'Ghostwriting, Ghostwritier, GhostWritting services' },
    { name: 'robots', content: 'index, follow' },
    { property: 'og:title', content: 'Jean Bacari - Ghostwriting' },
    { property: 'og:description', content: 'Jean Bacari - Ghostwriting' },
    { property: 'og:type', content: 'website' },
    { property: 'og:locale', content: 'fr_FR' },
    { property: 'og:site_name', content: 'Jean Bacari - Ghostwriting' },
  ],
  link: [
    { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
  ]
})

const menuItems = [
  { title: 'Services', href: '#services' },
  { title: 'Témoignages', href: '#testimonials' },
  { title: 'Tarifs', href: '#pricing' }
];
</script>

<style scoped>
.app-bar {
  background: linear-gradient(135deg, #1a237e 0%, #283593 50%, #3949ab 100%) !important;
  color: white !important;
}

.night-drawer {
  background: linear-gradient(180deg, #1a237e 0%, #283593 100%) !important;
}
</style>
