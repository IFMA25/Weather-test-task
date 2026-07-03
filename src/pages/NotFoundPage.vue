<script setup lang="ts">
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";

import VButton from "@/shared/components/base/VButton.vue";

const router = useRouter();
const { t } = useI18n();

const goToWeatherPage = () => {
  router.push("/");
};
</script>

<template>
  <section class="not-found">
    <div class="not-found__card">
      <div class="not-found__code">
        404
      </div>

      <h1 class="not-found__title">
        {{ t("notFound.title") }}
      </h1>

      <p class="not-found__text">
        {{ t("notFound.description") }}
      </p>

      <div class="not-found__actions">
        <VButton
          :text="t('notFound.backToWeather')"
          variant="main"
          class="not-found__button"
          @click="goToWeatherPage"
        />
      </div>
    </div>
  </section>
</template>

<style scoped lang="scss">
@use "@/shared/styles/variables.scss" as *;

.not-found {
  min-height: calc(100vh - 145px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1.5rem;
  background:
    radial-gradient(circle at top, rgba(63, 127, 216, 0.12) 0%, transparent 32%),
    linear-gradient(180deg, var(--card-bg) 0%, var(--color-surface-soft) 100%);

  &__card {
    width: 100%;
    max-width: 38rem;
    padding: 2rem;
    border: 1px solid var(--color-border);
    border-radius: $radius-xl;
    background: linear-gradient(180deg, var(--card-bg) 0%, var(--color-surface-soft) 100%);
    box-shadow: 0 0.75rem 2rem var(--color-shadow);
    text-align: center;
  }

  &__code {
    margin-bottom: 0.75rem;
    font-size: clamp(4rem, 9vw, 7rem);
    line-height: 1;
    font-family: $font-inter-bold;
    color: var(--color-primary);
    text-shadow: 0 0.25rem 1rem rgba(63, 127, 216, 0.18);
  }

  &__title {
    margin-bottom: 0.75rem;
    font-size: 1.75rem;
    font-family: $font-inter-semibold;
    color: var(--color-text);
  }

  &__text {
    margin: 0 auto 1.5rem;
    max-width: 28rem;
    font-size: 1rem;
    line-height: 1.6;
    color: var(--color-text-secondary);
  }

  &__actions {
    display: flex;
    justify-content: center;
  }

  &__button {
      background-color: var(--color-primary);
      color: var(--color-text-inverse);
      transition:
        transform 0.2s ease,
        box-shadow 0.2s ease,
        background-color 0.2s ease;
    }
}

@media (max-width: $xs) {
  .not-found {
    padding: 1rem;

    &__card {
      padding: 1.5rem 1rem;
    }

    &__title {
      font-size: 1.5rem;
    }

    &__text {
      font-size: 1rem;
    }
  }
}
</style>
