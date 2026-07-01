<template>
  <div
    class="loader-spinner"
  />
</template>

<style lang="scss">
.loader-spinner {
  width: 100%;
  height: 100%;
  padding: 0.25rem;
  aspect-ratio: 1;
  border-radius: 50%;
  background: currentColor;
  --_m: conic-gradient(#0000 10%, #000), linear-gradient(#000 0 0) content-box;
  -webkit-mask: var(--_m);
  mask: var(--_m);
  -webkit-mask-composite: source-out;
  mask-composite: subtract;
  animation: loader-spin 1s infinite linear;
}
@keyframes loader-spin {
  to {
    transform: rotate(1turn);
  }
}
</style>
