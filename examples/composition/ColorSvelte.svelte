<script lang="ts">
  import { ColorPicker } from '@salyra-ui/color-picker/svelte';
  let value = $state('#5268E080');
</script>

<ColorPicker.Root bind:value>
  <div class="composition-editor" data-composition="color">
    <ColorPicker.Wheel class="composition-wheel">
      <ColorPicker.Thumb class="composition-dot"
        ><span class="composition-dot-text">Pick</span></ColorPicker.Thumb
      >
    </ColorPicker.Wheel>
    <div class="composition-fields">
      <label><span>Brightness</span><ColorPicker.Slider channel="v" /></label>
      <label><span>Opacity</span><ColorPicker.Slider channel="alpha" /></label>
      <div class="composition-channels">
        <label
          ><span>Red</span><ColorPicker.ChannelInput
            format="rgb"
            index={0}
          /></label
        >
        <label
          ><span>Green</span><ColorPicker.ChannelInput
            format="rgb"
            index={1}
          /></label
        >
        <label
          ><span>Blue</span><ColorPicker.ChannelInput
            format="rgb"
            index={2}
          /></label
        >
      </div>
      <label><span>Color value</span><ColorPicker.Input /></label>
      <ColorPicker.FormatTrigger
        >{#snippet children(color)}Show next format ({color.format.toUpperCase()}){/snippet}</ColorPicker.FormatTrigger
      >
      <output>{value}</output>
    </div>
  </div>
</ColorPicker.Root>
