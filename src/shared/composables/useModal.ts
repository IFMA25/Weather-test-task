import { computed, onBeforeUnmount } from "vue";

import { useModalRegisterer } from "./useModalRegister";

export const useModal = (id: string, autoUnregister = true) => {
  const registerer = useModalRegisterer();

  registerer.register(id);

  const isOpen = computed(() => registerer.isOpen.value(id));
  const zIndex = computed(() => registerer.getZIndex.value(id));
  const modal = computed(() => registerer.getModal.value(id));
  const open = () => registerer.open(id);
  const close = () => registerer.close(id);
  const toggle = () => registerer.toggle(id);

  if (autoUnregister) {
    onBeforeUnmount(() => {
      registerer.unregister(id);
    });
  }

  return {
    isOpen,
    zIndex,
    modal,
    open,
    close,
    toggle,
  };
};
