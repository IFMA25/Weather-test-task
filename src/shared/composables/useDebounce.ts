export const useDebounce = (delay = 400) => {
  let timeout: ReturnType<typeof setTimeout> | null = null;

  const run = (callback: () => void) => {
    if (timeout) {
      clearTimeout(timeout);
    }

    timeout = setTimeout(() => {
      callback();
    }, delay);
  };

  return { run };
};
