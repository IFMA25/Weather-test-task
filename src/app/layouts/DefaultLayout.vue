<script setup lang="ts">
import VueFeather from "vue-feather";
</script>

<template>
  <div>
    <header>
      <VueFeather type="sunrise" />
      <h1>Weather</h1>
    </header>
    <main>
      <router-view />
    </main>
  </div>
</template>
