'use client';
import { ColorArea } from './ColorArea';
import { ColorSlider } from './ColorSlider';
import { ColorWheel } from './ColorWheel';
import { useColor } from './context';
export function ColorSurface() {
  const state = useColor();
  return (
    <>
      {state.view === 'wheel' ? <ColorWheel /> : <ColorArea />}
      <ColorSlider channel={state.view === 'wheel' ? 'v' : 'h'} />
    </>
  );
}
