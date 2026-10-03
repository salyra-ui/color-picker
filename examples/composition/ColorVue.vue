<script setup lang="ts">
import { ref } from 'vue';
import { ColorPicker } from '@salyra-ui/color-picker/vue';
const value = ref('#5268E080');
</script>
<template>
  <ColorPicker.Root v-model="value"
    ><div class="composition-editor" data-composition="color">
      <ColorPicker.Wheel class="composition-wheel"
        ><ColorPicker.Thumb class="composition-dot"
          ><span class="composition-dot-text">Pick</span></ColorPicker.Thumb
        ></ColorPicker.Wheel
      >
      <div class="composition-fields">
        <label><span>Brightness</span><ColorPicker.Slider channel="v" /></label
        ><label
          ><span>Opacity</span><ColorPicker.Slider channel="alpha"
        /></label>
        <div class="composition-channels">
          <label v-for="(label, index) in ['Red', 'Green', 'Blue']" :key="label"
            ><span>{{ label }}</span
            ><ColorPicker.ChannelInput format="rgb" :index="index as 0 | 1 | 2"
          /></label>
        </div>
        <label><span>Color value</span><ColorPicker.Input /></label
        ><ColorPicker.FormatTrigger v-slot="{ state }"
          >Show next format ({{
            state.format.toUpperCase()
          }})</ColorPicker.FormatTrigger
        ><output>{{ value }}</output>
      </div>
    </div></ColorPicker.Root
  >
</template>
