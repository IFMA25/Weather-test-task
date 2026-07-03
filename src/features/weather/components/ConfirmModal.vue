<script setup lang="ts">
import VButton from "@/shared/components/base/VButton.vue";
import VModal from "@/shared/components/base/VModal.vue";
import { useModal } from "@/shared/composables/useModal";


const { id, entityName, loading } = defineProps<{
  id: string;
  entityName: string;
  loading?: boolean;
}>();

const emit = defineEmits<{
  confirm: []
}>();

const { open, close } = useModal(id);

const handleConfirm = () => {
  emit("confirm");
};

defineExpose({ open, close });
</script>

<template>
  <VModal
    :id="id"
    :title="$t('modal.deleteTitle', { entityName })"
  >
    <div class="modal__content">
      {{ $t('modal.deleteDescription') }}
    </div>

    <template #footer>
      <VButton
        :text="$t('modal.cancel')"
        :disabled="loading"
        @click="close"
      />
      <VButton
        :text="$t('modal.delete')"
        variant="danger"
        :loading="loading"
        @click="handleConfirm"
      />
    </template>
  </VModal>
</template>

<style scoped lang="scss">
@use '@/shared/styles/variables.scss' as *;

</style>
