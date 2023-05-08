import { onMounted, onBeforeUnmount, Ref } from 'vue';

export function useEventListener(target: EventTarget, event: string, handler: (e: Event) => any) {
  onMounted(() => {
    target.addEventListener(event, handler);
  });

  // clean it up
  onBeforeUnmount(() => {
    target.removeEventListener(event, handler);
  });
}

export function useOnClickOutside(rootEl: Ref<HTMLElement | null>, callback: () => any) {
  // `mousedown` or `mouseup` here makes it easier to not trigger the callback immedialty
  // if you want to use `click` you need to call `stopPropagation` on the trigger element.
  useEventListener(window, 'mouseup', (e: Event) => {
    const clickedEl = e.target as HTMLElement;

    // skip if the root element contains the clicked element
    if (rootEl.value?.contains(clickedEl)) {
      return;
    }

    // otherwise execute the action
    callback();
  });
}
