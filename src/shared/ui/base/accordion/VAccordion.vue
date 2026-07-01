<script setup lang="ts">
const { multiple = false, open = [] } = defineProps<{
  multiple?: boolean;
  open?: string[];
}>();

const emit = defineEmits<{
  "update:open": [value: string[]];
}>();

const isOpen = (id: string) => open.includes(id);

const toggle = (id: string) => {
  if (multiple) {
    emit(
      "update:open",
      isOpen(id)
        ? open.filter((item) => item !== id)
        : [...open, id],
    );
  } else {
    emit("update:open", isOpen(id) ? [] : [id]);
  }
};
</script>

<template>
  <div
    class="v-accordion"
    role="list"
  >
    <slot
      :is-open="isOpen"
      :toggle="toggle"
    />
  </div>
</template>

<style scoped lang="scss">
.v-accordion {
  display: flex;
  flex-direction: column;
}
</style>
