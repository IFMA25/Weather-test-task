<script setup lang="ts">
import VButton from "@/shared/components/base/VButton.vue";
import VModal from "@/shared/components/base/VModal.vue";
import { useModal } from "@/shared/composables/useModal";

const { id, loading } = defineProps<{
  id: string;
  loading?: boolean;
}>();

const { open, close } = useModal(id);

defineExpose({ open, close });
</script>

<template>
  <VModal
    :id="id"
    :title="$t('modal.alertTitle')"
  >
    <div class="modal__content">
      {{ $t('modal.alertDescription') }}
    </div>

    <template #footer>
      <VButton
        :text="$t('modal.cancel')"
        :disabled="loading"
        @click="close"
      />
    </template>
  </VModal>
</template>

<style scoped lang="scss">
@use '@/shared/styles/variables.scss' as *;

</style>
