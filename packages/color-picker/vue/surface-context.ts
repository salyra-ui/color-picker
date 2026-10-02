import { inject, provide, type InjectionKey, type Ref } from 'vue';
import type { ColorView } from '../core';
const key: InjectionKey<Ref<ColorView>> = Symbol('color-surface');
export const provideSurface = (view: Ref<ColorView>) => provide(key, view);
export const useSurface = () => inject(key);
