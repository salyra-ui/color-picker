"use strict";
var ColorPicker = (() => {
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // packages/color-picker/vanilla/index.ts
  var index_exports = {};
  __export(index_exports, {
    ColorCollectionElement: () => ColorCollectionElement,
    ColorCompositionElement: () => ColorCompositionElement,
    ColorOutputElement: () => ColorOutputElement,
    ColorProviderElement: () => ColorProviderElement,
    ColorWheelElement: () => ColorWheelElement,
    alphaTrackStyle: () => alphaTrackStyle,
    areaStyle: () => areaStyle,
    bindAlphaInput: () => bindAlphaInput,
    bindColorArea: () => bindColorArea,
    bindColorForm: () => bindColorForm,
    bindColorSlider: () => bindColorSlider,
    bindColorSurface: () => bindColorSurface,
    bindColorValueInput: () => bindColorValueInput,
    bindMarkerWheel: () => bindMarkerWheel,
    browserColorStorage: () => browserColorStorage,
    channelSpecs: () => channelSpecs,
    channelValue: () => channelValue,
    channelsToHex: () => channelsToHex,
    clamp: () => clamp,
    colorAreaMarkup: () => colorAreaMarkup,
    colorAtPoint: () => colorAtPoint,
    colorContrast: () => colorContrast,
    colorFormatMarkup: () => colorFormatMarkup,
    colorFormats: () => colorFormats,
    colorInputAttributes: () => colorInputAttributes,
    colorNames: () => colorNames,
    colorPickerMarkup: () => colorPickerMarkup,
    colorPreviewStyle: () => colorPreviewStyle,
    colorPreviewStyles: () => colorPreviewStyles,
    colorSliderMarkup: () => colorSliderMarkup,
    colorViews: () => colorViews,
    colorWheelMarkup: () => colorWheelMarkup,
    compositeColor: () => compositeColor,
    contrast: () => contrast,
    createColorCollection: () => createColorCollection,
    createColorHistory: () => createColorHistory,
    createColorStore: () => createColorStore,
    createHistory: () => createHistory,
    foreground: () => foreground,
    formatColor: () => formatColor,
    getColor: () => getColor,
    getColorChannels: () => getColorChannels,
    getColorName: () => getColorName,
    getColorNameMatch: () => getColorNameMatch,
    getColorValue: () => getColorValue,
    hexAlpha: () => hexAlpha,
    hexToHsv: () => hexToHsv,
    hexToOklch: () => hexToOklch,
    hexToRgb: () => hexToRgb,
    hsvToChannels: () => hsvToChannels,
    hsvToHex: () => hsvToHex,
    hue: () => hue,
    luminance: () => luminance,
    markerStyle: () => markerStyle,
    markerWheelStyle: () => markerWheelStyle,
    mountColorCollection: () => mountColorCollection,
    mountColorControls: () => mountColorControls,
    mountColorPicker: () => mountColorPicker,
    mountHistory: () => mountHistory,
    nextColorFormat: () => nextColorFormat,
    normalizeColorHex: () => normalizeColorHex,
    normalizeHex: () => normalizeHex,
    oklabToOklch: () => oklabToOklch,
    oklabToRgb: () => oklabToRgb,
    oklchToHex: () => oklchToHex,
    oklchToOklab: () => oklchToOklab,
    oklchToRgb: () => oklchToRgb,
    opaqueHex: () => opaqueHex,
    parseColor: () => parseColor,
    rgbToHex: () => rgbToHex,
    rgbToOklab: () => rgbToOklab,
    setColorChannel: () => setColorChannel,
    setSliderValue: () => setSliderValue,
    sliderAttributes: () => sliderAttributes,
    sliderLabels: () => sliderLabels,
    sliderTrackStyle: () => sliderTrackStyle,
    sliderTrackVariables: () => sliderTrackVariables,
    sliderValue: () => sliderValue,
    styleText: () => styleText,
    subscribeColor: () => subscribeColor,
    subscribeColorSelector: () => subscribeColorSelector,
    surfaceStyles: () => surfaceStyles,
    thumbPosition: () => thumbPosition,
    thumbStyle: () => thumbStyle,
    wheelAtPoint: () => wheelAtPoint,
    wheelStyle: () => wheelStyle,
    wheelThumbStyle: () => wheelThumbStyle,
    withAlpha: () => withAlpha
  });

  // packages/color-picker/core/oklab.ts
  var linear = (c) => c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  var gamma = (c) => c <= 31308e-7 ? 12.92 * c : 1.055 * c ** (1 / 2.4) - 0.055;
  function rgbToOklab(rgb) {
    const [r, g, b] = rgb.map((c) => linear(c / 255));
    const l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b);
    const m = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b);
    const s = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b);
    return {
      l: 0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s,
      a: 1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s,
      b: 0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s
    };
  }
  function oklabToOklch({ l, a, b }) {
    const c = Math.hypot(a, b);
    return {
      l,
      c,
      h: c < 1e-7 ? 0 : (Math.atan2(b, a) * 180 / Math.PI + 360) % 360
    };
  }
  function oklchToOklab({ l, c, h }) {
    return {
      l,
      a: c * Math.cos(h * Math.PI / 180),
      b: c * Math.sin(h * Math.PI / 180)
    };
  }
  function linearRgb({ l, a, b }) {
    const x = (l + 0.3963377774 * a + 0.2158037573 * b) ** 3, y = (l - 0.1055613458 * a - 0.0638541728 * b) ** 3, z = (l - 0.0894841775 * a - 1.291485548 * b) ** 3;
    return [
      4.0767416621 * x - 3.3077115913 * y + 0.2309699292 * z,
      -1.2684380046 * x + 2.6097574011 * y - 0.3413193965 * z,
      -0.0041960863 * x - 0.7034186147 * y + 1.707614701 * z
    ];
  }
  function oklchToRgb(color) {
    if (![color.l, color.c, color.h].every(Number.isFinite) || color.l < 0 || color.l > 1 || color.c < 0)
      throw new TypeError("Invalid OKLCH color");
    const inGamut = (rgb2) => rgb2.every((c) => c >= -1 / 255 / 12.92 / 2 && c <= 1 + 1 / 255 / 12.92 / 2);
    let rgb = linearRgb(oklchToOklab(color));
    if (!inGamut(rgb)) {
      let low = 0, high = color.c;
      for (let i = 0; i < 24; i++) {
        const c = (low + high) / 2;
        if (inGamut(linearRgb(oklchToOklab({ ...color, c })))) low = c;
        else high = c;
      }
      rgb = linearRgb(oklchToOklab({ ...color, c: low }));
    }
    return rgb.map(
      (c) => Math.round(Math.max(0, Math.min(1, gamma(c))) * 255)
    );
  }
  function oklabToRgb(color) {
    return oklchToRgb(oklabToOklch(color));
  }

  // packages/color-picker/core/color.ts
  var clamp = (n, min = 0, max = 100) => Math.min(max, Math.max(min, Number.isFinite(n) ? n : min));
  var hue = (h) => ((Number.isFinite(h) ? h : 0) % 360 + 360) % 360;
  function normalizeHex(input) {
    if (typeof input !== "string" || !/^#?(?:[a-f\d]{3}|[a-f\d]{6})$/i.test(input.trim()))
      throw new TypeError("Expected a 3 or 6 digit hex color");
    let value = input.trim().replace("#", "").toUpperCase();
    if (value.length === 3) value = value.replace(/./g, "$&$&");
    return `#${value}`;
  }
  function normalizeColorHex(input) {
    if (typeof input !== "string" || !/^#?(?:[a-f\d]{3}|[a-f\d]{4}|[a-f\d]{6}|[a-f\d]{8})$/i.test(input.trim()))
      throw new TypeError("Expected a 3, 4, 6 or 8 digit hex color");
    let value = input.trim().replace("#", "").toUpperCase();
    if (value.length === 3 || value.length === 4)
      value = value.replace(/./g, "$&$&");
    if (value.length === 8 && value.endsWith("FF")) value = value.slice(0, 6);
    return "#" + value;
  }
  var opaqueHex = (input) => normalizeColorHex(input).slice(0, 7);
  function hexAlpha(input) {
    const hex = normalizeColorHex(input);
    return hex.length === 9 ? parseInt(hex.slice(7), 16) / 255 : 1;
  }
  function withAlpha(input, alpha) {
    if (!Number.isFinite(alpha) || alpha < 0 || alpha > 1)
      throw new TypeError("Alpha must be between 0 and 1");
    const hex = opaqueHex(input);
    return alpha === 1 ? hex : hex + Math.round(alpha * 255).toString(16).padStart(2, "0").toUpperCase();
  }
  function hexToRgb(input) {
    const hex = opaqueHex(input).slice(1);
    return [0, 2, 4].map((i) => parseInt(hex.slice(i, i + 2), 16));
  }
  function hsvToHex({ h, s, v }) {
    h = hue(h) / 60;
    s = clamp(s) / 100;
    v = clamp(v) / 100;
    const c = v * s, x = c * (1 - Math.abs(h % 2 - 1)), m = v - c;
    const rgb = h < 1 ? [c, x, 0] : h < 2 ? [x, c, 0] : h < 3 ? [0, c, x] : h < 4 ? [0, x, c] : h < 5 ? [x, 0, c] : [c, 0, x];
    return "#" + rgb.map(
      (n) => Math.round((n + m) * 255).toString(16).padStart(2, "0")
    ).join("").toUpperCase();
  }
  function hexToHsv(input, previousHue = 0) {
    const [r, g, b] = hexToRgb(input).map((n) => n / 255);
    const max = Math.max(r, g, b), min = Math.min(r, g, b), d = max - min;
    const h = d === 0 ? previousHue : 60 * (max === r ? (g - b) / d : max === g ? (b - r) / d + 2 : (r - g) / d + 4);
    return { h: hue(h), s: max === 0 ? 0 : d / max * 100, v: max * 100 };
  }
  function hsvToChannels({ h, s, v }) {
    s = clamp(s) / 100;
    v = clamp(v) / 100;
    const l = v * (1 - s / 2), saturation = l === 0 || l === 1 ? 0 : (v - l) / Math.min(l, 1 - l);
    const round = (n) => Math.round(n * 1e3) / 1e3;
    return `${round(hue(h))} ${round(saturation * 100)}% ${round(l * 100)}%`;
  }
  function channelsToHex(channels) {
    const [h, s, l] = channels.replace(/%/g, "").split(/\s+/).map(Number);
    const light = clamp(l) / 100, sat = clamp(s) / 100, v = light + sat * Math.min(light, 1 - light);
    return hsvToHex({ h, s: v === 0 ? 0 : 200 * (1 - light / v), v: v * 100 });
  }
  function luminance(hex) {
    const [r, g, b] = hexToRgb(hex).map((n) => {
      const c = n / 255;
      return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
    });
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  }
  function contrast(a, b) {
    const x = luminance(a), y = luminance(b);
    return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05);
  }
  function foreground(hex) {
    return contrast(hex, "#FFFFFF") >= contrast(hex, "#000000") ? "0 0% 100%" : "0 0% 0%";
  }
  function colorAtPoint(h, x, y, width, height) {
    return {
      h: hue(h),
      s: clamp(width > 0 ? x / width * 100 : 0),
      v: 100 - clamp(height > 0 ? y / height * 100 : 0)
    };
  }
  var colorFormats = [
    "hex",
    "rgb",
    "hsl",
    "hsv",
    "oklch",
    "oklab"
  ];
  function hexToOklch(hex) {
    return oklabToOklch(rgbToOklab(hexToRgb(hex)));
  }
  function oklchToHex(color) {
    return rgbToHex(oklchToRgb(color));
  }
  function rgbToHex(rgb) {
    if (rgb.some((n) => !Number.isFinite(n) || n < 0 || n > 255))
      throw new TypeError("RGB channels must be between 0 and 255");
    return "#" + rgb.map((n) => Math.round(n).toString(16).padStart(2, "0")).join("").toUpperCase();
  }
  function parseColor(text, format = "hex") {
    if (format === "hex") return normalizeColorHex(text);
    const raw = text.trim().replace(new RegExp(`^${format}(?:a)?\\((.*)\\)$`, "i"), "$1").replace(/\s*,\s*/g, " ");
    const parts = raw.replace(/\s*\/\s*/g, " ").split(/\s+/);
    if (parts.length !== 3 && parts.length !== 4)
      throw new TypeError("Expected three color channels and optional alpha");
    let alpha = 1;
    if (parts.length === 4) {
      const part = parts.pop();
      if (!/^[-+]?(?:\d+(?:\.\d*)?|\.\d+)%?$/.test(part))
        throw new TypeError("Invalid alpha");
      alpha = Number(part.replace("%", "")) / (part.endsWith("%") ? 100 : 1);
      if (!Number.isFinite(alpha) || alpha < 0 || alpha > 1)
        throw new TypeError("Alpha must be between 0 and 1");
    }
    return withAlpha(parseOpaqueColor(parts.join(" "), format), alpha);
  }
  function parseOpaqueColor(text, format) {
    const raw = text.trim().replace(new RegExp(`^${format}\\((.*)\\)$`), "$1").replace(/\s*,\s*/g, " ");
    const parts = raw.split(/\s+/);
    if (parts.length !== 3 || parts.some((p) => !/^[-+]?(?:\d+(?:\.\d*)?|\.\d+)%?$/.test(p)))
      throw new TypeError("Expected three color channels");
    const values = parts.map((p) => Number(p.replace("%", "")));
    if (format === "rgb") {
      if (parts.some((p) => p.endsWith("%")))
        throw new TypeError("RGB input uses 0\u2013255 channels");
      return rgbToHex(values);
    }
    if (format === "oklch" || format === "oklab") {
      const [rawL, a, b] = values, l = parts[0].endsWith("%") ? rawL / 100 : rawL;
      if (l < 0 || l > 1 || parts[1].endsWith("%") || parts[2].endsWith("%") || Math.abs(a) > 1 || Math.abs(b) > (format === "oklab" ? 1 : 360))
        throw new TypeError("Perceptual color channel out of range");
      return rgbToHex(
        format === "oklch" ? oklchToRgb({ l, c: a, h: b }) : oklabToRgb({ l, a, b })
      );
    }
    const [h, s, last] = values;
    if (h < 0 || h > 360 || s < 0 || s > 100 || last < 0 || last > 100 || parts[0].endsWith("%"))
      throw new TypeError("Color channel out of range");
    return format === "hsv" ? hsvToHex({ h, s, v: last }) : channelsToHex(`${h} ${s}% ${last}%`);
  }
  function formatColor(input, format = "hex", alpha = hexAlpha(input)) {
    if (!Number.isFinite(alpha) || alpha < 0 || alpha > 1)
      throw new TypeError("Alpha must be between 0 and 1");
    if (format === "hex") return withAlpha(input, alpha);
    const value = formatOpaqueColor(opaqueHex(input), format);
    return alpha === 1 ? value : `${value} / ${Number(alpha.toFixed(8))}`;
  }
  function formatOpaqueColor(hex, format) {
    const round = (n) => Number(n.toFixed(5));
    if (format === "hex") return normalizeHex(hex);
    if (format === "rgb") return hexToRgb(hex).join(", ");
    if (format === "hsl") return hsvToChannels(hexToHsv(hex));
    if (format === "hsv") {
      const { h, s, v } = hexToHsv(hex);
      return `${round(h)} ${round(s)}% ${round(v)}%`;
    }
    const lab2 = rgbToOklab(hexToRgb(hex));
    if (format === "oklab")
      return `${round(lab2.l)} ${round(lab2.a)} ${round(lab2.b)}`;
    const lch = oklabToOklch(lab2);
    return `${round(lch.l)} ${round(lch.c)} ${round(lch.h)}`;
  }

  // packages/color-picker/core/color-names.ts
  var colorNames = Object.freeze(
    [
      Object.freeze(["#000000", "Black"]),
      Object.freeze(["#000080", "Navy Blue"]),
      Object.freeze(["#0000C8", "Dark Blue"]),
      Object.freeze(["#0000FF", "Blue"]),
      Object.freeze(["#000741", "Stratos"]),
      Object.freeze(["#001B1C", "Swamp"]),
      Object.freeze(["#002387", "Resolution Blue"]),
      Object.freeze(["#002900", "Deep Fir"]),
      Object.freeze(["#002E20", "Burnham"]),
      Object.freeze(["#002FA7", "International Klein Blue"]),
      Object.freeze(["#003153", "Prussian Blue"]),
      Object.freeze(["#003366", "Midnight Blue"]),
      Object.freeze(["#003399", "Smalt"]),
      Object.freeze(["#003532", "Deep Teal"]),
      Object.freeze(["#003E40", "Cyprus"]),
      Object.freeze(["#004620", "Kaitoke Green"]),
      Object.freeze(["#0047AB", "Cobalt"]),
      Object.freeze(["#004816", "Crusoe"]),
      Object.freeze(["#004950", "Sherpa Blue"]),
      Object.freeze(["#0056A7", "Endeavour"]),
      Object.freeze(["#00581A", "Camarone"]),
      Object.freeze(["#0066CC", "Science Blue"]),
      Object.freeze(["#0066FF", "Blue Ribbon"]),
      Object.freeze(["#00755E", "Tropical Rain Forest"]),
      Object.freeze(["#0076A3", "Allports"]),
      Object.freeze(["#007BA7", "Deep Cerulean"]),
      Object.freeze(["#007EC7", "Lochmara"]),
      Object.freeze(["#007FFF", "Azure Radiance"]),
      Object.freeze(["#008080", "Teal"]),
      Object.freeze(["#0095B6", "Bondi Blue"]),
      Object.freeze(["#009DC4", "Pacific Blue"]),
      Object.freeze(["#00A693", "Persian Green"]),
      Object.freeze(["#00A86B", "Jade"]),
      Object.freeze(["#00CC99", "Caribbean Green"]),
      Object.freeze(["#00CCCC", "Robin's Egg Blue"]),
      Object.freeze(["#00FF00", "Green"]),
      Object.freeze(["#00FF7F", "Spring Green"]),
      Object.freeze(["#00FFFF", "Cyan / Aqua"]),
      Object.freeze(["#010D1A", "Blue Charcoal"]),
      Object.freeze(["#011635", "Midnight"]),
      Object.freeze(["#011D13", "Holly"]),
      Object.freeze(["#012731", "Daintree"]),
      Object.freeze(["#01361C", "Cardin Green"]),
      Object.freeze(["#01371A", "County Green"]),
      Object.freeze(["#013E62", "Astronaut Blue"]),
      Object.freeze(["#013F6A", "Regal Blue"]),
      Object.freeze(["#014B43", "Aqua Deep"]),
      Object.freeze(["#015E85", "Orient"]),
      Object.freeze(["#016162", "Blue Stone"]),
      Object.freeze(["#016D39", "Fun Green"]),
      Object.freeze(["#01796F", "Pine Green"]),
      Object.freeze(["#017987", "Blue Lagoon"]),
      Object.freeze(["#01826B", "Deep Sea"]),
      Object.freeze(["#01A368", "Green Haze"]),
      Object.freeze(["#022D15", "English Holly"]),
      Object.freeze(["#02402C", "Sherwood Green"]),
      Object.freeze(["#02478E", "Congress Blue"]),
      Object.freeze(["#024E46", "Evening Sea"]),
      Object.freeze(["#026395", "Bahama Blue"]),
      Object.freeze(["#02866F", "Observatory"]),
      Object.freeze(["#02A4D3", "Cerulean"]),
      Object.freeze(["#03163C", "Tangaroa"]),
      Object.freeze(["#032B52", "Green Vogue"]),
      Object.freeze(["#036A6E", "Mosque"]),
      Object.freeze(["#041004", "Midnight Moss"]),
      Object.freeze(["#041322", "Black Pearl"]),
      Object.freeze(["#042E4C", "Blue Whale"]),
      Object.freeze(["#044022", "Zuccini"]),
      Object.freeze(["#044259", "Teal Blue"]),
      Object.freeze(["#051040", "Deep Cove"]),
      Object.freeze(["#051657", "Gulf Blue"]),
      Object.freeze(["#055989", "Venice Blue"]),
      Object.freeze(["#056F57", "Watercourse"]),
      Object.freeze(["#062A78", "Catalina Blue"]),
      Object.freeze(["#063537", "Tiber"]),
      Object.freeze(["#069B81", "Gossamer"]),
      Object.freeze(["#06A189", "Niagara"]),
      Object.freeze(["#073A50", "Tarawera"]),
      Object.freeze(["#080110", "Jaguar"]),
      Object.freeze(["#081910", "Black Bean"]),
      Object.freeze(["#082567", "Deep Sapphire"]),
      Object.freeze(["#088370", "Elf Green"]),
      Object.freeze(["#08E8DE", "Bright Turquoise"]),
      Object.freeze(["#092256", "Downriver"]),
      Object.freeze(["#09230F", "Palm Green"]),
      Object.freeze(["#09255D", "Madison"]),
      Object.freeze(["#093624", "Bottle Green"]),
      Object.freeze(["#095859", "Deep Sea Green"]),
      Object.freeze(["#097F4B", "Salem"]),
      Object.freeze(["#0A001C", "Black Russian"]),
      Object.freeze(["#0A480D", "Dark Fern"]),
      Object.freeze(["#0A6906", "Japanese Laurel"]),
      Object.freeze(["#0A6F75", "Atoll"]),
      Object.freeze(["#0B0B0B", "Cod Gray"]),
      Object.freeze(["#0B0F08", "Marshland"]),
      Object.freeze(["#0B1107", "Gordons Green"]),
      Object.freeze(["#0B1304", "Black Forest"]),
      Object.freeze(["#0B6207", "San Felix"]),
      Object.freeze(["#0BDA51", "Malachite"]),
      Object.freeze(["#0C0B1D", "Ebony"]),
      Object.freeze(["#0C0D0F", "Woodsmoke"]),
      Object.freeze(["#0C1911", "Racing Green"]),
      Object.freeze(["#0C7A79", "Surfie Green"]),
      Object.freeze(["#0C8990", "Blue Chill"]),
      Object.freeze(["#0D0332", "Black Rock"]),
      Object.freeze(["#0D1117", "Bunker"]),
      Object.freeze(["#0D1C19", "Aztec"]),
      Object.freeze(["#0D2E1C", "Bush"]),
      Object.freeze(["#0E0E18", "Cinder"]),
      Object.freeze(["#0E2A30", "Firefly"]),
      Object.freeze(["#0F2D9E", "Torea Bay"]),
      Object.freeze(["#10121D", "Vulcan"]),
      Object.freeze(["#101405", "Green Waterloo"]),
      Object.freeze(["#105852", "Eden"]),
      Object.freeze(["#110C6C", "Arapawa"]),
      Object.freeze(["#120A8F", "Ultramarine"]),
      Object.freeze(["#123447", "Elephant"]),
      Object.freeze(["#126B40", "Jewel"]),
      Object.freeze(["#130000", "Diesel"]),
      Object.freeze(["#130A06", "Asphalt"]),
      Object.freeze(["#13264D", "Blue Zodiac"]),
      Object.freeze(["#134F19", "Parsley"]),
      Object.freeze(["#140600", "Nero"]),
      Object.freeze(["#1450AA", "Tory Blue"]),
      Object.freeze(["#151F4C", "Bunting"]),
      Object.freeze(["#1560BD", "Denim"]),
      Object.freeze(["#15736B", "Genoa"]),
      Object.freeze(["#161928", "Mirage"]),
      Object.freeze(["#161D10", "Hunter Green"]),
      Object.freeze(["#162A40", "Big Stone"]),
      Object.freeze(["#163222", "Celtic"]),
      Object.freeze(["#16322C", "Timber Green"]),
      Object.freeze(["#163531", "Gable Green"]),
      Object.freeze(["#171F04", "Pine Tree"]),
      Object.freeze(["#175579", "Chathams Blue"]),
      Object.freeze(["#182D09", "Deep Forest Green"]),
      Object.freeze(["#18587A", "Blumine"]),
      Object.freeze(["#19330E", "Palm Leaf"]),
      Object.freeze(["#193751", "Nile Blue"]),
      Object.freeze(["#1959A8", "Fun Blue"]),
      Object.freeze(["#1A1A68", "Lucky Point"]),
      Object.freeze(["#1AB385", "Mountain Meadow"]),
      Object.freeze(["#1B0245", "Tolopea"]),
      Object.freeze(["#1B1035", "Haiti"]),
      Object.freeze(["#1B127B", "Deep Koamaru"]),
      Object.freeze(["#1B1404", "Acadia"]),
      Object.freeze(["#1B2F11", "Seaweed"]),
      Object.freeze(["#1B3162", "Biscay"]),
      Object.freeze(["#1B659D", "Matisse"]),
      Object.freeze(["#1C1208", "Crowshead"]),
      Object.freeze(["#1C1E13", "Rangoon Green"]),
      Object.freeze(["#1C39BB", "Persian Blue"]),
      Object.freeze(["#1C402E", "Everglade"]),
      Object.freeze(["#1C7C7D", "Elm"]),
      Object.freeze(["#1D6142", "Green Pea"]),
      Object.freeze(["#1E0F04", "Creole"]),
      Object.freeze(["#1E1609", "Karaka"]),
      Object.freeze(["#1E1708", "El Paso"]),
      Object.freeze(["#1E385B", "Cello"]),
      Object.freeze(["#1E433C", "Te Papa Green"]),
      Object.freeze(["#1E90FF", "Dodger Blue"]),
      Object.freeze(["#1E9AB0", "Eastern Blue"]),
      Object.freeze(["#1F120F", "Night Rider"]),
      Object.freeze(["#1FC2C2", "Java"]),
      Object.freeze(["#20208D", "Jacksons Purple"]),
      Object.freeze(["#202E54", "Cloud Burst"]),
      Object.freeze(["#204852", "Blue Dianne"]),
      Object.freeze(["#211A0E", "Eternity"]),
      Object.freeze(["#220878", "Deep Blue"]),
      Object.freeze(["#228B22", "Forest Green"]),
      Object.freeze(["#233418", "Mallard"]),
      Object.freeze(["#240A40", "Violet"]),
      Object.freeze(["#240C02", "Kilamanjaro"]),
      Object.freeze(["#242A1D", "Log Cabin"]),
      Object.freeze(["#242E16", "Black Olive"]),
      Object.freeze(["#24500F", "Green House"]),
      Object.freeze(["#251607", "Graphite"]),
      Object.freeze(["#251706", "Cannon Black"]),
      Object.freeze(["#251F4F", "Port Gore"]),
      Object.freeze(["#25272C", "Shark"]),
      Object.freeze(["#25311C", "Green Kelp"]),
      Object.freeze(["#2596D1", "Curious Blue"]),
      Object.freeze(["#260368", "Paua"]),
      Object.freeze(["#26056A", "Paris M"]),
      Object.freeze(["#261105", "Wood Bark"]),
      Object.freeze(["#261414", "Gondola"]),
      Object.freeze(["#262335", "Steel Gray"]),
      Object.freeze(["#26283B", "Ebony Clay"]),
      Object.freeze(["#273A81", "Bay of Many"]),
      Object.freeze(["#27504B", "Plantation"]),
      Object.freeze(["#278A5B", "Eucalyptus"]),
      Object.freeze(["#281E15", "Oil"]),
      Object.freeze(["#283A77", "Astronaut"]),
      Object.freeze(["#286ACD", "Mariner"]),
      Object.freeze(["#290C5E", "Violent Violet"]),
      Object.freeze(["#292130", "Bastille"]),
      Object.freeze(["#292319", "Zeus"]),
      Object.freeze(["#292937", "Charade"]),
      Object.freeze(["#297B9A", "Jelly Bean"]),
      Object.freeze(["#29AB87", "Jungle Green"]),
      Object.freeze(["#2A0359", "Cherry Pie"]),
      Object.freeze(["#2A140E", "Coffee Bean"]),
      Object.freeze(["#2A2630", "Baltic Sea"]),
      Object.freeze(["#2A380B", "Turtle Green"]),
      Object.freeze(["#2A52BE", "Cerulean Blue"]),
      Object.freeze(["#2B0202", "Sepia Black"]),
      Object.freeze(["#2B194F", "Valhalla"]),
      Object.freeze(["#2B3228", "Heavy Metal"]),
      Object.freeze(["#2C0E8C", "Blue Gem"]),
      Object.freeze(["#2C1632", "Revolver"]),
      Object.freeze(["#2C2133", "Bleached Cedar"]),
      Object.freeze(["#2C8C84", "Lochinvar"]),
      Object.freeze(["#2D2510", "Mikado"]),
      Object.freeze(["#2D383A", "Outer Space"]),
      Object.freeze(["#2D569B", "St Tropaz"]),
      Object.freeze(["#2E0329", "Jacaranda"]),
      Object.freeze(["#2E1905", "Jacko Bean"]),
      Object.freeze(["#2E3222", "Rangitoto"]),
      Object.freeze(["#2E3F62", "Rhino"]),
      Object.freeze(["#2E8B57", "Sea Green"]),
      Object.freeze(["#2EBFD4", "Scooter"]),
      Object.freeze(["#2F270E", "Onion"]),
      Object.freeze(["#2F3CB3", "Governor Bay"]),
      Object.freeze(["#2F519E", "Sapphire"]),
      Object.freeze(["#2F5A57", "Spectra"]),
      Object.freeze(["#2F6168", "Casal"]),
      Object.freeze(["#300529", "Melanzane"]),
      Object.freeze(["#301F1E", "Cocoa Brown"]),
      Object.freeze(["#302A0F", "Woodrush"]),
      Object.freeze(["#304B6A", "San Juan"]),
      Object.freeze(["#30D5C8", "Turquoise"]),
      Object.freeze(["#311C17", "Eclipse"]),
      Object.freeze(["#314459", "Pickled Bluewood"]),
      Object.freeze(["#315BA1", "Azure"]),
      Object.freeze(["#31728D", "Calypso"]),
      Object.freeze(["#317D82", "Paradiso"]),
      Object.freeze(["#32127A", "Persian Indigo"]),
      Object.freeze(["#32293A", "Blackcurrant"]),
      Object.freeze(["#323232", "Mine Shaft"]),
      Object.freeze(["#325D52", "Stromboli"]),
      Object.freeze(["#327C14", "Bilbao"]),
      Object.freeze(["#327DA0", "Astral"]),
      Object.freeze(["#33036B", "Christalle"]),
      Object.freeze(["#33292F", "Thunder"]),
      Object.freeze(["#33CC99", "Shamrock"]),
      Object.freeze(["#341515", "Tamarind"]),
      Object.freeze(["#350036", "Mardi Gras"]),
      Object.freeze(["#350E42", "Valentino"]),
      Object.freeze(["#350E57", "Jagger"]),
      Object.freeze(["#353542", "Tuna"]),
      Object.freeze(["#354E8C", "Chambray"]),
      Object.freeze(["#363050", "Martinique"]),
      Object.freeze(["#363534", "Tuatara"]),
      Object.freeze(["#363C0D", "Waiouru"]),
      Object.freeze(["#36747D", "Ming"]),
      Object.freeze(["#368716", "La Palma"]),
      Object.freeze(["#370202", "Chocolate"]),
      Object.freeze(["#371D09", "Clinker"]),
      Object.freeze(["#37290E", "Brown Tumbleweed"]),
      Object.freeze(["#373021", "Birch"]),
      Object.freeze(["#377475", "Oracle"]),
      Object.freeze(["#380474", "Blue Diamond"]),
      Object.freeze(["#381A51", "Grape"]),
      Object.freeze(["#383533", "Dune"]),
      Object.freeze(["#384555", "Oxford Blue"]),
      Object.freeze(["#384910", "Clover"]),
      Object.freeze(["#394851", "Limed Spruce"]),
      Object.freeze(["#396413", "Dell"]),
      Object.freeze(["#3A0020", "Toledo"]),
      Object.freeze(["#3A2010", "Sambuca"]),
      Object.freeze(["#3A2A6A", "Jacarta"]),
      Object.freeze(["#3A686C", "William"]),
      Object.freeze(["#3A6A47", "Killarney"]),
      Object.freeze(["#3AB09E", "Keppel"]),
      Object.freeze(["#3B000B", "Temptress"]),
      Object.freeze(["#3B0910", "Aubergine"]),
      Object.freeze(["#3B1F1F", "Jon"]),
      Object.freeze(["#3B2820", "Treehouse"]),
      Object.freeze(["#3B7A57", "Amazon"]),
      Object.freeze(["#3B91B4", "Boston Blue"]),
      Object.freeze(["#3C0878", "Windsor"]),
      Object.freeze(["#3C1206", "Rebel"]),
      Object.freeze(["#3C1F76", "Meteorite"]),
      Object.freeze(["#3C2005", "Dark Ebony"]),
      Object.freeze(["#3C3910", "Camouflage"]),
      Object.freeze(["#3C4151", "Bright Gray"]),
      Object.freeze(["#3C4443", "Cape Cod"]),
      Object.freeze(["#3C493A", "Lunar Green"]),
      Object.freeze(["#3D0C02", "Bean  "]),
      Object.freeze(["#3D2B1F", "Bistre"]),
      Object.freeze(["#3D7D52", "Goblin"]),
      Object.freeze(["#3E0480", "Kingfisher Daisy"]),
      Object.freeze(["#3E1C14", "Cedar"]),
      Object.freeze(["#3E2B23", "English Walnut"]),
      Object.freeze(["#3E2C1C", "Black Marlin"]),
      Object.freeze(["#3E3A44", "Ship Gray"]),
      Object.freeze(["#3EABBF", "Pelorous"]),
      Object.freeze(["#3F2109", "Bronze"]),
      Object.freeze(["#3F2500", "Cola"]),
      Object.freeze(["#3F3002", "Madras"]),
      Object.freeze(["#3F307F", "Minsk"]),
      Object.freeze(["#3F4C3A", "Cabbage Pont"]),
      Object.freeze(["#3F583B", "Tom Thumb"]),
      Object.freeze(["#3F5D53", "Mineral Green"]),
      Object.freeze(["#3FC1AA", "Puerto Rico"]),
      Object.freeze(["#3FFF00", "Harlequin"]),
      Object.freeze(["#401801", "Brown Pod"]),
      Object.freeze(["#40291D", "Cork"]),
      Object.freeze(["#403B38", "Masala"]),
      Object.freeze(["#403D19", "Thatch Green"]),
      Object.freeze(["#405169", "Fiord"]),
      Object.freeze(["#40826D", "Viridian"]),
      Object.freeze(["#40A860", "Chateau Green"]),
      Object.freeze(["#410056", "Ripe Plum"]),
      Object.freeze(["#411F10", "Paco"]),
      Object.freeze(["#412010", "Deep Oak"]),
      Object.freeze(["#413C37", "Merlin"]),
      Object.freeze(["#414257", "Gun Powder"]),
      Object.freeze(["#414C7D", "East Bay"]),
      Object.freeze(["#4169E1", "Royal Blue"]),
      Object.freeze(["#41AA78", "Ocean Green"]),
      Object.freeze(["#420303", "Burnt Maroon"]),
      Object.freeze(["#423921", "Lisbon Brown"]),
      Object.freeze(["#427977", "Faded Jade"]),
      Object.freeze(["#431560", "Scarlet Gum"]),
      Object.freeze(["#433120", "Iroko"]),
      Object.freeze(["#433E37", "Armadillo"]),
      Object.freeze(["#434C59", "River Bed"]),
      Object.freeze(["#436A0D", "Green Leaf"]),
      Object.freeze(["#44012D", "Barossa"]),
      Object.freeze(["#441D00", "Morocco Brown"]),
      Object.freeze(["#444954", "Mako"]),
      Object.freeze(["#454936", "Kelp"]),
      Object.freeze(["#456CAC", "San Marino"]),
      Object.freeze(["#45B1E8", "Picton Blue"]),
      Object.freeze(["#460B41", "Loulou"]),
      Object.freeze(["#462425", "Crater Brown"]),
      Object.freeze(["#465945", "Gray Asparagus"]),
      Object.freeze(["#4682B4", "Steel Blue"]),
      Object.freeze(["#480404", "Rustic Red"]),
      Object.freeze(["#480607", "Bulgarian Rose"]),
      Object.freeze(["#480656", "Clairvoyant"]),
      Object.freeze(["#481C1C", "Cocoa Bean"]),
      Object.freeze(["#483131", "Woody Brown"]),
      Object.freeze(["#483C32", "Taupe"]),
      Object.freeze(["#49170C", "Van Cleef"]),
      Object.freeze(["#492615", "Brown Derby"]),
      Object.freeze(["#49371B", "Metallic Bronze"]),
      Object.freeze(["#495400", "Verdun Green"]),
      Object.freeze(["#496679", "Blue Bayoux"]),
      Object.freeze(["#497183", "Bismark"]),
      Object.freeze(["#4A2A04", "Bracken"]),
      Object.freeze(["#4A3004", "Deep Bronze"]),
      Object.freeze(["#4A3C30", "Mondo"]),
      Object.freeze(["#4A4244", "Tundora"]),
      Object.freeze(["#4A444B", "Gravel"]),
      Object.freeze(["#4A4E5A", "Trout"]),
      Object.freeze(["#4B0082", "Pigment Indigo"]),
      Object.freeze(["#4B5D52", "Nandor"]),
      Object.freeze(["#4C3024", "Saddle"]),
      Object.freeze(["#4C4F56", "Abbey"]),
      Object.freeze(["#4D0135", "Blackberry"]),
      Object.freeze(["#4D0A18", "Cab Sav"]),
      Object.freeze(["#4D1E01", "Indian Tan"]),
      Object.freeze(["#4D282D", "Cowboy"]),
      Object.freeze(["#4D282E", "Livid Brown"]),
      Object.freeze(["#4D3833", "Rock"]),
      Object.freeze(["#4D3D14", "Punga"]),
      Object.freeze(["#4D400F", "Bronzetone"]),
      Object.freeze(["#4D5328", "Woodland"]),
      Object.freeze(["#4E0606", "Mahogany"]),
      Object.freeze(["#4E2A5A", "Bossanova"]),
      Object.freeze(["#4E3B41", "Matterhorn"]),
      Object.freeze(["#4E420C", "Bronze Olive"]),
      Object.freeze(["#4E4562", "Mulled Wine"]),
      Object.freeze(["#4E6649", "Axolotl"]),
      Object.freeze(["#4E7F9E", "Wedgewood"]),
      Object.freeze(["#4EABD1", "Shakespeare"]),
      Object.freeze(["#4F1C70", "Honey Flower"]),
      Object.freeze(["#4F2398", "Daisy Bush"]),
      Object.freeze(["#4F69C6", "Indigo"]),
      Object.freeze(["#4F7942", "Fern Green"]),
      Object.freeze(["#4F9D5D", "Fruit Salad"]),
      Object.freeze(["#4FA83D", "Apple"]),
      Object.freeze(["#504351", "Mortar"]),
      Object.freeze(["#507096", "Kashmir Blue"]),
      Object.freeze(["#507672", "Cutty Sark"]),
      Object.freeze(["#50C878", "Emerald"]),
      Object.freeze(["#514649", "Emperor"]),
      Object.freeze(["#516E3D", "Chalet Green"]),
      Object.freeze(["#517C66", "Como"]),
      Object.freeze(["#51808F", "Smalt Blue"]),
      Object.freeze(["#52001F", "Castro"]),
      Object.freeze(["#520C17", "Maroon Oak"]),
      Object.freeze(["#523C94", "Gigas"]),
      Object.freeze(["#533455", "Voodoo"]),
      Object.freeze(["#534491", "Victoria"]),
      Object.freeze(["#53824B", "Hippie Green"]),
      Object.freeze(["#541012", "Heath"]),
      Object.freeze(["#544333", "Judge Gray"]),
      Object.freeze(["#54534D", "Fuscous Gray"]),
      Object.freeze(["#549019", "Vida Loca"]),
      Object.freeze(["#55280C", "Cioccolato"]),
      Object.freeze(["#555B10", "Saratoga"]),
      Object.freeze(["#556D56", "Finlandia"]),
      Object.freeze(["#5590D9", "Havelock Blue"]),
      Object.freeze(["#56B4BE", "Fountain Blue"]),
      Object.freeze(["#578363", "Spring Leaves"]),
      Object.freeze(["#583401", "Saddle Brown"]),
      Object.freeze(["#585562", "Scarpa Flow"]),
      Object.freeze(["#587156", "Cactus"]),
      Object.freeze(["#589AAF", "Hippie Blue"]),
      Object.freeze(["#591D35", "Wine Berry"]),
      Object.freeze(["#592804", "Brown Bramble"]),
      Object.freeze(["#593737", "Congo Brown"]),
      Object.freeze(["#594433", "Millbrook"]),
      Object.freeze(["#5A6E9C", "Waikawa Gray"]),
      Object.freeze(["#5A87A0", "Horizon"]),
      Object.freeze(["#5B3013", "Jambalaya"]),
      Object.freeze(["#5C0120", "Bordeaux"]),
      Object.freeze(["#5C0536", "Mulberry Wood"]),
      Object.freeze(["#5C2E01", "Carnaby Tan"]),
      Object.freeze(["#5C5D75", "Comet"]),
      Object.freeze(["#5D1E0F", "Redwood"]),
      Object.freeze(["#5D4C51", "Don Juan"]),
      Object.freeze(["#5D5C58", "Chicago"]),
      Object.freeze(["#5D5E37", "Verdigris"]),
      Object.freeze(["#5D7747", "Dingley"]),
      Object.freeze(["#5DA19F", "Breaker Bay"]),
      Object.freeze(["#5E483E", "Kabul"]),
      Object.freeze(["#5E5D3B", "Hemlock"]),
      Object.freeze(["#5F3D26", "Irish Coffee"]),
      Object.freeze(["#5F5F6E", "Mid Gray"]),
      Object.freeze(["#5F6672", "Shuttle Gray"]),
      Object.freeze(["#5FA777", "Aqua Forest"]),
      Object.freeze(["#5FB3AC", "Tradewind"]),
      Object.freeze(["#604913", "Horses Neck"]),
      Object.freeze(["#605B73", "Smoky"]),
      Object.freeze(["#606E68", "Corduroy"]),
      Object.freeze(["#6093D1", "Danube"]),
      Object.freeze(["#612718", "Espresso"]),
      Object.freeze(["#614051", "Eggplant"]),
      Object.freeze(["#615D30", "Costa Del Sol"]),
      Object.freeze(["#61845F", "Glade Green"]),
      Object.freeze(["#622F30", "Buccaneer"]),
      Object.freeze(["#623F2D", "Quincy"]),
      Object.freeze(["#624E9A", "Butterfly Bush"]),
      Object.freeze(["#625119", "West Coast"]),
      Object.freeze(["#626649", "Finch"]),
      Object.freeze(["#639A8F", "Patina"]),
      Object.freeze(["#63B76C", "Fern"]),
      Object.freeze(["#6456B7", "Blue Violet"]),
      Object.freeze(["#646077", "Dolphin"]),
      Object.freeze(["#646463", "Storm Dust"]),
      Object.freeze(["#646A54", "Siam"]),
      Object.freeze(["#646E75", "Nevada"]),
      Object.freeze(["#6495ED", "Cornflower Blue"]),
      Object.freeze(["#64CCDB", "Viking"]),
      Object.freeze(["#65000B", "Rosewood"]),
      Object.freeze(["#651A14", "Cherrywood"]),
      Object.freeze(["#652DC1", "Purple Heart"]),
      Object.freeze(["#657220", "Fern Frond"]),
      Object.freeze(["#65745D", "Willow Grove"]),
      Object.freeze(["#65869F", "Hoki"]),
      Object.freeze(["#660045", "Pompadour"]),
      Object.freeze(["#660099", "Purple"]),
      Object.freeze(["#66023C", "Tyrian Purple"]),
      Object.freeze(["#661010", "Dark Tan"]),
      Object.freeze(["#66B58F", "Silver Tree"]),
      Object.freeze(["#66FF00", "Bright Green"]),
      Object.freeze(["#66FF66", "Screamin' Green"]),
      Object.freeze(["#67032D", "Black Rose"]),
      Object.freeze(["#675FA6", "Scampi"]),
      Object.freeze(["#676662", "Ironside Gray"]),
      Object.freeze(["#678975", "Viridian Green"]),
      Object.freeze(["#67A712", "Christi"]),
      Object.freeze(["#683600", "Nutmeg Wood Finish"]),
      Object.freeze(["#685558", "Zambezi"]),
      Object.freeze(["#685E6E", "Salt Box"]),
      Object.freeze(["#692545", "Tawny Port"]),
      Object.freeze(["#692D54", "Finn"]),
      Object.freeze(["#695F62", "Scorpion"]),
      Object.freeze(["#697E9A", "Lynch"]),
      Object.freeze(["#6A442E", "Spice"]),
      Object.freeze(["#6A5D1B", "Himalaya"]),
      Object.freeze(["#6A6051", "Soya Bean"]),
      Object.freeze(["#6B2A14", "Hairy Heath"]),
      Object.freeze(["#6B3FA0", "Royal Purple"]),
      Object.freeze(["#6B4E31", "Shingle Fawn"]),
      Object.freeze(["#6B5755", "Dorado"]),
      Object.freeze(["#6B8BA2", "Bermuda Gray"]),
      Object.freeze(["#6B8E23", "Olive Drab"]),
      Object.freeze(["#6C3082", "Eminence"]),
      Object.freeze(["#6CDAE7", "Turquoise Blue"]),
      Object.freeze(["#6D0101", "Lonestar"]),
      Object.freeze(["#6D5E54", "Pine Cone"]),
      Object.freeze(["#6D6C6C", "Dove Gray"]),
      Object.freeze(["#6D9292", "Juniper"]),
      Object.freeze(["#6D92A1", "Gothic"]),
      Object.freeze(["#6E0902", "Red Oxide"]),
      Object.freeze(["#6E1D14", "Moccaccino"]),
      Object.freeze(["#6E4826", "Pickled Bean"]),
      Object.freeze(["#6E4B26", "Dallas"]),
      Object.freeze(["#6E6D57", "Kokoda"]),
      Object.freeze(["#6E7783", "Pale Sky"]),
      Object.freeze(["#6F440C", "Cafe Royale"]),
      Object.freeze(["#6F6A61", "Flint"]),
      Object.freeze(["#6F8E63", "Highland"]),
      Object.freeze(["#6F9D02", "Limeade"]),
      Object.freeze(["#6FD0C5", "Downy"]),
      Object.freeze(["#701C1C", "Persian Plum"]),
      Object.freeze(["#704214", "Sepia"]),
      Object.freeze(["#704A07", "Antique Bronze"]),
      Object.freeze(["#704F50", "Ferra"]),
      Object.freeze(["#706555", "Coffee"]),
      Object.freeze(["#708090", "Slate Gray"]),
      Object.freeze(["#711A00", "Cedar Wood Finish"]),
      Object.freeze(["#71291D", "Metallic Copper"]),
      Object.freeze(["#714693", "Affair"]),
      Object.freeze(["#714AB2", "Studio"]),
      Object.freeze(["#715D47", "Tobacco Brown"]),
      Object.freeze(["#716338", "Yellow Metal"]),
      Object.freeze(["#716B56", "Peat"]),
      Object.freeze(["#716E10", "Olivetone"]),
      Object.freeze(["#717486", "Storm Gray"]),
      Object.freeze(["#718080", "Sirocco"]),
      Object.freeze(["#71D9E2", "Aquamarine Blue"]),
      Object.freeze(["#72010F", "Venetian Red"]),
      Object.freeze(["#724A2F", "Old Copper"]),
      Object.freeze(["#726D4E", "Go Ben"]),
      Object.freeze(["#727B89", "Raven"]),
      Object.freeze(["#731E8F", "Seance"]),
      Object.freeze(["#734A12", "Raw Umber"]),
      Object.freeze(["#736C9F", "Kimberly"]),
      Object.freeze(["#736D58", "Crocodile"]),
      Object.freeze(["#737829", "Crete"]),
      Object.freeze(["#738678", "Xanadu"]),
      Object.freeze(["#74640D", "Spicy Mustard"]),
      Object.freeze(["#747D63", "Limed Ash"]),
      Object.freeze(["#747D83", "Rolling Stone"]),
      Object.freeze(["#748881", "Blue Smoke"]),
      Object.freeze(["#749378", "Laurel"]),
      Object.freeze(["#74C365", "Mantis"]),
      Object.freeze(["#755A57", "Russett"]),
      Object.freeze(["#7563A8", "Deluge"]),
      Object.freeze(["#76395D", "Cosmic"]),
      Object.freeze(["#7666C6", "Blue Marguerite"]),
      Object.freeze(["#76BD17", "Lima"]),
      Object.freeze(["#76D7EA", "Sky Blue"]),
      Object.freeze(["#770F05", "Dark Burgundy"]),
      Object.freeze(["#771F1F", "Crown of Thorns"]),
      Object.freeze(["#773F1A", "Walnut"]),
      Object.freeze(["#776F61", "Pablo"]),
      Object.freeze(["#778120", "Pacifika"]),
      Object.freeze(["#779E86", "Oxley"]),
      Object.freeze(["#77DD77", "Pastel Green"]),
      Object.freeze(["#780109", "Japanese Maple"]),
      Object.freeze(["#782D19", "Mocha"]),
      Object.freeze(["#782F16", "Peanut"]),
      Object.freeze(["#78866B", "Camouflage Green"]),
      Object.freeze(["#788A25", "Wasabi"]),
      Object.freeze(["#788BBA", "Ship Cove"]),
      Object.freeze(["#78A39C", "Sea Nymph"]),
      Object.freeze(["#795D4C", "Roman Coffee"]),
      Object.freeze(["#796878", "Old Lavender"]),
      Object.freeze(["#796989", "Rum"]),
      Object.freeze(["#796A78", "Fedora"]),
      Object.freeze(["#796D62", "Sandstone"]),
      Object.freeze(["#79DEEC", "Spray"]),
      Object.freeze(["#7A013A", "Siren"]),
      Object.freeze(["#7A58C1", "Fuchsia Blue"]),
      Object.freeze(["#7A7A7A", "Boulder"]),
      Object.freeze(["#7A89B8", "Wild Blue Yonder"]),
      Object.freeze(["#7AC488", "De York"]),
      Object.freeze(["#7B3801", "Red Beech"]),
      Object.freeze(["#7B3F00", "Cinnamon"]),
      Object.freeze(["#7B6608", "Yukon Gold"]),
      Object.freeze(["#7B7874", "Tapa"]),
      Object.freeze(["#7B7C94", "Waterloo "]),
      Object.freeze(["#7B8265", "Flax Smoke"]),
      Object.freeze(["#7B9F80", "Amulet"]),
      Object.freeze(["#7BA05B", "Asparagus"]),
      Object.freeze(["#7C1C05", "Kenyan Copper"]),
      Object.freeze(["#7C7631", "Pesto"]),
      Object.freeze(["#7C778A", "Topaz"]),
      Object.freeze(["#7C7B7A", "Concord"]),
      Object.freeze(["#7C7B82", "Jumbo"]),
      Object.freeze(["#7C881A", "Trendy Green"]),
      Object.freeze(["#7CA1A6", "Gumbo"]),
      Object.freeze(["#7CB0A1", "Acapulco"]),
      Object.freeze(["#7CB7BB", "Neptune"]),
      Object.freeze(["#7D2C14", "Pueblo"]),
      Object.freeze(["#7DA98D", "Bay Leaf"]),
      Object.freeze(["#7DC8F7", "Malibu"]),
      Object.freeze(["#7DD8C6", "Bermuda"]),
      Object.freeze(["#7E3A15", "Copper Canyon"]),
      Object.freeze(["#7F1734", "Claret"]),
      Object.freeze(["#7F3A02", "Peru Tan"]),
      Object.freeze(["#7F626D", "Falcon"]),
      Object.freeze(["#7F7589", "Mobster"]),
      Object.freeze(["#7F76D3", "Moody Blue"]),
      Object.freeze(["#7FFF00", "Chartreuse"]),
      Object.freeze(["#7FFFD4", "Aquamarine"]),
      Object.freeze(["#800000", "Maroon"]),
      Object.freeze(["#800B47", "Rose Bud Cherry"]),
      Object.freeze(["#801818", "Falu Red"]),
      Object.freeze(["#80341F", "Red Robin"]),
      Object.freeze(["#803790", "Vivid Violet"]),
      Object.freeze(["#80461B", "Russet"]),
      Object.freeze(["#807E79", "Friar Gray"]),
      Object.freeze(["#808000", "Olive"]),
      Object.freeze(["#808080", "Gray"]),
      Object.freeze(["#80B3AE", "Gulf Stream"]),
      Object.freeze(["#80B3C4", "Glacier"]),
      Object.freeze(["#80CCEA", "Seagull"]),
      Object.freeze(["#81422C", "Nutmeg"]),
      Object.freeze(["#816E71", "Spicy Pink"]),
      Object.freeze(["#817377", "Empress"]),
      Object.freeze(["#819885", "Spanish Green"]),
      Object.freeze(["#826F65", "Sand Dune"]),
      Object.freeze(["#828685", "Gunsmoke"]),
      Object.freeze(["#828F72", "Battleship Gray"]),
      Object.freeze(["#831923", "Merlot"]),
      Object.freeze(["#837050", "Shadow"]),
      Object.freeze(["#83AA5D", "Chelsea Cucumber"]),
      Object.freeze(["#83D0C6", "Monte Carlo"]),
      Object.freeze(["#843179", "Plum"]),
      Object.freeze(["#84A0A0", "Granny Smith"]),
      Object.freeze(["#8581D9", "Chetwode Blue"]),
      Object.freeze(["#858470", "Bandicoot"]),
      Object.freeze(["#859FAF", "Bali Hai"]),
      Object.freeze(["#85C4CC", "Half Baked"]),
      Object.freeze(["#860111", "Red Devil"]),
      Object.freeze(["#863C3C", "Lotus"]),
      Object.freeze(["#86483C", "Ironstone"]),
      Object.freeze(["#864D1E", "Bull Shot"]),
      Object.freeze(["#86560A", "Rusty Nail"]),
      Object.freeze(["#868974", "Bitter"]),
      Object.freeze(["#86949F", "Regent Gray"]),
      Object.freeze(["#871550", "Disco"]),
      Object.freeze(["#87756E", "Americano"]),
      Object.freeze(["#877C7B", "Hurricane"]),
      Object.freeze(["#878D91", "Oslo Gray"]),
      Object.freeze(["#87AB39", "Sushi"]),
      Object.freeze(["#885342", "Spicy Mix"]),
      Object.freeze(["#886221", "Kumera"]),
      Object.freeze(["#888387", "Suva Gray"]),
      Object.freeze(["#888D65", "Avocado"]),
      Object.freeze(["#893456", "Camelot"]),
      Object.freeze(["#893843", "Solid Pink"]),
      Object.freeze(["#894367", "Cannon Pink"]),
      Object.freeze(["#897D6D", "Makara"]),
      Object.freeze(["#8A3324", "Burnt Umber"]),
      Object.freeze(["#8A73D6", "True V"]),
      Object.freeze(["#8A8360", "Clay Creek"]),
      Object.freeze(["#8A8389", "Monsoon"]),
      Object.freeze(["#8A8F8A", "Stack"]),
      Object.freeze(["#8AB9F1", "Jordy Blue"]),
      Object.freeze(["#8B00FF", "Electric Violet"]),
      Object.freeze(["#8B0723", "Monarch"]),
      Object.freeze(["#8B6B0B", "Corn Harvest"]),
      Object.freeze(["#8B8470", "Olive Haze"]),
      Object.freeze(["#8B847E", "Schooner"]),
      Object.freeze(["#8B8680", "Natural Gray"]),
      Object.freeze(["#8B9C90", "Mantle"]),
      Object.freeze(["#8B9FEE", "Portage"]),
      Object.freeze(["#8BA690", "Envy"]),
      Object.freeze(["#8BA9A5", "Cascade"]),
      Object.freeze(["#8BE6D8", "Riptide"]),
      Object.freeze(["#8C055E", "Cardinal Pink"]),
      Object.freeze(["#8C472F", "Mule Fawn"]),
      Object.freeze(["#8C5738", "Potters Clay"]),
      Object.freeze(["#8C6495", "Trendy Pink"]),
      Object.freeze(["#8D0226", "Paprika"]),
      Object.freeze(["#8D3D38", "Sanguine Brown"]),
      Object.freeze(["#8D3F3F", "Tosca"]),
      Object.freeze(["#8D7662", "Cement"]),
      Object.freeze(["#8D8974", "Granite Green"]),
      Object.freeze(["#8D90A1", "Manatee"]),
      Object.freeze(["#8DA8CC", "Polo Blue"]),
      Object.freeze(["#8E0000", "Red Berry"]),
      Object.freeze(["#8E4D1E", "Rope"]),
      Object.freeze(["#8E6F70", "Opium"]),
      Object.freeze(["#8E775E", "Domino"]),
      Object.freeze(["#8E8190", "Mamba"]),
      Object.freeze(["#8EABC1", "Nepal"]),
      Object.freeze(["#8F021C", "Pohutukawa"]),
      Object.freeze(["#8F3E33", "El Salva"]),
      Object.freeze(["#8F4B0E", "Korma"]),
      Object.freeze(["#8F8176", "Squirrel"]),
      Object.freeze(["#8FD6B4", "Vista Blue"]),
      Object.freeze(["#900020", "Burgundy"]),
      Object.freeze(["#901E1E", "Old Brick"]),
      Object.freeze(["#907874", "Hemp"]),
      Object.freeze(["#907B71", "Almond Frost"]),
      Object.freeze(["#908D39", "Sycamore"]),
      Object.freeze(["#92000A", "Sangria"]),
      Object.freeze(["#924321", "Cumin"]),
      Object.freeze(["#926F5B", "Beaver"]),
      Object.freeze(["#928573", "Stonewall"]),
      Object.freeze(["#928590", "Venus"]),
      Object.freeze(["#9370DB", "Medium Purple"]),
      Object.freeze(["#93CCEA", "Cornflower"]),
      Object.freeze(["#93DFB8", "Algae Green"]),
      Object.freeze(["#944747", "Copper Rust"]),
      Object.freeze(["#948771", "Arrowtown"]),
      Object.freeze(["#950015", "Scarlett"]),
      Object.freeze(["#956387", "Strikemaster"]),
      Object.freeze(["#959396", "Mountain Mist"]),
      Object.freeze(["#960018", "Carmine"]),
      Object.freeze(["#964B00", "Brown"]),
      Object.freeze(["#967059", "Leather"]),
      Object.freeze(["#9678B6", "Purple Mountain's Majesty"]),
      Object.freeze(["#967BB6", "Lavender Purple"]),
      Object.freeze(["#96A8A1", "Pewter"]),
      Object.freeze(["#96BBAB", "Summer Green"]),
      Object.freeze(["#97605D", "Au Chico"]),
      Object.freeze(["#9771B5", "Wisteria"]),
      Object.freeze(["#97CD2D", "Atlantis"]),
      Object.freeze(["#983D61", "Vin Rouge"]),
      Object.freeze(["#9874D3", "Lilac Bush"]),
      Object.freeze(["#98777B", "Bazaar"]),
      Object.freeze(["#98811B", "Hacienda"]),
      Object.freeze(["#988D77", "Pale Oyster"]),
      Object.freeze(["#98FF98", "Mint Green"]),
      Object.freeze(["#990066", "Fresh Eggplant"]),
      Object.freeze(["#991199", "Violet Eggplant"]),
      Object.freeze(["#991613", "Tamarillo"]),
      Object.freeze(["#991B07", "Totem Pole"]),
      Object.freeze(["#996666", "Copper Rose"]),
      Object.freeze(["#9966CC", "Amethyst"]),
      Object.freeze(["#997A8D", "Mountbatten Pink"]),
      Object.freeze(["#9999CC", "Blue Bell"]),
      Object.freeze(["#9A3820", "Prairie Sand"]),
      Object.freeze(["#9A6E61", "Toast"]),
      Object.freeze(["#9A9577", "Gurkha"]),
      Object.freeze(["#9AB973", "Olivine"]),
      Object.freeze(["#9AC2B8", "Shadow Green"]),
      Object.freeze(["#9B4703", "Oregon"]),
      Object.freeze(["#9B9E8F", "Lemon Grass"]),
      Object.freeze(["#9C3336", "Stiletto"]),
      Object.freeze(["#9D5616", "Hawaiian Tan"]),
      Object.freeze(["#9DACB7", "Gull Gray"]),
      Object.freeze(["#9DC209", "Pistachio"]),
      Object.freeze(["#9DE093", "Granny Smith Apple"]),
      Object.freeze(["#9DE5FF", "Anakiwa"]),
      Object.freeze(["#9E5302", "Chelsea Gem"]),
      Object.freeze(["#9E5B40", "Sepia Skin"]),
      Object.freeze(["#9EA587", "Sage"]),
      Object.freeze(["#9EA91F", "Citron"]),
      Object.freeze(["#9EB1CD", "Rock Blue"]),
      Object.freeze(["#9EDEE0", "Morning Glory"]),
      Object.freeze(["#9F381D", "Cognac"]),
      Object.freeze(["#9F821C", "Reef Gold"]),
      Object.freeze(["#9F9F9C", "Star Dust"]),
      Object.freeze(["#9FA0B1", "Santas Gray"]),
      Object.freeze(["#9FD7D3", "Sinbad"]),
      Object.freeze(["#9FDD8C", "Feijoa"]),
      Object.freeze(["#A02712", "Tabasco"]),
      Object.freeze(["#A1750D", "Buttered Rum"]),
      Object.freeze(["#A1ADB5", "Hit Gray"]),
      Object.freeze(["#A1C50A", "Citrus"]),
      Object.freeze(["#A1DAD7", "Aqua Island"]),
      Object.freeze(["#A1E9DE", "Water Leaf"]),
      Object.freeze(["#A2006D", "Flirt"]),
      Object.freeze(["#A23B6C", "Rouge"]),
      Object.freeze(["#A26645", "Cape Palliser"]),
      Object.freeze(["#A2AAB3", "Gray Chateau"]),
      Object.freeze(["#A2AEAB", "Edward"]),
      Object.freeze(["#A3807B", "Pharlap"]),
      Object.freeze(["#A397B4", "Amethyst Smoke"]),
      Object.freeze(["#A3E3ED", "Blizzard Blue"]),
      Object.freeze(["#A4A49D", "Delta"]),
      Object.freeze(["#A4A6D3", "Wistful"]),
      Object.freeze(["#A4AF6E", "Green Smoke"]),
      Object.freeze(["#A50B5E", "Jazzberry Jam"]),
      Object.freeze(["#A59B91", "Zorba"]),
      Object.freeze(["#A5CB0C", "Bahia"]),
      Object.freeze(["#A62F20", "Roof Terracotta"]),
      Object.freeze(["#A65529", "Paarl"]),
      Object.freeze(["#A68B5B", "Barley Corn"]),
      Object.freeze(["#A69279", "Donkey Brown"]),
      Object.freeze(["#A6A29A", "Dawn"]),
      Object.freeze(["#A72525", "Mexican Red"]),
      Object.freeze(["#A7882C", "Luxor Gold"]),
      Object.freeze(["#A85307", "Rich Gold"]),
      Object.freeze(["#A86515", "Reno Sand"]),
      Object.freeze(["#A86B6B", "Coral Tree"]),
      Object.freeze(["#A8989B", "Dusty Gray"]),
      Object.freeze(["#A899E6", "Dull Lavender"]),
      Object.freeze(["#A8A589", "Tallow"]),
      Object.freeze(["#A8AE9C", "Bud"]),
      Object.freeze(["#A8AF8E", "Locust"]),
      Object.freeze(["#A8BD9F", "Norway"]),
      Object.freeze(["#A8E3BD", "Chinook"]),
      Object.freeze(["#A9A491", "Gray Olive"]),
      Object.freeze(["#A9ACB6", "Aluminium"]),
      Object.freeze(["#A9B2C3", "Cadet Blue"]),
      Object.freeze(["#A9B497", "Schist"]),
      Object.freeze(["#A9BDBF", "Tower Gray"]),
      Object.freeze(["#A9BEF2", "Perano"]),
      Object.freeze(["#A9C6C2", "Opal"]),
      Object.freeze(["#AA375A", "Night Shadz"]),
      Object.freeze(["#AA4203", "Fire"]),
      Object.freeze(["#AA8B5B", "Muesli"]),
      Object.freeze(["#AA8D6F", "Sandal"]),
      Object.freeze(["#AAA5A9", "Shady Lady"]),
      Object.freeze(["#AAA9CD", "Logan"]),
      Object.freeze(["#AAABB7", "Spun Pearl"]),
      Object.freeze(["#AAD6E6", "Regent St Blue"]),
      Object.freeze(["#AAF0D1", "Magic Mint"]),
      Object.freeze(["#AB0563", "Lipstick"]),
      Object.freeze(["#AB3472", "Royal Heath"]),
      Object.freeze(["#AB917A", "Sandrift"]),
      Object.freeze(["#ABA0D9", "Cold Purple"]),
      Object.freeze(["#ABA196", "Bronco"]),
      Object.freeze(["#AC8A56", "Limed Oak"]),
      Object.freeze(["#AC91CE", "East Side"]),
      Object.freeze(["#AC9E22", "Lemon Ginger"]),
      Object.freeze(["#ACA494", "Napa"]),
      Object.freeze(["#ACA586", "Hillary"]),
      Object.freeze(["#ACA59F", "Cloudy"]),
      Object.freeze(["#ACACAC", "Silver Chalice"]),
      Object.freeze(["#ACB78E", "Swamp Green"]),
      Object.freeze(["#ACCBB1", "Spring Rain"]),
      Object.freeze(["#ACDD4D", "Conifer"]),
      Object.freeze(["#ACE1AF", "Celadon"]),
      Object.freeze(["#AD781B", "Mandalay"]),
      Object.freeze(["#ADBED1", "Casper"]),
      Object.freeze(["#ADDFAD", "Moss Green"]),
      Object.freeze(["#ADE6C4", "Padua"]),
      Object.freeze(["#ADFF2F", "Green Yellow"]),
      Object.freeze(["#AE4560", "Hippie Pink"]),
      Object.freeze(["#AE6020", "Desert"]),
      Object.freeze(["#AE809E", "Bouquet"]),
      Object.freeze(["#AF4035", "Medium Carmine"]),
      Object.freeze(["#AF4D43", "Apple Blossom"]),
      Object.freeze(["#AF593E", "Brown Rust"]),
      Object.freeze(["#AF8751", "Driftwood"]),
      Object.freeze(["#AF8F2C", "Alpine"]),
      Object.freeze(["#AF9F1C", "Lucky"]),
      Object.freeze(["#AFA09E", "Martini"]),
      Object.freeze(["#AFB1B8", "Bombay"]),
      Object.freeze(["#AFBDD9", "Pigeon Post"]),
      Object.freeze(["#B04C6A", "Cadillac"]),
      Object.freeze(["#B05D54", "Matrix"]),
      Object.freeze(["#B05E81", "Tapestry"]),
      Object.freeze(["#B06608", "Mai Tai"]),
      Object.freeze(["#B09A95", "Del Rio"]),
      Object.freeze(["#B0E0E6", "Powder Blue"]),
      Object.freeze(["#B0E313", "Inch Worm"]),
      Object.freeze(["#B10000", "Bright Red"]),
      Object.freeze(["#B14A0B", "Vesuvius"]),
      Object.freeze(["#B1610B", "Pumpkin Skin"]),
      Object.freeze(["#B16D52", "Santa Fe"]),
      Object.freeze(["#B19461", "Teak"]),
      Object.freeze(["#B1E2C1", "Fringy Flower"]),
      Object.freeze(["#B1F4E7", "Ice Cold"]),
      Object.freeze(["#B20931", "Shiraz"]),
      Object.freeze(["#B2A1EA", "Biloba Flower"]),
      Object.freeze(["#B32D29", "Tall Poppy"]),
      Object.freeze(["#B35213", "Fiery Orange"]),
      Object.freeze(["#B38007", "Hot Toddy"]),
      Object.freeze(["#B3AF95", "Taupe Gray"]),
      Object.freeze(["#B3C110", "La Rioja"]),
      Object.freeze(["#B43332", "Well Read"]),
      Object.freeze(["#B44668", "Blush"]),
      Object.freeze(["#B4CFD3", "Jungle Mist"]),
      Object.freeze(["#B57281", "Turkish Rose"]),
      Object.freeze(["#B57EDC", "Lavender"]),
      Object.freeze(["#B5A27F", "Mongoose"]),
      Object.freeze(["#B5B35C", "Olive Green"]),
      Object.freeze(["#B5D2CE", "Jet Stream"]),
      Object.freeze(["#B5ECDF", "Cruise"]),
      Object.freeze(["#B6316C", "Hibiscus"]),
      Object.freeze(["#B69D98", "Thatch"]),
      Object.freeze(["#B6B095", "Heathered Gray"]),
      Object.freeze(["#B6BAA4", "Eagle"]),
      Object.freeze(["#B6D1EA", "Spindle"]),
      Object.freeze(["#B6D3BF", "Gum Leaf"]),
      Object.freeze(["#B7410E", "Rust"]),
      Object.freeze(["#B78E5C", "Muddy Waters"]),
      Object.freeze(["#B7A214", "Sahara"]),
      Object.freeze(["#B7A458", "Husk"]),
      Object.freeze(["#B7B1B1", "Nobel"]),
      Object.freeze(["#B7C3D0", "Heather"]),
      Object.freeze(["#B7F0BE", "Madang"]),
      Object.freeze(["#B81104", "Milano Red"]),
      Object.freeze(["#B87333", "Copper"]),
      Object.freeze(["#B8B56A", "Gimblet"]),
      Object.freeze(["#B8C1B1", "Green Spring"]),
      Object.freeze(["#B8C25D", "Celery"]),
      Object.freeze(["#B8E0F9", "Sail"]),
      Object.freeze(["#B94E48", "Chestnut"]),
      Object.freeze(["#B95140", "Crail"]),
      Object.freeze(["#B98D28", "Marigold"]),
      Object.freeze(["#B9C46A", "Wild Willow"]),
      Object.freeze(["#B9C8AC", "Rainee"]),
      Object.freeze(["#BA0101", "Guardsman Red"]),
      Object.freeze(["#BA450C", "Rock Spray"]),
      Object.freeze(["#BA6F1E", "Bourbon"]),
      Object.freeze(["#BA7F03", "Pirate Gold"]),
      Object.freeze(["#BAB1A2", "Nomad"]),
      Object.freeze(["#BAC7C9", "Submarine"]),
      Object.freeze(["#BAEEF9", "Charlotte"]),
      Object.freeze(["#BB3385", "Medium Red Violet"]),
      Object.freeze(["#BB8983", "Brandy Rose"]),
      Object.freeze(["#BBD009", "Rio Grande"]),
      Object.freeze(["#BBD7C1", "Surf"]),
      Object.freeze(["#BCC9C2", "Powder Ash"]),
      Object.freeze(["#BD5E2E", "Tuscany"]),
      Object.freeze(["#BD978E", "Quicksand"]),
      Object.freeze(["#BDB1A8", "Silk"]),
      Object.freeze(["#BDB2A1", "Malta"]),
      Object.freeze(["#BDB3C7", "Chatelle"]),
      Object.freeze(["#BDBBD7", "Lavender Gray"]),
      Object.freeze(["#BDBDC6", "French Gray"]),
      Object.freeze(["#BDC8B3", "Clay Ash"]),
      Object.freeze(["#BDC9CE", "Loblolly"]),
      Object.freeze(["#BDEDFD", "French Pass"]),
      Object.freeze(["#BEA6C3", "London Hue"]),
      Object.freeze(["#BEB5B7", "Pink Swan"]),
      Object.freeze(["#BEDE0D", "Fuego"]),
      Object.freeze(["#BF5500", "Rose of Sharon"]),
      Object.freeze(["#BFB8B0", "Tide"]),
      Object.freeze(["#BFBED8", "Blue Haze"]),
      Object.freeze(["#BFC1C2", "Silver Sand"]),
      Object.freeze(["#BFC921", "Key Lime Pie"]),
      Object.freeze(["#BFDBE2", "Ziggurat"]),
      Object.freeze(["#BFFF00", "Lime"]),
      Object.freeze(["#C02B18", "Thunderbird"]),
      Object.freeze(["#C04737", "Mojo"]),
      Object.freeze(["#C08081", "Old Rose"]),
      Object.freeze(["#C0C0C0", "Silver"]),
      Object.freeze(["#C0D3B9", "Pale Leaf"]),
      Object.freeze(["#C0D8B6", "Pixie Green"]),
      Object.freeze(["#C1440E", "Tia Maria"]),
      Object.freeze(["#C154C1", "Fuchsia Pink"]),
      Object.freeze(["#C1A004", "Buddha Gold"]),
      Object.freeze(["#C1B7A4", "Bison Hide"]),
      Object.freeze(["#C1BAB0", "Tea"]),
      Object.freeze(["#C1BECD", "Gray Suit"]),
      Object.freeze(["#C1D7B0", "Sprout"]),
      Object.freeze(["#C1F07C", "Sulu"]),
      Object.freeze(["#C26B03", "Indochine"]),
      Object.freeze(["#C2955D", "Twine"]),
      Object.freeze(["#C2BDB6", "Cotton Seed"]),
      Object.freeze(["#C2CAC4", "Pumice"]),
      Object.freeze(["#C2E8E5", "Jagged Ice"]),
      Object.freeze(["#C32148", "Maroon Flush"]),
      Object.freeze(["#C3B091", "Indian Khaki"]),
      Object.freeze(["#C3BFC1", "Pale Slate"]),
      Object.freeze(["#C3C3BD", "Gray Nickel"]),
      Object.freeze(["#C3CDE6", "Periwinkle Gray"]),
      Object.freeze(["#C3D1D1", "Tiara"]),
      Object.freeze(["#C3DDF9", "Tropical Blue"]),
      Object.freeze(["#C41E3A", "Cardinal"]),
      Object.freeze(["#C45655", "Fuzzy Wuzzy Brown"]),
      Object.freeze(["#C45719", "Orange Roughy"]),
      Object.freeze(["#C4C4BC", "Mist Gray"]),
      Object.freeze(["#C4D0B0", "Coriander"]),
      Object.freeze(["#C4F4EB", "Mint Tulip"]),
      Object.freeze(["#C54B8C", "Mulberry"]),
      Object.freeze(["#C59922", "Nugget"]),
      Object.freeze(["#C5994B", "Tussock"]),
      Object.freeze(["#C5DBCA", "Sea Mist"]),
      Object.freeze(["#C5E17A", "Yellow Green"]),
      Object.freeze(["#C62D42", "Brick Red"]),
      Object.freeze(["#C6726B", "Contessa"]),
      Object.freeze(["#C69191", "Oriental Pink"]),
      Object.freeze(["#C6A84B", "Roti"]),
      Object.freeze(["#C6C3B5", "Ash"]),
      Object.freeze(["#C6C8BD", "Kangaroo"]),
      Object.freeze(["#C6E610", "Las Palmas"]),
      Object.freeze(["#C7031E", "Monza"]),
      Object.freeze(["#C71585", "Red Violet"]),
      Object.freeze(["#C7BCA2", "Coral Reef"]),
      Object.freeze(["#C7C1FF", "Melrose"]),
      Object.freeze(["#C7C4BF", "Cloud"]),
      Object.freeze(["#C7C9D5", "Ghost"]),
      Object.freeze(["#C7CD90", "Pine Glade"]),
      Object.freeze(["#C7DDE5", "Botticelli"]),
      Object.freeze(["#C88A65", "Antique Brass"]),
      Object.freeze(["#C8A2C8", "Lilac"]),
      Object.freeze(["#C8A528", "Hokey Pokey"]),
      Object.freeze(["#C8AABF", "Lily"]),
      Object.freeze(["#C8B568", "Laser"]),
      Object.freeze(["#C8E3D7", "Edgewater"]),
      Object.freeze(["#C96323", "Piper"]),
      Object.freeze(["#C99415", "Pizza"]),
      Object.freeze(["#C9A0DC", "Light Wisteria"]),
      Object.freeze(["#C9B29B", "Rodeo Dust"]),
      Object.freeze(["#C9B35B", "Sundance"]),
      Object.freeze(["#C9B93B", "Earls Green"]),
      Object.freeze(["#C9C0BB", "Silver Rust"]),
      Object.freeze(["#C9D9D2", "Conch"]),
      Object.freeze(["#C9FFA2", "Reef"]),
      Object.freeze(["#C9FFE5", "Aero Blue"]),
      Object.freeze(["#CA3435", "Flush Mahogany"]),
      Object.freeze(["#CABB48", "Turmeric"]),
      Object.freeze(["#CADCD4", "Paris White"]),
      Object.freeze(["#CAE00D", "Bitter Lemon"]),
      Object.freeze(["#CAE6DA", "Skeptic"]),
      Object.freeze(["#CB8FA9", "Viola"]),
      Object.freeze(["#CBCAB6", "Foggy Gray"]),
      Object.freeze(["#CBD3B0", "Green Mist"]),
      Object.freeze(["#CBDBD6", "Nebula"]),
      Object.freeze(["#CC3333", "Persian Red"]),
      Object.freeze(["#CC5500", "Burnt Orange"]),
      Object.freeze(["#CC7722", "Ochre"]),
      Object.freeze(["#CC8899", "Puce"]),
      Object.freeze(["#CCCAA8", "Thistle Green"]),
      Object.freeze(["#CCCCFF", "Periwinkle"]),
      Object.freeze(["#CCFF00", "Electric Lime"]),
      Object.freeze(["#CD5700", "Tenn"]),
      Object.freeze(["#CD5C5C", "Chestnut Rose"]),
      Object.freeze(["#CD8429", "Brandy Punch"]),
      Object.freeze(["#CDF4FF", "Onahau"]),
      Object.freeze(["#CEB98F", "Sorrell Brown"]),
      Object.freeze(["#CEBABA", "Cold Turkey"]),
      Object.freeze(["#CEC291", "Yuma"]),
      Object.freeze(["#CEC7A7", "Chino"]),
      Object.freeze(["#CFA39D", "Eunry"]),
      Object.freeze(["#CFB53B", "Old Gold"]),
      Object.freeze(["#CFDCCF", "Tasman"]),
      Object.freeze(["#CFE5D2", "Surf Crest"]),
      Object.freeze(["#CFF9F3", "Humming Bird"]),
      Object.freeze(["#CFFAF4", "Scandal"]),
      Object.freeze(["#D05F04", "Red Stage"]),
      Object.freeze(["#D06DA1", "Hopbush"]),
      Object.freeze(["#D07D12", "Meteor"]),
      Object.freeze(["#D0BEF8", "Perfume"]),
      Object.freeze(["#D0C0E5", "Prelude"]),
      Object.freeze(["#D0F0C0", "Tea Green"]),
      Object.freeze(["#D18F1B", "Geebung"]),
      Object.freeze(["#D1BEA8", "Vanilla"]),
      Object.freeze(["#D1C6B4", "Soft Amber"]),
      Object.freeze(["#D1D2CA", "Celeste"]),
      Object.freeze(["#D1D2DD", "Mischka"]),
      Object.freeze(["#D1E231", "Pear"]),
      Object.freeze(["#D2691E", "Hot Cinnamon"]),
      Object.freeze(["#D27D46", "Raw Sienna"]),
      Object.freeze(["#D29EAA", "Careys Pink"]),
      Object.freeze(["#D2B48C", "Tan"]),
      Object.freeze(["#D2DA97", "Deco"]),
      Object.freeze(["#D2F6DE", "Blue Romance"]),
      Object.freeze(["#D2F8B0", "Gossip"]),
      Object.freeze(["#D3CBBA", "Sisal"]),
      Object.freeze(["#D3CDC5", "Swirl"]),
      Object.freeze(["#D47494", "Charm"]),
      Object.freeze(["#D4B6AF", "Clam Shell"]),
      Object.freeze(["#D4BF8D", "Straw"]),
      Object.freeze(["#D4C4A8", "Akaroa"]),
      Object.freeze(["#D4CD16", "Bird Flower"]),
      Object.freeze(["#D4D7D9", "Iron"]),
      Object.freeze(["#D4DFE2", "Geyser"]),
      Object.freeze(["#D4E2FC", "Hawkes Blue"]),
      Object.freeze(["#D54600", "Grenadier"]),
      Object.freeze(["#D591A4", "Can Can"]),
      Object.freeze(["#D59A6F", "Whiskey"]),
      Object.freeze(["#D5D195", "Winter Hazel"]),
      Object.freeze(["#D5F6E3", "Granny Apple"]),
      Object.freeze(["#D69188", "My Pink"]),
      Object.freeze(["#D6C562", "Tacha"]),
      Object.freeze(["#D6CEF6", "Moon Raker"]),
      Object.freeze(["#D6D6D1", "Quill Gray"]),
      Object.freeze(["#D6FFDB", "Snowy Mint"]),
      Object.freeze(["#D7837F", "New York Pink"]),
      Object.freeze(["#D7C498", "Pavlova"]),
      Object.freeze(["#D7D0FF", "Fog"]),
      Object.freeze(["#D84437", "Valencia"]),
      Object.freeze(["#D87C63", "Japonica"]),
      Object.freeze(["#D8BFD8", "Thistle"]),
      Object.freeze(["#D8C2D5", "Maverick"]),
      Object.freeze(["#D8FCFA", "Foam"]),
      Object.freeze(["#D94972", "Cabaret"]),
      Object.freeze(["#D99376", "Burning Sand"]),
      Object.freeze(["#D9B99B", "Cameo"]),
      Object.freeze(["#D9D6CF", "Timberwolf"]),
      Object.freeze(["#D9DCC1", "Tana"]),
      Object.freeze(["#D9E4F5", "Link Water"]),
      Object.freeze(["#D9F7FF", "Mabel"]),
      Object.freeze(["#DA3287", "Cerise"]),
      Object.freeze(["#DA5B38", "Flame Pea"]),
      Object.freeze(["#DA6304", "Bamboo"]),
      Object.freeze(["#DA6A41", "Red Damask"]),
      Object.freeze(["#DA70D6", "Orchid"]),
      Object.freeze(["#DA8A67", "Copperfield"]),
      Object.freeze(["#DAA520", "Golden Grass"]),
      Object.freeze(["#DAECD6", "Zanah"]),
      Object.freeze(["#DAF4F0", "Iceberg"]),
      Object.freeze(["#DAFAFF", "Oyster Bay"]),
      Object.freeze(["#DB5079", "Cranberry"]),
      Object.freeze(["#DB9690", "Petite Orchid"]),
      Object.freeze(["#DB995E", "Di Serria"]),
      Object.freeze(["#DBDBDB", "Alto"]),
      Object.freeze(["#DBFFF8", "Frosted Mint"]),
      Object.freeze(["#DC143C", "Crimson"]),
      Object.freeze(["#DC4333", "Punch"]),
      Object.freeze(["#DCB20C", "Galliano"]),
      Object.freeze(["#DCB4BC", "Blossom"]),
      Object.freeze(["#DCD747", "Wattle"]),
      Object.freeze(["#DCD9D2", "Westar"]),
      Object.freeze(["#DCDDCC", "Moon Mist"]),
      Object.freeze(["#DCEDB4", "Caper"]),
      Object.freeze(["#DCF0EA", "Swans Down"]),
      Object.freeze(["#DDD6D5", "Swiss Coffee"]),
      Object.freeze(["#DDF9F1", "White Ice"]),
      Object.freeze(["#DE3163", "Cerise Red"]),
      Object.freeze(["#DE6360", "Roman"]),
      Object.freeze(["#DEA681", "Tumbleweed"]),
      Object.freeze(["#DEBA13", "Gold Tips"]),
      Object.freeze(["#DEC196", "Brandy"]),
      Object.freeze(["#DECBC6", "Wafer"]),
      Object.freeze(["#DED4A4", "Sapling"]),
      Object.freeze(["#DED717", "Barberry"]),
      Object.freeze(["#DEE5C0", "Beryl Green"]),
      Object.freeze(["#DEF5FF", "Pattens Blue"]),
      Object.freeze(["#DF73FF", "Heliotrope"]),
      Object.freeze(["#DFBE6F", "Apache"]),
      Object.freeze(["#DFCD6F", "Chenin"]),
      Object.freeze(["#DFCFDB", "Lola"]),
      Object.freeze(["#DFECDA", "Willow Brook"]),
      Object.freeze(["#DFFF00", "Chartreuse Yellow"]),
      Object.freeze(["#E0B0FF", "Mauve"]),
      Object.freeze(["#E0B646", "Anzac"]),
      Object.freeze(["#E0B974", "Harvest Gold"]),
      Object.freeze(["#E0C095", "Calico"]),
      Object.freeze(["#E0FFFF", "Baby Blue"]),
      Object.freeze(["#E16865", "Sunglo"]),
      Object.freeze(["#E1BC64", "Equator"]),
      Object.freeze(["#E1C0C8", "Pink Flare"]),
      Object.freeze(["#E1E6D6", "Periglacial Blue"]),
      Object.freeze(["#E1EAD4", "Kidnapper"]),
      Object.freeze(["#E1F6E8", "Tara"]),
      Object.freeze(["#E25465", "Mandy"]),
      Object.freeze(["#E2725B", "Terracotta"]),
      Object.freeze(["#E28913", "Golden Bell"]),
      Object.freeze(["#E292C0", "Shocking"]),
      Object.freeze(["#E29418", "Dixie"]),
      Object.freeze(["#E29CD2", "Light Orchid"]),
      Object.freeze(["#E2D8ED", "Snuff"]),
      Object.freeze(["#E2EBED", "Mystic"]),
      Object.freeze(["#E2F3EC", "Apple Green"]),
      Object.freeze(["#E30B5C", "Razzmatazz"]),
      Object.freeze(["#E32636", "Alizarin Crimson"]),
      Object.freeze(["#E34234", "Cinnabar"]),
      Object.freeze(["#E3BEBE", "Cavern Pink"]),
      Object.freeze(["#E3F5E1", "Peppermint"]),
      Object.freeze(["#E3F988", "Mindaro"]),
      Object.freeze(["#E47698", "Deep Blush"]),
      Object.freeze(["#E49B0F", "Gamboge"]),
      Object.freeze(["#E4C2D5", "Melanie"]),
      Object.freeze(["#E4CFDE", "Twilight"]),
      Object.freeze(["#E4D1C0", "Bone"]),
      Object.freeze(["#E4D422", "Sunflower"]),
      Object.freeze(["#E4D5B7", "Grain Brown"]),
      Object.freeze(["#E4D69B", "Zombie"]),
      Object.freeze(["#E4F6E7", "Frostee"]),
      Object.freeze(["#E4FFD1", "Snow Flurry"]),
      Object.freeze(["#E52B50", "Amaranth"]),
      Object.freeze(["#E5841B", "Zest"]),
      Object.freeze(["#E5CCC9", "Dust Storm"]),
      Object.freeze(["#E5D7BD", "Stark White"]),
      Object.freeze(["#E5D8AF", "Hampton"]),
      Object.freeze(["#E5E0E1", "Bon Jour"]),
      Object.freeze(["#E5E5E5", "Mercury"]),
      Object.freeze(["#E5F9F6", "Polar"]),
      Object.freeze(["#E64E03", "Trinidad"]),
      Object.freeze(["#E6BE8A", "Gold Sand"]),
      Object.freeze(["#E6BEA5", "Cashmere"]),
      Object.freeze(["#E6D7B9", "Double Spanish White"]),
      Object.freeze(["#E6E4D4", "Satin Linen"]),
      Object.freeze(["#E6F2EA", "Harp"]),
      Object.freeze(["#E6F8F3", "Off Green"]),
      Object.freeze(["#E6FFE9", "Hint of Green"]),
      Object.freeze(["#E6FFFF", "Tranquil"]),
      Object.freeze(["#E77200", "Mango Tango"]),
      Object.freeze(["#E7730A", "Christine"]),
      Object.freeze(["#E79F8C", "Tonys Pink"]),
      Object.freeze(["#E79FC4", "Kobi"]),
      Object.freeze(["#E7BCB4", "Rose Fog"]),
      Object.freeze(["#E7BF05", "Corn"]),
      Object.freeze(["#E7CD8C", "Putty"]),
      Object.freeze(["#E7ECE6", "Gray Nurse"]),
      Object.freeze(["#E7F8FF", "Lily White"]),
      Object.freeze(["#E7FEFF", "Bubbles"]),
      Object.freeze(["#E89928", "Fire Bush"]),
      Object.freeze(["#E8B9B3", "Shilo"]),
      Object.freeze(["#E8E0D5", "Pearl Bush"]),
      Object.freeze(["#E8EBE0", "Green White"]),
      Object.freeze(["#E8F1D4", "Chrome White"]),
      Object.freeze(["#E8F2EB", "Gin"]),
      Object.freeze(["#E8F5F2", "Aqua Squeeze"]),
      Object.freeze(["#E96E00", "Clementine"]),
      Object.freeze(["#E97451", "Burnt Sienna"]),
      Object.freeze(["#E97C07", "Tahiti Gold"]),
      Object.freeze(["#E9CECD", "Oyster Pink"]),
      Object.freeze(["#E9D75A", "Confetti"]),
      Object.freeze(["#E9E3E3", "Ebb"]),
      Object.freeze(["#E9F8ED", "Ottoman"]),
      Object.freeze(["#E9FFFD", "Clear Day"]),
      Object.freeze(["#EA88A8", "Carissma"]),
      Object.freeze(["#EAAE69", "Porsche"]),
      Object.freeze(["#EAB33B", "Tulip Tree"]),
      Object.freeze(["#EAC674", "Rob Roy"]),
      Object.freeze(["#EADAB8", "Raffia"]),
      Object.freeze(["#EAE8D4", "White Rock"]),
      Object.freeze(["#EAF6EE", "Panache"]),
      Object.freeze(["#EAF6FF", "Solitude"]),
      Object.freeze(["#EAF9F5", "Aqua Spring"]),
      Object.freeze(["#EAFFFE", "Dew"]),
      Object.freeze(["#EB9373", "Apricot"]),
      Object.freeze(["#EBC2AF", "Zinnwaldite"]),
      Object.freeze(["#ECA927", "Fuel Yellow"]),
      Object.freeze(["#ECC54E", "Ronchi"]),
      Object.freeze(["#ECC7EE", "French Lilac"]),
      Object.freeze(["#ECCDB9", "Just Right"]),
      Object.freeze(["#ECE090", "Wild Rice"]),
      Object.freeze(["#ECEBBD", "Fall Green"]),
      Object.freeze(["#ECEBCE", "Aths Special"]),
      Object.freeze(["#ECF245", "Starship"]),
      Object.freeze(["#ED0A3F", "Red Ribbon"]),
      Object.freeze(["#ED7A1C", "Tango"]),
      Object.freeze(["#ED9121", "Carrot Orange"]),
      Object.freeze(["#ED989E", "Sea Pink"]),
      Object.freeze(["#EDB381", "Tacao"]),
      Object.freeze(["#EDC9AF", "Desert Sand"]),
      Object.freeze(["#EDCDAB", "Pancho"]),
      Object.freeze(["#EDDCB1", "Chamois"]),
      Object.freeze(["#EDEA99", "Primrose"]),
      Object.freeze(["#EDF5DD", "Frost"]),
      Object.freeze(["#EDF5F5", "Aqua Haze"]),
      Object.freeze(["#EDF6FF", "Zumthor"]),
      Object.freeze(["#EDF9F1", "Narvik"]),
      Object.freeze(["#EDFC84", "Honeysuckle"]),
      Object.freeze(["#EE82EE", "Lavender Magenta"]),
      Object.freeze(["#EEC1BE", "Beauty Bush"]),
      Object.freeze(["#EED794", "Chalky"]),
      Object.freeze(["#EED9C4", "Almond"]),
      Object.freeze(["#EEDC82", "Flax"]),
      Object.freeze(["#EEDEDA", "Bizarre"]),
      Object.freeze(["#EEE3AD", "Double Colonial White"]),
      Object.freeze(["#EEEEE8", "Cararra"]),
      Object.freeze(["#EEEF78", "Manz"]),
      Object.freeze(["#EEF0C8", "Tahuna Sands"]),
      Object.freeze(["#EEF0F3", "Athens Gray"]),
      Object.freeze(["#EEF3C3", "Tusk"]),
      Object.freeze(["#EEF4DE", "Loafer"]),
      Object.freeze(["#EEF6F7", "Catskill White"]),
      Object.freeze(["#EEFDFF", "Twilight Blue"]),
      Object.freeze(["#EEFF9A", "Jonquil"]),
      Object.freeze(["#EEFFE2", "Rice Flower"]),
      Object.freeze(["#EF863F", "Jaffa"]),
      Object.freeze(["#EFEFEF", "Gallery"]),
      Object.freeze(["#EFF2F3", "Porcelain"]),
      Object.freeze(["#F091A9", "Mauvelous"]),
      Object.freeze(["#F0D52D", "Golden Dream"]),
      Object.freeze(["#F0DB7D", "Golden Sand"]),
      Object.freeze(["#F0DC82", "Buff"]),
      Object.freeze(["#F0E2EC", "Prim"]),
      Object.freeze(["#F0E68C", "Khaki"]),
      Object.freeze(["#F0EEFD", "Selago"]),
      Object.freeze(["#F0EEFF", "Titan White"]),
      Object.freeze(["#F0F8FF", "Alice Blue"]),
      Object.freeze(["#F0FCEA", "Feta"]),
      Object.freeze(["#F18200", "Gold Drop"]),
      Object.freeze(["#F19BAB", "Wewak"]),
      Object.freeze(["#F1E788", "Sahara Sand"]),
      Object.freeze(["#F1E9D2", "Parchment"]),
      Object.freeze(["#F1E9FF", "Blue Chalk"]),
      Object.freeze(["#F1EEC1", "Mint Julep"]),
      Object.freeze(["#F1F1F1", "Seashell"]),
      Object.freeze(["#F1F7F2", "Saltpan"]),
      Object.freeze(["#F1FFAD", "Tidal"]),
      Object.freeze(["#F1FFC8", "Chiffon"]),
      Object.freeze(["#F2552A", "Flamingo"]),
      Object.freeze(["#F28500", "Tangerine"]),
      Object.freeze(["#F2C3B2", "Mandys Pink"]),
      Object.freeze(["#F2F2F2", "Concrete"]),
      Object.freeze(["#F2FAFA", "Black Squeeze"]),
      Object.freeze(["#F34723", "Pomegranate"]),
      Object.freeze(["#F3AD16", "Buttercup"]),
      Object.freeze(["#F3D69D", "New Orleans"]),
      Object.freeze(["#F3D9DF", "Vanilla Ice"]),
      Object.freeze(["#F3E7BB", "Sidecar"]),
      Object.freeze(["#F3E9E5", "Dawn Pink"]),
      Object.freeze(["#F3EDCF", "Wheatfield"]),
      Object.freeze(["#F3FB62", "Canary"]),
      Object.freeze(["#F3FBD4", "Orinoco"]),
      Object.freeze(["#F3FFD8", "Carla"]),
      Object.freeze(["#F400A1", "Hollywood Cerise"]),
      Object.freeze(["#F4A460", "Sandy brown"]),
      Object.freeze(["#F4C430", "Saffron"]),
      Object.freeze(["#F4D81C", "Ripe Lemon"]),
      Object.freeze(["#F4EBD3", "Janna"]),
      Object.freeze(["#F4F2EE", "Pampas"]),
      Object.freeze(["#F4F4F4", "Wild Sand"]),
      Object.freeze(["#F4F8FF", "Zircon"]),
      Object.freeze(["#F57584", "Froly"]),
      Object.freeze(["#F5C85C", "Cream Can"]),
      Object.freeze(["#F5C999", "Manhattan"]),
      Object.freeze(["#F5D5A0", "Maize"]),
      Object.freeze(["#F5DEB3", "Wheat"]),
      Object.freeze(["#F5E7A2", "Sandwisp"]),
      Object.freeze(["#F5E7E2", "Pot Pourri"]),
      Object.freeze(["#F5E9D3", "Albescent White"]),
      Object.freeze(["#F5EDEF", "Soft Peach"]),
      Object.freeze(["#F5F3E5", "Ecru White"]),
      Object.freeze(["#F5F5DC", "Beige"]),
      Object.freeze(["#F5FB3D", "Golden Fizz"]),
      Object.freeze(["#F5FFBE", "Australian Mint"]),
      Object.freeze(["#F64A8A", "French Rose"]),
      Object.freeze(["#F653A6", "Brilliant Rose"]),
      Object.freeze(["#F6A4C9", "Illusion"]),
      Object.freeze(["#F6F0E6", "Merino"]),
      Object.freeze(["#F6F7F7", "Black Haze"]),
      Object.freeze(["#F6FFDC", "Spring Sun"]),
      Object.freeze(["#F7468A", "Violet Red"]),
      Object.freeze(["#F77703", "Chilean Fire"]),
      Object.freeze(["#F77FBE", "Persian Pink"]),
      Object.freeze(["#F7B668", "Rajah"]),
      Object.freeze(["#F7C8DA", "Azalea"]),
      Object.freeze(["#F7DBE6", "We Peep"]),
      Object.freeze(["#F7F2E1", "Quarter Spanish White"]),
      Object.freeze(["#F7F5FA", "Whisper"]),
      Object.freeze(["#F7FAF7", "Snow Drift"]),
      Object.freeze(["#F8B853", "Casablanca"]),
      Object.freeze(["#F8C3DF", "Chantilly"]),
      Object.freeze(["#F8D9E9", "Cherub"]),
      Object.freeze(["#F8DB9D", "Marzipan"]),
      Object.freeze(["#F8DD5C", "Energy Yellow"]),
      Object.freeze(["#F8E4BF", "Givry"]),
      Object.freeze(["#F8F0E8", "White Linen"]),
      Object.freeze(["#F8F4FF", "Magnolia"]),
      Object.freeze(["#F8F6F1", "Spring Wood"]),
      Object.freeze(["#F8F7DC", "Coconut Cream"]),
      Object.freeze(["#F8F7FC", "White Lilac"]),
      Object.freeze(["#F8F8F7", "Desert Storm"]),
      Object.freeze(["#F8F99C", "Texas"]),
      Object.freeze(["#F8FACD", "Corn Field"]),
      Object.freeze(["#F8FDD3", "Mimosa"]),
      Object.freeze(["#F95A61", "Carnation"]),
      Object.freeze(["#F9BF58", "Saffron Mango"]),
      Object.freeze(["#F9E0ED", "Carousel Pink"]),
      Object.freeze(["#F9E4BC", "Dairy Cream"]),
      Object.freeze(["#F9E663", "Portica"]),
      Object.freeze(["#F9EAF3", "Amour"]),
      Object.freeze(["#F9F8E4", "Rum Swizzle"]),
      Object.freeze(["#F9FF8B", "Dolly"]),
      Object.freeze(["#F9FFF6", "Sugar Cane"]),
      Object.freeze(["#FA7814", "Ecstasy"]),
      Object.freeze(["#FA9D5A", "Tan Hide"]),
      Object.freeze(["#FAD3A2", "Corvette"]),
      Object.freeze(["#FADFAD", "Peach Yellow"]),
      Object.freeze(["#FAE600", "Turbo"]),
      Object.freeze(["#FAEAB9", "Astra"]),
      Object.freeze(["#FAECCC", "Champagne"]),
      Object.freeze(["#FAF0E6", "Linen"]),
      Object.freeze(["#FAF3F0", "Fantasy"]),
      Object.freeze(["#FAF7D6", "Citrine White"]),
      Object.freeze(["#FAFAFA", "Alabaster"]),
      Object.freeze(["#FAFDE4", "Hint of Yellow"]),
      Object.freeze(["#FAFFA4", "Milan"]),
      Object.freeze(["#FB607F", "Brink Pink"]),
      Object.freeze(["#FB8989", "Geraldine"]),
      Object.freeze(["#FBA0E3", "Lavender Rose"]),
      Object.freeze(["#FBA129", "Sea Buckthorn"]),
      Object.freeze(["#FBAC13", "Sun"]),
      Object.freeze(["#FBAED2", "Lavender Pink"]),
      Object.freeze(["#FBB2A3", "Rose Bud"]),
      Object.freeze(["#FBBEDA", "Cupid"]),
      Object.freeze(["#FBCCE7", "Classic Rose"]),
      Object.freeze(["#FBCEB1", "Apricot Peach"]),
      Object.freeze(["#FBE7B2", "Banana Mania"]),
      Object.freeze(["#FBE870", "Marigold Yellow"]),
      Object.freeze(["#FBE96C", "Festival"]),
      Object.freeze(["#FBEA8C", "Sweet Corn"]),
      Object.freeze(["#FBEC5D", "Candy Corn"]),
      Object.freeze(["#FBF9F9", "Hint of Red"]),
      Object.freeze(["#FBFFBA", "Shalimar"]),
      Object.freeze(["#FC0FC0", "Shocking Pink"]),
      Object.freeze(["#FC80A5", "Tickle Me Pink"]),
      Object.freeze(["#FC9C1D", "Tree Poppy"]),
      Object.freeze(["#FCC01E", "Lightning Yellow"]),
      Object.freeze(["#FCD667", "Goldenrod"]),
      Object.freeze(["#FCD917", "Candlelight"]),
      Object.freeze(["#FCDA98", "Cherokee"]),
      Object.freeze(["#FCF4D0", "Double Pearl Lusta"]),
      Object.freeze(["#FCF4DC", "Pearl Lusta"]),
      Object.freeze(["#FCF8F7", "Vista White"]),
      Object.freeze(["#FCFBF3", "Bianca"]),
      Object.freeze(["#FCFEDA", "Moon Glow"]),
      Object.freeze(["#FCFFE7", "China Ivory"]),
      Object.freeze(["#FCFFF9", "Ceramic"]),
      Object.freeze(["#FD0E35", "Torch Red"]),
      Object.freeze(["#FD5B78", "Wild Watermelon"]),
      Object.freeze(["#FD7B33", "Crusta"]),
      Object.freeze(["#FD7C07", "Sorbus"]),
      Object.freeze(["#FD9FA2", "Sweet Pink"]),
      Object.freeze(["#FDD5B1", "Light Apricot"]),
      Object.freeze(["#FDD7E4", "Pig Pink"]),
      Object.freeze(["#FDE1DC", "Cinderella"]),
      Object.freeze(["#FDE295", "Golden Glow"]),
      Object.freeze(["#FDE910", "Lemon"]),
      Object.freeze(["#FDF5E6", "Old Lace"]),
      Object.freeze(["#FDF6D3", "Half Colonial White"]),
      Object.freeze(["#FDF7AD", "Drover"]),
      Object.freeze(["#FDFEB8", "Pale Prim"]),
      Object.freeze(["#FDFFD5", "Cumulus"]),
      Object.freeze(["#FE28A2", "Persian Rose"]),
      Object.freeze(["#FE4C40", "Sunset Orange"]),
      Object.freeze(["#FE6F5E", "Bittersweet"]),
      Object.freeze(["#FE9D04", "California"]),
      Object.freeze(["#FEA904", "Yellow Sea"]),
      Object.freeze(["#FEBAAD", "Melon"]),
      Object.freeze(["#FED33C", "Bright Sun"]),
      Object.freeze(["#FED85D", "Dandelion"]),
      Object.freeze(["#FEDB8D", "Salomie"]),
      Object.freeze(["#FEE5AC", "Cape Honey"]),
      Object.freeze(["#FEEBF3", "Remy"]),
      Object.freeze(["#FEEFCE", "Oasis"]),
      Object.freeze(["#FEF0EC", "Bridesmaid"]),
      Object.freeze(["#FEF2C7", "Beeswax"]),
      Object.freeze(["#FEF3D8", "Bleach White"]),
      Object.freeze(["#FEF4CC", "Pipi"]),
      Object.freeze(["#FEF4DB", "Half Spanish White"]),
      Object.freeze(["#FEF4F8", "Wisp Pink"]),
      Object.freeze(["#FEF5F1", "Provincial Pink"]),
      Object.freeze(["#FEF7DE", "Half Dutch White"]),
      Object.freeze(["#FEF8E2", "Solitaire"]),
      Object.freeze(["#FEF8FF", "White Pointer"]),
      Object.freeze(["#FEF9E3", "Off Yellow"]),
      Object.freeze(["#FEFCED", "Orange White"]),
      Object.freeze(["#FF0000", "Red"]),
      Object.freeze(["#FF007F", "Rose"]),
      Object.freeze(["#FF00CC", "Purple Pizzazz"]),
      Object.freeze(["#FF00FF", "Magenta / Fuchsia"]),
      Object.freeze(["#FF2400", "Scarlet"]),
      Object.freeze(["#FF3399", "Wild Strawberry"]),
      Object.freeze(["#FF33CC", "Razzle Dazzle Rose"]),
      Object.freeze(["#FF355E", "Radical Red"]),
      Object.freeze(["#FF3F34", "Red Orange"]),
      Object.freeze(["#FF4040", "Coral Red"]),
      Object.freeze(["#FF4D00", "Vermilion"]),
      Object.freeze(["#FF4F00", "International Orange"]),
      Object.freeze(["#FF6037", "Outrageous Orange"]),
      Object.freeze(["#FF6600", "Blaze Orange"]),
      Object.freeze(["#FF66FF", "Pink Flamingo"]),
      Object.freeze(["#FF681F", "Orange"]),
      Object.freeze(["#FF69B4", "Hot Pink"]),
      Object.freeze(["#FF6B53", "Persimmon"]),
      Object.freeze(["#FF6FFF", "Blush Pink"]),
      Object.freeze(["#FF7034", "Burning Orange"]),
      Object.freeze(["#FF7518", "Pumpkin"]),
      Object.freeze(["#FF7D07", "Flamenco"]),
      Object.freeze(["#FF7F00", "Flush Orange"]),
      Object.freeze(["#FF7F50", "Coral"]),
      Object.freeze(["#FF8C69", "Salmon"]),
      Object.freeze(["#FF9000", "Pizazz"]),
      Object.freeze(["#FF910F", "West Side"]),
      Object.freeze(["#FF91A4", "Pink Salmon"]),
      Object.freeze(["#FF9933", "Neon Carrot"]),
      Object.freeze(["#FF9966", "Atomic Tangerine"]),
      Object.freeze(["#FF9980", "Vivid Tangerine"]),
      Object.freeze(["#FF9E2C", "Sunshade"]),
      Object.freeze(["#FFA000", "Orange Peel"]),
      Object.freeze(["#FFA194", "Mona Lisa"]),
      Object.freeze(["#FFA500", "Web Orange"]),
      Object.freeze(["#FFA6C9", "Carnation Pink"]),
      Object.freeze(["#FFAB81", "Hit Pink"]),
      Object.freeze(["#FFAE42", "Yellow Orange"]),
      Object.freeze(["#FFB0AC", "Cornflower Lilac"]),
      Object.freeze(["#FFB1B3", "Sundown"]),
      Object.freeze(["#FFB31F", "My Sin"]),
      Object.freeze(["#FFB555", "Texas Rose"]),
      Object.freeze(["#FFB7D5", "Cotton Candy"]),
      Object.freeze(["#FFB97B", "Macaroni and Cheese"]),
      Object.freeze(["#FFBA00", "Selective Yellow"]),
      Object.freeze(["#FFBD5F", "Koromiko"]),
      Object.freeze(["#FFBF00", "Amber"]),
      Object.freeze(["#FFC0A8", "Wax Flower"]),
      Object.freeze(["#FFC0CB", "Pink"]),
      Object.freeze(["#FFC3C0", "Your Pink"]),
      Object.freeze(["#FFC901", "Supernova"]),
      Object.freeze(["#FFCBA4", "Flesh"]),
      Object.freeze(["#FFCC33", "Sunglow"]),
      Object.freeze(["#FFCC5C", "Golden Tainoi"]),
      Object.freeze(["#FFCC99", "Peach Orange"]),
      Object.freeze(["#FFCD8C", "Chardonnay"]),
      Object.freeze(["#FFD1DC", "Pastel Pink"]),
      Object.freeze(["#FFD2B7", "Romantic"]),
      Object.freeze(["#FFD38C", "Grandis"]),
      Object.freeze(["#FFD700", "Gold"]),
      Object.freeze(["#FFD800", "School bus Yellow"]),
      Object.freeze(["#FFD8D9", "Cosmos"]),
      Object.freeze(["#FFDB58", "Mustard"]),
      Object.freeze(["#FFDCD6", "Peach Schnapps"]),
      Object.freeze(["#FFDDAF", "Caramel"]),
      Object.freeze(["#FFDDCD", "Tuft Bush"]),
      Object.freeze(["#FFDDCF", "Watusi"]),
      Object.freeze(["#FFDDF4", "Pink Lace"]),
      Object.freeze(["#FFDEAD", "Navajo White"]),
      Object.freeze(["#FFDEB3", "Frangipani"]),
      Object.freeze(["#FFE1DF", "Pippin"]),
      Object.freeze(["#FFE1F2", "Pale Rose"]),
      Object.freeze(["#FFE2C5", "Negroni"]),
      Object.freeze(["#FFE5A0", "Cream Brulee"]),
      Object.freeze(["#FFE5B4", "Peach"]),
      Object.freeze(["#FFE6C7", "Tequila"]),
      Object.freeze(["#FFE772", "Kournikova"]),
      Object.freeze(["#FFEAC8", "Sandy Beach"]),
      Object.freeze(["#FFEAD4", "Karry"]),
      Object.freeze(["#FFEC13", "Broom"]),
      Object.freeze(["#FFEDBC", "Colonial White"]),
      Object.freeze(["#FFEED8", "Derby"]),
      Object.freeze(["#FFEFA1", "Vis Vis"]),
      Object.freeze(["#FFEFC1", "Egg White"]),
      Object.freeze(["#FFEFD5", "Papaya Whip"]),
      Object.freeze(["#FFEFEC", "Fair Pink"]),
      Object.freeze(["#FFF0DB", "Peach Cream"]),
      Object.freeze(["#FFF0F5", "Lavender blush"]),
      Object.freeze(["#FFF14F", "Gorse"]),
      Object.freeze(["#FFF1B5", "Buttermilk"]),
      Object.freeze(["#FFF1D8", "Pink Lady"]),
      Object.freeze(["#FFF1EE", "Forget Me Not"]),
      Object.freeze(["#FFF1F9", "Tutu"]),
      Object.freeze(["#FFF39D", "Picasso"]),
      Object.freeze(["#FFF3F1", "Chardon"]),
      Object.freeze(["#FFF46E", "Paris Daisy"]),
      Object.freeze(["#FFF4CE", "Barley White"]),
      Object.freeze(["#FFF4DD", "Egg Sour"]),
      Object.freeze(["#FFF4E0", "Sazerac"]),
      Object.freeze(["#FFF4E8", "Serenade"]),
      Object.freeze(["#FFF4F3", "Chablis"]),
      Object.freeze(["#FFF5EE", "Seashell Peach"]),
      Object.freeze(["#FFF5F3", "Sauvignon"]),
      Object.freeze(["#FFF6D4", "Milk Punch"]),
      Object.freeze(["#FFF6DF", "Varden"]),
      Object.freeze(["#FFF6F5", "Rose White"]),
      Object.freeze(["#FFF8D1", "Baja White"]),
      Object.freeze(["#FFF9E2", "Gin Fizz"]),
      Object.freeze(["#FFF9E6", "Early Dawn"]),
      Object.freeze(["#FFFACD", "Lemon Chiffon"]),
      Object.freeze(["#FFFAF4", "Bridal Heath"]),
      Object.freeze(["#FFFBDC", "Scotch Mist"]),
      Object.freeze(["#FFFBF9", "Soapstone"]),
      Object.freeze(["#FFFC99", "Witch Haze"]),
      Object.freeze(["#FFFCEA", "Buttery White"]),
      Object.freeze(["#FFFCEE", "Island Spice"]),
      Object.freeze(["#FFFDD0", "Cream"]),
      Object.freeze(["#FFFDE6", "Chilean Heath"]),
      Object.freeze(["#FFFDE8", "Travertine"]),
      Object.freeze(["#FFFDF3", "Orchid White"]),
      Object.freeze(["#FFFDF4", "Quarter Pearl Lusta"]),
      Object.freeze(["#FFFEE1", "Half and Half"]),
      Object.freeze(["#FFFEEC", "Apricot White"]),
      Object.freeze(["#FFFEF0", "Rice Cake"]),
      Object.freeze(["#FFFEF6", "Black White"]),
      Object.freeze(["#FFFEFD", "Romance"]),
      Object.freeze(["#FFFF00", "Yellow"]),
      Object.freeze(["#FFFF66", "Laser Lemon"]),
      Object.freeze(["#FFFF99", "Pale Canary"]),
      Object.freeze(["#FFFFB4", "Portafino"]),
      Object.freeze(["#FFFFF0", "Ivory"]),
      Object.freeze(["#FFFFFF", "White"])
    ]
  );

  // packages/color-picker/core/values.ts
  function lab(hex) {
    const [r, g, b] = hexToRgb(hex).map((n) => {
      const c = n / 255;
      return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
    });
    const f = (t) => t > 8856452e-9 ? t ** (1 / 3) : t / 0.12841855 + 0.137931034;
    const x = f((0.4124564 * r + 0.3575761 * g + 0.1804375 * b) / 0.95047);
    const y = f(0.2126729 * r + 0.7151522 * g + 0.072175 * b);
    const z = f((0.0193339 * r + 0.119192 * g + 0.9503041 * b) / 1.08883);
    return [116 * y - 16, 500 * (x - y), 200 * (y - z)];
  }
  var candidates;
  var cache = /* @__PURE__ */ new Map();
  function getColorNameMatch(input) {
    const hex = opaqueHex(input), cached = cache.get(hex);
    if (cached) return cached;
    candidates ??= colorNames.map(([hex2, name]) => ({
      hex: hex2,
      name,
      lab: lab(hex2)
    }));
    const value = lab(hex);
    let nearest = candidates[0], distance = Infinity;
    for (const candidate of candidates) {
      const d = value.reduce((sum, v, i) => sum + (v - candidate.lab[i]) ** 2, 0);
      if (d < distance) {
        nearest = candidate;
        distance = d;
      }
      if (distance === 0) break;
    }
    const result = Object.freeze({
      name: nearest.name,
      slug: nearest.name.replace(/['/]/g, "").replace(/\s+/g, "-").toLowerCase(),
      matchedHex: nearest.hex,
      exact: hex === nearest.hex
    });
    if (cache.size >= 256) cache.delete(cache.keys().next().value);
    cache.set(hex, result);
    return result;
  }
  var getColorName = (hex) => getColorNameMatch(hex).name;
  function getColorValue(input, format, alpha = hexAlpha(input)) {
    if (!Number.isFinite(alpha) || alpha < 0 || alpha > 1)
      throw new TypeError("Alpha must be between 0 and 1");
    const hex = opaqueHex(input);
    let value;
    switch (format) {
      case "hex":
        value = withAlpha(hex, alpha);
        break;
      case "rgb": {
        const [r, g, b] = hexToRgb(hex);
        value = Object.freeze({ r, g, b, alpha });
        break;
      }
      case "hsv":
        value = Object.freeze({ ...hexToHsv(hex), alpha });
        break;
      case "hsl": {
        const [h, s, l] = hsvToChannels(hexToHsv(hex)).replace(/%/g, "").split(" ").map(Number);
        value = Object.freeze({ h, s, l, alpha });
        break;
      }
      case "oklch":
        value = Object.freeze({ ...hexToOklch(hex), alpha });
        break;
      case "oklab":
        value = Object.freeze({ ...rgbToOklab(hexToRgb(hex)), alpha });
        break;
      default:
        throw new TypeError("Unknown color format");
    }
    return value;
  }
  function getColor(hex, alpha = hexAlpha(hex)) {
    return Object.freeze({
      ...getColorNameMatch(hex),
      alpha,
      ...Object.fromEntries(
        colorFormats.map((format) => [format, getColorValue(hex, format, alpha)])
      ),
      formats: Object.freeze(
        Object.fromEntries(
          colorFormats.map((format) => [format, formatColor(hex, format, alpha)])
        )
      )
    });
  }

  // packages/color-picker/core/picker.ts
  var colorViews = ["area", "wheel"];
  function createColorStore(hex = "#6366F1", format = "hex", view = "area", disabled = false) {
    if (!colorViews.includes(view)) throw new TypeError("Invalid color view");
    if (!colorFormats.includes(format))
      throw new TypeError("Unknown color format");
    const initial = hexToHsv(hex);
    const alpha = hexAlpha(hex);
    let state = Object.freeze({
      ...initial,
      disabled,
      format,
      view,
      hex: hsvToHex(initial),
      value: withAlpha(hsvToHex(initial), alpha),
      alpha
    });
    const server = state, listeners = /* @__PURE__ */ new Set();
    const update = (hsv) => {
      const next = { h: hue(hsv.h), s: clamp(hsv.s), v: clamp(hsv.v) };
      if (next.h === state.h && next.s === state.s && next.v === state.v) return;
      state = Object.freeze({
        ...state,
        ...next,
        hex: hsvToHex(next),
        value: withAlpha(hsvToHex(next), state.alpha),
        alpha: state.alpha,
        format: state.format,
        view: state.view
      });
      listeners.forEach((fn) => fn());
    };
    return {
      setDisabled(disabled2) {
        if (disabled2 === state.disabled) return;
        state = Object.freeze({ ...state, disabled: disabled2 });
        listeners.forEach((fn) => fn());
      },
      getColor: () => getColor(state.hex, state.alpha),
      getValue: (format2) => getColorValue(state.hex, format2, state.alpha),
      getSnapshot: () => state,
      getServerSnapshot: () => server,
      subscribe(fn) {
        listeners.add(fn);
        return () => {
          listeners.delete(fn);
        };
      },
      setFormat(format2) {
        if (!colorFormats.includes(format2))
          throw new TypeError("Unknown color format");
        if (format2 === state.format) return;
        state = Object.freeze({ ...state, format: format2 });
        listeners.forEach((fn) => fn());
      },
      setView(view2) {
        if (!colorViews.includes(view2)) throw new TypeError("Invalid color view");
        if (state.view === view2) return;
        state = Object.freeze({ ...state, view: view2 });
        listeners.forEach((fn) => fn());
      },
      setHex(hex2) {
        const value = normalizeColorHex(hex2), alpha2 = hexAlpha(value), rgb = opaqueHex(value);
        if (rgb === state.hex && alpha2 === state.alpha) return;
        const next = rgb === state.hex ? { h: state.h, s: state.s, v: state.v } : hexToHsv(rgb, state.h);
        state = Object.freeze({
          ...state,
          ...next,
          hex: rgb,
          alpha: alpha2,
          value: withAlpha(rgb, alpha2)
        });
        listeners.forEach((fn) => fn());
      },
      setAlpha(alpha2) {
        if (!Number.isFinite(alpha2) || alpha2 < 0 || alpha2 > 1)
          throw new TypeError("Alpha must be between 0 and 1");
        if (alpha2 === state.alpha) return;
        state = Object.freeze({
          ...state,
          alpha: alpha2,
          value: withAlpha(state.hex, alpha2)
        });
        listeners.forEach((fn) => fn());
      },
      setHSV(hsv) {
        update({ ...state, ...hsv });
      }
    };
  }
  function bindColorArea(element, store, mode = "area") {
    let pointer, frame, pending;
    const view = element.ownerDocument.defaultView;
    const flush = () => {
      if (frame !== void 0) view.cancelAnimationFrame(frame);
      frame = void 0;
      if (pending) {
        if (!store.getSnapshot().disabled) store.setHSV(pending);
        pending = void 0;
      }
    };
    const read = (event) => {
      if (store.getSnapshot().disabled) return;
      const rect = element.getBoundingClientRect();
      pending = mode === "wheel" ? wheelAtPoint(
        store.getSnapshot(),
        event.clientX - rect.left,
        event.clientY - rect.top,
        rect.width,
        rect.height
      ) : colorAtPoint(
        store.getSnapshot().h,
        event.clientX - rect.left,
        event.clientY - rect.top,
        rect.width,
        rect.height
      );
      if (frame === void 0) frame = view.requestAnimationFrame(flush);
    };
    const down = (event) => {
      if (store.getSnapshot().disabled || pointer !== void 0 || event.button !== 0 || !event.isPrimary)
        return;
      event.preventDefault();
      element.focus();
      pointer = event.pointerId;
      element.setPointerCapture(pointer);
      read(event);
    };
    const move = (event) => {
      if (event.pointerId === pointer) read(event);
    };
    const end = (event) => {
      if (event.pointerId !== pointer) return;
      read(event);
      flush();
      pointer = void 0;
    };
    const cancel = () => {
      flush();
      pointer = void 0;
    };
    const key = (event) => {
      if (store.getSnapshot().disabled) return;
      const { h, s, v } = store.getSnapshot(), step = event.shiftKey ? 10 : 1;
      const changes = mode === "wheel" ? {
        ArrowLeft: { h: h - step },
        ArrowRight: { h: h + step },
        ArrowUp: { s: s + step },
        ArrowDown: { s: s - step },
        Home: { s: 0 },
        End: { s: 100 }
      } : {
        ArrowLeft: { s: s - step },
        ArrowRight: { s: s + step },
        ArrowUp: { v: v + step },
        ArrowDown: { v: v - step },
        Home: { s: 0 },
        End: { s: 100 }
      };
      if (changes[event.key]) {
        event.preventDefault();
        store.setHSV(changes[event.key]);
      }
    };
    element.addEventListener("pointerdown", down);
    element.addEventListener("pointermove", move);
    element.addEventListener("pointerup", end);
    element.addEventListener("pointercancel", cancel);
    element.addEventListener("lostpointercapture", cancel);
    element.addEventListener("keydown", key);
    return () => {
      if (frame !== void 0) view.cancelAnimationFrame(frame);
      if (pointer !== void 0 && element.hasPointerCapture(pointer))
        element.releasePointerCapture(pointer);
      element.removeEventListener("pointerdown", down);
      element.removeEventListener("pointermove", move);
      element.removeEventListener("pointerup", end);
      element.removeEventListener("pointercancel", cancel);
      element.removeEventListener("lostpointercapture", cancel);
      element.removeEventListener("keydown", key);
    };
  }
  function wheelAtPoint(state, x, y, width, height) {
    const dx = x - width / 2, dy = y - height / 2, radius = Math.min(width, height) / 2;
    return {
      h: dx === 0 && dy === 0 ? state.h : hue(Math.atan2(dy, dx) * 180 / Math.PI),
      s: radius > 0 ? clamp(Math.hypot(dx, dy) / radius * 100) : 0,
      v: state.v
    };
  }
  function wheelStyle(state) {
    return `position:relative;touch-action:none;width:100%;aspect-ratio:1;border-radius:50%;background:var(--cp-wheel-background,linear-gradient(rgba(0,0,0,${1 - state.v / 100}),rgba(0,0,0,${1 - state.v / 100})),radial-gradient(closest-side,white,transparent),conic-gradient(from 90deg,red,yellow,lime,cyan,blue,magenta,red))`;
  }
  function wheelThumbStyle(state) {
    const a = state.h * Math.PI / 180;
    return `position:absolute;left:${50 + Math.cos(a) * state.s / 2}%;top:${50 + Math.sin(a) * state.s / 2}%;transform:translate(-50%,-50%);width:var(--cp-thumb-size,12px);height:var(--cp-thumb-size,12px);border:var(--cp-thumb-border,2px solid white);box-shadow:var(--cp-thumb-shadow,0 0 0 1px #000);border-radius:var(--cp-thumb-radius,50%);pointer-events:none;display:grid;place-items:center;color:var(--cp-thumb-text-color,white);font-size:var(--cp-thumb-text-size,10px)`;
  }
  function areaStyle(state) {
    return `background:linear-gradient(to top,#000,transparent),linear-gradient(to right,#fff,transparent),hsl(${state.h} 100% 50%);position:relative;touch-action:none;min-height:var(--cp-area-height,180px);min-width:0;width:100%`;
  }
  function thumbStyle(state) {
    return `position:absolute;left:${state.s}%;top:${100 - state.v}%;transform:translate(-50%,-50%);width:var(--cp-thumb-size,12px);height:var(--cp-thumb-size,12px);border:var(--cp-thumb-border,2px solid white);box-shadow:var(--cp-thumb-shadow,0 0 0 1px #000);border-radius:var(--cp-thumb-radius,50%);pointer-events:none;display:grid;place-items:center;color:var(--cp-thumb-text-color,white);font-size:var(--cp-thumb-text-size,10px)`;
  }
  function subscribeColor(store, onChange) {
    let last = store.getSnapshot().value;
    return store.subscribe(() => {
      const hex = store.getSnapshot().value;
      if (hex !== last) {
        last = hex;
        onChange(hex);
      }
    });
  }

  // packages/color-picker/core/channels.ts
  var spec = (label, min, max, step = 1, unit = "") => ({ label, min, max, step, unit });
  var channelSpecs = {
    rgb: [spec("R", 0, 255), spec("G", 0, 255), spec("B", 0, 255)],
    hsl: [
      spec("H", 0, 360, 1, "\xB0"),
      spec("S", 0, 100, 0.1, "%"),
      spec("L", 0, 100, 0.1, "%")
    ],
    hsv: [
      spec("H", 0, 360, 1, "\xB0"),
      spec("S", 0, 100, 0.1, "%"),
      spec("V", 0, 100, 0.1, "%")
    ],
    oklch: [
      spec("L", 0, 100, 0.1, "%"),
      spec("C", 0, 0.4, 1e-3),
      spec("H", 0, 360, 1, "\xB0")
    ],
    oklab: [
      spec("L", 0, 100, 0.1, "%"),
      spec("a", -0.4, 0.4, 1e-3),
      spec("b", -0.4, 0.4, 1e-3)
    ]
  };
  function getColorChannels(state, format) {
    if (format === "rgb") return hexToRgb(state.hex);
    if (format === "hsl")
      return hsvToChannels(state).replace(/%/g, "").split(" ").map(Number);
    if (format === "hsv") return [state.h, state.s, state.v];
    if (format === "oklch") {
      const c2 = hexToOklch(state.hex);
      return [c2.l * 100, c2.c, c2.h];
    }
    const c = rgbToOklab(hexToRgb(state.hex));
    return [c.l * 100, c.a, c.b];
  }
  function channelValue(state, format, index) {
    const step = channelSpecs[format][index].step;
    const decimals = String(step).split(".")[1]?.length ?? 0;
    return String(
      Number(getColorChannels(state, format)[index].toFixed(decimals))
    );
  }
  function setColorChannel(store, format, index, value) {
    const spec2 = channelSpecs[format][index];
    if (!Number.isFinite(value) || value < spec2.min || value > spec2.max)
      throw new TypeError(
        `${spec2.label} must be between ${spec2.min} and ${spec2.max}`
      );
    const values = getColorChannels(store.getSnapshot(), format);
    values[index] = value;
    const [a, b, c] = values;
    if (format === "rgb") {
      store.setHSV(hexToHsv(rgbToHex(values)));
      return;
    }
    if (format === "hsv") {
      store.setHSV({ h: a, s: b, v: c });
      return;
    }
    if (format === "hsl") {
      const l = c / 100, s = b / 100, v = l + s * Math.min(l, 1 - l);
      store.setHSV({ h: a, s: v === 0 ? 0 : 200 * (1 - l / v), v: v * 100 });
      return;
    }
    store.setHSV(
      hexToHsv(
        format === "oklch" ? oklchToHex({ l: a / 100, c: b, h: c }) : rgbToHex(oklabToRgb({ l: a / 100, a: b, b: c }))
      )
    );
  }

  // packages/color-picker/core/markers.ts
  var markerWheelStyle = () => wheelStyle({ h: 0, s: 100, v: 100 });
  function markerStyle(marker, active) {
    const a = marker.color.h * Math.PI / 180;
    return `position:absolute;transform:translate(-50%,-50%);left:${50 + Math.cos(a) * marker.color.s / 2}%;top:${50 + Math.sin(a) * marker.color.s / 2}%;background:${marker.color.hex};z-index:${active ? 2 : 1}`;
  }
  function bindMarkerWheel(element, options) {
    const win = element.ownerDocument.defaultView;
    const disabled = () => !!element.closest('[inert], [aria-disabled="true"]');
    let pointer, draggedId, frame, pending, moved = false, marker = false, startX = 0, startY = 0;
    const flush = () => {
      if (frame !== void 0) win.cancelAnimationFrame(frame);
      frame = void 0;
      if (disabled()) pending = void 0;
      if (pending) {
        const next = pending;
        pending = void 0;
        if (options.getMarkers().some((marker2) => marker2.id === next.markerId))
          options.setHSV(next.markerId, next.hsv);
      }
    };
    const read = (event) => {
      if (event.defaultPrevented || disabled()) return;
      const current = options.getMarkers().find((item) => item.id === draggedId);
      if (!draggedId || !current) return;
      const r = element.getBoundingClientRect();
      pending = {
        markerId: draggedId,
        hsv: wheelAtPoint(
          current.color,
          event.clientX - r.left,
          event.clientY - r.top,
          r.width,
          r.height
        )
      };
      if (frame === void 0) frame = win.requestAnimationFrame(flush);
    };
    const down = (event) => {
      if (event.defaultPrevented || disabled() || pointer !== void 0 || event.button !== 0 || !event.isPrimary)
        return;
      const button = event.target.closest(
        "[data-marker-id]"
      );
      if (button?.matches(':disabled, [aria-disabled="true"]')) return;
      if (button) {
        options.select(button.dataset.markerId);
        button.focus();
      } else element.focus();
      event.preventDefault();
      draggedId = button?.dataset.markerId ?? options.getActiveId();
      startX = event.clientX;
      startY = event.clientY;
      pointer = event.pointerId;
      moved = false;
      marker = !!button;
      element.setPointerCapture(pointer);
      if (!marker) read(event);
    };
    const move = (event) => {
      if (event.pointerId === pointer) {
        if (marker && !moved && Math.hypot(event.clientX - startX, event.clientY - startY) < 4)
          return;
        moved = true;
        read(event);
      }
    };
    const end = (event) => {
      if (event.pointerId !== pointer) return;
      if (!marker || moved) read(event);
      flush();
      pointer = void 0;
      draggedId = void 0;
    };
    const cancel = () => {
      flush();
      pointer = void 0;
      draggedId = void 0;
    };
    const click = (event) => {
      if (event.defaultPrevented || disabled()) return;
      const button = event.target.closest(
        "[data-marker-id]"
      );
      if (button?.matches(':disabled, [aria-disabled="true"]')) return;
      if (button) options.select(button.dataset.markerId);
    };
    const key = (event) => {
      if (event.defaultPrevented || disabled()) return;
      const button = event.target.closest(
        "[data-marker-id]"
      );
      if (button?.matches(':disabled, [aria-disabled="true"]')) return;
      if (button && [
        "ArrowLeft",
        "ArrowRight",
        "ArrowUp",
        "ArrowDown",
        "Home",
        "End"
      ].includes(event.key))
        options.select(button.dataset.markerId);
      const targetId = button?.dataset.markerId ?? options.getActiveId();
      const current = options.getMarkers().find((item) => item.id === targetId);
      if (!current) return;
      const c = current.color, step = event.shiftKey ? 10 : 1;
      const patch = {
        ArrowLeft: { h: c.h - step },
        ArrowRight: { h: c.h + step },
        ArrowUp: { s: c.s + step },
        ArrowDown: { s: c.s - step },
        Home: { s: 0 },
        End: { s: 100 }
      };
      if (patch[event.key]) {
        event.preventDefault();
        options.setHSV(targetId, patch[event.key]);
      }
    };
    element.addEventListener("pointerdown", down);
    element.addEventListener("pointermove", move);
    element.addEventListener("pointerup", end);
    element.addEventListener("pointercancel", cancel);
    element.addEventListener("lostpointercapture", cancel);
    element.addEventListener("click", click);
    element.addEventListener("keydown", key);
    return () => {
      if (frame !== void 0) win.cancelAnimationFrame(frame);
      pending = void 0;
      if (pointer !== void 0 && element.hasPointerCapture(pointer))
        element.releasePointerCapture(pointer);
      element.removeEventListener("pointerdown", down);
      element.removeEventListener("pointermove", move);
      element.removeEventListener("pointerup", end);
      element.removeEventListener("pointercancel", cancel);
      element.removeEventListener("lostpointercapture", cancel);
      element.removeEventListener("click", click);
      element.removeEventListener("keydown", key);
    };
  }

  // packages/color-picker/core/contrast.ts
  function compositeColor(color, background) {
    const alpha = hexAlpha(normalizeColorHex(color));
    if (hexAlpha(normalizeColorHex(background)) !== 1)
      throw new TypeError("Composite background must be opaque");
    const fg = hexToRgb(color), bg = hexToRgb(background);
    return rgbToHex(
      fg.map((channel, i) => channel * alpha + bg[i] * (1 - alpha))
    );
  }
  function colorContrast(foreground2, background, options = {}) {
    const canvas = normalizeColorHex(options.canvas ?? "#FFFFFF");
    if (hexAlpha(canvas) !== 1)
      throw new TypeError("Contrast canvas must be opaque");
    if (options.text !== void 0 && options.text !== "normal" && options.text !== "large")
      throw new TypeError("Invalid text size");
    const bg = compositeColor(background, canvas), fg = compositeColor(foreground2, bg), ratio = contrast(fg, bg);
    return Object.freeze({
      ratio,
      aa: ratio >= (options.text === "large" ? 3 : 4.5),
      aaa: ratio >= (options.text === "large" ? 4.5 : 7),
      foreground: fg,
      background: bg,
      suggestedForeground: contrast("#000000", bg) >= contrast("#FFFFFF", bg) ? "#000000" : "#FFFFFF"
    });
  }

  // packages/color-picker/core/parts.ts
  var sliderLabels = {
    h: "Hue",
    s: "Saturation",
    v: "Brightness",
    alpha: "Alpha"
  };
  var sliderValue = (state, channel) => channel === "alpha" ? state.alpha * 100 : state[channel];
  function setSliderValue(store, channel, value) {
    if (channel === "alpha") store.setAlpha(value / 100);
    else store.setHSV({ [channel]: value });
  }
  function sliderTrackVariables(state) {
    return {
      "--cp-alpha-color": state.hex,
      "--cp-saturation-start": hsvToHex({ ...state, s: 0 }),
      "--cp-saturation-end": hsvToHex({ ...state, s: 100 }),
      "--cp-brightness-end": hsvToHex({ ...state, v: 100 })
    };
  }
  var cssVariables = (variables) => Object.entries(variables).map(([property, value]) => `${property}:${value}`).join(";");
  function sliderTrackStyle(state) {
    return cssVariables(sliderTrackVariables(state));
  }
  function colorPreviewStyles(value) {
    return {
      background: `linear-gradient(${value},${value}),repeating-conic-gradient(#eee 0% 25%,white 0% 50%) 0/12px 12px`,
      color: colorContrast("#000000", value).suggestedForeground
    };
  }
  var colorPreviewStyle = (value) => cssVariables(colorPreviewStyles(value));
  var alphaTrackStyle = (hex) => `--cp-alpha-color:${hex}`;
  function bindAlphaInput(input, store) {
    let focused = false;
    const render = () => {
      if (!focused) {
        input.value = String(
          Number((store.getSnapshot().alpha * 100).toFixed(1))
        );
        input.setAttribute("aria-invalid", "false");
      }
    };
    const change = () => {
      const n = input.valueAsNumber;
      if (input.value !== "" && Number.isFinite(n) && n >= 0 && n <= 100) {
        store.setAlpha(n / 100);
        input.setAttribute("aria-invalid", "false");
      } else input.setAttribute("aria-invalid", "true");
    };
    const focus = () => focused = true;
    const blur = () => {
      focused = false;
      render();
    };
    const key = (e) => {
      if (e.key === "Enter") {
        focused = false;
        render();
        focused = true;
      }
    };
    input.addEventListener("input", change);
    input.addEventListener("focus", focus);
    input.addEventListener("blur", blur);
    input.addEventListener("keydown", key);
    render();
    const unsubscribe = store.subscribe(render);
    return () => {
      unsubscribe();
      input.removeEventListener("input", change);
      input.removeEventListener("focus", focus);
      input.removeEventListener("blur", blur);
      input.removeEventListener("keydown", key);
    };
  }

  // packages/color-picker/core/history.ts
  function createHistory(source, options = {}) {
    const limit = options.limit ?? 100;
    if (!Number.isInteger(limit) || limit < 1)
      throw new TypeError("History limit must be a positive integer");
    const key = source.key ?? JSON.stringify;
    let entries = [source.read()], index = 0, depth = 0, restoring = false, disposed = false;
    const listeners = /* @__PURE__ */ new Set();
    const capture = () => Object.freeze({
      canUndo: index > 0,
      canRedo: index < entries.length - 1,
      length: entries.length,
      index
    });
    let snapshot = capture();
    const emit = () => {
      snapshot = capture();
      listeners.forEach((fn) => fn());
    };
    const record = () => {
      if (disposed || restoring || depth) return;
      const next = source.read();
      if (key(next) === key(entries[index])) return;
      entries = entries.slice(0, index + 1);
      entries.push(next);
      if (entries.length > limit + 1) entries.shift();
      index = entries.length - 1;
      emit();
    };
    const unsubscribe = source.subscribe(record);
    const restore = (offset) => {
      if (disposed) return;
      depth = 0;
      record();
      const next = index + offset;
      if (next < 0 || next >= entries.length) return;
      restoring = true;
      try {
        source.write(entries[next]);
        index = next;
      } finally {
        restoring = false;
      }
      emit();
    };
    return {
      getSnapshot: () => snapshot,
      subscribe(fn) {
        listeners.add(fn);
        return () => {
          listeners.delete(fn);
        };
      },
      begin() {
        if (!disposed) depth++;
      },
      end() {
        if (depth) depth--;
        record();
      },
      undo: () => restore(-1),
      redo: () => restore(1),
      clear() {
        if (disposed) return;
        depth = 0;
        entries = [source.read()];
        index = 0;
        emit();
      },
      destroy() {
        disposed = true;
        unsubscribe();
        listeners.clear();
        entries = [];
      }
    };
  }
  function createColorHistory(store, options) {
    return createHistory(
      {
        read: store.getSnapshot,
        subscribe: store.subscribe,
        key: (s) => JSON.stringify([s.h, s.s, s.v, s.alpha]),
        write(s) {
          store.setHSV({ h: s.h, s: s.s, v: s.v });
          store.setAlpha(s.alpha);
        }
      },
      options
    );
  }
  function mountHistory(root, history) {
    const doc = root.ownerDocument;
    let pointer, typing, keyboard = false;
    const down = (e) => {
      if (e.button === 0 && pointer === void 0) {
        pointer = e.pointerId;
        history.begin();
      }
    };
    const up = (e) => {
      if (e.pointerId === pointer) {
        pointer = void 0;
        history.end();
      }
    };
    const focus = (e) => {
      const el = e.target;
      if (el.matches(
        "input:not([type=range]):not([type=checkbox]):not([type=radio]), textarea"
      )) {
        typing = el;
        history.begin();
      }
    };
    const blur = (e) => {
      if (e.target === typing) {
        typing = void 0;
        history.end();
      }
    };
    const keys = (e) => {
      const el = e.target;
      const editable = el.matches(
        "input, textarea, select, [contenteditable=true]"
      );
      if (!editable && (e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "z") {
        e.preventDefault();
        e.shiftKey ? history.redo() : history.undo();
        return;
      }
      if (!typing && !keyboard && [
        "ArrowUp",
        "ArrowDown",
        "ArrowLeft",
        "ArrowRight",
        "Home",
        "End"
      ].includes(e.key)) {
        keyboard = true;
        history.begin();
      }
    };
    const keyup = () => {
      if (keyboard) {
        keyboard = false;
        history.end();
      }
    };
    const leave = () => {
      if (pointer !== void 0) {
        pointer = void 0;
        history.end();
      }
      keyup();
    };
    root.addEventListener("pointerdown", down, true);
    doc.addEventListener("pointerup", up);
    doc.addEventListener("pointercancel", up);
    root.addEventListener("focusin", focus);
    root.addEventListener("focusout", blur);
    root.addEventListener("keydown", keys, true);
    doc.addEventListener("keyup", keyup);
    doc.defaultView?.addEventListener("blur", leave);
    return () => {
      root.removeEventListener("pointerdown", down, true);
      doc.removeEventListener("pointerup", up);
      doc.removeEventListener("pointercancel", up);
      root.removeEventListener("focusin", focus);
      root.removeEventListener("focusout", blur);
      root.removeEventListener("keydown", keys, true);
      doc.removeEventListener("keyup", keyup);
      doc.defaultView?.removeEventListener("blur", leave);
      leave();
      if (typing) {
        typing = void 0;
        history.end();
      }
    };
  }

  // packages/color-picker/core/form.ts
  function bindColorForm(root, store, options) {
    if (!options.name) throw new TypeError("Color field name is required");
    const format = options.format ?? "hex";
    if (!colorFormats.includes(format))
      throw new TypeError("Invalid form color format");
    const input = root.ownerDocument.createElement("input");
    input.type = "text";
    input.name = options.name;
    input.required = options.required ?? false;
    input.tabIndex = -1;
    input.setAttribute("aria-label", options.name);
    input.style.cssText = "position:absolute;width:1px;height:1px;opacity:0;pointer-events:none;clip-path:inset(50%)";
    root.append(input);
    const initial = options.defaultValue ?? store.getSnapshot().value;
    const update = () => {
      const s = store.getSnapshot();
      input.value = format === "hex" ? s.value : formatColor(s.hex, format, s.alpha);
      input.disabled = options.disabled === true || s.disabled;
      input.setCustomValidity(options.validate?.(input.value) ?? "");
    };
    update();
    const unsubscribe = store.subscribe(update);
    const form = input.form;
    let disposed = false;
    const timers = /* @__PURE__ */ new Set();
    const reset = (event) => {
      const fields = [
        ...root.querySelectorAll(
          '[data-cp-part="input"], [data-cp-part="track"], [data-cp-part="select"], cp-slider input, cp-alpha-input input, cp-format-select select, cp-view-select select'
        )
      ].map((field) => [field, field.value]);
      const timer = setTimeout(() => {
        timers.delete(timer);
        if (disposed || event.defaultPrevented) return;
        fields.forEach(([field, value]) => {
          if (field.isConnected) field.value = value;
        });
        store.setHex(initial);
        update();
      }, 0);
      timers.add(timer);
    };
    const invalid = () => root.querySelector(
      'input:not([tabindex="-1"]):not([type=hidden]), [data-area]'
    )?.focus();
    input.addEventListener("invalid", invalid);
    form?.addEventListener("reset", reset);
    return {
      input,
      getValue: () => input.value,
      destroy() {
        disposed = true;
        timers.forEach(clearTimeout);
        timers.clear();
        unsubscribe();
        form?.removeEventListener("reset", reset);
        input.removeEventListener("invalid", invalid);
        input.remove();
      }
    };
  }

  // packages/color-picker/core/collection.ts
  function browserColorStorage(key = "@salyra-ui/color-picker:colors") {
    return {
      read: () => JSON.parse(localStorage.getItem(key) ?? "null"),
      write: (value) => localStorage.setItem(key, JSON.stringify(value))
    };
  }
  function createColorCollection(options = {}) {
    const limit = options.limit ?? 12;
    if (!Number.isInteger(limit) || limit < 1 || limit > 1e3)
      throw new TypeError("Color collection limit must be between 1 and 1000");
    const normalize = (value) => {
      if (!Array.isArray(value) || value.some((v) => typeof v !== "string"))
        throw new TypeError("Expected a list of colors");
      return Object.freeze(
        [...new Set(value.map(normalizeColorHex))].slice(0, limit)
      );
    };
    let state = Object.freeze({
      recent: Object.freeze([]),
      favorites: normalize(options.favorites ?? [])
    });
    const listeners = /* @__PURE__ */ new Set();
    const publish = (next, persist = true) => {
      if (JSON.stringify(state) === JSON.stringify(next)) return;
      state = Object.freeze(next);
      listeners.forEach((fn) => fn());
      if (persist)
        try {
          options.storage?.write(state);
        } catch {
        }
    };
    return {
      getSnapshot: () => state,
      subscribe(fn) {
        listeners.add(fn);
        return () => {
          listeners.delete(fn);
        };
      },
      load() {
        try {
          const data = options.storage?.read();
          if (data)
            publish(
              {
                recent: normalize(data.recent),
                favorites: normalize(data.favorites)
              },
              false
            );
        } catch {
        }
      },
      remember(color) {
        const value = normalizeColorHex(color);
        publish({
          ...state,
          recent: normalize([value, ...state.recent.filter((c) => c !== value)])
        });
      },
      toggleFavorite(color) {
        const value = normalizeColorHex(color);
        publish({
          ...state,
          favorites: normalize(
            state.favorites.includes(value) ? state.favorites.filter((c) => c !== value) : [value, ...state.favorites]
          )
        });
      },
      clearRecent() {
        publish({ ...state, recent: Object.freeze([]) });
      }
    };
  }

  // packages/color-picker/core/controls.ts
  function surfaceStyles(state, view) {
    return {
      position: "relative",
      touchAction: "none",
      ...view === "wheel" ? {
        aspectRatio: "1",
        borderRadius: "50%",
        background: `var(--cp-wheel-background,linear-gradient(rgba(0,0,0,${1 - state.v / 100}),rgba(0,0,0,${1 - state.v / 100})),radial-gradient(closest-side,white,transparent),conic-gradient(from 90deg,red,yellow,lime,cyan,blue,magenta,red))`
      } : {
        background: `linear-gradient(to top,#000,transparent),linear-gradient(to right,#fff,transparent),hsl(${state.h} 100% 50%)`
      }
    };
  }
  function thumbPosition(state, view) {
    const a = state.h * Math.PI / 180;
    return {
      position: "absolute",
      transform: "translate(-50%,-50%)",
      pointerEvents: "none",
      left: `${view === "wheel" ? 50 + Math.cos(a) * state.s / 2 : state.s}%`,
      top: `${view === "wheel" ? 50 + Math.sin(a) * state.s / 2 : 100 - state.v}%`
    };
  }
  function styleText(styles) {
    return Object.entries(styles).map(
      ([key, value]) => `${key.replace(/[A-Z]/g, (x) => "-" + x.toLowerCase())}:${value}`
    ).join(";");
  }
  function sliderAttributes(state, channel) {
    return {
      type: "range",
      min: 0,
      max: channel === "h" ? 359 : 100,
      step: channel === "alpha" ? 0.1 : 1,
      value: sliderValue(state, channel),
      disabled: state.disabled
    };
  }
  function subscribeColorSelector(store, select, listener, equal = Object.is) {
    let previous = select(store.getSnapshot());
    return store.subscribe(() => {
      const next = select(store.getSnapshot());
      if (!equal(previous, next)) {
        previous = next;
        listener(next);
      }
    });
  }
  function bindColorSlider(input, store, channel, isDisabled) {
    const ownDisabled = input.disabled && !input.hasAttribute("data-cp-disabled") && !input.hasAttribute("data-tk-disabled");
    const localDisabled = isDisabled ?? (() => ownDisabled);
    const render = () => {
      const state = store.getSnapshot();
      input.value = String(sliderValue(state, channel));
      input.disabled = localDisabled() || state.disabled;
      for (const [key, value] of Object.entries(sliderTrackVariables(state)))
        input.style.setProperty(key, value);
    };
    const change = (event) => {
      if (!event.defaultPrevented && !input.disabled && !store.getSnapshot().disabled)
        setSliderValue(store, channel, input.valueAsNumber);
    };
    input.addEventListener("input", change);
    render();
    const stop = store.subscribe(render);
    return () => {
      stop();
      input.removeEventListener("input", change);
      input.disabled = ownDisabled;
    };
  }
  function bindColorValueInput(input, store, options = {}, isDisabled) {
    let focused = false;
    const ownDisabled = input.disabled && !input.hasAttribute("data-cp-disabled") && !input.hasAttribute("data-tk-disabled");
    const localDisabled = isDisabled ?? (() => ownDisabled);
    const format = () => options.format ?? store.getSnapshot().format;
    const render = () => {
      const state = store.getSnapshot();
      input.disabled = localDisabled() || state.disabled;
      if (focused) return;
      input.value = options.index === void 0 ? formatColor(state.hex, format(), state.alpha) : channelValue(state, format(), options.index);
      input.setAttribute("aria-invalid", "false");
    };
    if (options.index !== void 0 && (!options.format || options.format === "hex"))
      throw new TypeError("Channel inputs require a non-hex format");
    const change = (event) => {
      if (event.defaultPrevented || input.disabled || store.getSnapshot().disabled)
        return;
      try {
        if (!input.value.trim()) throw new Error("Incomplete input");
        if (options.index === void 0)
          store.setHex(parseColor(input.value, format()));
        else
          setColorChannel(
            store,
            format(),
            options.index,
            Number(input.value)
          );
        input.setAttribute("aria-invalid", "false");
      } catch {
        input.setAttribute("aria-invalid", "true");
      }
    };
    const focus = () => {
      focused = true;
    };
    const blur = () => {
      focused = false;
      render();
    };
    const key = (event) => {
      if (event.defaultPrevented) return;
      if (event.key === "Enter" || event.key === "Escape") {
        focused = false;
        render();
        focused = true;
      }
    };
    input.addEventListener("input", change);
    input.addEventListener("focus", focus);
    input.addEventListener("blur", blur);
    input.addEventListener("keydown", key);
    render();
    const stop = store.subscribe(render);
    return () => {
      stop();
      input.removeEventListener("input", change);
      input.removeEventListener("focus", focus);
      input.removeEventListener("blur", blur);
      input.removeEventListener("keydown", key);
      input.disabled = ownDisabled;
    };
  }
  function colorInputAttributes(state, options = {}) {
    if (options.index !== void 0) {
      if (!options.format || options.format === "hex")
        throw new TypeError("Channel inputs require a non-hex format");
      const spec2 = channelSpecs[options.format][options.index];
      return {
        type: "number",
        min: spec2.min,
        max: spec2.max,
        step: spec2.step,
        value: channelValue(state, options.format, options.index),
        disabled: state.disabled,
        "aria-label": `${options.format.toUpperCase()} ${spec2.label}`
      };
    }
    return {
      type: "text",
      value: formatColor(state.hex, options.format ?? state.format, state.alpha),
      disabled: state.disabled,
      "aria-label": (options.format ?? state.format).toUpperCase()
    };
  }
  function nextColorFormat(store, format) {
    if (store.getSnapshot().disabled) return;
    store.setFormat(
      format ?? colorFormats[(colorFormats.indexOf(store.getSnapshot().format) + 1) % colorFormats.length]
    );
  }
  function bindColorSurface(element, store, view = "area") {
    element.dataset.cpPart = "surface";
    element.dataset.view = view;
    const render = () => {
      const state = store.getSnapshot();
      for (const [key, value] of Object.entries(surfaceStyles(state, view)))
        element.style.setProperty(
          key.replace(/[A-Z]/g, (x) => "-" + x.toLowerCase()),
          value
        );
      element.setAttribute("aria-disabled", String(state.disabled));
      element.tabIndex = state.disabled ? -1 : 0;
      for (const thumb of element.querySelectorAll(
        '[data-cp-part="thumb"]'
      )) {
        if (thumb.closest('[data-cp-part="surface"]') !== element) continue;
        for (const [key, value] of Object.entries(thumbPosition(state, view)))
          thumb.style.setProperty(
            key.replace(/[A-Z]/g, (x) => "-" + x.toLowerCase()),
            value
          );
      }
    };
    render();
    const stop = store.subscribe(render), unbind = bindColorArea(element, store, view);
    return () => {
      stop();
      unbind();
    };
  }

  // packages/color-picker/vanilla/elements.ts
  var ColorProviderElement = class extends HTMLElement {
    static {
      this.observedAttributes = ["disabled"];
    }
    attributeChangedCallback() {
      if (this.store) this.store.setDisabled(this.hasAttribute("disabled"));
    }
    setStore(store) {
      this.unsubscribe?.();
      this.unsubscribe = void 0;
      this.store = store;
      if (this.isConnected) this.connectedCallback();
    }
    connectedCallback() {
      if (this.unsubscribe) return;
      this.store ??= createColorStore(
        this.getAttribute("value") ?? "#6366F1",
        "hex",
        this.getAttribute("view") ?? "area",
        this.hasAttribute("disabled")
      );
      if (this.hasAttribute("disabled")) this.store.setDisabled(true);
      const updateDisabled = () => {
        const disabled = this.store.getSnapshot().disabled;
        this.toggleAttribute("inert", disabled);
        this.setAttribute("aria-disabled", String(disabled));
        this.dataset.disabled = String(disabled);
        this.querySelectorAll("input, select, button").forEach((control) => {
          if (control.closest("cp-provider") !== this) return;
          if (disabled) {
            if (!control.disabled) {
              control.dataset.cpDisabled = "";
              control.disabled = true;
            }
          } else if (control.hasAttribute("data-cp-disabled")) {
            control.disabled = false;
            delete control.dataset.cpDisabled;
          }
        });
      };
      let previousDisabled = this.store.getSnapshot().disabled;
      const states = this.store.subscribe(() => {
        const disabled = this.store.getSnapshot().disabled;
        if (disabled !== previousDisabled) {
          previousDisabled = disabled;
          updateDisabled();
        }
      });
      const observer = new this.ownerDocument.defaultView.MutationObserver(
        updateDisabled
      );
      observer.observe(this, { childList: true, subtree: true });
      updateDisabled();
      const colors = subscribeColor(
        this.store,
        () => this.dispatchEvent(
          new CustomEvent("color-change", {
            detail: this.store.getSnapshot().value,
            bubbles: true
          })
        )
      );
      this.unsubscribe = () => {
        states();
        colors();
        observer.disconnect();
      };
      this.dispatchEvent(new Event("color-context"));
    }
    disconnectedCallback() {
      this.unsubscribe?.();
      this.unsubscribe = void 0;
    }
  };
  function connect(element, render, bind) {
    const root = element.closest("cp-provider");
    if (!root) throw new Error("Color components require cp-provider");
    let unsubscribe, cleanup;
    const setup = () => {
      if (!root.store) return;
      unsubscribe?.();
      cleanup?.();
      render(root.store);
      unsubscribe = root.store.subscribe(() => render(root.store));
      cleanup = bind?.(root.store);
    };
    root.addEventListener("color-context", setup);
    setup();
    return () => {
      root.removeEventListener("color-context", setup);
      unsubscribe?.();
      cleanup?.();
    };
  }
  var ColorAreaElement = class extends HTMLElement {
    connectedCallback() {
      const area = this.querySelector("[data-area]"), thumb = area.firstElementChild;
      this.cleanup = connect(
        this,
        (store) => {
          const state = store.getSnapshot();
          area.style.cssText = `${areaStyle(state)};${area.dataset.customStyle ?? ""}`;
          thumb.style.cssText = thumbStyle(state);
          area.setAttribute(
            "aria-label",
            `Saturation and brightness. Arrow keys adjust; Shift for larger steps. ${Math.round(state.s)}% saturation, ${Math.round(state.v)}% brightness.`
          );
        },
        (store) => bindColorArea(area, store)
      );
    }
    disconnectedCallback() {
      this.cleanup?.();
    }
  };
  var ColorWheelElement = class extends HTMLElement {
    setMarkers(markers, activeId) {
      this.markers = markers;
      this.activeId = activeId;
      this.render();
    }
    render() {
      const area = this.querySelector("[data-area]");
      if (!area) return;
      const store = this.closest("cp-provider")?.store;
      if (!store) return;
      const classes = JSON.parse(
        this.getAttribute("data-classes") ?? "{}"
      );
      area.style.cssText = (this.markers ? markerWheelStyle() : wheelStyle(store.getSnapshot())) + ";" + (this.getAttribute("data-custom-style") ?? "");
      if (this.markers) {
        for (const el of area.querySelectorAll("[data-marker-id]"))
          el.hidden = !this.markers.some(
            (marker) => marker.id === el.dataset.markerId
          );
        for (const marker of this.markers) {
          let button = Array.from(
            area.querySelectorAll("[data-marker-id]")
          ).find((el) => el.dataset.markerId === marker.id);
          if (!button) {
            button = area.ownerDocument.createElement("button");
            button.type = "button";
            button.dataset.markerId = marker.id;
            button.dataset.cpPart = "marker";
            button.append(area.ownerDocument.createElement("span"));
            area.append(button);
          }
          button.hidden = false;
          button.className = "cp-wheel-marker " + (classes.marker ?? "");
          button.setAttribute(
            "aria-label",
            marker.ariaLabel ?? `Select ${marker.id} marker`
          );
          button.setAttribute(
            "aria-pressed",
            String(marker.id === this.activeId)
          );
          button.dataset.small = String(
            this.markers.length === 1 || !marker.label
          );
          button.style.cssText = markerStyle(marker, marker.id === this.activeId);
          const text = button.firstElementChild;
          text.dataset.cpPart = "marker-text";
          text.className = classes.text ?? "";
          text.textContent = marker.label ?? "";
        }
      } else {
        const thumb = area.querySelector('[data-cp-part="thumb"]');
        if (thumb) thumb.style.cssText = wheelThumbStyle(store.getSnapshot());
      }
    }
    connectedCallback() {
      this.markers = this.markers ?? (this.hasAttribute("data-markers") ? JSON.parse(this.getAttribute("data-markers")) : void 0);
      this.activeId ??= this.getAttribute("data-active-id") ?? void 0;
      const area = this.querySelector("[data-area]");
      this.cleanup = connect(
        this,
        () => this.render(),
        (store) => this.markers ? bindMarkerWheel(area, {
          getMarkers: () => this.markers ?? [],
          getActiveId: () => this.activeId ?? this.markers?.[0]?.id ?? "",
          select: (id) => this.dispatchEvent(
            new CustomEvent("marker-select", {
              detail: id,
              bubbles: true
            })
          ),
          setHSV: (id, hsv) => this.dispatchEvent(
            new CustomEvent("marker-change", {
              detail: { id, hsv },
              bubbles: true
            })
          )
        }) : bindColorArea(area, store, "wheel")
      );
    }
    disconnectedCallback() {
      this.cleanup?.();
    }
  };
  var ColorSliderElement = class extends HTMLElement {
    connectedCallback() {
      const input = this.querySelector("input"), channel = this.getAttribute("channel") ?? "h";
      this.cleanup = connect(
        this,
        (store) => {
          input.value = String(sliderValue(store.getSnapshot(), channel));
          const track = input.closest(".cp-slider") ?? input.parentElement;
          for (const [property, value] of Object.entries(
            sliderTrackVariables(store.getSnapshot())
          ))
            track.style.setProperty(property, value);
        },
        (store) => {
          const update = () => setSliderValue(store, channel, Number(input.value));
          input.addEventListener("input", update);
          return () => input.removeEventListener("input", update);
        }
      );
    }
    disconnectedCallback() {
      this.cleanup?.();
    }
  };
  function applyFieldClasses(element) {
    const source = element.hasAttribute("data-classes") ? element : element.closest("cp-input[data-classes]");
    const classes = JSON.parse(source?.dataset.classes ?? "{}");
    const add = (node, value) => {
      if (node && value?.trim()) node.classList.add(...value.trim().split(/\s+/));
    };
    add(
      element.querySelector("label"),
      [classes.root, classes.label].filter(Boolean).join(" ")
    );
    const input = element.querySelector("input");
    if (input) {
      input.dataset.cpPart = "input";
      add(input, classes.input);
    }
    add(
      element.querySelector("[data-label], [data-channel-label]"),
      classes.text
    );
  }
  var ColorTextInputElement = class extends HTMLElement {
    connectedCallback() {
      applyFieldClasses(this);
      const input = this.querySelector("input"), label = this.querySelector("[data-label]");
      const format = (store) => this.getAttribute("format") ?? store.getSnapshot().format;
      this.cleanup = connect(
        this,
        (store) => {
          const f = format(store);
          input.maxLength = f === "hex" ? 9 : 64;
          if (input.ownerDocument.activeElement !== input)
            input.value = formatColor(
              store.getSnapshot().hex,
              f,
              store.getSnapshot().alpha
            );
          label.textContent = this.getAttribute("label") ?? f.toUpperCase();
          input.setAttribute("aria-invalid", "false");
        },
        (store) => {
          const update = () => {
            try {
              store.setHex(parseColor(input.value, format(store)));
              input.setAttribute("aria-invalid", "false");
            } catch {
              input.setAttribute("aria-invalid", "true");
            }
          };
          const reset = () => {
            input.value = formatColor(
              store.getSnapshot().hex,
              format(store),
              store.getSnapshot().alpha
            );
            input.setAttribute("aria-invalid", "false");
          };
          const key = (event) => {
            if (event.key === "Enter") reset();
          };
          input.addEventListener("input", update);
          input.addEventListener("blur", reset);
          input.addEventListener("keydown", key);
          return () => {
            input.removeEventListener("input", update);
            input.removeEventListener("blur", reset);
            input.removeEventListener("keydown", key);
          };
        }
      );
    }
    disconnectedCallback() {
      this.cleanup?.();
    }
  };
  var ColorChannelInputElement = class extends HTMLElement {
    connectedCallback() {
      const format = this.getAttribute("format"), index = Number(this.getAttribute("index")), spec2 = channelSpecs[format][index];
      if (!this.querySelector("input")) {
        this.innerHTML = '<label class="cp-channel"><span data-channel-label></span><span class="cp-channel-field"><input type="number"/><span data-unit aria-hidden="true"></span></span></label>';
      }
      applyFieldClasses(this);
      const input = this.querySelector("input");
      this.querySelector("[data-channel-label]").textContent = spec2.label;
      this.querySelector("[data-unit]").textContent = spec2.unit;
      input.setAttribute("aria-label", `${format.toUpperCase()} ${spec2.label}`);
      input.min = String(spec2.min);
      input.max = String(spec2.max);
      input.step = String(spec2.step);
      this.cleanup = connect(
        this,
        (store) => {
          if (input.ownerDocument.activeElement !== input)
            input.value = channelValue(store.getSnapshot(), format, index);
        },
        (store) => {
          const change = () => {
            try {
              if (!input.value.trim()) throw new Error("Incomplete");
              setColorChannel(store, format, index, Number(input.value));
              input.setAttribute("aria-invalid", "false");
            } catch {
              input.setAttribute("aria-invalid", "true");
            }
          };
          const reset = () => {
            input.value = channelValue(store.getSnapshot(), format, index);
            input.setAttribute("aria-invalid", "false");
          };
          const key = (event) => {
            if (event.key === "Enter") reset();
          };
          input.addEventListener("input", change);
          input.addEventListener("blur", reset);
          input.addEventListener("keydown", key);
          return () => {
            input.removeEventListener("input", change);
            input.removeEventListener("blur", reset);
            input.removeEventListener("keydown", key);
          };
        }
      );
    }
    disconnectedCallback() {
      this.cleanup?.();
    }
  };
  var ColorPreviewElement = class extends HTMLElement {
    connectedCallback() {
      const output = this.querySelector("output");
      this.cleanup = connect(this, (store) => {
        const value = store.getSnapshot().value;
        for (const [property, color] of Object.entries(colorPreviewStyles(value)))
          output.style.setProperty(property, color);
        output.textContent = value;
        output.setAttribute("aria-label", `Selected color ${value}`);
      });
    }
    disconnectedCallback() {
      this.cleanup?.();
    }
  };
  var ColorInputElement = class extends HTMLElement {
    connectedCallback() {
      this.cleanup = connect(this, (store) => {
        const format = this.getAttribute("format") ?? store.getSnapshot().format;
        if (this.dataset.renderedFormat === format) return;
        this.dataset.renderedFormat = format;
        if (format === "hex") {
          const text = this.ownerDocument.createElement("cp-text-input");
          text.setAttribute("format", "hex");
          if (this.hasAttribute("label"))
            text.setAttribute("label", this.getAttribute("label"));
          text.innerHTML = '<label class="cp-input"><span data-label>HEX</span><input spellcheck="false" maxlength="9"/></label>';
          this.replaceChildren(text);
        } else {
          const group = this.ownerDocument.createElement("div");
          group.className = "cp-channels";
          group.setAttribute("role", "group");
          group.setAttribute(
            "aria-label",
            this.getAttribute("label") ?? format.toUpperCase()
          );
          for (let index = 0; index < 3; index++) {
            const channel = this.ownerDocument.createElement("cp-channel-input");
            channel.setAttribute("format", format);
            channel.setAttribute("index", String(index));
            group.append(channel);
          }
          this.replaceChildren(group);
        }
      });
    }
    disconnectedCallback() {
      this.cleanup?.();
    }
  };
  var ColorModeElement = class extends HTMLElement {
    connectedCallback() {
      const button = this.querySelector("button");
      const custom = this.hasAttribute("data-custom");
      this.cleanup = connect(
        this,
        (store) => {
          const format = store.getSnapshot().format;
          if (!custom) button.textContent = "Next format";
          button.querySelectorAll("[data-color-format]").forEach((label) => label.textContent = format.toUpperCase());
          button.setAttribute(
            "aria-label",
            `Next color format (${format.toUpperCase()})`
          );
        },
        (store) => {
          const click = () => store.setFormat(
            colorFormats[(colorFormats.indexOf(store.getSnapshot().format) + 1) % colorFormats.length]
          );
          button.addEventListener("click", click);
          return () => button.removeEventListener("click", click);
        }
      );
    }
    disconnectedCallback() {
      this.cleanup?.();
    }
  };
  var ColorFormatSelectElement = class extends HTMLElement {
    connectedCallback() {
      const select = this.querySelector("select");
      this.cleanup = connect(
        this,
        (store) => {
          select.value = store.getSnapshot().format;
        },
        (store) => {
          const change = () => store.setFormat(select.value);
          select.addEventListener("change", change);
          return () => select.removeEventListener("change", change);
        }
      );
    }
    disconnectedCallback() {
      this.cleanup?.();
    }
  };
  var ColorViewSelectElement = class extends HTMLElement {
    connectedCallback() {
      const select = this.querySelector("select");
      this.cleanup = connect(
        this,
        (store) => {
          select.value = store.getSnapshot().view;
        },
        (store) => {
          const change = () => store.setView(select.value);
          select.addEventListener("change", change);
          return () => select.removeEventListener("change", change);
        }
      );
    }
    disconnectedCallback() {
      this.cleanup?.();
    }
  };
  var ColorSurfaceElement = class extends HTMLElement {
    connectedCallback() {
      this.cleanup = connect(this, (store) => {
        for (const child of this.children) {
          child.hidden = child.dataset.view !== store.getSnapshot().view;
        }
      });
    }
    disconnectedCallback() {
      this.cleanup?.();
    }
  };
  var ColorCollectionElement = class extends HTMLElement {
    setCollection(collection) {
      this.disconnectedCallback();
      this.collection = collection;
      if (this.isConnected) this.connectedCallback();
    }
    connectedCallback() {
      if (this.cleanup) return;
      const colors = JSON.parse(
        this.getAttribute("data-colors") ?? "[]"
      );
      this.collection ??= createColorCollection({
        favorites: this.getAttribute("kind") === "favorites" ? colors : []
      });
      if (!this.collection.getSnapshot().recent.length && this.getAttribute("kind") !== "favorites")
        for (const color of [...colors].reverse())
          this.collection.remember(color);
      const collection = this.collection;
      let store;
      const render = () => {
        const classes = JSON.parse(this.getAttribute("data-classes") ?? "{}");
        const root = this.ownerDocument.createElement("fieldset");
        root.className = `cp-collection ${classes.root ?? ""}`;
        root.disabled = store?.getSnapshot().disabled ?? false;
        const label = this.ownerDocument.createElement("legend");
        label.textContent = this.getAttribute("label") ?? "Recent colors";
        label.className = classes.label ?? "";
        root.append(label);
        for (const value of collection.getSnapshot()[this.getAttribute("kind") === "favorites" ? "favorites" : "recent"]) {
          const button = this.ownerDocument.createElement("button");
          button.type = "button";
          button.className = `cp-swatch ${classes.item ?? ""}`;
          button.style.background = value;
          button.setAttribute("aria-label", value);
          button.addEventListener("click", () => store?.setHex(value));
          root.append(button);
        }
        this.replaceChildren(root);
      };
      this.cleanup = connect(this, (next) => {
        store = next;
        const root = this.querySelector("fieldset");
        if (root) root.disabled = next.getSnapshot().disabled;
      });
      this.stopCollection = collection.subscribe(render);
      render();
    }
    disconnectedCallback() {
      this.cleanup?.();
      this.stopCollection?.();
      this.cleanup = void 0;
      this.stopCollection = void 0;
    }
  };
  var ColorSwatchElement = class extends HTMLElement {
    connectedCallback() {
      const button = this.querySelector("button");
      this.cleanup = connect(
        this,
        () => {
        },
        (store) => {
          const click = () => store.setHex(this.getAttribute("value"));
          button.addEventListener("click", click);
          return () => button.removeEventListener("click", click);
        }
      );
    }
    disconnectedCallback() {
      this.cleanup?.();
    }
  };
  var ColorAlphaInputElement = class extends HTMLElement {
    connectedCallback() {
      this.cleanup = connect(
        this,
        () => {
        },
        (store) => bindAlphaInput(this.querySelector("input"), store)
      );
    }
    disconnectedCallback() {
      this.cleanup?.();
    }
  };
  var ColorOutputElement = class extends HTMLElement {
    connectedCallback() {
      this.cleanup = connect(this, (store) => {
        this.color = store.getColor();
        const target = this.querySelector("output");
        const format = this.getAttribute("format");
        if (target)
          target.textContent = format === "name" ? this.color.name : format === "json" ? JSON.stringify(this.color, null, 2) : store.getSnapshot().value;
        this.dispatchEvent(
          new CustomEvent("color-values", { detail: this.color, bubbles: true })
        );
      });
    }
    disconnectedCallback() {
      this.cleanup?.();
      this.cleanup = void 0;
    }
  };
  for (const [name, element] of [
    ["cp-provider", ColorProviderElement],
    ["cp-output", ColorOutputElement],
    ["cp-area", ColorAreaElement],
    ["cp-preview", ColorPreviewElement],
    ["cp-wheel", ColorWheelElement],
    ["cp-slider", ColorSliderElement],
    ["cp-alpha-input", ColorAlphaInputElement],
    ["cp-input", ColorInputElement],
    ["cp-text-input", ColorTextInputElement],
    ["cp-channel-input", ColorChannelInputElement],
    ["cp-mode", ColorModeElement],
    ["cp-format-select", ColorFormatSelectElement],
    ["cp-view-select", ColorViewSelectElement],
    ["cp-surface", ColorSurfaceElement],
    ["cp-swatch", ColorSwatchElement],
    ["cp-collection", ColorCollectionElement]
  ])
    if (!customElements.get(name)) customElements.define(name, element);

  // packages/color-picker/vanilla/composition.ts
  function mountColorControls(root, store) {
    const stops = [];
    const controls = Array.from(
      root.querySelectorAll("[data-cp-control]")
    );
    if (root.matches("[data-cp-control]")) controls.unshift(root);
    for (const element of controls) {
      const kind = element.dataset.cpControl;
      if (kind === "area" || kind === "wheel")
        stops.push(bindColorSurface(element, store, kind));
      else if (kind === "slider")
        stops.push(
          bindColorSlider(
            element,
            store,
            element.dataset.channel ?? "h"
          )
        );
      else if (kind === "input")
        stops.push(
          bindColorValueInput(element, store, {
            format: element.dataset.format,
            index: element.hasAttribute("data-index") ? Number(element.dataset.index) : void 0
          })
        );
      else if (kind === "format") {
        const button = element, disabled = button.disabled && !button.hasAttribute("data-cp-disabled") && !button.hasAttribute("data-tk-disabled");
        const render = () => {
          button.disabled = disabled || store.getSnapshot().disabled;
          if (button.dataset.format)
            button.setAttribute(
              "aria-pressed",
              String(store.getSnapshot().format === button.dataset.format)
            );
        };
        const click = (event) => {
          if (!event.defaultPrevented && !button.disabled)
            nextColorFormat(
              store,
              button.dataset.format
            );
        };
        render();
        stops.push(store.subscribe(render));
        button.addEventListener("click", click);
        stops.push(() => button.removeEventListener("click", click));
      }
    }
    return {
      store,
      destroy() {
        stops.splice(0).reverse().forEach((stop) => stop());
      }
    };
  }

  // packages/color-picker/vanilla/composition-element.ts
  var ColorCompositionElement = class extends HTMLElement {
    constructor() {
      super(...arguments);
      this.controls = [];
    }
    connectedCallback() {
      const root = this.closest("cp-provider");
      if (!root) return;
      const setup = () => {
        const controls = Array.from(
          this.querySelectorAll('[data-cp-control], [data-cp-part="thumb"]')
        );
        if (this.bound === root.store && controls.length === this.controls.length && controls.every((control, index) => control === this.controls[index]))
          return;
        this.controls = controls;
        this.bound = root.store;
        this.stop?.();
        this.stop = void 0;
        if (root.store) this.stop = mountColorControls(this, root.store).destroy;
      };
      const observer = new this.ownerDocument.defaultView.MutationObserver(
        setup
      );
      observer.observe(this, { childList: true, subtree: true });
      root.addEventListener("color-context", setup);
      this.detach = () => {
        observer.disconnect();
        root.removeEventListener("color-context", setup);
      };
      setup();
      queueMicrotask(() => {
        if (this.isConnected) setup();
      });
    }
    disconnectedCallback() {
      this.stop?.();
      this.detach?.();
      this.stop = this.detach = void 0;
      this.bound = void 0;
      this.controls = [];
    }
  };
  if (!customElements.get("cp-compose"))
    customElements.define("cp-compose", ColorCompositionElement);

  // packages/color-picker/vanilla/index.ts
  var colorAreaMarkup = `<cp-area><div class="cp-area" data-area data-cp-part="surface" role="group" tabindex="0" aria-label="Saturation and brightness"><span data-cp-part="thumb" aria-hidden="true"></span></div></cp-area>`;
  var colorWheelMarkup = `<cp-wheel><div class="cp-wheel" data-area data-cp-part="surface" role="group" tabindex="0" aria-label="Hue and saturation wheel"><span data-cp-part="thumb" aria-hidden="true"></span></div></cp-wheel>`;
  var colorFormatMarkup = `<cp-format-select><label class="cp-format">Color format<select>${["hex", "rgb", "hsl", "hsv", "oklch", "oklab"].map((f) => `<option value="${f}">${f.toUpperCase()}</option>`).join("")}</select></label></cp-format-select>`;
  function colorSliderMarkup(channel, label = channel) {
    const text = label.replace(
      /[&<>"']/g,
      (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]
    );
    return `<cp-slider channel="${channel}"><label class="cp-slider" data-channel="${channel}">${text}<input type="range" min="0" max="${channel === "h" ? 359 : 100}" step="1" /></label></cp-slider>`;
  }
  var colorPickerMarkup = `<div class="cp-picker">
  <cp-view-select><label class="cp-format">Picker view<select><option value="area">Rectangle</option><option value="wheel">Wheel</option></select></label></cp-view-select>
  <cp-surface><div data-view="area">${colorAreaMarkup}</div><div data-view="wheel">${colorWheelMarkup}</div></cp-surface>
  ${colorSliderMarkup("h", "Hue")}${colorSliderMarkup("v", "Brightness")}${colorSliderMarkup("alpha", "Alpha")}
  ${colorFormatMarkup}<cp-input></cp-input>
  <cp-alpha-input><label class="cp-channel cp-alpha-input">Alpha<span class="cp-channel-field"><input type="number" min="0" max="100" step=".1" /><span aria-hidden="true">%</span></span></label></cp-alpha-input>
  <cp-mode><button type="button">Switch format</button></cp-mode>
  <cp-output format="name"><output aria-live="polite"></output></cp-output>
</div>`;
  function mountColorPicker(host, options = {}) {
    const store = options.store ?? createColorStore(
      options.value,
      options.format,
      options.view,
      options.disabled
    );
    const provider = host.ownerDocument.createElement(
      "cp-provider"
    );
    provider.className = options.className ?? "";
    if (options.disabled !== void 0) store.setDisabled(options.disabled);
    provider.setStore(store);
    provider.innerHTML = colorPickerMarkup;
    const change = () => options.onChange?.(store.getColor());
    provider.addEventListener("color-change", change);
    host.append(provider);
    change();
    return {
      element: provider,
      store,
      getColor: store.getColor,
      getValue: store.getValue,
      destroy() {
        provider.removeEventListener("color-change", change);
        provider.remove();
      }
    };
  }
  function mountColorCollection(host, store, collection, options = {}) {
    const root = host.ownerDocument.createElement("fieldset");
    root.className = `cp-collection ${options.classes?.root ?? ""}`;
    const legend = host.ownerDocument.createElement("legend");
    legend.className = options.classes?.label ?? "";
    legend.textContent = options.label ?? (options.kind === "favorites" ? "Favorite colors" : "Recent colors");
    const update = () => {
      root.replaceChildren(legend);
      for (const value of collection.getSnapshot()[options.kind ?? "recent"]) {
        const button = host.ownerDocument.createElement("button");
        button.type = "button";
        button.className = `cp-swatch ${options.classes?.item ?? ""}`;
        button.style.background = value;
        button.setAttribute("aria-label", value);
        button.textContent = options.renderLabel?.(value) ?? "";
        button.addEventListener("click", () => store.setHex(value));
        root.append(button);
      }
    };
    update();
    root.disabled = store.getSnapshot().disabled;
    host.append(root);
    const stopCollection = collection.subscribe(update), stopColor = store.subscribe(() => {
      root.disabled = store.getSnapshot().disabled;
    });
    return {
      element: root,
      destroy() {
        stopCollection();
        stopColor();
        root.remove();
      }
    };
  }
  return __toCommonJS(index_exports);
})();
