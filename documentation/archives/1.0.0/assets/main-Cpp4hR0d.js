import{F as Te,O as Be,P as Ie,Q as Fe,c as fe,s as lo,R as co,S as po,m as mo,T as ho,o as uo,U as Qe,L as $t,V as bo,W as go,b as fo,X as vo,Y as yo,g as ko,Z as So,_ as ht,$ as To,a0 as ut,M as Co,l as Oe,q as wo,d as xo,h as $o,j as Eo,n as Po,v as Et,a1 as bt,a2 as Ao,z as gt,a3 as Ro,a4 as Lo,a5 as Pt,r as te,x as At,a6 as et,H as Mo,A as Rt,u as Lt,E as Mt,I as qo,J as j,a7 as Ho,t as No,C as Io,D as Fo,K as U,a8 as qt,a9 as Ht,aa as Nt,ab as $e,ac as It,ad as Ft,ae as Do,N as Bo,af as Vo,ag as Oo}from"./styles-CXddFY77.js";/* empty css               */function jo(t,e="primary"){if(!Te.includes(e))throw new TypeError("Invalid contrast role");return Be(Fe(t.theme.structure.userPreset[e].foreground),Ie(t.theme,e))}function Uo(t){return t==="React"?`import { useEffect, useState } from 'react';
import { ColorPicker } from '@salyra-ui/color-picker/react';
import { ThemeProvider, ThemeStudio, createThemeStore, createThemeEditor, generateTheme, type ThemeStore } from '@salyra-ui/theme-studio/react';

export default function App() {
  // Create a store for this mounted app, never a shared server module variable.
  const [applied] = useState(() => createThemeStore({theme: generateTheme('#5268E0'), modeStorage:false}));
  return <ThemeProvider store={applied} modeStorage={false}>
    <button style={{background:'hsl(var(--primary))',color:'hsl(var(--primary-foreground))'}}>Applied theme</button>
    <DraftPreview applied={applied} />
  </ThemeProvider>;
}
function DraftPreview({applied}: {applied:ThemeStore}) {
  const [editor, setEditor] = useState<ReturnType<typeof createThemeEditor> | null>(null);
  const [error, setError] = useState('');
  useEffect(() => {
    const next = createThemeEditor(applied);
    setEditor(next);
    return () => next.destroy();
  }, [applied]);
  if (!editor) return <p role="status">Preparing editor…</p>;
  return <ThemeStudio.Root store={editor.store} options={{modeStorage:false}}>
    <ThemeStudio.Scope className="draft-preview">
      <ThemeStudio.PickerRoot roles={['primary']}>
        <label>Draft primary<ColorPicker.Input format="hex" /></label>
      </ThemeStudio.PickerRoot>
      <button style={{background:'hsl(var(--primary))',color:'hsl(var(--primary-foreground))'}}>Draft theme</button>
      <button onClick={() => {try {editor.apply();setError('');} catch(e) {setError(String(e));}}}>Save</button>
      <button onClick={() => {editor.cancel();setError('');}}>Cancel</button>
      <p role="status">{error}</p>
    </ThemeStudio.Scope>
  </ThemeStudio.Root>;
}`:t==="Svelte"?`<script lang="ts">
  import { onDestroy } from 'svelte';
  import { ColorPicker } from '@salyra-ui/color-picker/svelte';
  import { ThemeProvider, ThemeStudio, createThemeStore, createThemeEditor, generateTheme } from '@salyra-ui/theme-studio/svelte';
  const applied = createThemeStore({theme:generateTheme('#5268E0'),modeStorage:false});
  const editor = createThemeEditor(applied);
  let error = $state('');
  function save() {try {editor.apply();error='';} catch(e) {error=String(e);}}
  onDestroy(() => editor.destroy());
<\/script>

<ThemeProvider store={applied} options={{modeStorage:false}}>
  <button style="background:hsl(var(--primary));color:hsl(var(--primary-foreground))">Applied theme</button>
  <ThemeStudio.Root store={editor.store} options={{modeStorage:false}}>
    <ThemeStudio.Scope class="draft-preview">
      <ThemeStudio.PickerRoot roles={['primary']}>
        <label>Draft primary<ColorPicker.Input format="hex" /></label>
      </ThemeStudio.PickerRoot>
      <button style="background:hsl(var(--primary));color:hsl(var(--primary-foreground))">Draft theme</button>
      <button onclick={save}>Save</button>
      <button onclick={() => {editor.cancel();error='';}}>Cancel</button>
      <p role="status">{error}</p>
    </ThemeStudio.Scope>
  </ThemeStudio.Root>
</ThemeProvider>`:t==="Vue"?`<script setup lang="ts">
import { onScopeDispose, ref } from 'vue';
import { ColorPicker } from '@salyra-ui/color-picker/vue';
import { ThemeProvider, ThemeStudio, createThemeStore, createThemeEditor, generateTheme } from '@salyra-ui/theme-studio/vue';
const applied = createThemeStore({theme:generateTheme('#5268E0'),modeStorage:false});
const editor = createThemeEditor(applied);
const error = ref('');
function save() {try {editor.apply();error.value='';} catch(e) {error.value=String(e);}}
onScopeDispose(() => editor.destroy());
<\/script>
<template>
  <ThemeProvider :store="applied" :options="{modeStorage:false}">
    <button style="background:hsl(var(--primary));color:hsl(var(--primary-foreground))">Applied theme</button>
    <ThemeStudio.Root :store="editor.store" :options="{modeStorage:false}">
      <ThemeStudio.Scope class="draft-preview">
        <ThemeStudio.PickerRoot :roles="['primary']">
          <label>Draft primary<ColorPicker.Input format="hex" /></label>
        </ThemeStudio.PickerRoot>
        <button style="background:hsl(var(--primary));color:hsl(var(--primary-foreground))">Draft theme</button>
        <button @click="save">Save</button>
        <button @click="editor.cancel();error=''">Cancel</button>
        <p role="status">{{error}}</p>
      </ThemeStudio.Scope>
    </ThemeStudio.Root>
  </ThemeProvider>
</template>`:t==="Angular"?`import { Component, DestroyRef, inject } from '@angular/core';
import { ColorField } from '@salyra-ui/color-picker/angular';
import { ThemeProvider, ThemeRoot, ThemeVariableScope, ThemePickerRoot, createThemeStore, createThemeEditor, generateTheme } from '@salyra-ui/theme-studio/angular';
@Component({
  selector:'app-root', standalone:true,
  imports:[ThemeProvider,ThemeRoot,ThemeVariableScope,ThemePickerRoot,ColorField],
  template:\`<tk-provider [store]="applied" [options]="options">
    <button style="background:hsl(var(--primary));color:hsl(var(--primary-foreground))">Applied theme</button>
    <section tkRoot [store]="editor.store" [options]="options">
      <div tkScope class="draft-preview">
        <div tkPickerRoot [options]="pickerOptions"><label>Draft primary<input cpInput format="hex" /></label></div>
        <button style="background:hsl(var(--primary));color:hsl(var(--primary-foreground))">Draft theme</button>
        <button (click)="save()">Save</button>
        <button (click)="editor.cancel();error=''">Cancel</button>
        <p role="status">{{error}}</p>
      </div>
    </section>
  </tk-provider>\`,
})
export class AppComponent {
  readonly options = {modeStorage:false as const};
  readonly pickerOptions = {roles:['primary'] as const};
  readonly applied = createThemeStore({theme:generateTheme('#5268E0'),...this.options});
  readonly editor = createThemeEditor(this.applied);
  error = '';
  constructor() {inject(DestroyRef).onDestroy(() => this.editor.destroy());}
  save() {try {this.editor.apply();this.error='';} catch(e) {this.error=String(e);}}
}`:t==="Astro"?`---
import ThemeProvider from '@salyra-ui/theme-studio/astro/ThemeProvider.astro';
import ThemeRoot from '@salyra-ui/theme-studio/astro/ThemeRoot.astro';
import ThemeVariableScope from '@salyra-ui/theme-studio/astro/ThemeVariableScope.astro';
import ThemePickerRoot from '@salyra-ui/theme-studio/astro/ThemePickerRoot.astro';
import ColorField from '@salyra-ui/color-picker/astro/ColorField.astro';
import { generateTheme } from '@salyra-ui/theme-studio';
const value = '#5268E0';
const options = {theme:generateTheme(value),modeStorage:false as const};
---
<ThemeProvider {...options} scopeProps={{id:'applied-preview'}}>
  <button style="background:hsl(var(--primary));color:hsl(var(--primary-foreground))">Applied theme</button>
  <ThemeRoot id="draft-root" {options}>
    <ThemeVariableScope {options} class="draft-preview">
      <ThemePickerRoot roles={['primary']}>
        <label>Draft primary<ColorField {value} format="hex" /></label>
      </ThemePickerRoot>
      <button style="background:hsl(var(--primary));color:hsl(var(--primary-foreground))">Draft theme</button>
      <button id="save-draft">Save</button><button id="cancel-draft">Cancel</button>
      <p id="draft-error" role="status"></p>
    </ThemeVariableScope>
  </ThemeRoot>
</ThemeProvider>
<script>
  import { createThemeEditor, type ThemeRootElement } from '@salyra-ui/theme-studio/vanilla';
  const applied = document.querySelector('#applied-preview')!.closest('tk-root') as ThemeRootElement;
  const root = document.querySelector('#draft-root') as ThemeRootElement;
  if (!applied.store) throw new Error('The app theme root has not initialized');
  const editor = createThemeEditor(applied.store);
  root.setStore(editor.store,{modeStorage:false});
  const error = document.querySelector('#draft-error')!;
  document.querySelector('#save-draft')!.addEventListener('click',() => {
    try {editor.apply();error.textContent='';} catch(e) {error.textContent=String(e);}
  });
  document.querySelector('#cancel-draft')!.addEventListener('click',() => {editor.cancel();error.textContent='';});
  window.addEventListener('pagehide',event => {if (!event.persisted) editor.destroy();});
<\/script>`:`<section id="app-theme">
  <button style="background:hsl(var(--primary));color:hsl(var(--primary-foreground))">Applied theme</button>
  <section id="draft-preview">
    <label>Draft primary<input data-cp-control="input" data-format="hex" /></label>
    <button style="background:hsl(var(--primary));color:hsl(var(--primary-foreground))">Draft theme</button>
    <button id="save-draft">Save</button><button id="cancel-draft">Cancel</button>
    <p id="draft-error" role="status"></p>
  </section>
</section>
<script src="./assets/theme-studio.min.js"><\/script>
<script>
  const {createThemeStore,createThemeEditor,generateTheme,mountThemeStore,bindThemeScope,mountThemeControls} = ThemeStudio;
  const applied = createThemeStore({theme:generateTheme('#5268E0'),modeStorage:false});
  const editor = createThemeEditor(applied);
  const stopApp = mountThemeStore(applied,undefined,{modeStorage:false});
  const appScope = bindThemeScope(document.querySelector('#app-theme'),applied);
  const draftScope = bindThemeScope(document.querySelector('#draft-preview'),editor.store);
  const controls = mountThemeControls(document.querySelector('#draft-preview'),editor.store,{roles:['primary']});
  const error = document.querySelector('#draft-error');
  const save = () => {try {editor.apply();error.textContent='';} catch(e) {error.textContent=String(e);}};
  const cancel = () => {editor.cancel();error.textContent='';};
  const saveButton = document.querySelector('#save-draft'), cancelButton = document.querySelector('#cancel-draft');
  saveButton.addEventListener('click',save);
  cancelButton.addEventListener('click',cancel);
  window.addEventListener('pagehide',event => {
    if (event.persisted) return;
    saveButton.removeEventListener('click',save);
    cancelButton.removeEventListener('click',cancel);
    controls.destroy();draftScope();appScope();stopApp();editor.destroy();
  });
<\/script>`}const lt=class lt extends HTMLElement{attributeChangedCallback(){this.store&&this.store.setDisabled(this.hasAttribute("disabled"))}setStore(e){var o;(o=this.unsubscribe)==null||o.call(this),this.unsubscribe=void 0,this.store=e,this.isConnected&&this.connectedCallback()}connectedCallback(){if(this.unsubscribe)return;this.store??(this.store=fe(this.getAttribute("value")??"#6366F1","hex",this.getAttribute("view")??"area",this.hasAttribute("disabled"))),this.hasAttribute("disabled")&&this.store.setDisabled(!0);const e=()=>{const i=this.store.getSnapshot().disabled;this.toggleAttribute("inert",i),this.setAttribute("aria-disabled",String(i)),this.dataset.disabled=String(i),this.querySelectorAll("input, select, button").forEach(l=>{l.closest("cp-provider")===this&&(i?l.disabled||(l.dataset.cpDisabled="",l.disabled=!0):l.hasAttribute("data-cp-disabled")&&(l.disabled=!1,delete l.dataset.cpDisabled))})};let o=this.store.getSnapshot().disabled;const r=this.store.subscribe(()=>{const i=this.store.getSnapshot().disabled;i!==o&&(o=i,e())}),a=new this.ownerDocument.defaultView.MutationObserver(e);a.observe(this,{childList:!0,subtree:!0}),e();const s=lo(this.store,()=>this.dispatchEvent(new CustomEvent("color-change",{detail:this.store.getSnapshot().value,bubbles:!0})));this.unsubscribe=()=>{r(),s(),a.disconnect()},this.dispatchEvent(new Event("color-context"))}disconnectedCallback(){var e;(e=this.unsubscribe)==null||e.call(this),this.unsubscribe=void 0}};lt.observedAttributes=["disabled"];let ze=lt;function W(t,e,o){const r=t.closest("cp-provider");if(!r)throw new Error("Color components require cp-provider");let a,s;const i=()=>{r.store&&(a==null||a(),s==null||s(),e(r.store),a=r.store.subscribe(()=>e(r.store)),s=o==null?void 0:o(r.store))};return r.addEventListener("color-context",i),i(),()=>{r.removeEventListener("color-context",i),a==null||a(),s==null||s()}}class Wo extends HTMLElement{connectedCallback(){const e=this.querySelector("[data-area]"),o=e.firstElementChild;this.cleanup=W(this,r=>{const a=r.getSnapshot();e.style.cssText=`${bo(a)};${e.dataset.customStyle??""}`,o.style.cssText=go(a),e.setAttribute("aria-label",`Saturation and brightness. Arrow keys adjust; Shift for larger steps. ${Math.round(a.s)}% saturation, ${Math.round(a.v)}% brightness.`)},r=>$t(e,r))}disconnectedCallback(){var e;(e=this.cleanup)==null||e.call(this)}}class Go extends HTMLElement{setMarkers(e,o){this.markers=e,this.activeId=o,this.render()}render(){var a;const e=this.querySelector("[data-area]");if(!e)return;const o=(a=this.closest("cp-provider"))==null?void 0:a.store;if(!o)return;const r=JSON.parse(this.getAttribute("data-classes")??"{}");if(e.style.cssText=(this.markers?co():po(o.getSnapshot()))+";"+(this.getAttribute("data-custom-style")??""),this.markers){for(const s of e.querySelectorAll("[data-marker-id]"))s.hidden=!this.markers.some(i=>i.id===s.dataset.markerId);for(const s of this.markers){let i=Array.from(e.querySelectorAll("[data-marker-id]")).find(m=>m.dataset.markerId===s.id);i||(i=e.ownerDocument.createElement("button"),i.type="button",i.dataset.markerId=s.id,i.dataset.cpPart="marker",i.append(e.ownerDocument.createElement("span")),e.append(i)),i.hidden=!1,i.className="cp-wheel-marker "+(r.marker??""),i.setAttribute("aria-label",s.ariaLabel??`Select ${s.id} marker`),i.setAttribute("aria-pressed",String(s.id===this.activeId)),i.dataset.small=String(this.markers.length===1||!s.label),i.style.cssText=mo(s,s.id===this.activeId);const l=i.firstElementChild;l.dataset.cpPart="marker-text",l.className=r.text??"",l.textContent=s.label??""}}else{const s=e.querySelector('[data-cp-part="thumb"]');s&&(s.style.cssText=ho(o.getSnapshot()))}}connectedCallback(){this.markers=this.markers??(this.hasAttribute("data-markers")?JSON.parse(this.getAttribute("data-markers")):void 0),this.activeId??(this.activeId=this.getAttribute("data-active-id")??void 0);const e=this.querySelector("[data-area]");this.cleanup=W(this,()=>this.render(),o=>this.markers?fo(e,{getMarkers:()=>this.markers??[],getActiveId:()=>{var r,a;return this.activeId??((a=(r=this.markers)==null?void 0:r[0])==null?void 0:a.id)??""},select:r=>this.dispatchEvent(new CustomEvent("marker-select",{detail:r,bubbles:!0})),setHSV:(r,a)=>this.dispatchEvent(new CustomEvent("marker-change",{detail:{id:r,hsv:a},bubbles:!0}))}):$t(e,o,"wheel"))}disconnectedCallback(){var e;(e=this.cleanup)==null||e.call(this)}}class zo extends HTMLElement{connectedCallback(){const e=this.querySelector("input"),o=this.getAttribute("channel")??"h";this.cleanup=W(this,r=>{e.value=String(yo(r.getSnapshot(),o));const a=e.closest(".cp-slider")??e.parentElement;for(const[s,i]of Object.entries(ko(r.getSnapshot())))a.style.setProperty(s,i)},r=>{const a=()=>vo(r,o,Number(e.value));return e.addEventListener("input",a),()=>e.removeEventListener("input",a)})}disconnectedCallback(){var e;(e=this.cleanup)==null||e.call(this)}}function Dt(t){const e=t.hasAttribute("data-classes")?t:t.closest("cp-input[data-classes]"),o=JSON.parse((e==null?void 0:e.dataset.classes)??"{}"),r=(s,i)=>{s&&(i!=null&&i.trim())&&s.classList.add(...i.trim().split(/\s+/))};r(t.querySelector("label"),[o.root,o.label].filter(Boolean).join(" "));const a=t.querySelector("input");a&&(a.dataset.cpPart="input",r(a,o.input)),r(t.querySelector("[data-label], [data-channel-label]"),o.text)}class Jo extends HTMLElement{connectedCallback(){Dt(this);const e=this.querySelector("input"),o=this.querySelector("[data-label]"),r=a=>this.getAttribute("format")??a.getSnapshot().format;this.cleanup=W(this,a=>{const s=r(a);e.maxLength=s==="hex"?9:64,e.ownerDocument.activeElement!==e&&(e.value=ht(a.getSnapshot().hex,s,a.getSnapshot().alpha)),o.textContent=this.getAttribute("label")??s.toUpperCase(),e.setAttribute("aria-invalid","false")},a=>{const s=()=>{try{a.setHex(So(e.value,r(a))),e.setAttribute("aria-invalid","false")}catch{e.setAttribute("aria-invalid","true")}},i=()=>{e.value=ht(a.getSnapshot().hex,r(a),a.getSnapshot().alpha),e.setAttribute("aria-invalid","false")},l=m=>{m.key==="Enter"&&i()};return e.addEventListener("input",s),e.addEventListener("blur",i),e.addEventListener("keydown",l),()=>{e.removeEventListener("input",s),e.removeEventListener("blur",i),e.removeEventListener("keydown",l)}})}disconnectedCallback(){var e;(e=this.cleanup)==null||e.call(this)}}class Ko extends HTMLElement{connectedCallback(){const e=this.getAttribute("format"),o=Number(this.getAttribute("index")),r=uo[e][o];this.querySelector("input")||(this.innerHTML='<label class="cp-channel"><span data-channel-label></span><span class="cp-channel-field"><input type="number"/><span data-unit aria-hidden="true"></span></span></label>'),Dt(this);const a=this.querySelector("input");this.querySelector("[data-channel-label]").textContent=r.label,this.querySelector("[data-unit]").textContent=r.unit,a.setAttribute("aria-label",`${e.toUpperCase()} ${r.label}`),a.min=String(r.min),a.max=String(r.max),a.step=String(r.step),this.cleanup=W(this,s=>{a.ownerDocument.activeElement!==a&&(a.value=ut(s.getSnapshot(),e,o))},s=>{const i=()=>{try{if(!a.value.trim())throw new Error("Incomplete");To(s,e,o,Number(a.value)),a.setAttribute("aria-invalid","false")}catch{a.setAttribute("aria-invalid","true")}},l=()=>{a.value=ut(s.getSnapshot(),e,o),a.setAttribute("aria-invalid","false")},m=b=>{b.key==="Enter"&&l()};return a.addEventListener("input",i),a.addEventListener("blur",l),a.addEventListener("keydown",m),()=>{a.removeEventListener("input",i),a.removeEventListener("blur",l),a.removeEventListener("keydown",m)}})}disconnectedCallback(){var e;(e=this.cleanup)==null||e.call(this)}}class Xo extends HTMLElement{connectedCallback(){const e=this.querySelector("output");this.cleanup=W(this,o=>{const r=o.getSnapshot().value;for(const[a,s]of Object.entries(Co(r)))e.style.setProperty(a,s);e.textContent=r,e.setAttribute("aria-label",`Selected color ${r}`)})}disconnectedCallback(){var e;(e=this.cleanup)==null||e.call(this)}}class Yo extends HTMLElement{connectedCallback(){this.cleanup=W(this,e=>{const o=this.getAttribute("format")??e.getSnapshot().format;if(this.dataset.renderedFormat!==o)if(this.dataset.renderedFormat=o,o==="hex"){const r=this.ownerDocument.createElement("cp-text-input");r.setAttribute("format","hex"),this.hasAttribute("label")&&r.setAttribute("label",this.getAttribute("label")),r.innerHTML='<label class="cp-input"><span data-label>HEX</span><input spellcheck="false" maxlength="9"/></label>',this.replaceChildren(r)}else{const r=this.ownerDocument.createElement("div");r.className="cp-channels",r.setAttribute("role","group"),r.setAttribute("aria-label",this.getAttribute("label")??o.toUpperCase());for(let a=0;a<3;a++){const s=this.ownerDocument.createElement("cp-channel-input");s.setAttribute("format",o),s.setAttribute("index",String(a)),r.append(s)}this.replaceChildren(r)}})}disconnectedCallback(){var e;(e=this.cleanup)==null||e.call(this)}}class _o extends HTMLElement{connectedCallback(){const e=this.querySelector("button"),o=this.hasAttribute("data-custom");this.cleanup=W(this,r=>{const a=r.getSnapshot().format;o||(e.textContent="Next format"),e.querySelectorAll("[data-color-format]").forEach(s=>s.textContent=a.toUpperCase()),e.setAttribute("aria-label",`Next color format (${a.toUpperCase()})`)},r=>{const a=()=>r.setFormat(Oe[(Oe.indexOf(r.getSnapshot().format)+1)%Oe.length]);return e.addEventListener("click",a),()=>e.removeEventListener("click",a)})}disconnectedCallback(){var e;(e=this.cleanup)==null||e.call(this)}}class Zo extends HTMLElement{connectedCallback(){const e=this.querySelector("select");this.cleanup=W(this,o=>{e.value=o.getSnapshot().format},o=>{const r=()=>o.setFormat(e.value);return e.addEventListener("change",r),()=>e.removeEventListener("change",r)})}disconnectedCallback(){var e;(e=this.cleanup)==null||e.call(this)}}class Qo extends HTMLElement{connectedCallback(){const e=this.querySelector("select");this.cleanup=W(this,o=>{e.value=o.getSnapshot().view},o=>{const r=()=>o.setView(e.value);return e.addEventListener("change",r),()=>e.removeEventListener("change",r)})}disconnectedCallback(){var e;(e=this.cleanup)==null||e.call(this)}}class er extends HTMLElement{connectedCallback(){this.cleanup=W(this,e=>{for(const o of this.children)o.hidden=o.dataset.view!==e.getSnapshot().view})}disconnectedCallback(){var e;(e=this.cleanup)==null||e.call(this)}}class tr extends HTMLElement{setCollection(e){this.disconnectedCallback(),this.collection=e,this.isConnected&&this.connectedCallback()}connectedCallback(){if(this.cleanup)return;const e=JSON.parse(this.getAttribute("data-colors")??"[]");if(this.collection??(this.collection=Qe({favorites:this.getAttribute("kind")==="favorites"?e:[]})),!this.collection.getSnapshot().recent.length&&this.getAttribute("kind")!=="favorites")for(const s of[...e].reverse())this.collection.remember(s);const o=this.collection;let r;const a=()=>{const s=JSON.parse(this.getAttribute("data-classes")??"{}"),i=this.ownerDocument.createElement("fieldset");i.className=`cp-collection ${s.root??""}`,i.disabled=(r==null?void 0:r.getSnapshot().disabled)??!1;const l=this.ownerDocument.createElement("legend");l.textContent=this.getAttribute("label")??"Recent colors",l.className=s.label??"",i.append(l);for(const m of o.getSnapshot()[this.getAttribute("kind")==="favorites"?"favorites":"recent"]){const b=this.ownerDocument.createElement("button");b.type="button",b.className=`cp-swatch ${s.item??""}`,b.style.background=m,b.setAttribute("aria-label",m),b.addEventListener("click",()=>r==null?void 0:r.setHex(m)),i.append(b)}this.replaceChildren(i)};this.cleanup=W(this,s=>{r=s;const i=this.querySelector("fieldset");i&&(i.disabled=s.getSnapshot().disabled)}),this.stopCollection=o.subscribe(a),a()}disconnectedCallback(){var e,o;(e=this.cleanup)==null||e.call(this),(o=this.stopCollection)==null||o.call(this),this.cleanup=void 0,this.stopCollection=void 0}}class or extends HTMLElement{connectedCallback(){const e=this.querySelector("button");this.cleanup=W(this,()=>{},o=>{const r=()=>o.setHex(this.getAttribute("value"));return e.addEventListener("click",r),()=>e.removeEventListener("click",r)})}disconnectedCallback(){var e;(e=this.cleanup)==null||e.call(this)}}class rr extends HTMLElement{connectedCallback(){this.cleanup=W(this,()=>{},e=>wo(this.querySelector("input"),e))}disconnectedCallback(){var e;(e=this.cleanup)==null||e.call(this)}}class ar extends HTMLElement{connectedCallback(){this.cleanup=W(this,e=>{this.color=e.getColor();const o=this.querySelector("output"),r=this.getAttribute("format");o&&(o.textContent=r==="name"?this.color.name:r==="json"?JSON.stringify(this.color,null,2):e.getSnapshot().value),this.dispatchEvent(new CustomEvent("color-values",{detail:this.color,bubbles:!0}))})}disconnectedCallback(){var e;(e=this.cleanup)==null||e.call(this),this.cleanup=void 0}}for(const[t,e]of[["cp-provider",ze],["cp-output",ar],["cp-area",Wo],["cp-preview",Xo],["cp-wheel",Go],["cp-slider",zo],["cp-alpha-input",rr],["cp-input",Yo],["cp-text-input",Jo],["cp-channel-input",Ko],["cp-mode",_o],["cp-format-select",Zo],["cp-view-select",Qo],["cp-surface",er],["cp-swatch",or],["cp-collection",tr]])customElements.get(t)||customElements.define(t,e);function tt(t,e){const o=[],r=Array.from(t.querySelectorAll("[data-cp-control]"));t.matches("[data-cp-control]")&&r.unshift(t);for(const a of r){const s=a.dataset.cpControl;if(s==="area"||s==="wheel")o.push(xo(a,e,s));else if(s==="slider")o.push($o(a,e,a.dataset.channel??"h"));else if(s==="input")o.push(Eo(a,e,{format:a.dataset.format,index:a.hasAttribute("data-index")?Number(a.dataset.index):void 0}));else if(s==="format"){const i=a,l=i.disabled&&!i.hasAttribute("data-cp-disabled")&&!i.hasAttribute("data-tk-disabled"),m=()=>{i.disabled=l||e.getSnapshot().disabled,i.dataset.format&&i.setAttribute("aria-pressed",String(e.getSnapshot().format===i.dataset.format))},b=d=>{!d.defaultPrevented&&!i.disabled&&Po(e,i.dataset.format)};m(),o.push(e.subscribe(m)),i.addEventListener("click",b),o.push(()=>i.removeEventListener("click",b))}}return{store:e,destroy(){o.splice(0).reverse().forEach(a=>a())}}}class sr extends HTMLElement{constructor(){super(...arguments),this.controls=[]}connectedCallback(){const e=this.closest("cp-provider");if(!e)return;const o=()=>{var s;const a=Array.from(this.querySelectorAll('[data-cp-control], [data-cp-part="thumb"]'));this.bound===e.store&&a.length===this.controls.length&&a.every((i,l)=>i===this.controls[l])||(this.controls=a,this.bound=e.store,(s=this.stop)==null||s.call(this),this.stop=void 0,e.store&&(this.stop=tt(this,e.store).destroy))},r=new this.ownerDocument.defaultView.MutationObserver(o);r.observe(this,{childList:!0,subtree:!0}),e.addEventListener("color-context",o),this.detach=()=>{r.disconnect(),e.removeEventListener("color-context",o)},o(),queueMicrotask(()=>{this.isConnected&&o()})}disconnectedCallback(){var e,o;(e=this.stop)==null||e.call(this),(o=this.detach)==null||o.call(this),this.stop=this.detach=void 0,this.bound=void 0,this.controls=[]}}customElements.get("cp-compose")||customElements.define("cp-compose",sr);const Bt='<cp-area><div class="cp-area" data-area data-cp-part="surface" role="group" tabindex="0" aria-label="Saturation and brightness"><span data-cp-part="thumb" aria-hidden="true"></span></div></cp-area>',Vt='<cp-wheel><div class="cp-wheel" data-area data-cp-part="surface" role="group" tabindex="0" aria-label="Hue and saturation wheel"><span data-cp-part="thumb" aria-hidden="true"></span></div></cp-wheel>',Ot=`<cp-format-select><label class="cp-format">Color format<select>${["hex","rgb","hsl","hsv","oklch","oklab"].map(t=>`<option value="${t}">${t.toUpperCase()}</option>`).join("")}</select></label></cp-format-select>`;function we(t,e=t){const o=e.replace(/[&<>"']/g,r=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[r]);return`<cp-slider channel="${t}"><label class="cp-slider" data-channel="${t}">${o}<input type="range" min="0" max="${t==="h"?359:100}" step="1" /></label></cp-slider>`}const nr=`<div class="cp-picker">
  <cp-view-select><label class="cp-format">Picker view<select><option value="area">Rectangle</option><option value="wheel">Wheel</option></select></label></cp-view-select>
  <cp-surface><div data-view="area">${Bt}</div><div data-view="wheel">${Vt}</div></cp-surface>
  ${we("h","Hue")}${we("v","Brightness")}${we("alpha","Alpha")}
  ${Ot}<cp-input></cp-input>
  <cp-alpha-input><label class="cp-channel cp-alpha-input">Alpha<span class="cp-channel-field"><input type="number" min="0" max="100" step=".1" /><span aria-hidden="true">%</span></span></label></cp-alpha-input>
  <cp-mode><button type="button">Switch format</button></cp-mode>
  <cp-output format="name"><output aria-live="polite"></output></cp-output>
</div>`;function jt(t,e={}){const o=e.store??fe(e.value,e.format,e.view,e.disabled),r=t.ownerDocument.createElement("cp-provider");r.className=e.className??"",e.disabled!==void 0&&o.setDisabled(e.disabled),r.setStore(o),r.innerHTML=nr;const a=()=>{var s;return(s=e.onChange)==null?void 0:s.call(e,o.getColor())};return r.addEventListener("color-change",a),t.append(r),a(),{element:r,store:o,getColor:o.getColor,getValue:o.getValue,destroy(){r.removeEventListener("color-change",a),r.remove()}}}function De(t,e,o,r={}){var b,d;const a=t.ownerDocument.createElement("fieldset");a.className=`cp-collection ${((b=r.classes)==null?void 0:b.root)??""}`;const s=t.ownerDocument.createElement("legend");s.className=((d=r.classes)==null?void 0:d.label)??"",s.textContent=r.label??(r.kind==="favorites"?"Favorite colors":"Recent colors");const i=()=>{var u,p;a.replaceChildren(s);for(const c of o.getSnapshot()[r.kind??"recent"]){const h=t.ownerDocument.createElement("button");h.type="button",h.className=`cp-swatch ${((u=r.classes)==null?void 0:u.item)??""}`,h.style.background=c,h.setAttribute("aria-label",c),h.textContent=((p=r.renderLabel)==null?void 0:p.call(r,c))??"",h.addEventListener("click",()=>e.setHex(c)),a.append(h)}};i(),a.disabled=e.getSnapshot().disabled,t.append(a);const l=o.subscribe(i),m=e.subscribe(()=>{a.disabled=e.getSnapshot().disabled});return{element:a,destroy(){l(),m(),a.remove()}}}function ir(t,e,o){const r=new Map,a=()=>{for(const[c,h]of r)(c.closest("tk-root,tk-provider")!==t||c.dataset.tkBorder!==h.kind||c.dataset.target!==h.target)&&(h.destroy(),r.delete(c));for(const c of t.querySelectorAll("[data-tk-border]")){if(c.closest("tk-root,tk-provider")!==t||r.has(c))continue;const h=c.dataset.tkBorder,g=c.dataset.target;r.set(c,{kind:h,target:g,destroy:Et(c,e,h,g)})}},s=()=>{if(o.selection)return;const c=y=>[...t.querySelectorAll(y)].filter(T=>T.closest("tk-root,tk-provider")===t),h=c("tk-picker"),g=c("cp-provider[data-theme-generator]"),v=c("[data-tk-border]"),C=c("[data-tk-background]").length>0;if(!h.length&&!g.length&&!v.length&&!C)return;const $=new Set(g.map(y=>y.dataset.role??"primary"));for(const y of h){const T=[...y.querySelectorAll("[data-include-role]:checked")],x=JSON.parse(y.dataset.selectedRoles??"null")??JSON.parse(y.dataset.options??"{}").roles;for(const E of x??(T.length?T.map(w=>w.dataset.includeRole):["primary","secondary","accent"]))$.add(E)}e.setSelection({roles:[...$],radius:v.filter(y=>y.dataset.tkBorder==="radius").map(y=>y.dataset.target),width:v.filter(y=>y.dataset.tkBorder==="width").map(y=>y.dataset.target),background:C})},i=new t.ownerDocument.defaultView.MutationObserver(()=>{a(),s()});i.observe(t,{childList:!0,subtree:!0,attributes:!0,attributeFilter:["disabled","data-options","data-role","data-target","data-tk-border","data-selected-roles"]});const l=()=>{var h;const c=e.getSnapshot();t.dataset.disabled=String(c.disabled),t.querySelectorAll("input, select, button").forEach(g=>{g.closest("tk-root,tk-provider")===t&&(c.disabled?g.disabled||(g.dataset.tkDisabled="",g.disabled=!0):g.hasAttribute("data-tk-disabled")&&(g.disabled=!1,delete g.dataset.tkDisabled))}),t.querySelectorAll("cp-provider[data-theme-generator]").forEach(g=>{var v;g.closest("tk-root,tk-provider")===t&&((v=g.store)==null||v.setDisabled(c.disabled||g.hasAttribute("disabled")))}),t.dataset.theme=c.theme.id,t.dataset.mode=c.mode,t.dataset.modePreference=c.modePreference,t.querySelectorAll("[data-tk-mode]").forEach(g=>{if(g.closest("tk-root,tk-provider")!==t)return;const v=g.dataset.tkMode;bt(v)&&g.setAttribute("aria-pressed",String(v===c.modePreference));const C=g.querySelector("[data-mode-label]");C&&(C.textContent=JSON.parse(g.dataset.modeLabels??"{}")[v||c.modePreference])}),t.querySelectorAll("[data-tk-name]").forEach(g=>{g.closest("tk-root,tk-provider")===t&&(g.ownerDocument.activeElement!==g&&(g.value=c.theme.name),g.placeholder=gt(c.theme))}),t.querySelectorAll("[data-tk-name-suggestion]").forEach(g=>{g.closest("tk-root,tk-provider")===t&&(g.textContent=`Suggested: ${gt(c.theme)}`)}),t.dataset.themeStatus=c.status;for(const g of t.querySelectorAll("cp-provider[data-theme-generator]"))g.closest("tk-root,tk-provider")===t&&((h=g.store)==null||h.setHex(Fe(c.theme.structure.userPreset[g.dataset.role??"primary"].DEFAULT)));t.querySelectorAll("[data-tk-background]").forEach(g=>{g.closest("tk-root,tk-provider")===t&&(g.checked=c.background==="tinted")}),t.querySelectorAll("[data-tk-harmony]").forEach(g=>{g.closest("tk-root,tk-provider")===t&&(g.value=c.theme.harmony??"analogous")}),t.dispatchEvent(new CustomEvent("theme-change",{detail:c}))},m=c=>{const h=c.target;if(h.matches("cp-provider[data-theme-generator]")&&h.closest("tk-root,tk-provider")===t){const g=c.detail;g!==Fe(e.getSnapshot().theme.structure.userPreset[h.dataset.role??"primary"].DEFAULT)&&e.setColor(h.dataset.role??"primary",g)}},b=c=>{if(e.getSnapshot().disabled)return;const h=c.target.closest("[data-tk-mode],[data-tk-retry],[data-tk-theme],[data-tk-generate-harmony]");(h==null?void 0:h.closest("tk-root,tk-provider"))===t&&(h.hasAttribute("data-tk-mode")?e.setMode(bt(h.dataset.tkMode)?h.dataset.tkMode:Ao(e.getSnapshot().modePreference)):h.hasAttribute("data-tk-retry")?e.reload():h.hasAttribute("data-tk-generate-harmony")?e.generateHarmony():e.setTheme(JSON.parse(h.getAttribute("data-tk-theme"))))},d=c=>{if(e.getSnapshot().disabled)return;const h=c.target;h.matches("[data-tk-background]")&&h.closest("tk-root,tk-provider")===t&&e.setBackground(h.checked?"tinted":"neutral")},u=c=>{if(e.getSnapshot().disabled)return;const h=c.target;h.closest("tk-root,tk-provider")===t&&(h.matches("[data-tk-name]")&&e.setName(c.type==="change"&&!h.value?void 0:h.value),h.matches("[data-tk-harmony]")&&e.setHarmony(h.value))};t.addEventListener("change",s),a(),s(),t.addEventListener("change",u),t.addEventListener("input",u),t.addEventListener("change",d),t.addEventListener("color-change",m),t.addEventListener("click",b),l();const p=e.subscribe(l);return()=>{i.disconnect(),r.forEach(c=>c.destroy()),r.clear(),t.removeEventListener("change",s),p(),t.removeEventListener("change",u),t.removeEventListener("input",u),t.removeEventListener("change",d),t.removeEventListener("color-change",m),t.removeEventListener("click",b)}}const ke="tk-root,tk-provider";class Ut extends HTMLElement{setStore(e,o){var r;o&&(this.options=o),(r=this.cleanup)==null||r.call(this),this.cleanup=void 0,this.store=e,this.isConnected&&this.connectedCallback()}bindPresentation(e){return()=>{}}connectedCallback(){if(this.cleanup)return;const{src:e,storageKey:o,modeStorageKey:r,...a}=JSON.parse(this.getAttribute("data-config")??"{}"),s={...a,...this.options};e&&!s.loadTheme&&(s.loadTheme=Ro(e)),o&&!s.storage&&(s.storage=Lo(o)),r&&s.modeStorage!==!1&&!s.modeStorage&&(s.modeStorage=Pt(r));const i=this.store??(this.store=te(s)),l=this.bindPresentation(i),m=ir(this,i,s),b=At(i,s.storage,s);this.cleanup=()=>{m(),l(),b()}}disconnectedCallback(){var e;(e=this.cleanup)==null||e.call(this),this.cleanup=void 0}}function Wt(t,e){const o=et(t,e),r=t.hasAttribute("inert")&&!e.getSnapshot().disabled,a=t.getAttribute("aria-disabled"),s=()=>{t.toggleAttribute("inert",r||e.getSnapshot().disabled),t.setAttribute("aria-disabled",String(e.getSnapshot().disabled))};s();const i=e.subscribe(s);return()=>{i(),o(),t.toggleAttribute("inert",r),a===null?t.removeAttribute("aria-disabled"):t.setAttribute("aria-disabled",a)}}class lr extends Ut{bindPresentation(e){return Wt(this,e)}}class cr extends HTMLElement{connectedCallback(){if(this.detach)return;const e=this.closest(ke);if(!e)return;const o=()=>{var r;!e.store||this.store===e.store||((r=this.cleanup)==null||r.call(this),this.store=e.store,this.cleanup=this.hasAttribute("data-controls-boundary")?Wt(this,e.store):et(this,e.store))};e.addEventListener("theme-change",o),this.detach=()=>e.removeEventListener("theme-change",o),o()}disconnectedCallback(){var e,o;(e=this.detach)==null||e.call(this),(o=this.cleanup)==null||o.call(this),this.detach=this.cleanup=this.store=void 0}}class dr extends HTMLElement{connectedCallback(){const e=this.closest(ke);if(!e)return;const o=()=>{if(!e.store)return;const r=this.getAttribute("role-name")??"primary",a=e.store.getSnapshot().theme.structure.userPreset[r];this.querySelectorAll("[data-shade]").forEach((s,i)=>{s.style.background=`hsl(${a[s.dataset.shade?Number(s.dataset.shade):Rt[i]]})`})};e.addEventListener("theme-change",o),o(),this.cleanup=()=>e.removeEventListener("theme-change",o)}disconnectedCallback(){var e;(e=this.cleanup)==null||e.call(this)}}customElements.get("tk-provider")||customElements.define("tk-provider",lr);customElements.get("tk-palette")||customElements.define("tk-palette",dr);class pr extends HTMLElement{connectedCallback(){const e=this.closest(ke);if(!e)return;let o;const r=()=>{var v,C,$,y,T;if(!this.isConnected||!e.store||this.cleanup&&o===e.store)return;const a=this.querySelector("cp-provider[data-tk-active-color]"),s=this.querySelector('[data-picker-surface="shared-wheel"] cp-wheel');if(!a||!s)return;customElements.upgrade(this),(v=this.cleanup)==null||v.call(this),this.cleanup=void 0,o=e.store;const i=JSON.parse(this.getAttribute("data-options")??"{}"),l=Lt(e.store,i),m=i.controls===!1||i.controls===void 0&&((C=i.roles)==null?void 0:C.length)===1;(y=($=this.querySelector("[data-picker-view]"))==null?void 0:$.closest("label"))==null||y.toggleAttribute("hidden",m),(T=this.querySelector(".tk-role-options"))==null||T.toggleAttribute("hidden",m),a.setStore(l.activeColor);const b=()=>{var E;const x=l.getSnapshot();this.dataset.selectedRoles!==JSON.stringify(x.roles)&&(this.dataset.selectedRoles=JSON.stringify(x.roles)),(E=this.querySelector(".tk-role-tabs"))==null||E.toggleAttribute("hidden",x.roles.length===1),this.querySelector("[data-picker-view]").value=x.view,this.querySelectorAll("[data-picker-surface]").forEach(w=>w.hidden=w.dataset.pickerSurface!==x.view),this.querySelectorAll("[data-picker-channel]").forEach(w=>w.hidden=w.dataset.pickerChannel!==(x.view==="area"?"h":"v")),this.querySelector(".tk-editing").textContent=`Editing ${x.activeRole}`,this.querySelectorAll("[data-include-role]").forEach(w=>{const D=w.dataset.includeRole;w.checked=x.roles.includes(D),w.disabled=x.roles.length===1&&w.checked}),this.querySelectorAll("[data-select-role]").forEach(w=>{const D=w.dataset.selectRole;w.hidden=!x.roles.includes(D),w.setAttribute("aria-pressed",String(x.activeRole===D)),w.firstElementChild.style.background=x.colors[D].hex}),s.setMarkers(Mt(x),x.activeRole)},d=x=>{const E=x.target;if(E.matches("[data-picker-view]")&&l.setView(E.value),E.matches("[data-include-role]")){const w=E.dataset.includeRole,D=l.getSnapshot().roles;l.setRoles(E.checked?[...D,w]:D.filter(ae=>ae!==w))}},u=x=>{const E=x.target.closest("[data-select-role]");E&&l.selectRole(E.dataset.selectRole)},p=x=>l.selectRole(x.detail),c=x=>{const{id:E,hsv:w}=x.detail;l.setHSV(E,w)};s.addEventListener("marker-select",p),s.addEventListener("marker-change",c),this.addEventListener("change",d),this.addEventListener("click",u);const h=l.subscribe(b),g=l.mount();b(),this.cleanup=()=>{h(),g(),s.removeEventListener("marker-select",p),s.removeEventListener("marker-change",c),this.removeEventListener("change",d),this.removeEventListener("click",u)}};e.addEventListener("theme-change",r),this.ownerDocument.addEventListener("DOMContentLoaded",r,{once:!0}),this.detach=()=>{e.removeEventListener("theme-change",r),this.ownerDocument.removeEventListener("DOMContentLoaded",r)},r(),queueMicrotask(r)}disconnectedCallback(){var e,o;(e=this.detach)==null||e.call(this),this.detach=void 0,(o=this.cleanup)==null||o.call(this),this.cleanup=void 0}}customElements.get("tk-picker")||customElements.define("tk-picker",pr);function Gt(t,e){const o=t.closest(ke);if(!o)throw new Error("Theme components require tk-root or tk-provider");const r=()=>{o.store&&e(o.store)};return o.addEventListener("theme-change",r),r(),()=>o.removeEventListener("theme-change",r)}class mr extends HTMLElement{connectedCallback(){const e=Mo(JSON.parse(this.dataset.themes??"[]")),o=this.querySelector("select"),r=()=>{var l;const s=e.find(m=>m.id===o.value),i=this.closest(ke);s&&((l=i==null?void 0:i.store)==null||l.setTheme(s))};o.addEventListener("change",r);const a=Gt(this,s=>{o.value=qo(s.getSnapshot().theme,e)??""});this.cleanup=()=>{a(),o.removeEventListener("change",r)}}disconnectedCallback(){var e;(e=this.cleanup)==null||e.call(this),this.cleanup=void 0}}class hr extends HTMLElement{connectedCallback(){this.cleanup=Gt(this,e=>{const o=e.getSnapshot(),r=this.dataset.selection?JSON.parse(this.dataset.selection):void 0,a=j(o,r);if(this.configuration===a&&this.configuration.mode===a.mode&&this.configuration.modePreference===a.modePreference&&this.configuration.systemMode===a.systemMode)return;this.configuration=a;const s=this.querySelector("pre");s&&(s.textContent=a[this.getAttribute("format")??"json"]),this.dispatchEvent(new CustomEvent("configuration-change",{detail:a,bubbles:!0}))})}disconnectedCallback(){var e;(e=this.cleanup)==null||e.call(this),this.cleanup=void 0,this.configuration=void 0}}customElements.get("tk-select")||customElements.define("tk-select",mr);customElements.get("tk-export")||customElements.define("tk-export",hr);customElements.get("tk-root")||customElements.define("tk-root",Ut);customElements.get("tk-scope")||customElements.define("tk-scope",cr);function zt(t,e,o={}){const r=new Map(Array.from(t.querySelectorAll("button, input")).map(d=>[d,d.disabled&&!d.hasAttribute("data-tk-disabled")&&!d.hasAttribute("data-cp-disabled")])),a=Lt(e,o),s=[a.mount()],i=tt(t,a.activeColor);s.push(i.destroy);const l=d=>Array.from(t.querySelectorAll(d));for(const d of l('[data-tk-control="wheel"]'))d.dataset.cpPart="surface",d.style.position="relative",d.style.touchAction="none",d.style.aspectRatio="1",d.style.borderRadius="50%",d.style.background="radial-gradient(closest-side,white,transparent),conic-gradient(from 90deg,red,yellow,lime,cyan,blue,magenta,red)",d.tabIndex=0,s.push(Ho(d,a));for(const d of l('input[data-tk-control="geometry"]')){const u=d.dataset.kind??"radius",p=d.dataset.target??"DEFAULT",c=e.registerFields({roles:[],[u]:[p]});s.push(c.destroy,Et(d,e,u,p))}const m=l('button[data-tk-control="role"]');for(const d of m){const u=p=>{!p.defaultPrevented&&!d.disabled&&a.selectRole(d.dataset.role)};d.addEventListener("click",u),s.push(()=>d.removeEventListener("click",u))}const b=()=>{const d=a.getSnapshot(),u=a.activeColor.getSnapshot().disabled;for(const p of m){const c=p.dataset.role;p.setAttribute("aria-pressed",String(d.activeRole===c)),p.disabled=!!r.get(p)||u||!d.roles.includes(c)}for(const p of l('[data-tk-control="wheel"]')){p.setAttribute("aria-disabled",String(u)),p.tabIndex=u?-1:0;for(const c of p.querySelectorAll("[data-marker-id]")){const h=Mt(d).find(g=>g.id===c.dataset.markerId);if(c.hidden=!h,!!h){c.disabled=!!r.get(c)||u,c.setAttribute("aria-pressed",String(d.activeRole===h.id));for(const[g,v]of Object.entries(No(h.color,"wheel")))c.style.setProperty(g.replace(/[A-Z]/g,C=>"-"+C.toLowerCase()),v);c.style.pointerEvents="auto",c.style.background=h.color.hex,c.style.zIndex=d.activeRole===h.id?"2":"1"}}}for(const p of l('input[data-tk-control="geometry"]'))p.disabled=!!r.get(p)||e.getSnapshot().disabled};return b(),s.push(a.subscribe(b),e.subscribe(b)),{store:e,picker:a,getConfiguration:()=>j(e.getSnapshot()),destroy(){s.splice(0).reverse().forEach(d=>d())}}}class ur extends HTMLElement{constructor(){super(...arguments),this.controls=[]}connectedCallback(){const e=this.closest(ke);if(!e)return;const o=()=>{var l;if(!e.store)return;const s=Array.from(this.querySelectorAll("[data-tk-control], [data-cp-control], [data-marker-id]"));if(this.bound===e.store&&s.length===this.controls.length&&s.every((m,b)=>m===this.controls[b]))return;this.controls=s,(l=this.stop)==null||l.call(this),this.bound=e.store;const i=zt(this,e.store,JSON.parse(this.dataset.options??"{}"));this.picker=i.picker,this.stop=i.destroy},r=()=>o(),a=new MutationObserver(()=>o());a.observe(this,{childList:!0,subtree:!0}),e.addEventListener("theme-change",r),this.detach=()=>{a.disconnect(),e.removeEventListener("theme-change",r)},o(),queueMicrotask(()=>{this.isConnected&&o()})}disconnectedCallback(){var e,o;(e=this.stop)==null||e.call(this),(o=this.detach)==null||o.call(this),this.bound=this.picker=void 0,this.controls=[],this.stop=this.detach=void 0}}customElements.get("tk-compose")||customElements.define("tk-compose",ur);const Je=["primary","secondary","accent"],Jt=`<tk-picker><cp-provider data-tk-active-color><div class="tk-picker tk-generator">
  <label class="cp-format">Theme picker view<select data-picker-view><option value="area">Rectangle</option><option value="wheel">Wheel</option><option value="shared-wheel">Shared wheel</option></select></label>
  <fieldset class="tk-role-options"><legend>Visible roles</legend>${Je.map(t=>`<label><input type="checkbox" data-include-role="${t}" checked />${t}</label>`).join("")}</fieldset>
  <div class="tk-role-tabs" aria-label="Active color">${Je.map(t=>`<button type="button" data-select-role="${t}"><span></span>${t}</button>`).join("")}</div>
  <div data-picker-surface="shared-wheel"><cp-wheel data-markers="[]"><div class="cp-wheel tk-shared-wheel" data-area data-cp-part="surface" role="group" tabindex="0" aria-label="Shared theme color wheel"></div></cp-wheel></div>
  <div data-picker-surface="area">${Bt}</div><div data-picker-surface="wheel">${Vt}</div>
  <p class="tk-editing" aria-live="polite"></p>
  <div data-picker-channel="h">${we("h","Hue")}</div><div data-picker-channel="v">${we("v","Brightness")}</div>
  ${Ot}<cp-input></cp-input><cp-mode><button type="button">Switch format</button></cp-mode>
</div></cp-provider></tk-picker>`,br=`<div class="tk-generator">
  <div class="tk-role-tabs" aria-label="Theme mode"><button type="button" data-tk-mode="system">System</button><button type="button" data-tk-mode="light">Light mode</button><button type="button" data-tk-mode="dark">Dark mode</button></div>
  <label class="tk-name">Theme name<input data-tk-name maxlength="200" /><small data-tk-name-suggestion></small></label>
  <tk-select><label class="cp-format">Saved themes<select><option value="" disabled>Custom theme</option></select></label></tk-select>
  ${Jt}
  <div class="tk-harmony"><label>Color harmony<select data-tk-harmony><option value="analogous">Analogous</option><option value="triadic">Triadic</option><option value="split-complementary">Split complementary</option></select></label><button type="button" data-tk-generate-harmony>Generate accent &amp; secondary</button></div>
  <label class="tk-background"><input type="checkbox" data-tk-background />Tint background with primary</label>
  <label class="tk-border"><span>Card radius</span><span class="tk-border-field"><input type="number" min="0" max="1000" step=".125" data-tk-border="radius" data-target="card" /><span aria-hidden="true">rem</span></span></label>
  <label class="tk-border"><span>Card border width</span><span class="tk-border-field"><input type="number" min="0" max="1000" step="1" data-tk-border="width" data-target="card" /><span aria-hidden="true">px</span></span></label>
  <details><summary>Export configuration</summary><tk-export format="json"><pre class="tk-export" aria-label="Theme configuration"></pre></tk-export></details>
</div>`;function ot(t,e={}){var m,b,d,u;const o=e.store??te(e),r=t.ownerDocument.createElement("tk-provider");r.className=`tk-scope ${e.className??""}`,r.setStore(o,e),r.innerHTML=br;for(const p of["radius","width"]){r.querySelectorAll(`[data-tk-border="${p}"]`).forEach(h=>h.closest("label").remove());const c=(e[p]??["card"]).map(h=>`<label class="tk-border"><span>${Io(p,h)}</span><span class="tk-border-field"><input type="number" min="0" max="1000" step="${p==="radius"?".125":"1"}" data-tk-border="${p}" data-target="${h}"><span aria-hidden="true">${Fo(p)}</span></span></label>`).join("");r.querySelector("details").insertAdjacentHTML("beforebegin",c)}e.backgroundControl===!1&&r.querySelector("[data-tk-background]").closest("label").remove(),((b=(m=e.picker)==null?void 0:m.roles)==null?void 0:b.length)===1&&(r.querySelector(".tk-harmony").remove(),r.querySelector("tk-select").setAttribute("hidden","")),r.querySelector("tk-picker").setAttribute("data-options",JSON.stringify(e.picker??{}));const s=r.querySelector("tk-select");s.setAttribute("data-themes",JSON.stringify(e.themes??[])),(d=e.themes)!=null&&d.length||s.setAttribute("hidden","");const i=s.querySelector("select");i.disabled=!((u=e.themes)!=null&&u.length);for(const p of e.themes??[]){const c=t.ownerDocument.createElement("option");c.value=p.id,c.textContent=p.name,i.append(c)}const l=()=>{var p;return(p=e.onChange)==null?void 0:p.call(e,j(o.getSnapshot()))};return r.addEventListener("theme-change",l),t.append(r),{element:r,store:o,getConfiguration:p=>j(o.getSnapshot(),p),destroy(){r.removeEventListener("theme-change",l),r.remove()}}}function Me(t="primary",e={}){if(!Je.includes(t)||e.shape&&!["square","circle","joined"].includes(e.shape))throw new TypeError("Invalid palette role or shape");const o=a=>String(a).replace(/[&<>"']/g,s=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[s]),r=e.classes??{};return`<tk-palette role-name="${t}"><div class="tk-palette ${o(r.root??"")}" data-shape="${e.shape??"square"}" aria-label="${t} shades">${Rt.map(a=>{var s,i;return`<div data-palette-part="item" class="${o(r.item??"")} ${o(((s=e.shadeClasses)==null?void 0:s[a])??"")}"><span data-palette-part="label" class="${o(r.label??"")}">${o(((i=e.labels)==null?void 0:i[a])??a)}</span><div data-palette-part="swatch" data-shade="${a}" class="tk-shade ${o(r.swatch??"")}"></div></div>`}).join("")}</div></tk-palette>`}function gr(t){var b;t.innerHTML='<div class="editing-lab"><div><h3>Draft theme</h3><div data-editor></div><div class="lab-options"><label>Recent themes<select data-theme-list="recent"></select></label><label>Favorite themes<select data-theme-list="favorites"></select></label><label><input type="checkbox" data-lock>Lock accent during generation</label><label><input type="checkbox" data-live>Apply changes live</label></div><div class="recipe-actions"><button type="button" data-undo>Undo</button><button type="button" data-redo>Redo</button><button type="button" data-apply>Apply</button><button type="button" data-cancel>Cancel</button><button type="button" data-favorite>Favorite applied theme</button></div><p data-status role="status"></p></div><div class="lab-applied"><h3>Applied theme</h3><article data-applied class="recipe-preview"><h4>Project settings</h4><p>Changes appear here after Apply.</p><button type="button">Save changes</button></article><p data-contrast></p><details class="configuration"><summary>Tailwind CSS</summary><pre data-output class="recipe-output" tabindex="0"></pre><button type="button" data-copy>Copy Tailwind CSS</button><p data-copy-status aria-live="polite"></p></details></div></div>';const e=te({theme:U("#5268E0"),mode:"light",modeStorage:!1}),o=qt(e),r=Ht({storage:Nt("docs:themes"),favorites:[e.getSnapshot().theme]});r.load();const a=ot(t.querySelector("[data-editor]"),{store:o.store,modeStorage:!1});(b=a.element.querySelector("details"))==null||b.remove();const s=d=>t.querySelector("[data-"+d+"]"),i=()=>{const d=o.getSnapshot(),u=o.history.getSnapshot(),p=o.store.getSnapshot();s("undo").disabled=!u.canUndo,s("redo").disabled=!u.canRedo,s("apply").disabled=!d.dirty||d.conflict,s("cancel").disabled=!d.dirty&&!d.conflict;for(const g of t.querySelectorAll("[data-theme-list]")){const v=r.getSnapshot()[g.dataset.themeList];g.replaceChildren(new Option("Choose a theme",""));for(const C of v)g.add(new Option(C.name,C.id));g.disabled=!v.length}t.querySelector("[data-status]").textContent=d.conflict?"The applied theme changed. Cancel to load it.":d.dirty?"Unapplied changes":"Up to date",t.querySelector("[data-applied]").style.cssText=j(e.getSnapshot()).css;const c=p.theme.structure.userPreset.primary,h=Be(Fe(c.foreground),Ie(p.theme,"primary"));t.querySelector("[data-contrast]").textContent=`Primary text contrast: ${h.ratio.toFixed(2)}:1 · ${h.aa?"AA passes":"AA fails"}`,t.querySelector("[data-output]").textContent=j(p).tailwind};s("undo").onclick=o.history.undo,s("redo").onclick=o.history.redo,s("apply").onclick=()=>{o.apply(),r.remember(e.getSnapshot().theme)},s("favorite").onclick=()=>r.toggleFavorite(e.getSnapshot().theme);for(const d of t.querySelectorAll("[data-theme-list]"))d.onchange=()=>{const u=r.getSnapshot()[d.dataset.themeList].find(p=>p.id===d.value);u&&o.store.setTheme(u)};s("cancel").onclick=o.cancel,t.querySelector("[data-lock]").onchange=d=>o.setLocked("accent",d.currentTarget.checked),t.querySelector("[data-live]").onchange=d=>o.setLive(d.currentTarget.checked),s("copy").onclick=async()=>{try{await navigator.clipboard.writeText(j(o.store.getSnapshot()).tailwind),t.querySelector("[data-copy-status]").textContent="Tailwind CSS copied."}catch{t.querySelector("[data-copy-status]").textContent="Select the CSS and copy it with your keyboard."}};const l=[e.subscribe(i),o.store.subscribe(i),o.subscribe(i),o.history.subscribe(i),r.subscribe(i)],m=$e(t,o.history);return i(),()=>{l.forEach(d=>d()),m(),a.destroy(),o.destroy(),t.replaceChildren()}}function fr(t){t.innerHTML='<form class="color-form-lab"><div data-picker></div><div data-favorites></div><div data-recent></div><div class="recipe-actions"><button type="button" data-save>Save color</button><button type="button" data-favorite>Toggle favorite</button><button type="button" data-undo>Undo</button><button type="button" data-redo>Redo</button><button type="reset">Reset</button><button type="submit">Submit</button></div><p data-contrast></p><p>Submit reads <code>brandColor</code> from FormData. Reset restores the starting color.</p><output data-output class="recipe-output" aria-live="polite"></output></form>';const e=t.querySelector("form"),o=fe("#5268E080"),r=It(o),a=Qe({storage:Ft("docs:color-collection"),favorites:["#5268E0","#277D59","#C25D3D"]});a.load();const s=jt(t.querySelector("[data-picker]"),{store:o}),i=De(t.querySelector("[data-favorites]"),o,a,{kind:"favorites"}),l=De(t.querySelector("[data-recent]"),o,a),m=Do(e,o,{name:"brandColor",required:!0}),b=$e(e,r),d=c=>t.querySelector("[data-"+c+"]"),u=()=>{d("undo").disabled=!r.getSnapshot().canUndo,d("redo").disabled=!r.getSnapshot().canRedo;const c=Be(o.getSnapshot().value,"#FFFFFF");t.querySelector("[data-contrast]").textContent=`Text on white: ${c.ratio.toFixed(2)}:1 · ${c.aa?"AA passes":"AA fails"}`};d("undo").onclick=r.undo,d("redo").onclick=r.redo,d("save").onclick=()=>a.remember(o.getSnapshot().value),d("favorite").onclick=()=>a.toggleFavorite(o.getSnapshot().value),e.onsubmit=c=>{c.preventDefault(),t.querySelector("[data-output]").textContent=JSON.stringify(Object.fromEntries(new FormData(e)),null,2)};const p=[o.subscribe(u),r.subscribe(u)];return u(),()=>{p.forEach(c=>c()),m.destroy(),b(),i.destroy(),l.destroy(),s.destroy(),r.destroy(),t.replaceChildren()}}const vr=`.recipe { display: grid; gap: 24px; max-width: 760px; }
.recipe .tk-scope { display: grid; gap: 16px; min-width: 0; }
.recipe-actions { display: flex; flex-wrap: wrap; gap: 8px; }
.recipe-actions button { padding: 8px 14px; cursor: pointer; }
.recipe-actions button:disabled { cursor: default; opacity: .45; }
.recipe-preview { background: hsl(var(--background)); color: hsl(var(--foreground)); padding: 24px; border-radius: var(--border-radius-card); border: var(--border-width-card) solid currentColor; }
.recipe-preview button { background: hsl(var(--primary)); color: hsl(var(--primary-foreground)); padding: 10px 16px; border: 0; }
.recipe-output { overflow: auto; max-height: 260px; white-space: pre-wrap; }
.recipe input, .recipe select { max-width: 100%; }
.recipe .cp-area { height: 180px; }
.recipe .cp-swatch { width: 28px; height: 28px; }
.recipe label:not([class]) { display: flex; gap: 8px; align-items: center; }`;function yr(t){return t==="theme-studio"?`import { createThemeStore, createThemeEditor, generateTheme, themeConfiguration, themeColor, createThemeCollection, browserThemeCollectionStorage } from '@salyra-ui/theme-studio';
import { mountHistory, colorContrast, channelsToHex } from '@salyra-ui/color-picker';

export function createDemo() {
  const target = createThemeStore({ theme: generateTheme('#5268E0'), mode: 'light', modeStorage: false });
  const editor = createThemeEditor(target);
  const collection = createThemeCollection({storage:browserThemeCollectionStorage('example:themes'),favorites:[target.getSnapshot().theme]});
  const read = () => {
    const draft = editor.store.getSnapshot();
    const primary = draft.theme.structure.userPreset.primary;
    return { collection: collection.getSnapshot(), session: editor.getSnapshot(), history: editor.history.getSnapshot(),
      contrast: colorContrast(channelsToHex(primary.foreground), themeColor(draft.theme, 'primary')),
      tailwind: themeConfiguration(draft).tailwind };
  };
  let state = read();
  const listeners = new Set<() => void>();
  const update = () => { state = read(); listeners.forEach(fn => fn()); };
  const stops = [target.subscribe(update), editor.store.subscribe(update), editor.subscribe(update), editor.history.subscribe(update), collection.subscribe(update)];
  return {
    target, editor, collection,
    apply() { editor.apply(); collection.remember(target.getSnapshot().theme); },
    getSnapshot: () => state,
    subscribe(fn: () => void) { listeners.add(fn); return () => { listeners.delete(fn); }; },
    mount(root: HTMLElement) { collection.load(); return mountHistory(root, editor.history); },
    destroy() { stops.forEach(stop => stop()); editor.destroy(); listeners.clear(); },
  };
}`:`import { createColorStore, createColorHistory, createColorCollection, browserColorStorage, bindColorForm, mountHistory, colorContrast } from '@salyra-ui/color-picker';

export function createDemo() {
  const store = createColorStore('#5268E080');
  const history = createColorHistory(store);
  const collection = createColorCollection({ storage: browserColorStorage('example:colors'), favorites: ['#5268E0','#277D59','#C25D3D'] });
  let submitted = '';
  const read = () => ({ color: store.getSnapshot(), history: history.getSnapshot(), collection: collection.getSnapshot(), contrast: colorContrast(store.getSnapshot().value, '#FFFFFF'), submitted });
  let state = read();
  const listeners = new Set<() => void>();
  const update = () => { state = read(); listeners.forEach(fn => fn()); };
  const stops = [store.subscribe(update), history.subscribe(update), collection.subscribe(update)];
  return {
    store, history, collection, getSnapshot: () => state,
    subscribe(fn: () => void) { listeners.add(fn); return () => { listeners.delete(fn); }; },
    submit(form: HTMLFormElement) { submitted = JSON.stringify(Object.fromEntries(new FormData(form)), null, 2); update(); },
    mount(form: HTMLFormElement) {
      collection.load();
      const field = bindColorForm(form, store, { name: 'brandColor', format: 'hex', required: true });
      const detach = mountHistory(form, history);
      return () => { field.destroy(); detach(); };
    },
    destroy() { stops.forEach(stop => stop()); history.destroy(); listeners.clear(); },
  };
}`}const kr=`<ThemeProvider store={demo.editor.store} modeStorage={false}>
        <ThemePicker view="shared-wheel" /><ThemeName /><ThemeRadius target="card" /><ThemeBorderWidth target="card" />
        <ThemeHarmony /><ThemeBackground />
        <ThemeSelect themes={view.collection.recent} label="Recent themes" /><ThemeSelect themes={view.collection.favorites} label="Favorite themes" />
      </ThemeProvider>
      <label><input type="checkbox" checked={view.session.locked.includes('accent')} onChange={e => demo.editor.setLocked('accent', e.target.checked)} />Lock accent during generation</label>
      <label><input type="checkbox" checked={view.session.live} onChange={e => demo.editor.setLive(e.target.checked)} />Apply changes live</label>
      <div className="recipe-actions">
        <button type="button" disabled={!view.history.canUndo} onClick={demo.editor.history.undo}>Undo</button>
        <button type="button" disabled={!view.history.canRedo} onClick={demo.editor.history.redo}>Redo</button>
        <button type="button" disabled={!view.session.dirty || view.session.conflict} onClick={() => demo.apply()}>Apply</button>
        <button type="button" disabled={!view.session.dirty && !view.session.conflict} onClick={demo.editor.cancel}>Cancel</button>
        <button type="button" onClick={() => demo.collection.toggleFavorite(demo.target.getSnapshot().theme)}>Favorite applied theme</button>
      </div>
      <p role="status">{view.session.conflict ? 'The applied theme changed. Cancel to load it.' : view.session.dirty ? 'Unapplied changes' : 'Up to date'}</p>
      <p>Primary text contrast: {view.contrast.ratio.toFixed(2)}:1 · {view.contrast.aa ? 'AA passes' : 'AA fails'}</p>
      <ThemeProvider store={demo.target} modeStorage={false}><article className="recipe-preview"><h2>Applied theme</h2><button type="button">Example button</button></article></ThemeProvider>
      <details><summary>Tailwind CSS</summary><pre className="recipe-output">{view.tailwind}</pre></details>`,Sr=`<ColorProvider store={demo.store}><ColorArea /><ColorSlider channel="h" /><ColorSlider channel="alpha" /><ColorInput /><ColorCollection collection={demo.collection} kind="favorites" label="Favorite colors" /><ColorCollection collection={demo.collection} /></ColorProvider>
      <div className="recipe-actions"><button type="button" onClick={() => demo.collection.remember(view.color.value)}>Save color</button><button type="button" onClick={() => demo.collection.toggleFavorite(view.color.value)}>Toggle favorite</button><button type="button" disabled={!view.history.canUndo} onClick={demo.history.undo}>Undo</button><button type="button" disabled={!view.history.canRedo} onClick={demo.history.redo}>Redo</button><button type="reset">Reset</button><button type="submit">Submit</button></div>
      <p>Text on white: {view.contrast.ratio.toFixed(2)}:1 · {view.contrast.aa ? 'AA passes' : 'AA fails'}</p>
      <output className="recipe-output" aria-live="polite">{view.submitted}</output>`;function rt(t,e){const o=t==="theme-studio",r=o?"ThemeProvider, ThemePicker, ThemeName, ThemeRadius, ThemeBorderWidth, ThemeHarmony, ThemeBackground, ThemeSelect":"ColorProvider, ColorArea, ColorSlider, ColorInput, ColorCollection",a=o?"div":"form",s=o?kr:Sr;if(e==="React")return`import { useEffect, useRef, useState, useSyncExternalStore } from 'react';
import { ${r} } from '@salyra-ui/${t}/react';
import '@salyra-ui/${t}/styles.min.css';
import './recipe.css';
import { createDemo } from './controller';
export default function App() {
  const [demo] = useState(createDemo);
  const view = useSyncExternalStore(demo.subscribe, demo.getSnapshot, demo.getSnapshot);
  const root = useRef<${o?"HTMLDivElement":"HTMLFormElement"}>(null), lifecycle = useRef(0);
  useEffect(() => {
    const lease = ++lifecycle.current, detach = demo.mount(root.current!);
    return () => { detach(); queueMicrotask(() => { if (lifecycle.current === lease) demo.destroy(); }); };
  }, [demo]);
  return <${a} ref={root} className="recipe"${o?"":" onSubmit={e => { e.preventDefault(); demo.submit(e.currentTarget); }}"}>
      ${s}
    </${a}>;
}`;let i=s.replaceAll("className=","class=").replaceAll("modeStorage={false}","options={{ modeStorage: false }}");if(e==="Svelte")return i=i.replaceAll("onChange=","onchange=").replaceAll("onClick=","onclick=").replace("checked={view.session.locked.includes('accent')} onchange={e => demo.editor.setLocked('accent', e.target.checked)}","checked={view.session.locked.includes('accent')} onchange={e => demo.editor.setLocked('accent', e.currentTarget.checked)}").replace("checked={view.session.live} onchange={e => demo.editor.setLive(e.target.checked)}","checked={view.session.live} onchange={e => demo.editor.setLive(e.currentTarget.checked)}"),`<script lang="ts">
  import { onMount } from 'svelte';
  import { ${r} } from '@salyra-ui/${t}/svelte';
  import '@salyra-ui/${t}/styles.min.css';
  import './recipe.css';
  import { createDemo } from './controller';
  const demo = createDemo();
  let root: ${o?"HTMLDivElement":"HTMLFormElement"}, view = $state(demo.getSnapshot());
  onMount(() => { const stop = demo.subscribe(() => view = demo.getSnapshot()), detach = demo.mount(root); return () => { stop(); detach(); demo.destroy(); }; });
<\/script>
<${a} bind:this={root} class="recipe"${o?"":" onsubmit={e => { e.preventDefault(); demo.submit(e.currentTarget); }}"}>
${i}
</${a}>`;if(e==="Vue")return i=i.replaceAll("store={demo.editor.store}",':store="demo.editor.store"').replaceAll("store={demo.target}",':store="demo.target"').replaceAll("store={demo.store}",':store="demo.store"').replaceAll("options={{ modeStorage: false }}",':options="{ modeStorage: false }"').replaceAll("collection={demo.collection}",':collection="demo.collection"'),i=i.replace(/themes=\{([^}]+)\}/g,':themes="$1"'),i=i.replace(/disabled=\{([^}]+)\}/g,':disabled="$1"').replace(/checked=\{([^}]+)\}/g,':checked="$1"'),i=i.replace(/onClick=\{([^}]+)\}/g,(d,u)=>`@click="${u.replace(/^\(\) => /,"")}"`).replace(/onChange=\{e => ([^}]+)\}/g,(d,u)=>`@change="${u.replaceAll("e.target.checked","($event.target as HTMLInputElement).checked")}"`).replace(/\{(view\.[^}\n]+)\}/g,"{{ $1 }}"),`<script setup lang="ts">
import { shallowRef, ref, onMounted, onBeforeUnmount } from 'vue';
import { ${r} } from '@salyra-ui/${t}/vue';
import '@salyra-ui/${t}/styles.min.css';
import './recipe.css';
import { createDemo } from './controller';
const demo = createDemo(), view = shallowRef(demo.getSnapshot()), root = ref<${o?"HTMLDivElement":"HTMLFormElement"}>();
const stop = demo.subscribe(() => view.value = demo.getSnapshot());
let detach: (() => void) | undefined;
onMounted(() => { detach = demo.mount(root.value!); });
onBeforeUnmount(() => { stop(); detach?.(); demo.destroy(); });
<\/script>
<template><${a} ref="root" class="recipe"${o?"":' @submit.prevent="demo.submit(root!)"'}>
${i}
</${a}></template>`;if(e==="Angular"){i=i.replaceAll("options={{ modeStorage: false }}",'[options]="{ modeStorage: false }"').replace(/store=\{([^}]+)\}/g,'[store]="$1"').replace(/themes=\{([^}]+)\}/g,'[themes]="$1"').replace(/collection=\{([^}]+)\}/g,'[collection]="$1"'),i=i.replace(/disabled=\{([^}]+)\}/g,'[disabled]="$1"').replace(/checked=\{([^}]+)\}/g,'[checked]="$1"'),i=i.replace(/onClick=\{([^}]+)\}/g,(d,u)=>`(click)="${u.startsWith("() => ")?u.slice(6):u+"()"}"`).replace(/onChange=\{e => ([^}]+)\}/g,(d,u)=>`(change)="${u.replaceAll("e.target.checked","checked($event)")}"`).replace(/\{(view\.[^}\n]+)\}/g,"{{ $1 }}").replace(/view\./g,"view().");for(const d of r.split(", "))i=i.replaceAll(`<${d}`,`<${d.replace(/([a-z])([A-Z])/g,"$1-$2").toLowerCase().replace("theme-","tk-").replace("color-","cp-")}`).replaceAll(`</${d}>`,`</${d.replace(/([a-z])([A-Z])/g,"$1-$2").toLowerCase().replace("theme-","tk-").replace("color-","cp-")}>`);return`import { Component, ElementRef, afterNextRender, DestroyRef, inject, signal } from '@angular/core';
import { ${r} } from '@salyra-ui/${t}/angular';
import { createDemo } from './controller';
@Component({ selector: 'app-root', standalone: true, imports: [${r}], template: \`<${a} #root class="recipe"${o?"":' (submit)="$event.preventDefault(); demo.submit(root)"'}>${i}</${a}>\` })
export class App {
  readonly demo = createDemo(); readonly view = signal(this.demo.getSnapshot());
  readonly element: ElementRef<HTMLElement> = inject(ElementRef);
  checked(event: Event) { return (event.target as HTMLInputElement).checked; }
  constructor() { const stop = this.demo.subscribe(() => this.view.set(this.demo.getSnapshot())); let detach: (() => void) | undefined;
    afterNextRender(() => { detach = this.demo.mount(this.element.nativeElement.querySelector<${o?"HTMLDivElement":"HTMLFormElement"}>('.recipe')!); });
    inject(DestroyRef).onDestroy(() => { stop(); detach?.(); this.demo.destroy(); });
  }
}`}const l=o?"div":"form",m=o?'<h2>Draft theme</h2><div data-editor></div><label>Recent themes<select data-theme-list="recent"></select></label><label>Favorite themes<select data-theme-list="favorites"></select></label><button type="button" data-favorite>Favorite applied theme</button><label><input type="checkbox" data-lock>Lock accent during generation</label><label><input type="checkbox" data-live>Apply changes live</label><div class="recipe-actions"><button type="button" data-undo>Undo</button><button type="button" data-redo>Redo</button><button type="button" data-apply>Apply</button><button type="button" data-cancel>Cancel</button></div><p data-status role="status"></p><div data-applied class="recipe-preview"><h2>Applied theme</h2><button type="button">Example button</button></div><details><summary>Tailwind CSS</summary><pre data-output class="recipe-output"></pre></details>':'<div data-picker></div><div data-favorites></div><div data-recent></div><div class="recipe-actions"><button type="button" data-save>Save color</button><button type="button" data-favorite>Toggle favorite</button><button type="button" data-undo>Undo</button><button type="button" data-redo>Redo</button><button type="reset">Reset</button><button type="submit">Submit</button></div><output data-output class="recipe-output" aria-live="polite"></output>',b=Tr(t);if(e==="Astro"){const d=o?`import { generateTheme, createThemeStore, themeConfiguration } from '@salyra-ui/theme-studio';
${["ThemeProvider","ThemePicker","ThemeName","ThemeRadius","ThemeBorderWidth","ThemeHarmony","ThemeBackground"].map(c=>`import ${c} from '@salyra-ui/theme-studio/astro/${c}.astro';`).join(`
`)}
const theme = generateTheme('#5268E0');
const appliedCss = themeConfiguration(createThemeStore({ theme, mode: 'light', modeStorage: false }).getSnapshot()).css;`:`import { createColorStore } from '@salyra-ui/color-picker';
${["ColorProvider","ColorArea","ColorSlider","ColorInput"].map(c=>`import ${c} from '@salyra-ui/color-picker/astro/${c}.astro';`).join(`
`)}
const color = createColorStore('#5268E080').getSnapshot();`,u=o?m.replace("<div data-editor></div>",'<div data-editor><ThemeProvider {theme} mode="light" modeStorage={false}><ThemePicker {theme} /><ThemeName {theme} /><ThemeRadius {theme} target="card" /><ThemeBorderWidth {theme} target="card" /><ThemeHarmony /><ThemeBackground {theme} /></ThemeProvider></div>').replace('<div data-applied class="recipe-preview">','<div data-applied class="recipe-preview" style={appliedCss}>'):m.replace("<div data-picker></div>",'<div data-picker><ColorProvider value="#5268E080"><ColorArea value="#5268E080" /><ColorSlider channel="h" value={color.h} /><ColorSlider channel="alpha" value={color.alpha * 100} /><ColorInput value="#5268E080" /></ColorProvider></div>'),p=b.replace(o?"const picker = mountThemeKit(root.querySelector<HTMLElement>('[data-editor]')!, { store: demo.editor.store, modeStorage: false });":"const picker = mountColorPicker(root.querySelector<HTMLElement>('[data-picker]')!, { store: demo.store });",o?"const provider = root.querySelector<ThemeRootElement>('[data-editor] tk-root')!; provider.setStore(demo.editor.store, {modeStorage:false}); const picker = {destroy: () => provider.remove()};":"const provider = root.querySelector<ColorProviderElement>('[data-picker] cp-provider')!; provider.setStore(demo.store); const picker = {destroy: () => provider.remove()};");return`---
${d}
import '@salyra-ui/${t}/styles.min.css';
import './recipe.css';
---
<${l} class="recipe" data-recipe="${t}">${u}<p data-contrast></p></${l}>
<script>
import type { ${o?"ThemeRootElement":"ColorProviderElement"} } from '@salyra-ui/${t}/astro/client';
${p}
<\/script>`}return`<${l} class="recipe" data-recipe="${t}">${m}<p data-contrast></p></${l}>
<script type="module">
${b}
<\/script>`}function Tr(t){const e=t==="theme-studio";return`import { ${e?"mountThemeKit, themeConfiguration":"mountColorPicker, mountColorCollection"} } from '@salyra-ui/${t}/vanilla';
import { createDemo } from './controller';
import '@salyra-ui/${t}/styles.min.css';
import './recipe.css';
for (const root of document.querySelectorAll<${e?"HTMLDivElement":"HTMLFormElement"}>('[data-recipe="${t}"]')) {
  const demo = createDemo();
  const button = (name: string) => root.querySelector<HTMLButtonElement>('[data-' + name + ']')!;
  const picker = ${e?"mountThemeKit(root.querySelector<HTMLElement>('[data-editor]')!, { store: demo.editor.store, modeStorage: false })":"mountColorPicker(root.querySelector<HTMLElement>('[data-picker]')!, { store: demo.store })"};
  ${e?`root.querySelector('[data-editor] details')?.remove();
  button('apply').onclick = demo.apply;
  button('favorite').onclick = () => demo.collection.toggleFavorite(demo.target.getSnapshot().theme);
  for(const list of root.querySelectorAll<HTMLSelectElement>('[data-theme-list]')) list.onchange = () => { const theme = demo.collection.getSnapshot()[list.dataset.themeList as 'recent' | 'favorites'].find(theme => theme.id === list.value); if(theme) demo.editor.store.setTheme(theme); };  button('cancel').onclick = demo.editor.cancel;
  root.querySelector<HTMLInputElement>('[data-lock]')!.onchange = e => demo.editor.setLocked('accent', (e.currentTarget as HTMLInputElement).checked);
  root.querySelector<HTMLInputElement>('[data-live]')!.onchange = e => demo.editor.setLive((e.currentTarget as HTMLInputElement).checked);`:`const favorites = mountColorCollection(root.querySelector<HTMLElement>('[data-favorites]')!, demo.store, demo.collection, { kind: 'favorites' });
  const recent = mountColorCollection(root.querySelector<HTMLElement>('[data-recent]')!, demo.store, demo.collection);
  button('save').onclick = () => demo.collection.remember(demo.store.getSnapshot().value);
  button('favorite').onclick = () => demo.collection.toggleFavorite(demo.store.getSnapshot().value);
  root.onsubmit = e => { e.preventDefault(); demo.submit(root); };`}
  button('undo').onclick = demo.${e?"editor.":""}history.undo; button('redo').onclick = demo.${e?"editor.":""}history.redo;
  const update = () => {
    const state = demo.getSnapshot();
    button('undo').disabled = !state.history.canUndo; button('redo').disabled = !state.history.canRedo;
    ${e?`root.querySelector('[data-editor] details')?.remove();
  button('apply').disabled = !state.session.dirty || state.session.conflict;
    button('cancel').disabled = !state.session.dirty && !state.session.conflict;
    for(const list of root.querySelectorAll<HTMLSelectElement>('[data-theme-list]')) {
      list.replaceChildren(new Option('Choose a theme',''));
      const themes = state.collection[list.dataset.themeList as 'recent' | 'favorites'];
      for(const theme of themes) list.add(new Option(theme.name,theme.id));
      list.disabled = !themes.length;
    }
    root.querySelector('[data-status]')!.textContent = state.session.conflict ? 'The applied theme changed. Cancel to load it.' : state.session.dirty ? 'Unapplied changes' : 'Up to date';
    root.querySelector<HTMLElement>('[data-applied]')!.style.cssText = themeConfiguration(demo.target.getSnapshot()).css;`:""}
    root.querySelector('[data-output]')!.textContent = state.${e?"tailwind":"submitted"};
    root.querySelector('[data-contrast]')!.textContent = 'Text contrast: ' + state.contrast.ratio.toFixed(2) + ':1 · ' + (state.contrast.aa ? 'AA passes' : 'AA fails');
  };
  const stop = demo.subscribe(update), detach = demo.mount(root); update();
  const destroy = () => { stop(); detach(); picker.destroy(); ${e?"":"favorites.destroy(); recent.destroy();"} demo.destroy(); };
  window.addEventListener('pagehide', destroy, { once: true });
  document.addEventListener('astro:before-swap', destroy, { once: true });
}`}function Cr(t,e){const o=rt(t,e),s=[{name:{React:"App.tsx",Svelte:"App.svelte",Vue:"App.vue",Angular:"app.ts",Astro:"index.astro",Vanilla:"index.html"}[e],code:o},{name:"controller.ts",code:yr(t)},{name:"recipe.css",code:vr}];if(e==="Vanilla"){const b=o.match(/<script type="module">([\s\S]+)<\/script>/)[1];s[0].code=o.replace(/<script type="module">[\s\S]+<\/script>/,'<script type="module" src="/main.ts"><\/script>'),s.push({name:"main.ts",code:b})}const i={"@salyra-ui/color-picker":"^1.0.0",...t==="theme-studio"?{"@salyra-ui/theme-studio":"^1.0.0"}:{}},l={typescript:"~5.8.3",vite:"^6.1.0"},m={dev:"vite",build:"vite build"};return e==="React"&&(Object.assign(i,{react:"^18.3.1","react-dom":"^18.3.1"}),Object.assign(l,{"@vitejs/plugin-react":"^4.3.0","@types/react":"^18.3.0","@types/react-dom":"^18.3.0"}),s.push({name:"main.tsx",code:`import { createRoot } from 'react-dom/client';
import { StrictMode } from 'react';
import App from './App';
createRoot(document.getElementById('app')!).render(<StrictMode><App /></StrictMode>);`},{name:"vite.config.ts",code:`import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
export default defineConfig({ plugins: [react()] });`})),e==="Svelte"&&(s.push({name:"svelte.config.js",code:"export default {};"}),Object.assign(i,{svelte:"^5.20.0"}),Object.assign(l,{"@sveltejs/vite-plugin-svelte":"^5.0.0"}),s.push({name:"main.ts",code:`import { mount } from 'svelte';
import App from './App.svelte';
mount(App, {target:document.getElementById('app')!});`},{name:"vite.config.ts",code:`import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';
export default defineConfig({ plugins: [svelte()] });`})),e==="Vue"&&(Object.assign(i,{vue:"^3.5.0"}),Object.assign(l,{"@vitejs/plugin-vue":"^5.2.0"}),s.push({name:"main.ts",code:`import { createApp } from 'vue';
import App from './App.vue';
createApp(App).mount('#app');`},{name:"vite.config.ts",code:`import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
export default defineConfig({ plugins: [vue()] });`})),e==="Angular"&&(s[2].code=`@import '@salyra-ui/${t}/styles.min.css';
`+s[2].code,Object.assign(i,{"@angular/core":"~19.2.0","@angular/common":"~19.2.0","@angular/compiler":"~19.2.0","@angular/platform-browser":"~19.2.0","zone.js":"~0.15.0",rxjs:"^7.8.1"}),Object.assign(l,{"@angular/cli":"~19.2.0","@angular/compiler-cli":"~19.2.0","@angular-devkit/build-angular":"~19.2.0"}),delete l.vite,m.dev="ng serve",m.build="ng build",s.push({name:"main.ts",code:`import 'zone.js';
import { bootstrapApplication } from '@angular/platform-browser';
import { App } from './app';
bootstrapApplication(App).catch(console.error);`},{name:"angular.json",code:JSON.stringify({version:1,projects:{example:{projectType:"application",root:"",sourceRoot:"",architect:{build:{builder:"@angular-devkit/build-angular:application",options:{browser:"main.ts",index:"index.html",tsConfig:"tsconfig.json",outputPath:"dist",styles:["recipe.css"]}},serve:{builder:"@angular-devkit/build-angular:dev-server",options:{buildTarget:"example:build"}}}}}},null,2)})),e==="Astro"?(i.astro="^5.0.0",delete l.vite,m.dev="astro dev",m.build="astro build",s[0].name="src/pages/index.astro",s[0].code=o.replaceAll("'./controller'","'../controller'").replaceAll("'./recipe.css'","'../recipe.css'"),s[1].name="src/controller.ts",s[2].name="src/recipe.css",s.push({name:"astro.config.mjs",code:`import { defineConfig } from 'astro/config';
export default defineConfig({});`})):e!=="Vanilla"&&s.push({name:"index.html",code:`<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Salyra UI example</title></head><body>${e==="Angular"?"<app-root></app-root>":'<div id="app"></div><script type="module" src="/main.'+(e==="React"?"tsx":"ts")+'"><\/script>'}</body></html>`}),s.push({name:"package.json",code:JSON.stringify({name:`salyra-${t}-${e.toLowerCase()}-example`,private:!0,type:"module",scripts:m,dependencies:i,devDependencies:l},null,2)}),s.push({name:"tsconfig.json",code:JSON.stringify({compilerOptions:{target:"ES2022",module:"ESNext",moduleResolution:"Bundler",strict:!0,skipLibCheck:!0,jsx:"react-jsx",esModuleInterop:!0,experimentalDecorators:!0,useDefineForClassFields:!1,lib:["ES2022","DOM","DOM.Iterable"]},include:["**/*.ts","**/*.tsx","**/*.svelte","**/*.vue"],angularCompilerOptions:{strictTemplates:!0}},null,2)}),s.push({name:"README.md",code:`# ${t} / ${e}

Run npm install, then npm run dev.

The controller holds shared state. App uses native ${e} components.

${t==="theme-studio"?"Edits stay in a draft until Apply. Cancel loads the applied theme. Undo/Redo tracks edits. Lock accent excludes it from generation. Exported Tailwind CSS contains only registered editor fields. Import the exported stylesheet after Tailwind.":"Submit reads the real form field. Reset restores the starting RGBA color. Save color adds a recent swatch. Favorite colors are optional and persist through the provided storage adapter."}
`}),s}function wr(t){const e=new TextEncoder,o=[],r=[];let a=0;const s=u=>{let p=4294967295;for(const c of u){p^=c;for(let h=0;h<8;h++)p=p>>>1^(p&1?3988292384:0)}return(p^4294967295)>>>0};for(const u of t){const p=e.encode(u.name),c=e.encode(u.code),h=s(c),g=new Uint8Array(30+p.length),v=new DataView(g.buffer);v.setUint32(0,67324752,!0),v.setUint16(4,20,!0),v.setUint16(6,2048,!0),v.setUint32(14,h,!0),v.setUint32(18,c.length,!0),v.setUint32(22,c.length,!0),v.setUint16(26,p.length,!0),g.set(p,30),o.push(g,c);const C=new Uint8Array(46+p.length),$=new DataView(C.buffer);$.setUint32(0,33639248,!0),$.setUint16(4,20,!0),$.setUint16(6,20,!0),$.setUint16(8,2048,!0),$.setUint32(16,h,!0),$.setUint32(20,c.length,!0),$.setUint32(24,c.length,!0),$.setUint16(28,p.length,!0),$.setUint32(42,a,!0),C.set(p,46),r.push(C),a+=g.length+c.length}const i=r.reduce((u,p)=>u+p.length,0),l=new Uint8Array(22),m=new DataView(l.buffer);m.setUint32(0,101010256,!0),m.setUint16(8,t.length,!0),m.setUint16(10,t.length,!0),m.setUint32(12,i,!0),m.setUint32(16,a,!0);const b=new Uint8Array(a+i+l.length);let d=0;for(const u of[...o,...r,l])b.set(u,d),d+=u.length;return b}function xr(t,e){const o=wr(t),r=URL.createObjectURL(new Blob([o],{type:"application/zip"})),a=document.createElement("a");a.href=r,a.download=e+".zip",a.click(),setTimeout(()=>URL.revokeObjectURL(r),1e3)}function Kt(t,e,o="Picker"){if(e==="Vanilla"){const a=[...t.matchAll(/<script src="[^"]+"><\/script>\n?/g)].map(s=>s[0]).join("");t=t.replace(/<script src="[^"]+"><\/script>\n?/g,""),t=t.replace("<script>",`${a}<script>`)}t=$r(t);const r={React:"Picker.tsx",Svelte:"Picker.svelte",Vue:"Picker.vue",Angular:"picker.component.ts",Astro:"Picker.astro",Vanilla:"index.html"}[e].replace("Picker",o).replace("picker",o.replace(/([a-z])([A-Z])/g,"$1-$2").toLowerCase());if(e==="React"||e==="Angular"){const a=/\/\* (?:Add to your stylesheet:|In your global stylesheet:|Global stylesheet:?) \*\//,s=t.match(a);if((s==null?void 0:s.index)!==void 0)return[{name:r,code:t.slice(0,s.index).trim()},{name:"styles.css",code:t.slice(s.index+s[0].length).trim()}]}return[{name:r,code:t}]}function $r(t){return t.replace(/([ \t]*)import \{ ([^}\n]{70,}) \} from/g,(e,o,r)=>`${o}import {
${String(r).split(", ").map(a=>`${o}  ${a},`).join(`
`)}
${o}} from`).replaceAll("/><Color",`/>
    <Color`).replaceAll("/><Theme",`/>
    <Theme`)}const Xt=["React","Svelte","Vue","Angular","Astro","Vanilla"],at=[{id:"rectangle",title:"Rectangle",description:"Drag to adjust saturation and brightness. The sliders below change hue and opacity."},{id:"wheel",title:"Wheel",description:"Pick a hue around the wheel, then move inward to reduce saturation. Adjust brightness and opacity with the sliders."},{id:"channels",title:"Channel inputs",description:"Enter each channel separately. Change the format to switch between HEX, RGB, HSL, HSV, OKLCH and OKLab."},{id:"custom",title:"Custom controls",description:"Change the label inside the dot, the control color and the track size. Copy the updated component and styles."}];at.push({id:"form",title:"Forms & saved colors",description:"Submit the selected color, reset the form, undo edits and keep recent or favorite swatches."});at.push({id:"disabled",title:"Disabled",description:"A disabled picker keeps its color visible and blocks editing. You can still update it from the store."});const st=[{id:"shared",title:"Shared wheel",description:"Select a marker to edit primary, secondary or accent. Brightness and the channel fields follow the selected color."},{id:"rectangle",title:"Separate role editing",description:"Choose a color role above the rectangle. Editing it keeps the other two colors unchanged."},{id:"single",title:"Primary only",description:"Edit primary with a single dot. The JSON and CSS contain only the primary palette."},{id:"geometry",title:"Radius & borders",description:"Choose which radius and border width fields to include. Only the enabled fields appear in the editor and its export."},{id:"presets",title:"Presets & appearance",description:"Choose a saved theme and an appearance setting. The appearance setting is remembered after a refresh."},{id:"custom",title:"Custom generator",description:"Give the editor your own labels, colors and classes. The appearance buttons show how to replace the default text."}];st.push({id:"editing",title:"Draft & Apply",description:"Edit a draft, undo changes, lock accent during generation and apply the result to a separate preview."});st.push({id:"palette",title:"Shade swatches",description:"Show the generated shades as squares, circles or a joined strip. Change the labels and classes without replacing the theme colors."},{id:"disabled",title:"Disabled",description:"Disable the editor while keeping its values and generated shades visible. Programmatic theme updates still work."});function re(t,e){return`@salyra-ui/${t}/${e.toLowerCase()}`}function B(t){return`${t.split("/").slice(0,2).join("/")}/styles.min.css`}const de=`.custom-picker {
  --cp-thumb-size: 22px;
  --cp-thumb-radius: 0;
  --cp-track-height: 12px;
  --cp-track-radius: 0;
}
.custom-picker [data-cp-part="thumb-text"] { font-size: 10px; }`;function Er(t,e){const o=re("color-picker",t),r=e==="wheel"?"ColorWheel":"ColorArea",a=[...e==="channels"?[]:[r],...e==="rectangle"||e==="custom"?["ColorSlider"]:["ColorSlider"],"ColorFormatSelect","ColorInput","ColorAlphaInput","ColorMode"],s=e==="custom",l=`${e==="channels"?"":`<${r}${s?` thumbText="C" classes={{ root: 'brand-surface', thumb: 'brand-thumb' }}`:""} />
    `}<ColorSlider channel="${e==="wheel"?"v":e==="channels"?"alpha":"h"}" />${e==="channels"?"":`
    <ColorSlider channel="alpha" />`}
    <ColorFormatSelect /><ColorInput /><ColorAlphaInput /><ColorMode />`,m=e==="channels"?"rgb":"hex",b=`ColorProvider, ${[...new Set(a)].join(", ")}, createColorStore`,d=`import '${B(o)}';`;if(t==="React")return`import { useState } from 'react';
import { ${b} } from '${o}';
${d}

export function Picker() {
  const [store] = useState(() => createColorStore('#5268E080', '${m}'));
  return <div${s?' className="picker-parts custom-picker"':' className="picker-parts"'}>
    <ColorProvider store={store} onChange={() => {
      const color = store.getColor();
      console.log(color.name, color.hex, color.hsl, color.formats);
    }}>
    ${l}
    </ColorProvider>
  </div>;
}${s?`

/* Add to your stylesheet: */
`+de:""}`;if(t==="Svelte")return`<script lang="ts">
  import { ${b} } from '${o}';
  ${d}
  const store = createColorStore('#5268E080', '${m}');
<\/script>

<div${s?' class="picker-parts custom-picker"':' class="picker-parts"'}>
  <ColorProvider {store} onChange={() => console.log(store.getColor())}>
    ${l}
  </ColorProvider>
</div>${s?`
<style>
`+de.replace('[data-cp-part="thumb-text"]',':global([data-cp-part="thumb-text"])')+`
</style>`:""}`;if(t==="Vue")return`<script setup lang="ts">
import { ${b} } from '${o}';
${d}
const store = createColorStore('#5268E080', '${m}');
<\/script>

<template>
  <div${s?' class="picker-parts custom-picker"':' class="picker-parts"'}>
  <ColorProvider :store="store" @change="console.log(store.getColor())">
    ${l.replace("classes={{ root: 'brand-surface', thumb: 'brand-thumb' }}",`:classes="{ root: 'brand-surface', thumb: 'brand-thumb' }"`)}
  </ColorProvider>
  </div>
</template>${s?`
<style>
`+de+`
</style>`:""}`;const u=l.replace("classes={{ root: 'brand-surface', thumb: 'brand-thumb' }}",`[classes]="{ root: 'brand-surface', thumb: 'brand-thumb' }"`).replace(/ColorArea/g,"cp-area").replace(/ColorWheel/g,"cp-wheel").replace(/ColorSlider/g,"cp-slider").replace(/ColorFormatSelect/g,"cp-format-select").replace(/ColorInput/g,"cp-input").replace(/ColorAlphaInput/g,"cp-alpha-input").replace(/ColorMode/g,"cp-mode");if(t==="Angular")return`import { Component } from '@angular/core';
import { ${b} } from '${o}';

@Component({
  selector: 'app-color-picker', standalone: true,
  imports: [ColorProvider, ${[...new Set(a)].join(", ")}],
  template: \`<div${s?' class="picker-parts custom-picker"':' class="picker-parts"'}>
  <cp-provider [store]="store" (colorChange)="changed()">
    ${u}
  </cp-provider></div>\`,
})
export class Picker {
  readonly store = createColorStore('#5268E080', '${m}');
  changed() { console.log(this.store.getColor()); }
}

/* In your global stylesheet: */
@import '${B(o)}';${s?`
`+de:""}`;if(t==="Astro"){const c=["ColorProvider",...new Set(a)],h=l.replace(/<(ColorArea|ColorWheel|ColorInput|ColorAlphaInput)(?=[ />])/g,"<$1 {value}").replace('<ColorSlider channel="h"','<ColorSlider value={state.h} channel="h"').replace('<ColorSlider channel="v"','<ColorSlider value={state.v} channel="v"').replaceAll('<ColorSlider channel="alpha"','<ColorSlider value={state.alpha * 100} channel="alpha"');return`---
import { createColorStore } from '${o}';
${c.map(g=>`import ${g} from '${o}/${g}.astro';`).join(`
`)}
${d}
const value = '#5268E080';
const state = createColorStore(value).getSnapshot();
---
<div${s?' class="picker-parts custom-picker"':' class="picker-parts"'}>
  <ColorProvider {value}>
    ${h}
  </ColorProvider>
</div>
<script>
  import type { ColorProviderElement } from '${o}/client';
  document.querySelector('cp-provider')?.addEventListener('color-change', event => {
    console.log((event.currentTarget as ColorProviderElement).store?.getColor());
  });
<\/script>${s?`
<style is:global>
`+de+`
</style>`:""}`}return`<link rel="stylesheet" href="/assets/color-picker.min.css">
<script src="/assets/color-picker.min.js"><\/script>
${nt(e)}
<script>
const store = ColorPicker.createColorStore('#5268E080', '${m}');
const provider = document.querySelector('cp-provider');
provider.setStore(store);
provider.addEventListener('color-change', () => console.log(store.getColor()));
<\/script>${s?`
<style>
`+de+`
</style>`:""}`}function nt(t){const e=t==="channels"?"":t==="wheel"?'<cp-wheel><div class="cp-wheel" data-area data-cp-part="surface" tabindex="0" role="group" aria-label="Hue and saturation wheel"><span data-cp-part="thumb"></span></div></cp-wheel>':`<cp-area><div class="cp-area" data-area data-cp-part="surface" tabindex="0" role="group" aria-label="Saturation and brightness"><span data-cp-part="thumb">${t==="custom"?'<span data-cp-part="thumb-text">C</span>':""}</span></div></cp-area>`,o=(r,a)=>`<cp-slider channel="${r}"><label class="cp-slider" data-channel="${r}">${a}<input type="range" min="0" max="${r==="h"?"359":"100"}"></label></cp-slider>`;return`<cp-provider value="#5268E080" class="picker-parts${t==="custom"?" custom-picker":""}">
  ${e}${e?`
  `+o(t==="wheel"?"v":"h",t==="wheel"?"Brightness":"Hue"):""}
  ${o("alpha","Alpha")}
  <cp-format-select><label class="cp-format">Format<select>${["hex","rgb","hsl","hsv","oklch","oklab"].map(r=>`<option value="${r}">${r.toUpperCase()}</option>`).join("")}</select></label></cp-format-select>
  <cp-input></cp-input>
  <cp-alpha-input><label class="cp-channel cp-alpha-input">Alpha<span class="cp-channel-field"><input type="number" min="0" max="100" step=".1"><span aria-hidden="true">%</span></span></label></cp-alpha-input>
  ${t==="custom"?'<cp-mode data-custom><button type="button"><span>Change <span data-color-format>HEX</span> format</span></button></cp-mode>':'<cp-mode><button type="button">Switch format</button></cp-mode>'}
  <cp-output format="json"><output hidden></output></cp-output>
</cp-provider>`}function Pr(t,e,o){var $,y;if(e==="custom")return Rr(t);const r=re("theme-studio",t),a=e==="rectangle"||e==="geometry"?"area":"wheel";let s=e==="presets"?["ThemeSelect","ThemeMode"]:["ThemeName","ThemeSelect","ThemePicker","ThemeHarmony","ThemeBackground","ThemeRadius","ThemeBorderWidth","ThemeMode","ThemeExport","ThemePalette"];const i=["system","light","dark"].map(T=>`<ThemeMode value="${T}">${T[0].toUpperCase()+T.slice(1)}</ThemeMode>`).join(`
    `),l=`<ThemePicker view="${e==="shared"?"shared-wheel":a}" roles={${JSON.stringify(o.roles??["primary"]).replaceAll('"',"'")}} controls={false} />`,m=[...(o.radius??[]).map(T=>`<ThemeRadius target="${T}" />`),...(o.width??[]).map(T=>`<ThemeBorderWidth target="${T}" />`)].join(`
    `),d=e==="presets"?`<ThemeSelect themes={themes} />
    ${i}
    ${["primary","secondary","accent"].map(T=>`<ThemePalette role="${T}" shape="joined" />`).join(`
    `)}`:`<ThemeName />
    ${e==="shared"||e==="rectangle"||e==="disabled"?"<ThemeSelect themes={themes} />":""}
    ${l}
    ${e==="shared"||e==="rectangle"?"<ThemeHarmony />":""}
    ${o.background?"<ThemeBackground />":""}
    ${m}
    ${e==="single"||(($=o.modes)==null?void 0:$.length)===1?"":i}
    ${(o.roles??["primary"]).map(T=>`<ThemePalette role="${T}" shape="joined" />`).join(`
    `)}
    <ThemeExport selection={selection} />`;s=[...new Set((d.match(/<Theme[A-Z]\w+/g)??[]).map(T=>T.slice(1)))];const u="generateTheme, browserModeStorage",p=`import '${B(r)}';`,c=`const selection = ${JSON.stringify(o)} as const;
const themes = [generateTheme('#5268E0', { name: 'Indigo' }), generateTheme('#277D59', { name: 'Forest' }), generateTheme('#C25D3D', { name: 'Terracotta' })];`;if(t==="React")return`import { ThemeProvider, ${s.join(", ")}, ${u} } from '${r}';
${p}

${c}
export function ThemeExample() {
  return <ThemeProvider theme={themes[0]} selection={selection} mode="system"
    modeStorage={browserModeStorage('app:mode')}>
    ${d}
    <section className="app-preview">Your application content</section>
  </ThemeProvider>;
}
/* .app-preview { background: hsl(var(--background)); color: hsl(var(--foreground)); } */`;if(t==="Svelte")return`<script lang="ts">
  import { ThemeProvider, ${s.join(", ")}, ${u} } from '${r}';
  ${p}
  ${c}
<\/script>

<ThemeProvider options={{ theme: themes[0], selection, mode: 'system',
  modeStorage: browserModeStorage('app:mode') }}>
    ${d.replace("themes={themes}","{themes}").replace(/<ThemeMode value="(system|light|dark)">([^<]+)<\/ThemeMode>/g,'<ThemeMode value="$1">{#snippet children()}$2{/snippet}</ThemeMode>')}
    <section class="app-preview">Your application content</section>
</ThemeProvider>
<style>
  .app-preview { background: hsl(var(--background)); color: hsl(var(--foreground)); }
</style>`;if(t==="Vue")return`<script setup lang="ts">
import { ThemeProvider, ${s.join(", ")}, ${u} } from '${r}';
${p}
${c}
<\/script>
<template>
  <ThemeProvider :options="{ theme: themes[0], selection, mode: 'system',
    modeStorage: browserModeStorage('app:mode') }">
    ${d.replace("themes={themes}",':themes="themes"').replace(/roles=\{([^}]+)\}/g,':roles="$1"').replace("controls={false}",':controls="false"').replace("selection={selection}",':selection="selection"').replace("roles={['primary']}",`:roles="['primary']"`).replace("selection={{ roles: ['primary'] }}",`:selection="{ roles: ['primary'] }"`)}
    <section class="app-preview">Your application content</section>
  </ThemeProvider>
</template>
<style>
.app-preview { background: hsl(var(--background)); color: hsl(var(--foreground)); }
</style>`;const h={ThemeName:"tk-name",ThemePicker:"tk-picker",ThemeHarmony:"tk-harmony",ThemeBackground:"tk-background",ThemeRadius:"tk-radius",ThemeBorderWidth:"tk-border-width",ThemeMode:"tk-mode",ThemeExport:"tk-export",ThemeSelect:"tk-select",ThemePalette:"tk-palette"},g=d.replace(/Theme\w+/g,T=>h[T]??T).replace("themes={themes}",'[themes]="themes"').replace(/roles=\{([^}]+)\}/g,'[roles]="$1"').replace("controls={false}",'[controls]="false"').replace("selection={selection}",'[selection]="selection"').replace("roles={['primary']}",`[roles]="['primary']"`).replace("selection={{ roles: ['primary'] }}",`[selection]="{ roles: ['primary'] }"`);if(t==="Angular")return`import { Component } from '@angular/core';
import { ThemeProvider, ${s.join(", ")}, ${u} } from '${r}';

@Component({ selector: 'app-theme', standalone: true,
  imports: [ThemeProvider, ${s.join(", ")}],
  template: \`<tk-provider [options]="options">
    ${g.replace(/<tk-mode value="(system|light|dark)">([^<]+)<\/tk-mode>/g,'<tk-mode value="$1"><ng-template>$2</ng-template></tk-mode>')}
    <section class="app-preview">Your application content</section>
  </tk-provider>\`,
})
export class ThemeExample {
  readonly selection = ${JSON.stringify(o)} as const;
  readonly themes = [generateTheme('#5268E0', { name: 'Indigo' }), generateTheme('#277D59', { name: 'Forest' }), generateTheme('#C25D3D', { name: 'Terracotta' })];
  readonly options = { theme: this.themes[0], selection: this.selection, mode: 'system' as const,
    modeStorage: browserModeStorage('app:mode') };
}
/* Global stylesheet: */
@import '${B(r)}';
.app-preview { background: hsl(var(--background)); color: hsl(var(--foreground)); }`;if(t==="Astro")return`---
import { generateTheme } from '${r}';
${["ThemeProvider",...s].map(T=>`import ${T} from '${r}/${T}.astro';`).join(`
`)}
${p}
${c}
const theme = themes[0];
---
<ThemeProvider {theme} {selection} mode="system" modeStorageKey="app:mode">
    ${d.replace("<ThemeSelect ","<ThemeSelect {theme} ").replace("<ThemeName />","<ThemeName {theme} />").replace("<ThemePicker ","<ThemePicker {theme} ").replace("<ThemeHarmony />","<ThemeHarmony {theme} />").replace("<ThemeBackground />","<ThemeBackground {theme} />").replace("<ThemeRadius ","<ThemeRadius {theme} ").replace("<ThemeBorderWidth ","<ThemeBorderWidth {theme} ").replaceAll("<ThemePalette ","<ThemePalette {theme} ").replace("<ThemeExport",`<ThemeExport {theme} mode="${((y=o.modes)==null?void 0:y.length)===1?o.modes[0]:"light"}"`)}
    <section class="app-preview">Your application content</section>
</ThemeProvider>
<style>.app-preview { background: hsl(var(--background)); color: hsl(var(--foreground)); }</style>`;const v=Lr(e,o),C=`const options = { theme: ThemeStudio.generateTheme('#5268E0', { name: 'Indigo' }), selection: ${JSON.stringify(o)}, mode: 'system',
  modeStorage: ThemeStudio.browserModeStorage('app:mode') };
const provider = document.querySelector('tk-provider');
provider.setStore(ThemeStudio.createThemeStore(options), options);
const render = () => {
  const config = ThemeStudio.themeConfiguration(provider.store.getSnapshot());
  document.querySelector('#preview').style.cssText = config.css;
  console.log(config.theme.name, config.json);
};
provider.addEventListener('theme-change', render);
render();`;return`<link rel="stylesheet" href="/assets/theme-studio.min.css">
<script src="/assets/theme-studio.min.js"><\/script>
${v}
<section id="preview">Your application content</section>
<script>
${C}
<\/script>
<style>
#preview { background: hsl(var(--background)); color: hsl(var(--foreground)); padding: 24px; }
</style>`}function Ar(t){const e=re("theme-studio",t),o=`fallbackTheme: generateTheme('#5268E0'),
  loadTheme: createHttpThemeLoader('/api/theme'),
  timeoutMs: 10000, modeStorage: false as const`;return t==="React"?`import { ThemeProvider, ThemeLoading, ThemeReady, ThemeError,
  generateTheme, createHttpThemeLoader } from '${e}';

export function RemoteTheme() {
  return <ThemeProvider fallbackTheme={generateTheme('#5268E0')}
    loadTheme={createHttpThemeLoader('/api/theme')}
    timeoutMs={10000} modeStorage={false}>
    <ThemeLoading><div>Loading theme…</div></ThemeLoading>
    <ThemeReady><section>Your themed content</section></ThemeReady>
    <ThemeError>{(error, retry) =>
      <button onClick={() => void retry()}>Retry</button>
    }</ThemeError>
  </ThemeProvider>;
}`:t==="Svelte"?`<script lang="ts">
  import { ThemeProvider, ThemeLoading, ThemeReady, ThemeError,
    generateTheme, createHttpThemeLoader } from '${e}';
  const options = { ${o} };
<\/script>
<ThemeProvider {options}>
  <ThemeLoading><div>Loading theme…</div></ThemeLoading>
  <ThemeReady><section>Your themed content</section></ThemeReady>
  <ThemeError>{#snippet children(error, retry)}
    <button onclick={retry}>Retry</button>
  {/snippet}</ThemeError>
</ThemeProvider>`:t==="Vue"?`<script setup lang="ts">
import { ThemeProvider, ThemeLoading, ThemeReady, ThemeError,
  generateTheme, createHttpThemeLoader } from '${e}';
const options = { ${o} };
<\/script>
<template><ThemeProvider :options="options">
  <ThemeLoading><div>Loading theme…</div></ThemeLoading>
  <ThemeReady><section>Your themed content</section></ThemeReady>
  <ThemeError v-slot="{ error, retry }"><button @click="retry">Retry</button></ThemeError>
</ThemeProvider></template>`:t==="Astro"?`---
import { generateTheme } from '${e}';
${["ThemeProvider","ThemeLoading","ThemeReady","ThemeError"].map(a=>`import ${a} from '${e}/${a}.astro';`).join(`
`)}
const fallbackTheme = generateTheme('#5268E0');
---
<ThemeProvider {fallbackTheme} src="/api/theme" modeStorage={false}>
  <ThemeLoading><div>Loading theme…</div></ThemeLoading>
  <ThemeReady><section>Your themed content</section></ThemeReady>
  <ThemeError><button data-tk-retry>Retry</button></ThemeError>
</ThemeProvider>`:t==="Angular"?`import { Component } from '@angular/core';
import { ThemeProvider, ThemeLoading, ThemeReady, ThemeError,
  createThemeStore, generateTheme, createHttpThemeLoader } from '${e}';
@Component({ selector: 'app-remote-theme', standalone: true,
  imports: [ThemeProvider, ThemeLoading, ThemeReady, ThemeError],
  template: \`<tk-provider [store]="store" [options]="options">
    <tk-loading>Loading theme…</tk-loading>
    <tk-ready>Your themed content</tk-ready>
    <tk-error><button (click)="store.reload()">Retry</button></tk-error>
  </tk-provider>\` })
export class RemoteTheme {
  readonly options = { ${o} };
  readonly store = createThemeStore(this.options);
}`:`<link rel="stylesheet" href="/assets/theme-studio.min.css">
<script src="/assets/theme-studio.min.js"><\/script>
<div id="loading">Loading theme…</div>
<section id="content">Your themed content</section>
<button id="retry" hidden>Retry</button>
<script>
${`const options = { ${o} };
const store = ThemeStudio.createThemeStore(options);
const render = () => {
  const state = store.getSnapshot();
  document.querySelector('#content').style.cssText = ThemeStudio.themeConfiguration(state).css;
  document.querySelector('#loading').hidden = state.status !== 'loading';
  document.querySelector('#content').hidden = state.status === 'loading';
  document.querySelector('#retry').hidden = !state.error;
};
const unsubscribe = store.subscribe(render);
render();
const unmount = ThemeStudio.mountThemeStore(store, undefined, options);
document.querySelector('#retry').addEventListener('click', () => store.reload());
// On removal: unsubscribe(); unmount();`.replace("false as const","false").replace("fallbackTheme: generateTheme(","fallbackTheme: ThemeStudio.generateTheme(").replace("loadTheme: createHttpThemeLoader(","loadTheme: ThemeStudio.createHttpThemeLoader(")}
<\/script>
<style>#content { background: hsl(var(--background)); color: hsl(var(--foreground)); }</style>`}const Ee={text:"C",color:"#E4002B",size:22,track:12};function Pe(t,e=".custom-picker"){return`${e} {
  --cp-thumb-size: ${t.size}px;
  --cp-thumb-radius: 0;
  --cp-track-height: ${t.track}px;
  --cp-track-radius: 0;
  --cp-controls-color: ${t.color};
}
${e} [data-cp-part="thumb-text"] { font-size: 10px; color: white; }
${e} input[type="range"] { accent-color: var(--cp-controls-color); }
${e} button { border-color: var(--cp-controls-color); color: var(--cp-controls-color); }
${e} button[aria-pressed="true"] { background: var(--cp-controls-color); color: white; }`}function ft(t,e,o=Ee){if(e==="form")return rt("color-picker",t);let r=qr(Er(t,e==="disabled"?"rectangle":e),t);if(e==="disabled")return Zt(r,t,!1);if(e!=="custom")return r;t==="React"&&(r=r.replace("<ColorMode />","<ColorMode>{format => <span>Change {format.toUpperCase()} format</span>}</ColorMode>")),t==="Svelte"&&(r=r.replace("<ColorMode />","<ColorMode>{#snippet children(format)}<span>Change {format.toUpperCase()} format</span>{/snippet}</ColorMode>")),t==="Vue"&&(r=r.replace("<ColorMode />",'<ColorMode v-slot="{ format }"><span>Change {{ format.toUpperCase() }} format</span></ColorMode>')),t==="Angular"&&(r=r.replace("<cp-mode />","<cp-mode><ng-template let-format><span>Change {{ format.toUpperCase() }} format</span></ng-template></cp-mode>")),t==="Astro"&&(r=r.replace("<ColorMode />","<ColorMode><span>Change <span data-color-format>HEX</span> format</span></ColorMode>")),t==="Vanilla"&&(r=r.replace('<cp-mode><button type="button">Switch format</button></cp-mode>','<cp-mode data-custom><button type="button"><span>Change <span data-color-format>HEX</span> format</span></button></cp-mode>'));const a=o.text.replace(/&/g,"&amp;").replace(/"/g,"&quot;").replace(/</g,"&lt;").replace(/>/g,"&gt;");return r.replaceAll('thumbText="C"',`thumbText="${a}"`).replaceAll(">C</span>",`>${a}</span>`).replace(de,Pe(o)).replace(de.replace('[data-cp-part="thumb-text"]',':global([data-cp-part="thumb-text"])'),Pe(o).replace('[data-cp-part="thumb-text"]',':global([data-cp-part="thumb-text"])').replace('input[type="range"]',':global(input[type="range"])').replace(" button"," :global(button)"))}function Yt(){return`<div class="custom-theme">
  <h3 class="generator-title">Brand color</h3>
  <label>Theme title<input data-tk-name maxlength="200"></label>
  <cp-provider data-theme-generator data-role="primary" class="picker-parts">
    <cp-area><div class="cp-area" data-area data-cp-part="surface" tabindex="0" role="group" aria-label="Brand color"><span data-cp-part="thumb"><span data-cp-part="thumb-text">B</span></span></div></cp-area>
    <cp-slider channel="h"><label class="cp-slider" data-channel="h">Color tone<input type="range" min="0" max="359"></label></cp-slider>
    <cp-input></cp-input>
  </cp-provider>
  <div class="custom-mode-bar">
    <button type="button" data-tk-mode="system">Use device</button>
    <button type="button" data-tk-mode="light">Day</button>
    <button type="button" data-tk-mode="dark">Night</button>
  </div>
  ${Me("primary",{shape:"joined"})}
</div>`}function Rr(t){const e=re("theme-studio",t),o=re("color-picker",t),r=`import '${B(e)}';`,a=Pe({...Ee,size:26},".custom-theme"),s=`<ThemeName label="Theme title" />
    <h3>Brand color</h3>
    <ThemeGenerator role="primary">
      <ColorArea thumbText="B" classes={{ root: 'brand-surface', thumb: 'brand-thumb' }} />
      <ColorSlider channel="h" label="Color tone" /><ColorInput />
    </ThemeGenerator>
    <ThemeMode value="system">Use device</ThemeMode>
    <ThemeMode value="light">Day</ThemeMode>
    <ThemeMode value="dark">Night</ThemeMode>
    <ThemePalette role="primary" shape="joined" />`,i="ThemeProvider, ThemeGenerator, ThemeName, ThemeMode, ThemePalette, generateTheme",l="ColorArea, ColorSlider, ColorInput";return t==="React"?`import { ${i} } from '${e}';
import { ${l} } from '${o}';
${r}

export function CustomGenerator() {
  return <ThemeProvider theme={generateTheme('#5268E0')} modeStorage={false}>
  <div className="custom-theme">
    ${s}
  </div>
  </ThemeProvider>;
}
/* Global stylesheet */
${a}`:t==="Svelte"?`<script lang="ts">
  import { ${i} } from '${e}';
  import { ${l} } from '${o}';
  ${r}
<\/script>
<ThemeProvider options={{ theme: generateTheme('#5268E0'), modeStorage: false }}>
  <div class="custom-theme">
    ${s.replace(/<ThemeMode value="(system|light|dark)">([^<]+)<\/ThemeMode>/g,'<ThemeMode value="$1">{#snippet children()}$2{/snippet}</ThemeMode>')}
  </div>
</ThemeProvider>
<!-- Add this CSS globally (or use :global for internal selectors). -->
<style is:global>
${a}
</style>`.replace("<style is:global>","<style>"):t==="Vue"?`<script setup lang="ts">
import { ${i} } from '${e}';
import { ${l} } from '${o}';
${r}
<\/script>
<template>
<ThemeProvider :options="{ theme: generateTheme('#5268E0'), modeStorage: false }">
  <div class="custom-theme">
    ${s.replace("classes={{ root: 'brand-surface', thumb: 'brand-thumb' }}",`:classes="{ root: 'brand-surface', thumb: 'brand-thumb' }"`)}
  </div>
</ThemeProvider>
</template>
<style>
${a}
</style>`:t==="Angular"?`import { Component } from '@angular/core';
import { ${i} } from '${e}';
import { ${l} } from '${o}';
@Component({ selector: 'app-custom-theme', standalone: true,
  imports: [ThemeProvider, ThemeGenerator, ThemeName, ThemeMode, ThemePalette, ${l}],
  template: \`<tk-provider [options]="options"><div class="custom-theme">
    <tk-name label="Theme title" /><h3>Brand color</h3>
    <tk-generator role="primary" [custom]="true">
      <cp-area thumbText="B" [classes]="{ root: 'brand-surface', thumb: 'brand-thumb' }" />
      <cp-slider channel="h" label="Color tone" /><cp-input />
    </tk-generator>
    <tk-mode value="system"><ng-template>Use device</ng-template></tk-mode>
    <tk-mode value="light"><ng-template>Day</ng-template></tk-mode>
    <tk-mode value="dark"><ng-template>Night</ng-template></tk-mode>
    <tk-palette role="primary" shape="joined" />
  </div></tk-provider>\` })
export class CustomGenerator {
 readonly options = {theme: generateTheme('#5268E0'), modeStorage: false as const};
}
/* Global stylesheet */
@import '${B(e)}';
${a}`:t==="Astro"?`---
import { generateTheme } from '${e}';
${["ThemeProvider","ThemeGenerator","ThemeName","ThemeMode","ThemePalette"].map(b=>`import ${b} from '${e}/${b}.astro';`).join(`
`)}
${["ColorArea","ColorSlider","ColorInput"].map(b=>`import ${b} from '${o}/${b}.astro';`).join(`
`)}
${r}
const theme=generateTheme('#5268E0');
---
<ThemeProvider {theme} modeStorage={false}>
 <div class="custom-theme">
  <ThemeName {theme} label="Theme title" /><h3>Brand color</h3>
  <ThemeGenerator {theme} role="primary">
   <ColorArea value="#5268E0" thumbText="B" />
   <ColorSlider channel="h" label="Color tone" /><ColorInput value="#5268E0" />
  </ThemeGenerator>
  <ThemeMode value="system">Use device</ThemeMode>
  <ThemeMode value="light">Day</ThemeMode>
  <ThemeMode value="dark">Night</ThemeMode>
 </div>
</ThemeProvider>
<style is:global>
${a}
</style>`:`<link rel="stylesheet" href="/assets/theme-studio.min.css">
<script src="/assets/theme-studio.min.js"><\/script>
${`<tk-provider class="tk-scope tk-generator" data-config='{"mode":"system","modeStorage":false}'>
${Yt()}
</tk-provider>`}
<script>
const provider = document.querySelector('tk-provider');
const options = { theme: ThemeStudio.generateTheme('#5268E0'), modeStorage: false };
provider.setStore(ThemeStudio.createThemeStore(options), options);
<\/script>
<style>
${a}
</style>`}function vt(t,e,o={...Ee,text:"B",size:26},r=ye(e)){var i;if(e==="editing")return rt("theme-studio",t);if(e==="palette")return Ke(t);let a=_t(Pr(t,e,r),t,r.roles);if(e!=="presets"&&e!=="custom"&&(a=a.replaceAll("ThemeStudio.browserModeStorage('app:mode')","false").replaceAll("browserModeStorage('app:mode')",t==="Angular"?"false as const":"false").replaceAll(", browserModeStorage","").replace('modeStorageKey="app:mode"',"modeStorage={false}").replaceAll('mode="system"','mode="light"').replaceAll("mode: 'system'","mode: 'light'")),e==="disabled"&&(a=Zt(a,t,!0)),e==="geometry"&&((i=r.modes)==null?void 0:i.length)===1&&r.modes[0]==="dark"&&(a=a.replaceAll('mode="light"','mode="dark"').replaceAll("mode: 'light'","mode: 'dark'")),e!=="custom")return a;const s=o.text.replace(/&/g,"&amp;").replace(/"/g,"&quot;").replace(/</g,"&lt;").replace(/>/g,"&gt;");return a.replaceAll('thumbText="B"',`thumbText="${s}"`).replaceAll(">B</span>",`>${s}</span>`).replace(Pe({...Ee,size:26},".custom-theme"),Pe(o,".custom-theme")).replaceAll(t==="Svelte"?'.custom-theme [data-cp-part="thumb-text"]':"__unused__",'.custom-theme :global([data-cp-part="thumb-text"])').replaceAll(t==="Svelte"?'.custom-theme input[type="range"]':"__unused__",'.custom-theme :global(input[type="range"])').replaceAll(t==="Svelte"?".custom-theme button":"__unused__",".custom-theme :global(button)").replace(' :global(button)[aria-pressed="true"]',' :global(button[aria-pressed="true"])')}function ye(t){return t==="single"||t==="custom"?{roles:["primary"]}:t==="geometry"?{roles:["primary"],radius:["card"],width:["button"],modes:["light"]}:{roles:["primary","secondary","accent"],radius:["card"],width:["card"],background:!0,modes:["light","dark"]}}function Lr(t,e){var l;const o={view:t==="rectangle"||t==="geometry"?"area":t==="single"?"wheel":"shared-wheel",roles:e.roles,controls:!1},r=Jt.replace("<tk-picker>",`<tk-picker data-options='${JSON.stringify(o)}'>`),a=[U("#5268E0",{name:"Indigo"}),U("#277D59",{name:"Forest"}),U("#C25D3D",{name:"Terracotta"})],s=`<tk-select data-themes='${JSON.stringify(a)}'><label class="cp-format">Theme<select><option value="" disabled>Custom theme</option>${a.map(m=>`<option value="${m.id}">${m.name}</option>`).join("")}</select></label></tk-select>`,i=[...(e.radius??[]).map(m=>`<label class="tk-border"><span>${m} radius</span><span class="tk-border-field"><input type="number" min="0" max="1000" step=".125" data-tk-border="radius" data-target="${m}"><span aria-hidden="true">rem</span></span></label>`),...(e.width??[]).map(m=>`<label class="tk-border"><span>${m} border width</span><span class="tk-border-field"><input type="number" min="0" max="1000" step="1" data-tk-border="width" data-target="${m}"><span aria-hidden="true">px</span></span></label>`)].join(`
  `);return`<tk-provider class="tk-scope tk-generator" data-config='${JSON.stringify({mode:"light",modeStorage:!1,selection:e})}'>
  ${t==="single"||((l=e.modes)==null?void 0:l.length)===1?"":'<div class="mode-buttons"><button data-tk-mode="system">System</button><button data-tk-mode="light">Light</button><button data-tk-mode="dark">Dark</button></div>'}
  ${t==="presets"?s:`<label class="tk-name">Theme name<input data-tk-name maxlength="200"></label>
  ${r}
  ${t==="shared"||t==="rectangle"?'<div class="tk-harmony"><label>Harmony<select data-tk-harmony><option value="analogous">Analogous</option><option value="triadic">Triadic</option><option value="split-complementary">Split complementary</option></select></label><button data-tk-generate-harmony>Generate accent &amp; secondary</button></div>':""}
  ${i}
  ${e.background?'<label class="tk-background"><input type="checkbox" data-tk-background>Tint background with primary</label>':""}`}
  <tk-export format="json"><pre class="tk-export"></pre></tk-export>
</tk-provider>`}function Mr(t){const e=re("theme-studio",t);return t==="React"?`import { useThemeMode } from '${e}';

// Render this component inside ThemeProvider.
export function AppearanceControls() {
 const mode = useThemeMode();
 return <div className="appearance-controls">
   <button aria-pressed={mode.preference === 'system'} onClick={() => mode.setMode('system')}>Use device</button>
   <button aria-pressed={mode.preference === 'light'} onClick={() => mode.setMode('light')}>Day</button>
   <button aria-pressed={mode.preference === 'dark'} onClick={() => mode.setMode('dark')}>Night</button>
 </div>;
}`:t==="Svelte"?`<script lang="ts">
 import { useThemeMode } from '${e}';
 // Render this child component inside ThemeProvider.
 const mode = useThemeMode();
<\/script>
<div class="appearance-controls">
 <button aria-pressed={$mode.preference === 'system'} onclick={() => mode.setMode('system')}>Use device</button>
 <button aria-pressed={$mode.preference === 'light'} onclick={() => mode.setMode('light')}>Day</button>
 <button aria-pressed={$mode.preference === 'dark'} onclick={() => mode.setMode('dark')}>Night</button>
</div>`:t==="Vue"?`<script setup lang="ts">
import { useThemeMode } from '${e}';
// Render this child component inside ThemeProvider.
const mode = useThemeMode();
<\/script>
<template><div class="appearance-controls">
 <button :aria-pressed="mode.preference.value === 'system'" @click="mode.setMode('system')">Use device</button>
 <button :aria-pressed="mode.preference.value === 'light'" @click="mode.setMode('light')">Day</button>
 <button :aria-pressed="mode.preference.value === 'dark'" @click="mode.setMode('dark')">Night</button>
</div></template>`:t==="Angular"?`import { Component } from '@angular/core';
import { useThemeMode } from '${e}';
// Render this child component inside tk-provider.
@Component({selector:'app-appearance',standalone:true,
 template:\`<div class="appearance-controls">
  <button [attr.aria-pressed]="mode.preference() === 'system'" (click)="mode.setMode('system')">Use device</button>
  <button [attr.aria-pressed]="mode.preference() === 'light'" (click)="mode.setMode('light')">Day</button>
  <button [attr.aria-pressed]="mode.preference() === 'dark'" (click)="mode.setMode('dark')">Night</button>
 </div>\`})
export class AppearanceControls {readonly mode=useThemeMode();}`:`<!-- Place these controls inside ThemeProvider / tk-provider. -->
<!-- Astro: ThemeProvider registers the native client automatically.
     Vanilla: load theme-studio.js once in the outer page. -->
<div class="appearance-controls">
 <button type="button" data-tk-mode="system">Use device</button>
 <button type="button" data-tk-mode="light">Day</button>
 <button type="button" data-tk-mode="dark">Night</button>
</div>
<!-- ThemeStudio.themeModeActions(provider.store).cycle() is also available
     for a custom cycle button. -->`}function qr(t,e){const o=`.picker-parts { display: grid; gap: var(--cp-gap, 16px); width: 100%; max-width: 360px; }
.picker-parts cp-provider { display: contents; }`,r=e==="Svelte"?o.replace(" cp-provider"," :global(cp-provider)"):o;if(e==="React"){const a="/* Add to your stylesheet: */";return t.includes(a)?t.replace(a,a+`
`+o):t+`

`+a+`
`+o}return e==="Angular"?t+`
`+o:t.includes("</style>")?t.replace("</style>",r+`
</style>`):t+`
<style${e==="Astro"?" is:global":""}>
${r}
</style>`}function Hr(t){const e=re("theme-studio",t),o='<section class="app-preview"><h3>Project settings</h3><button type="button">Save changes</button></section>',r=`.app-preview { padding: 24px; background: hsl(var(--background)); color: hsl(var(--foreground)); border: var(--border-width-card) solid hsl(var(--primary)); border-radius: var(--border-radius-card); }
.app-preview button { background: hsl(var(--primary)); color: hsl(var(--primary-foreground)); padding: 10px 16px; border: 0; border-radius: var(--border-radius-button); }`;return t==="React"?`import { ThemeProvider, generateTheme } from '${e}';
import '${B(e)}';

const theme = generateTheme('#277D59', { name: 'Forest' });
export function StandaloneTheme() {
  return <ThemeProvider theme={theme} mode="system" modeStorage={false}>
    ${o.replaceAll("class=","className=")}
  </ThemeProvider>;
}
/* Global stylesheet */
${r}`:t==="Svelte"?`<script lang="ts">
 import { ThemeProvider, generateTheme } from '${e}';
 import '${B(e)}';
 const theme = generateTheme('#277D59', { name: 'Forest' });
<\/script>
<ThemeProvider options={{ theme, mode: 'system', modeStorage: false }}>
 ${o}
</ThemeProvider>
<style>
${r}
</style>`:t==="Vue"?`<script setup lang="ts">
import { ThemeProvider, generateTheme } from '${e}';
import '${B(e)}';
const theme = generateTheme('#277D59', { name: 'Forest' });
<\/script>
<template><ThemeProvider :options="{ theme, mode: 'system', modeStorage: false }">
 ${o}
</ThemeProvider></template>
<style>
${r}
</style>`:t==="Angular"?`import { Component } from '@angular/core';
import { ThemeProvider, generateTheme } from '${e}';
@Component({ selector: 'app-standalone-theme', standalone: true,
 imports: [ThemeProvider],
 template: \`<tk-provider [options]="options">${o}</tk-provider>\` })
export class StandaloneTheme {
 readonly options = { theme: generateTheme('#277D59', { name: 'Forest' }),
   mode: 'system' as const, modeStorage: false as const };
}
/* Global stylesheet */
@import '${B(e)}';
${r}`:t==="Astro"?`---
import { generateTheme } from '${e}';
import ThemeProvider from '${e}/ThemeProvider.astro';
import '${B(e)}';
const theme = generateTheme('#277D59', { name: 'Forest' });
---
<ThemeProvider {theme} mode="system" modeStorage={false}>
 ${o}
</ThemeProvider>
<style>
${r}
</style>`:`<link rel="stylesheet" href="/assets/theme-studio.min.css">
<script src="/assets/theme-studio.min.js"><\/script>
<tk-provider class="tk-scope">${o}</tk-provider>
<script>
const options = { theme: ThemeStudio.generateTheme('#277D59', { name: 'Forest' }),
  mode: 'system', modeStorage: false };
const provider = document.querySelector('tk-provider');
provider.setStore(ThemeStudio.createThemeStore(options), options);
<\/script>
<style>
${r}
</style>`}function Nr(t,e){if(e==="standalone")return Hr(t);const o=e==="timeout"?2e3:5e3;return Ir(t).replaceAll("10000",String(o)).replace("generateTheme('#5268E0')","generateTheme('#5268E0', { name: 'Indigo fallback' })")}const xe=`<h3>Project settings</h3>
  <p>Sample controls using the theme's CSS variables.</p>
  <label>Project name<input value="Website redesign" /></label>
  <div class="app-actions"><button type="button">Save changes</button><button type="button" class="secondary">Cancel</button></div>
  <aside>Accent surface</aside>`,je=`.app-preview { display: grid; gap: 16px; padding: 24px; background: hsl(var(--background)); color: hsl(var(--foreground)); border: var(--border-width-card) solid hsl(var(--primary)); border-radius: var(--border-radius-card); }
.app-preview h3, .app-preview p { margin: 0; }
.app-preview label { display: grid; gap: 8px; }
.app-preview input { background: hsl(var(--background)); color: hsl(var(--foreground)); border: var(--border-width-input) solid hsl(var(--primary)); border-radius: var(--border-radius-input); padding: 10px; }
.app-actions { display: flex; gap: 8px; }
.app-actions button { background: hsl(var(--primary)); color: hsl(var(--primary-foreground)); padding: 10px 16px; border: 0; border-radius: var(--border-radius-button); }
.app-actions .secondary { background: hsl(var(--secondary)); color: hsl(var(--secondary-foreground)); }
.app-preview aside { background: hsl(var(--accent)); color: hsl(var(--accent-foreground)); padding: 16px; border-radius: var(--border-radius-card); }`;function _t(t,e,o=["primary","secondary","accent"]){const r=o.includes("accent")?xe:xe.replace("<aside>Accent surface</aside>",""),a=e==="React"?r.replaceAll("class=","className=").replace("input value=","input defaultValue="):r;let s=t.replace("Your application content",a);if(!s.includes("app-preview")){const i=e==="Angular"||e==="Vanilla"?"</tk-provider>":"</ThemeProvider>";s=s.replace(i,`<section ${e==="React"?"className":"class"}="app-preview">${a}</section>
${i}`)}return s=s.replace(/\/\* \.app-preview \{[^}]*\} \*\//,""),s.includes("</style>")?s.replace("</style>",je+`
</style>`):e==="React"||e==="Angular"?s+(/\/\* (?:Add to your stylesheet:|In your global stylesheet:|Global stylesheet:?) \*\//.test(s)?`
`:`
/* Global stylesheet */
`)+je:s+`
<style${e==="Astro"?" is:global":""}>
${je}
</style>`}function Ir(t){const e=Ar(t).replace("<section>Your themed content</section>",`<section class="app-preview">${xe}</section>`).replace("<tk-ready>Your themed content</tk-ready>",`<tk-ready><section class="app-preview">${xe}</section></tk-ready>`).replace('<section id="content">Your themed content</section>',`<section id="content" class="app-preview">${xe}</section>`);return _t(t==="React"?e.replaceAll("class=","className=").replace("input value=","input defaultValue="):e,t)}function Zt(t,e,o){return o?e==="React"||e==="Astro"?t.replace("<ThemeProvider ","<ThemeProvider disabled "):t.replace("theme: themes[0]","disabled: true, theme: themes[0]").replace("theme: this.themes[0]","disabled: true, theme: this.themes[0]").replace("theme: ThemeStudio.generateTheme(","disabled: true, theme: ThemeStudio.generateTheme("):e==="React"||e==="Svelte"||e==="Astro"?t.replace("<ColorProvider ","<ColorProvider disabled "):e==="Vue"?t.replace("<ColorProvider ",'<ColorProvider :disabled="true" '):e==="Angular"?t.replace("<cp-provider ",'<cp-provider [disabled]="true" '):t.replace("<cp-provider ","<cp-provider disabled ")}const Qt={shape:"joined",label:"500",gap:4,size:48};function eo(t){return`.brand-palette { --tk-palette-gap: ${t.gap}px; --tk-swatch-height: ${t.size}px; --tk-swatch-radius: 10px; }
.brand-shade-label { font-size: 11px; font-weight: 600; }
.brand-shade { outline: 1px solid rgb(0 0 0 / 8%); outline-offset: -1px; }`}function Ke(t,e=Qt){const o=re("theme-studio",t),r="{ root: 'brand-palette', label: 'brand-shade-label', swatch: 'brand-shade' }",a=JSON.stringify({500:e.label}).replaceAll("<","\\u003c"),s=`const classes = ${r};
const labels = ${a};`,i=`role="primary" shape="${e.shape}" classes={classes} labels={labels}`,l=eo(e);return t==="React"?`import { ThemeProvider, ThemePalette, generateTheme } from '${o}';
import '${B(o)}';
${s}
export function Shades() {
  return <ThemeProvider theme={generateTheme('#5268E0')}><ThemePalette ${i} /></ThemeProvider>;
}
/* Global stylesheet */
${l}`:t==="Svelte"?`<script lang="ts">
import { ThemeProvider, ThemePalette, generateTheme } from '${o}';
import '${B(o)}';
${s}
<\/script>
<ThemeProvider options={{ theme: generateTheme('#5268E0') }}><ThemePalette ${i} /></ThemeProvider>
<style>
${l.replace(".brand-palette",":global(.brand-palette)").replace(".brand-shade-label",":global(.brand-shade-label)").replace(".brand-shade {",":global(.brand-shade) {")}
</style>`:t==="Vue"?`<script setup lang="ts">
import { ThemeProvider, ThemePalette, generateTheme } from '${o}';
import '${B(o)}';
${s}
<\/script>
<template><ThemeProvider :options="{ theme: generateTheme('#5268E0') }"><ThemePalette role="primary" shape="${e.shape}" :classes="classes" :labels="labels" /></ThemeProvider></template>
<style>
${l}
</style>`:t==="Angular"?`import { Component } from '@angular/core';
import { ThemeProvider, ThemePalette, generateTheme } from '${o}';
@Component({ selector: 'app-shades', standalone: true, imports: [ThemeProvider, ThemePalette], template: \`<tk-provider [options]="options"><tk-palette role="primary" shape="${e.shape}" [classes]="classes" [labels]="labels" /></tk-provider>\` })
export class Shades { readonly options = { theme: generateTheme('#5268E0') }; readonly classes = ${r}; readonly labels = ${a}; }
/* Global stylesheet */
@import '${B(o)}';
${l}`:t==="Astro"?`---
import { generateTheme } from '${o}';
import ThemeProvider from '${o}/ThemeProvider.astro';
import ThemePalette from '${o}/ThemePalette.astro';
import '${B(o)}';
const theme = generateTheme('#5268E0');
${s}
---
<ThemeProvider {theme}><ThemePalette {theme} ${i} /></ThemeProvider>
<style is:global>
${l}
</style>`:`<link rel="stylesheet" href="/assets/theme-studio.min.css">
<script src="/assets/theme-studio.min.js"><\/script>
<tk-provider class="tk-scope"><div id="palette"></div></tk-provider>
<script>
${s}
const provider = document.querySelector('tk-provider');
provider.setStore(ThemeStudio.createThemeStore({ theme: ThemeStudio.generateTheme('#5268E0') }));
document.querySelector('#palette').innerHTML = ThemeStudio.themePaletteMarkup('primary', { shape: '${e.shape}', classes, labels });
<\/script>
<style>
${l}
</style>`}const q=t=>t.replace(/[&<>"']/g,e=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[e]);let Ce=0;function X(t,e,o={}){let r=o.integration??"React",a=0,s=[];const i=`source-${++Ce}`;t.classList.add("code-panel"),t.innerHTML=`<div class="code-toolbar"><div class="framework-tabs" role="tablist" aria-label="${q(o.label??"Example")} framework" ${o.file?"hidden":""}>${Xt.map(h=>`<button type="button" role="tab" id="${i}-${h}" aria-controls="${i}-code" data-framework="${h}">${h}</button>`).join("")}</div><span class="fixed-source-file" ${o.file?"":"hidden"}>${q(o.file??"")}</span><div class="code-actions"><button type="button" class="download-button" aria-label="Download files" title="Download all example files as a ZIP"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3v12m-4-4 4 4 4-4M5 16v4h14v-4"/></svg><span>Download files</span></button><button type="button" class="copy-button">Copy code</button></div></div><div class="source-file-tabs" role="tablist" aria-label="${q(o.label??"Example")} files"></div><pre id="${i}-code" role="tabpanel" tabindex="0"><code></code></pre><p class="copy-status" aria-live="polite"></p>`;const l=t.querySelector("code"),m=t.querySelector(".copy-button"),b=t.querySelector(".copy-status"),d=t.querySelector(".source-file-tabs"),u=t.querySelector(".framework-tabs"),p=()=>{l.textContent=s[a].code,d.querySelectorAll("[data-file]").forEach(h=>{const g=Number(h.dataset.file)===a;h.setAttribute("aria-selected",String(g)),h.tabIndex=g?0:-1}),b.textContent="",m.textContent="Copy code"},c=()=>{var g,v;const h=(g=s[a])==null?void 0:g.name;s=((v=o.files)==null?void 0:v.call(o,r))??(o.file?[{name:o.file,code:e(r)}]:Kt(e(r),r,o.baseName)),a=Math.max(0,s.findIndex(C=>C.name===h)),d.innerHTML=s.map((C,$)=>`<button type="button" role="tab" aria-controls="${i}-code" data-file="${$}">${q(C.name)}</button>`).join(""),d.hidden=!!o.file&&s.length===1,u.querySelectorAll("[data-framework]").forEach(C=>{const $=C.dataset.framework===r;C.setAttribute("aria-selected",String($)),C.tabIndex=$?0:-1}),o.file||t.querySelector("pre").setAttribute("aria-labelledby",`${i}-${r}`),p()};u.addEventListener("click",h=>{const g=h.target.closest("[data-framework]");g&&(r=g.dataset.framework,c())}),d.addEventListener("click",h=>{const g=h.target.closest("[data-file]");g&&(a=Number(g.dataset.file),p())});for(const h of[u,d])h.addEventListener("keydown",g=>{if(!["ArrowLeft","ArrowRight","Home","End"].includes(g.key))return;const v=[...h.querySelectorAll("button")],C=v.indexOf(document.activeElement);if(C<0)return;g.preventDefault();const $=g.key==="Home"?0:g.key==="End"?v.length-1:(C+(g.key==="ArrowRight"?1:-1)+v.length)%v.length;v[$].click(),v[$].focus()});return t.querySelector(".download-button").addEventListener("click",()=>{var h;return xr(s,((h=o.downloadName)==null?void 0:h.call(o))??(o.baseName??"example")+(o.file?"":"-"+r.toLowerCase()))}),m.addEventListener("click",async()=>{try{await navigator.clipboard.writeText(l.textContent??""),b.textContent="Code copied.",m.textContent="Copied"}catch{b.textContent="Select the code and copy it with your keyboard.";const h=document.createRange();h.selectNodeContents(l);const g=window.getSelection();g==null||g.removeAllRanges(),g==null||g.addRange(h)}}),c(),{refresh:c,setIntegration(h){r=h,c()}}}function to(t=["primary","secondary","accent"]){return`<div class="theme-sample"><div class="sample-header"><span>Application preview</span><span data-sample-mode></span></div><article class="sample-card"><span class="sample-name" data-sample-name></span><h3>Project settings</h3><p>Buttons, inputs and surfaces use the active theme tokens.</p><label>Project name<input value="Website redesign" aria-label="Example project name"></label><div class="sample-actions"><button class="sample-primary" type="button">Save changes</button><button class="sample-secondary" type="button">Cancel</button></div>${t.includes("accent")?'<div class="sample-note">Accent surface</div>':""}</article><div class="sample-colors">${t.map(e=>`<span style="--role:var(--${e})"><i></i>${e}</span>`).join("")}</div></div>`}function oo(t,e){t.style.cssText=e.css,t.querySelector("[data-sample-name]").textContent=e.theme.name,t.querySelector("[data-sample-mode]").textContent=e.modePreference==="system"?`System / ${e.mode}`:e.mode}function Fr(t,e){t.querySelector("[data-color-swatch]").style.backgroundColor=e.hex,t.querySelector("[data-color-name]").textContent=e.name,t.querySelector("[data-color-match]").textContent=e.exact?"Exact named color":"Nearest named color",t.querySelector("[data-color-hex]").textContent=e.hex;const o=t.querySelector("[data-color-values]");o.innerHTML=Object.entries(e.formats).map(([r,a])=>`<div><dt>${r.toUpperCase()}</dt><dd>${q(a)}</dd></div>`).join("")}function Re(t,e,o,r="all"){var $;const a=e==="color-picker",s=(a?at:st).filter(({id:y})=>{const T=y==="custom"||y==="palette";return r==="all"||(r==="customization"?T:!T)});let i=(($=s.find(({id:y})=>y===o))==null?void 0:$.id)??s[0].id,l,m={...Ee,...a?{}:{text:"B",size:26}},b={...Qt},d={...ye("geometry"),modes:["light"]};t.classList.add("explorer"),t.innerHTML=`<div class="example-toolbar">${s.length===1?`<span class="example-select">${q(s[0].title)}</span>`:`<label class="example-select">${r==="customization"?"Customize":"Example"}<select data-example aria-label="${a?"Color picker":"Theme studio"} ${r==="customization"?"customization":"example"}">${s.map(y=>`<option value="${y.id}" ${y.id===i?"selected":""}>${q(y.title)}</option>`).join("")}</select></label>`}<div class="view-tabs" role="group" aria-label="Example display"><button type="button" data-display="preview" aria-pressed="true">Preview</button><button type="button" data-display="code" aria-pressed="false">Code</button></div></div><div class="example-description"><p></p></div><div class="example-body" data-display="preview"><div class="example-preview"><div class="preview-label">Interactive preview <span>Vanilla adapter</span></div><div class="preview-content"></div></div><div class="example-code"></div></div>`;const u=t.querySelector(".example-body"),p=t.querySelector(".preview-content"),c=t.querySelector(".example-description p"),h=t.querySelector("[data-example]"),g=X(t.querySelector(".example-code"),y=>a?ft(y,i,m):i==="palette"?Ke(y,b):vt(y,i,m,i==="geometry"?d:ye(i)),{label:a?"Color picker":"Theme editor",baseName:a?"ColorPicker":"ThemeEditor",files:y=>i==="editing"||i==="form"?Cr(e,y):Kt(a?ft(y,i,m):i==="palette"?Ke(y,b):vt(y,i,m,i==="geometry"?d:ye(i)),y,a?"ColorPicker":"ThemeEditor")}),v=()=>{var y;if(l==null||l(),p.replaceChildren(),h&&(h.value=i),c.textContent=s.find(T=>T.id===i).description,i==="editing")l=gr(p);else if(i==="form")l=fr(p);else if(a){if(p.innerHTML=`<div class="color-demo">${nt(i)}<div class="color-result"><div class="swatch-checker"><div data-color-swatch></div></div><div><h3 data-color-name></h3><p data-color-match></p><code data-color-hex></code></div></div></div><details class="color-values"><summary>All color values</summary><dl data-color-values></dl></details>`,i==="custom"){const w=kt(m,()=>C());p.prepend(w)}const T=fe("#5268E080",i==="channels"?"rgb":"hex","area",i==="disabled"),x=p.querySelector("cp-provider");x.setStore(T);const E=()=>Fr(p,T.getColor());x.addEventListener("color-change",E),E(),l=()=>{x.removeEventListener("color-change",E),x.remove()}}else if(i==="palette"){p.innerHTML='<form class="swatch-settings"><label>Swatch shape<select data-swatch-shape><option value="square">Squares</option><option value="circle">Circles</option><option value="joined">Joined strip</option></select></label><label>500 shade label<input data-swatch-label maxlength="40"></label><label>Gap (px)<input type="number" data-swatch-gap min="0" max="24"></label><label>Height (px)<input type="number" data-swatch-size min="24" max="96"></label></form><div class="palette-example"></div>';const T=p.querySelector(".palette-example"),x={theme:U("#5268E0"),modeStorage:!1},E=document.createElement("tk-provider");E.setStore(te(x),x);const w=()=>{E.innerHTML=Me("primary",{shape:b.shape,classes:{root:"brand-palette",label:"brand-shade-label",swatch:"brand-shade"},labels:{500:b.label}});const me=document.createElement("style");me.textContent=eo(b).replaceAll(".brand-palette",`.explorer-${Ce} .brand-palette`).replaceAll(".brand-shade-label",`.explorer-${Ce} .brand-shade-label`).replaceAll(".brand-shade {",`.explorer-${Ce} .brand-shade {`),E.className=`explorer-${Ce}`,E.append(me),g.refresh()};T.append(E);const D=p.querySelector("[data-swatch-shape]"),ae=p.querySelector("[data-swatch-label]"),ie=p.querySelector("[data-swatch-gap]"),V=p.querySelector("[data-swatch-size]");D.value=b.shape,ae.value=b.label,ie.value=String(b.gap),V.value=String(b.size),p.querySelector("form").addEventListener("submit",me=>me.preventDefault()),p.querySelector("form").addEventListener("input",()=>{!ie.validity.valid||!V.validity.valid||(b={shape:D.value,label:ae.value,gap:ie.valueAsNumber,size:V.valueAsNumber},w())}),w(),l=()=>E.remove()}else{p.innerHTML=`<div class="theme-demo"><div class="theme-controls"></div><div class="sample-host">${to(ye(i).roles)}</div></div><details class="configuration"><summary>Generated configuration</summary><div class="output-actions"><label>Format<select data-output-format aria-label="Configuration format"><option value="json">JSON</option><option value="css">CSS</option><option value="tailwind">Tailwind CSS</option></select></label><button type="button" data-copy-output>Copy output</button><button type="button" data-download>Download</button></div><pre tabindex="0"></pre><p data-output-status aria-live="polite"></p></details>`;const T=p.querySelector(".sample-host"),x=p.querySelector("pre"),E=p.querySelector(".theme-controls"),w=[U("#5268E0",{name:"Indigo"}),U("#277D59",{name:"Forest"}),U("#C25D3D",{name:"Terracotta"})];let D="",ae="",ie="";const V=p.querySelector("[data-output-format]");V.value="json";const me=()=>{x.textContent=V.value==="tailwind"?ie:V.value==="css"?ae:D};V.addEventListener("change",me);const ve=G=>{oo(T,j(Dr(G))),D=G.json,ie=G.tailwind,ae=`:root {
${Object.entries(G.tokens).map(([O,P])=>`  ${O}: ${P};`).join(`
`)}
}`,me()};if(i==="custom"){p.prepend(kt(m,()=>C()));const G={theme:w[0],mode:"system",modeStorage:!1},O=te(G),P=document.createElement("tk-provider");P.setStore(O,G),P.innerHTML=Yt(),P.querySelector("cp-provider").setAttribute("value","#5268E0"),E.append(P);const A=O.subscribe(()=>ve(j(O.getSnapshot(),{roles:["primary"]})));ve(j(O.getSnapshot(),{roles:["primary"]})),l=()=>{A(),P.remove()}}else if(i==="presets"){const G={theme:w[0],mode:"system",modeStorage:Pt("docs:theme-mode")},O=te(G),P=document.createElement("tk-provider");P.setStore(O,G);const he=document.createElement("tk-select");he.dataset.themes=JSON.stringify(w),he.innerHTML=`<label class="cp-format">Theme<select>${w.map(M=>`<option value="${M.id}">${M.name}</option>`).join("")}</select></label>`,P.append(he);const A=document.createElement("div");A.className="mode-buttons",A.innerHTML=["system","light","dark"].map(M=>`<button type="button" data-tk-mode="${M}">${M[0].toUpperCase()+M.slice(1)}</button>`).join(""),P.append(A),P.insertAdjacentHTML("beforeend",`<section class="generated-palettes"><h3>Generated shades</h3>${["primary","secondary","accent"].map(M=>`<h4>${M}</h4>${Me(M,{shape:"joined"})}`).join("")}</section>`),E.append(P);const I=O.subscribe(()=>ve(j(O.getSnapshot())));ve(j(O.getSnapshot())),l=()=>{I(),P.remove()}}else{const G=i==="geometry"?d:ye(i);let O=te({theme:w[0],disabled:i==="disabled",mode:((y=G.modes)==null?void 0:y[0])??"light",modeStorage:!1,selection:G}),P;const he=()=>{var M,Y,ct,dt,pt,mt;P==null||P.destroy();const A=i==="geometry"?d:G;O.setSelection(A),((M=A.modes)==null?void 0:M.length)===1&&O.setMode(A.modes[0]),P=ot(E,{store:O,selection:A,theme:w[0],themes:w,modeStorage:!1,disabled:i==="disabled",radius:A.radius??[],width:A.width??[],backgroundControl:!!A.background,picker:{view:i==="rectangle"||i==="geometry"?"area":i==="single"?"wheel":"shared-wheel",roles:A.roles,controls:!1},onChange:ve}),(i==="single"||i==="geometry")&&((Y=P.element.querySelector("tk-select"))==null||Y.remove(),(ct=P.element.querySelector(".tk-harmony"))==null||ct.remove()),(i==="single"||((dt=A.modes)==null?void 0:dt.length)===1)&&((pt=P.element.querySelector('[aria-label="Theme mode"]'))==null||pt.remove()),(mt=P.element.querySelector("details"))==null||mt.remove();const I=document.createElement("section");I.className="generated-palettes",I.innerHTML=`<h3>Generated shades</h3>${(A.roles??["primary"]).map(Ve=>`<h4>${Ve[0].toUpperCase()+Ve.slice(1)}</h4>${Me(Ve,{shape:"joined"})}`).join("")}`,P.element.append(I),ve(P.getConfiguration())};if(i==="geometry"){const A=document.createElement("div");A.className="geometry-config",A.innerHTML=`<fieldset><legend>Fields included in this editor</legend><table><thead><tr><th>Target</th><th>Radius <small>rem</small></th><th>Border width <small>px</small></th></tr></thead><tbody>${Bo.map(I=>`<tr><th scope="row">${I==="DEFAULT"?"Default":I[0].toUpperCase()+I.slice(1)}</th>${["radius","width"].map(M=>{var Y;return`<td><input type="checkbox" data-geometry="${M}" data-target="${I}" aria-label="Include ${I} ${M}" ${(Y=d[M])!=null&&Y.includes(I)?"checked":""}></td>`}).join("")}</tr>`).join("")}</tbody></table></fieldset><fieldset class="geometry-modes"><legend>Appearance included in the export</legend>${["light","dark"].map(I=>{var M;return`<label><input type="checkbox" data-export-mode="${I}" ${(M=d.modes)!=null&&M.includes(I)?"checked":""}>${I==="light"?"Light":"Dark"}</label>`}).join("")}<label><input type="checkbox" data-export-background ${d.background?"checked":""}>Background and foreground</label></fieldset>`,A.addEventListener("change",()=>{var M;const I=[...A.querySelectorAll("[data-export-mode]:checked")].map(Y=>Y.dataset.exportMode);if(!I.length){A.querySelector(`[data-export-mode="${((M=d.modes)==null?void 0:M[0])??"light"}"]`).checked=!0;return}d={roles:["primary"],radius:[...A.querySelectorAll('[data-geometry="radius"]:checked')].map(Y=>Y.dataset.target),width:[...A.querySelectorAll('[data-geometry="width"]:checked')].map(Y=>Y.dataset.target),modes:I,background:A.querySelector("[data-export-background]").checked},he(),g.refresh()}),p.prepend(A)}he(),l=()=>P.destroy()}p.querySelector("[data-copy-output]").addEventListener("click",async()=>{try{await navigator.clipboard.writeText(V.value==="tailwind"?ie:V.value==="css"?ae:D),p.querySelector("[data-output-status]").textContent=`${V.value.toUpperCase()} copied.`}catch{p.querySelector("[data-output-status]").textContent="Select the output and copy it with your keyboard."}}),p.querySelector("[data-download]").addEventListener("click",()=>Br(V.value==="tailwind"?ie:V.value==="css"?ae:D,V.value==="tailwind"?"theme.tailwind.css":V.value==="css"?"theme.css":"theme.json"))}i==="custom"&&C(),g.refresh()};function C(){const y=p.querySelector(".custom-picker,.custom-theme");y&&(y.style.setProperty("--cp-controls-color",m.color),y.style.setProperty("--cp-thumb-size",m.size+"px"),y.style.setProperty("--cp-track-height",m.track+"px"),y.querySelector("[data-cp-part=thumb-text]").textContent=m.text,g.refresh())}return h==null||h.addEventListener("change",()=>{i=h.value,v()}),t.querySelectorAll(".view-tabs button[data-display]").forEach(y=>y.addEventListener("click",()=>{u.dataset.display=y.dataset.display,t.querySelectorAll(".view-tabs button").forEach(T=>T.setAttribute("aria-pressed",String(T===y)))})),v(),()=>l==null?void 0:l()}function Dr(t){return{theme:t.sourceTheme,disabled:!1,mode:t.mode,modePreference:t.modePreference,systemMode:t.systemMode,status:"ready",pending:!1,error:null,background:t.sourceTheme.backgroundMode??"preserve",style:t.css}}function Br(t,e){const o=URL.createObjectURL(new Blob([t],{type:"application/json"})),r=document.createElement("a");r.href=o,r.download=e,r.click(),URL.revokeObjectURL(o)}function yt(t){t.classList.add("rendering-lab"),t.innerHTML=`<div class="lab-controls" role="group" aria-label="Rendering scenario"><button data-scenario="standalone" aria-pressed="true">Standalone</button><button data-scenario="success" aria-pressed="false">Fetch success</button><button data-scenario="failure" aria-pressed="false">Fetch error</button><button data-scenario="timeout" aria-pressed="false">Timeout</button></div><div class="lab-description"><p data-lab-description></p><p class="muted" data-lab-request-note>The preview simulates a request locally. The source uses /api/theme. Return a Theme object as JSON. HTTP errors, invalid theme data and timeouts apply the fallback.</p></div><div class="view-tabs lab-view-tabs" role="group" aria-label="Loading example display"><button type="button" data-lab-display="preview" aria-pressed="true">Preview</button><button type="button" data-lab-display="code" aria-pressed="false">Code</button></div><div class="lab-grid" data-lab-display="preview"><div class="lab-preview"><div class="request-status" role="status"><span data-status></span><span data-lab-name></span></div><div data-lab-loading class="loading-example" hidden><div class="loading-bar"></div><h3>Loading theme</h3><p>This area is custom loading content.</p></div><div data-lab-content>${to()}</div><div class="error-example" data-lab-error hidden><p></p><button type="button" data-retry>Retry successfully</button></div><div class="lab-replay"><button type="button" data-replay>Run again</button><span data-lab-mode></span></div></div><div data-lab-code></div></div>`;let e,o,r="standalone",a=!1;const s=X(t.querySelector("[data-lab-code]"),m=>Nr(m,r),{label:"Theme loading",baseName:"ThemeLoadingExample"}),i={standalone:"A supplied theme is ready immediately. No fetch and no loading screen.",success:"Show custom loading content, then apply the returned theme after 1.2 seconds.",failure:"A failed request applies the Indigo fallback. The error and retry control remain available.",timeout:"A request that never resolves is cancelled after 2 seconds. The fallback is applied automatically."},l=()=>{o==null||o(),e==null||e(),a=!1,s.refresh(),t.querySelectorAll("[data-scenario]").forEach(c=>c.setAttribute("aria-pressed",String(c.dataset.scenario===r))),t.querySelector("[data-lab-description]").textContent=i[r];const m=U("#5268E0",{name:"Indigo fallback"}),b=U("#277D59",{name:"Forest response"}),d=r==="standalone"?{theme:b,modeStorage:!1}:{fallbackTheme:m,modeStorage:!1,timeoutMs:r==="timeout"?2e3:5e3,loadTheme:c=>new Promise((h,g)=>{const v=r==="failure"&&!a,C=r==="timeout"&&!a,$=window.setTimeout(()=>v?g(new Error("Simulated request failed.")):h(b),C?2e4:1200);c.addEventListener("abort",()=>{clearTimeout($),g(new DOMException("Aborted","AbortError"))},{once:!0})})},u=te(d);t.querySelector("[data-lab-request-note]").hidden=r==="standalone";const p=()=>{var h;const c=u.getSnapshot();t.querySelector("[data-status]").textContent=c.pending?"Loading":c.status==="fallback"?"Fallback applied":"Ready",t.querySelector("[data-lab-name]").textContent=c.theme.name,t.querySelector("[data-lab-loading]").hidden=c.status!=="loading",t.querySelector("[data-lab-content]").hidden=c.status==="loading",t.querySelector("[data-lab-error]").hidden=!c.error,t.querySelector("[data-lab-error] p").textContent=((h=c.error)==null?void 0:h.message)??"",t.querySelector("[data-lab-mode]").textContent=`${c.modePreference} / ${c.mode}`,oo(t.querySelector("[data-lab-content]"),j(c))};o=u.subscribe(p),p(),e=At(u,void 0,d),t.querySelector("[data-retry]").onclick=()=>{a=!0,u.reload()}};return t.querySelectorAll("button[data-lab-display]").forEach(m=>m.addEventListener("click",()=>{t.querySelector(".lab-grid").dataset.labDisplay=m.dataset.labDisplay,t.querySelectorAll("button[data-lab-display]").forEach(b=>b.setAttribute("aria-pressed",String(b===m)))})),t.querySelectorAll("[data-scenario]").forEach(m=>m.addEventListener("click",()=>{r=m.dataset.scenario,l()})),t.querySelector("[data-replay]").addEventListener("click",l),l(),()=>{o==null||o(),e==null||e()}}function kt(t,e){const o=document.createElement("div");return o.className="customization-form",o.innerHTML=`<p class="customization-title">Live customization</p><label>Thumb text<input data-custom="text" maxlength="3" value="${q(t.text)}"></label><label>Controls color<input data-custom="color" type="color" value="${t.color}"></label><label>Thumb size (px)<input data-custom="size" type="number" min="8" max="60" value="${t.size}"></label><label>Track height (px)<input data-custom="track" type="number" min="2" max="24" value="${t.track}"></label>`,o.addEventListener("input",r=>{const a=r.target,s=a.dataset.custom;if(s==="text"&&(t.text=a.value),s==="color"&&(t.color=a.value),s==="size"||s==="track"){const i=a.valueAsNumber;if(!Number.isFinite(i)||i<Number(a.min)||i>Number(a.max))return;t[s]=i}e()}),o}const Vr=`import { useState } from 'react';
import { ColorPicker } from '@salyra-ui/color-picker/react';
export default function ColorExample() {
  const [value, setValue] = useState('#5268E080');
  return (
    <ColorPicker.Root value={value} onValueChange={setValue}>
      <div className="composition-editor" data-composition="color">
        <ColorPicker.Wheel className="composition-wheel">
          <ColorPicker.Thumb className="composition-dot">
            <span className="composition-dot-text">Pick</span>
          </ColorPicker.Thumb>
        </ColorPicker.Wheel>
        <div className="composition-fields">
          <label>
            <span>Brightness</span>
            <ColorPicker.Slider channel="v" />
          </label>
          <label>
            <span>Opacity</span>
            <ColorPicker.Slider channel="alpha" />
          </label>
          <div className="composition-channels">
            {(['Red', 'Green', 'Blue'] as const).map((label, index) => (
              <label key={label}>
                <span>{label}</span>
                <ColorPicker.ChannelInput
                  format="rgb"
                  index={index as 0 | 1 | 2}
                />
              </label>
            ))}
          </div>
          <label>
            <span>Color value</span>
            <ColorPicker.Input />
          </label>
          <ColorPicker.FormatTrigger
            render={(color) =>
              \`Show next format (\${color.format.toUpperCase()})\`
            }
          />
          <output>{value}</output>
        </div>
      </div>
    </ColorPicker.Root>
  );
}
`,Or=`<script lang="ts">
  import { ColorPicker } from '@salyra-ui/color-picker/svelte';
  let value = $state('#5268E080');
<\/script>

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
`,jr=`<script setup lang="ts">
import { ref } from 'vue';
import { ColorPicker } from '@salyra-ui/color-picker/vue';
const value = ref('#5268E080');
<\/script>
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
`,Ur=`import { Component } from '@angular/core';
import {
  ColorRoot,
  ColorPlane,
  ColorThumb,
  ColorRange,
  ColorField,
  ColorFormatTrigger,
  createColorStore,
} from '@salyra-ui/color-picker/angular';
@Component({
  selector: 'color-composition',
  standalone: true,
  imports: [
    ColorRoot,
    ColorPlane,
    ColorThumb,
    ColorRange,
    ColorField,
    ColorFormatTrigger,
  ],
  template: \` <section cpRoot [store]="store">
    <div class="composition-editor" data-composition="color">
      <div cpWheel class="composition-wheel" aria-label="Brand color">
        <span cpThumb class="composition-dot"
          ><span class="composition-dot-text">Pick</span></span
        >
      </div>
      <div class="composition-fields">
        <label><span>Brightness</span><input cpSlider="v" /></label
        ><label><span>Opacity</span><input cpSlider="alpha" /></label>
        <div class="composition-channels">
          <label
            ><span>Red</span><input cpInput format="rgb" [index]="0" /></label
          ><label
            ><span>Green</span><input cpInput format="rgb" [index]="1" /></label
          ><label
            ><span>Blue</span><input cpInput format="rgb" [index]="2"
          /></label>
        </div>
        <label><span>Color value</span><input cpInput /></label
        ><button cpFormatTrigger>Show next format</button>
      </div>
    </div>
  </section>\`,
})
export class ColorComposition {
  readonly store = createColorStore('#5268E080');
}
`,Wr=`---
import ColorRoot from '@salyra-ui/color-picker/astro/ColorRoot.astro';
import ColorWheel from '@salyra-ui/color-picker/astro/ColorWheelSurface.astro';
import ColorThumb from '@salyra-ui/color-picker/astro/ColorThumb.astro';
import ColorSlider from '@salyra-ui/color-picker/astro/ColorRange.astro';
import ColorInput from '@salyra-ui/color-picker/astro/ColorField.astro';
import ColorFormatTrigger from '@salyra-ui/color-picker/astro/ColorFormatTrigger.astro';
const value = '#5268E080';
---

<ColorRoot {value}>
  <div class="composition-editor" data-composition="color">
    <ColorWheel {value} class="composition-wheel">
      <ColorThumb {value} view="wheel" class="composition-dot">
        <span class="composition-dot-text">Pick</span>
      </ColorThumb>
    </ColorWheel>
    <div class="composition-fields">
      <label>
        <span>Brightness</span>
        <ColorSlider {value} channel="v" />
      </label>
      <label>
        <span>Opacity</span>
        <ColorSlider {value} channel="alpha" />
      </label>
      <div class="composition-channels">
        {['Red', 'Green', 'Blue'].map((label, index) => (
          <label>
            <span>{label}</span>
            <ColorInput {value} format="rgb" index={index as 0 | 1 | 2} />
          </label>
        ))}
      </div>
      <label>
        <span>Color value</span>
        <ColorInput {value} />
      </label>
      <ColorFormatTrigger>Show next format</ColorFormatTrigger>
    </div>
  </div>
</ColorRoot>
`,Gr=`<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width,initial-scale=1" />
    <link rel="stylesheet" href="./styles.css" />
    <title>Custom color picker</title>
  </head>
  <body>
    <div class="composition-editor" data-composition="color">
      <div
        class="composition-wheel"
        data-cp-control="wheel"
        role="group"
        aria-label="Brand color"
      >
        <span data-cp-part="thumb" class="composition-dot"
          ><span class="composition-dot-text">Pick</span></span
        >
      </div>
      <div class="composition-fields">
        <label
          ><span>Brightness</span
          ><input
            type="range"
            min="0"
            max="100"
            data-cp-control="slider"
            data-channel="v" /></label
        ><label
          ><span>Opacity</span
          ><input
            type="range"
            min="0"
            max="100"
            step=".1"
            data-cp-control="slider"
            data-channel="alpha"
        /></label>
        <div class="composition-channels">
          <label
            ><span>Red</span
            ><input
              type="number"
              data-cp-control="input"
              data-format="rgb"
              data-index="0" /></label
          ><label
            ><span>Green</span
            ><input
              type="number"
              data-cp-control="input"
              data-format="rgb"
              data-index="1" /></label
          ><label
            ><span>Blue</span
            ><input
              type="number"
              data-cp-control="input"
              data-format="rgb"
              data-index="2"
          /></label>
        </div>
        <label><span>Color value</span><input data-cp-control="input" /></label
        ><button type="button" data-cp-control="format">Show next format</button
        ><output></output>
      </div>
    </div>
    <script src="/assets/color-picker.min.js"><\/script>
    <script>
      const root = document.querySelector('[data-composition="color"]');
      const store = ColorPicker.createColorStore('#5268E080');
      const controls = ColorPicker.mountColorControls(root, store);
      const render = () =>
        (root.querySelector('output').textContent = store.getSnapshot().value);
      render();
      const unsubscribe = store.subscribe(render);
      // When this editor is removed, call controls.destroy() and unsubscribe().
    <\/script>
  </body>
</html>
`,zr=`import { ColorPicker } from '@salyra-ui/color-picker/react';
import {
  ThemeStudio,
  ThemeExport,
  ThemePalette,
  generateTheme,
} from '@salyra-ui/theme-studio/react';
const options = {
  theme: generateTheme('#5268E0'),
  mode: 'dark' as const,
  modeStorage: false as const,
  selection: {
    roles: ['primary', 'accent'] as const,
    radius: ['card'] as const,
    width: ['button'] as const,
  },
};
export default function ThemeExample() {
  return (
    <ThemeStudio.Root options={options}>
      <ThemeStudio.Scope>
        <ThemeStudio.PickerRoot roles={['primary', 'accent']}>
          <div className="composition-editor" data-composition="theme">
            <ThemeStudio.Wheel className="composition-wheel" />
            <div className="composition-fields">
              <div className="composition-roles">
                <ThemeStudio.RoleTrigger role="primary">
                  Brand color
                </ThemeStudio.RoleTrigger>
                <ThemeStudio.RoleTrigger role="accent">
                  Highlight
                </ThemeStudio.RoleTrigger>
              </div>
              <label>
                <span>Brightness</span>
                <ColorPicker.Slider channel="v" />
              </label>
              <label>
                <span>Active color</span>
                <ColorPicker.Input format="hex" />
              </label>
              <label>
                <span>Card corners in rem</span>
                <ThemeStudio.GeometryInput kind="radius" target="card" />
              </label>
              <label>
                <span>Button border in px</span>
                <ThemeStudio.GeometryInput kind="width" target="button" />
              </label>
              <article className="composition-preview">
                <h3>Live theme</h3>
                <button type="button">Continue</button>
              </article>
            </div>
          </div>
        </ThemeStudio.PickerRoot>
        <ThemePalette role="primary" shape="joined" />
        <details>
          <summary>Selected configuration</summary>
          <ThemeExport />
        </details>
      </ThemeStudio.Scope>
    </ThemeStudio.Root>
  );
}
`,Jr=`<script lang="ts">
  import { ColorPicker } from '@salyra-ui/color-picker/svelte';
  import {
    ThemeStudio,
    ThemeExport,
    ThemePalette,
    generateTheme,
  } from '@salyra-ui/theme-studio/svelte';
  const options = {
    theme: generateTheme('#5268E0'),
    mode: 'dark' as const,
    modeStorage: false as const,
    selection: {
      roles: ['primary', 'accent'] as const,
      radius: ['card'] as const,
      width: ['button'] as const,
    },
  };
<\/script>

<ThemeStudio.Root {options}>
  <ThemeStudio.Scope>
    <ThemeStudio.PickerRoot roles={['primary', 'accent']}>
      <div class="composition-editor" data-composition="theme">
        <ThemeStudio.Wheel class="composition-wheel" />
        <div class="composition-fields">
          <div class="composition-roles">
            <ThemeStudio.RoleTrigger role="primary"
              >Brand color</ThemeStudio.RoleTrigger
            ><ThemeStudio.RoleTrigger role="accent"
              >Highlight</ThemeStudio.RoleTrigger
            >
          </div>
          <label
            ><span>Brightness</span><ColorPicker.Slider channel="v" /></label
          >
          <label
            ><span>Active color</span><ColorPicker.Input format="hex" /></label
          >
          <label
            ><span>Card corners in rem</span><ThemeStudio.GeometryInput
              kind="radius"
              target="card"
            /></label
          >
          <label
            ><span>Button border in px</span><ThemeStudio.GeometryInput
              kind="width"
              target="button"
            /></label
          >
          <article class="composition-preview">
            <h3>Live theme</h3>
            <button type="button">Continue</button>
          </article>
        </div>
      </div>
    </ThemeStudio.PickerRoot>
    <ThemePalette role="primary" shape="joined" />
    <details><summary>Selected configuration</summary><ThemeExport /></details>
  </ThemeStudio.Scope>
</ThemeStudio.Root>
`,Kr=`<script setup lang="ts">
import { ColorPicker } from '@salyra-ui/color-picker/vue';
import {
  ThemeStudio,
  ThemeExport,
  ThemePalette,
  generateTheme,
} from '@salyra-ui/theme-studio/vue';
const options = {
  theme: generateTheme('#5268E0'),
  mode: 'dark' as const,
  modeStorage: false as const,
  selection: {
    roles: ['primary', 'accent'] as const,
    radius: ['card'] as const,
    width: ['button'] as const,
  },
};
<\/script>
<template>
  <ThemeStudio.Root :options="options"
    ><ThemeStudio.Scope>
      <ThemeStudio.PickerRoot :roles="['primary', 'accent']"
        ><div class="composition-editor" data-composition="theme">
          <ThemeStudio.Wheel class="composition-wheel" />
          <div class="composition-fields">
            <div class="composition-roles">
              <ThemeStudio.RoleTrigger role="primary"
                >Brand color</ThemeStudio.RoleTrigger
              ><ThemeStudio.RoleTrigger role="accent"
                >Highlight</ThemeStudio.RoleTrigger
              >
            </div>
            <label
              ><span>Brightness</span><ColorPicker.Slider channel="v" /></label
            ><label
              ><span>Active color</span><ColorPicker.Input format="hex"
            /></label>
            <label
              ><span>Card corners in rem</span
              ><ThemeStudio.GeometryInput kind="radius" target="card" /></label
            ><label
              ><span>Button border in px</span
              ><ThemeStudio.GeometryInput kind="width" target="button"
            /></label>
            <article class="composition-preview">
              <h3>Live theme</h3>
              <button type="button">Continue</button>
            </article>
          </div>
        </div></ThemeStudio.PickerRoot
      ><ThemePalette role="primary" shape="joined" />
      <details>
        <summary>Selected configuration</summary>
        <ThemeExport />
      </details> </ThemeStudio.Scope
  ></ThemeStudio.Root>
</template>
`,Xr=`import { Component, DestroyRef, inject, signal } from '@angular/core';
import {
  ColorField,
  ColorRange,
  ColorPlane,
  thumbPosition,
} from '@salyra-ui/color-picker/angular';
import {
  ThemeRoot,
  ThemeVariableScope,
  ThemePickerRoot,
  ThemeRoleTrigger,
  ThemeGeometryInput,
  ThemeExport,
  generateTheme,
  createThemeStore,
  createThemePickerStore,
  themePickerMarkers,
} from '@salyra-ui/theme-studio/angular';
@Component({
  selector: 'theme-composition',
  standalone: true,
  imports: [
    ThemeRoot,
    ThemeVariableScope,
    ThemePickerRoot,
    ThemeRoleTrigger,
    ThemeGeometryInput,
    ThemeExport,
    ColorField,
    ColorRange,
    ColorPlane,
  ],
  template: \` <section tkRoot [store]="store">
    <div tkScope>
      <div tkPickerRoot [picker]="picker">
        <div class="composition-editor" data-composition="theme">
          <div
            cpWheel
            class="composition-wheel"
            [cpMarkers]="markers()"
            [cpActiveId]="state().activeRole"
            (markerSelect)="select($event)"
            (markerChange)="change($event)"
          >
            @for (marker of markers(); track marker.id) {
              <button
                type="button"
                class="cp-wheel-marker"
                [attr.data-marker-id]="marker.id"
                [attr.aria-label]="marker.ariaLabel"
                [attr.aria-pressed]="state().activeRole === marker.id"
                [disabled]="state().colors[state().activeRole].disabled"
                [style.position]="'absolute'"
                [style.transform]="'translate(-50%,-50%)'"
                [style.left]="position(marker).left"
                [style.top]="position(marker).top"
                [style.background]="marker.color.hex"
              >
                {{ marker.label }}
              </button>
            }
          </div>
          <div class="composition-fields">
            <div class="composition-roles">
              <button tkRoleTrigger="primary">Brand color</button
              ><button tkRoleTrigger="accent">Highlight</button>
            </div>
            <label><span>Brightness</span><input cpSlider="v" /></label
            ><label
              ><span>Active color</span><input cpInput format="hex"
            /></label>
            <label
              ><span>Card corners in rem</span
              ><input tkGeometry="radius" target="card" /></label
            ><label
              ><span>Button border in px</span
              ><input tkGeometry="width" target="button"
            /></label>
            <article class="composition-preview">
              <h3>Live theme</h3>
              <button type="button">Continue</button>
            </article>
          </div>
        </div>
        <details>
          <summary>Selected configuration</summary>
          <tk-export />
        </details>
      </div>
    </div>
  </section>\`,
})
export class ThemeComposition {
  readonly store = createThemeStore({
    theme: generateTheme('#5268E0'),
    mode: 'dark',
    modeStorage: false,
    selection: {
      roles: ['primary', 'accent'],
      radius: ['card'],
      width: ['button'],
    },
  });
  readonly picker = createThemePickerStore(this.store, {
    roles: ['primary', 'accent'],
  });
  readonly state = signal(this.picker.getSnapshot());
  constructor() {
    inject(DestroyRef).onDestroy(
      this.picker.subscribe(() => this.state.set(this.picker.getSnapshot())),
    );
  }
  readonly markers = () => themePickerMarkers(this.state());
  readonly position = (marker: ReturnType<typeof themePickerMarkers>[number]) =>
    thumbPosition(marker.color, 'wheel');
  select(id: string) {
    this.picker.selectRole(id as 'primary' | 'accent');
  }
  change(event: {
    id: string;
    hsv: Partial<{ h: number; s: number; v: number }>;
  }) {
    this.picker.setHSV(event.id as 'primary' | 'accent', event.hsv);
  }
}
`,Yr=`---
import ThemeVariableScope from '@salyra-ui/theme-studio/astro/ThemeVariableScope.astro';
import ThemeRoot from '@salyra-ui/theme-studio/astro/ThemeRoot.astro';
import ThemePickerRoot from '@salyra-ui/theme-studio/astro/ThemePickerRoot.astro';
import ThemeRoleTrigger from '@salyra-ui/theme-studio/astro/ThemeRoleTrigger.astro';
import ThemeWheel from '@salyra-ui/theme-studio/astro/ThemePickerWheel.astro';
import ThemeGeometryInput from '@salyra-ui/theme-studio/astro/ThemeGeometryInput.astro';
import ThemeExport from '@salyra-ui/theme-studio/astro/ThemeExport.astro';
import ColorSlider from '@salyra-ui/color-picker/astro/ColorRange.astro';
import ColorInput from '@salyra-ui/color-picker/astro/ColorField.astro';
import { generateTheme } from '@salyra-ui/theme-studio';
const value = '#5268E0',
  theme = generateTheme(value),
  roles = ['primary', 'accent'] as const;
const options = {
  theme,
  mode: 'dark' as const,
  modeStorage: false as const,
  selection: { roles, radius: ['card'] as const, width: ['button'] as const },
};
---

<ThemeRoot {options}>
  <ThemeVariableScope {options}>
    <ThemePickerRoot {roles}>
      <div class="composition-editor" data-composition="theme">
        <ThemeWheel {theme} {roles} class="composition-wheel" />
        <div class="composition-fields">
          <div class="composition-roles">
            <ThemeRoleTrigger role="primary">Brand color</ThemeRoleTrigger>
            <ThemeRoleTrigger role="accent">Highlight</ThemeRoleTrigger>
          </div>
          <label>
            <span>Brightness</span>
            <ColorSlider {value} channel="v" />
          </label>
          <label>
            <span>Active color</span>
            <ColorInput {value} format="hex" />
          </label>
          <label>
            <span>Card corners in rem</span>
            <ThemeGeometryInput {theme} kind="radius" target="card" />
          </label>
          <label>
            <span>Button border in px</span>
            <ThemeGeometryInput {theme} kind="width" target="button" />
          </label>
          <article class="composition-preview">
            <h3>Live theme</h3>
            <button type="button">Continue</button>
          </article>
        </div>
      </div>
      <details>
        <summary>Selected configuration</summary>
        <ThemeExport {theme} selection={options.selection} />
      </details>
    </ThemePickerRoot>
  </ThemeVariableScope>
</ThemeRoot>
`,_r=`<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width,initial-scale=1" />
    <link rel="stylesheet" href="./styles.css" />
    <title>Custom theme editor</title>
  </head>
  <body>
    <section data-composition="theme">
      <div class="composition-editor">
        <div
          class="composition-wheel"
          data-tk-control="wheel"
          role="group"
          aria-label="Theme colors"
        >
          <button
            type="button"
            data-marker-id="primary"
            data-cp-part="marker"
            aria-label="Brand color"
          >
            P</button
          ><button
            type="button"
            data-marker-id="accent"
            data-cp-part="marker"
            aria-label="Highlight"
          >
            A
          </button>
        </div>
        <div class="composition-fields">
          <div class="composition-roles">
            <button type="button" data-tk-control="role" data-role="primary">
              Brand color</button
            ><button type="button" data-tk-control="role" data-role="accent">
              Highlight
            </button>
          </div>
          <label
            ><span>Brightness</span
            ><input
              type="range"
              min="0"
              max="100"
              data-cp-control="slider"
              data-channel="v" /></label
          ><label
            ><span>Active color</span
            ><input data-cp-control="input" data-format="hex"
          /></label>
          <label
            ><span>Card corners in rem</span
            ><input
              type="number"
              min="0"
              max="1000"
              step=".125"
              data-tk-control="geometry"
              data-kind="radius"
              data-target="card" /></label
          ><label
            ><span>Button border in px</span
            ><input
              type="number"
              min="0"
              max="1000"
              data-tk-control="geometry"
              data-kind="width"
              data-target="button"
          /></label>
          <article class="composition-preview">
            <h3>Live theme</h3>
            <button type="button">Continue</button>
          </article>
        </div>
      </div>
      <details>
        <summary>Selected configuration</summary>
        <pre data-configuration></pre>
      </details>
    </section>
    <script src="/assets/theme-studio.min.js"><\/script>
    <script>
      const root = document.querySelector('[data-composition="theme"]');
      const store = ThemeStudio.createThemeStore({
        theme: ThemeStudio.generateTheme('#5268E0'),
        mode: 'dark',
        modeStorage: false,
      });
      const scope = ThemeStudio.bindThemeScope(root, store);
      const controls = ThemeStudio.mountThemeControls(root, store, {
        roles: ['primary', 'accent'],
      });
      const render = () =>
        (root.querySelector('[data-configuration]').textContent =
          controls.getConfiguration().json);
      render();
      const unsubscribe = store.subscribe(render);
      // On removal, call controls.destroy(), scope() and unsubscribe().
    <\/script>
  </body>
</html>
`,Zr=`.composition-editor {
  display: grid;
  grid-template-columns: minmax(180px, 240px) minmax(0, 1fr);
  gap: 32px;
  align-items: start;
  padding: 24px;
  border: 1px solid #dcdce2;
  background: #fff;
  color: #17171a;
  font-family: 'Helvetica Neue', Arial, sans-serif;
}
.composition-wheel {
  width: 100%;
  max-width: 240px;
}
.composition-dot {
  width: 18px;
  height: 18px;
  border: 2px solid white;
  border-radius: 4px;
  box-shadow: 0 0 0 1px #17171a;
}
.composition-dot-text {
  position: absolute;
  left: 50%;
  top: 24px;
  transform: translateX(-50%);
  font-size: 11px;
  background: #17171a;
  color: #fff;
  padding: 3px 6px;
  white-space: nowrap;
}
.composition-fields {
  display: grid;
  gap: 16px;
  min-width: 0;
}
.composition-fields label {
  display: grid;
  gap: 8px;
  min-width: 0;
  font-size: 13px;
}
.composition-fields input:not([type='range']) {
  box-sizing: border-box;
  width: 100%;
  min-width: 0;
  height: 40px;
  padding: 8px 10px;
  border: 1px solid #dcdce2;
  border-radius: 6px;
  background: #fff;
  color: #17171a;
  font: inherit;
}
.composition-fields input[aria-invalid='true'] {
  outline: 2px solid #e4002b;
}
.composition-fields input[type='range'] {
  width: 100%;
  accent-color: #e4002b;
}
.composition-channels {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 8px;
}
.composition-fields button {
  min-height: 40px;
  padding: 8px 12px;
  border: 1px solid #dcdce2;
  border-radius: 6px;
  background: #fff;
  color: #17171a;
  font: inherit;
  cursor: pointer;
}
.composition-roles {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}
.composition-roles [aria-pressed='true'] {
  border-color: #17171a;
  background: #17171a;
  color: #fff;
}
.composition-wheel [data-cp-part='marker'] {
  width: 26px;
  height: 26px;
  padding: 0;
  border: 2px solid white;
  border-radius: 6px;
  color: #fff;
  font-size: 11px;
  text-shadow: 0 1px 2px #000;
  box-shadow: 0 0 0 1px #17171a;
}
.composition-wheel [data-cp-part='marker'][data-small='true'] {
  width: 14px;
  height: 14px;
}
.composition-preview {
  padding: 20px;
  background: hsl(var(--background));
  color: hsl(var(--foreground));
  border-radius: var(--border-radius-card);
}
.composition-preview h3 {
  margin: 0 0 16px;
  font-size: 18px;
}
.composition-preview button {
  background: hsl(var(--primary));
  color: hsl(var(--primary-foreground));
  border: var(--border-width-button) solid hsl(var(--accent));
}
.composition-editor :focus-visible {
  outline: 2px solid #e4002b;
  outline-offset: 3px;
}
.composition-editor :disabled {
  opacity: 0.5;
  cursor: default;
}
@media (max-width: 600px) {
  .composition-editor {
    grid-template-columns: 1fr;
    gap: 24px;
    padding: 16px;
  }
  .composition-wheel {
    margin-inline: auto;
  }
}
`,Xe={"color-picker":{React:Vr,Svelte:Or,Vue:jr,Angular:Ur,Astro:Wr,Vanilla:Gr},"theme-studio":{React:zr,Svelte:Jr,Vue:Kr,Angular:Xr,Astro:Yr,Vanilla:_r}};function Qr(t,e){const o={React:"tsx",Svelte:"svelte",Vue:"vue",Angular:"ts",Astro:"astro",Vanilla:"html"}[e],r=Xe[t][e];return[{name:`${t==="color-picker"?"Color":"Theme"}Example.${o}`,code:r},{name:"styles.css",code:Zr},{name:"README.md",code:`# Composable ${t}

This example uses the v1 composition API.

Keep styles.css next to the example and import it in your application entry. The example styles are local to .composition-editor.

${e==="Vanilla"?"Download "+t+".min.js from the documentation downloads and place it at /assets/"+t+".min.js. The standard .js build has the same API. No framework or default stylesheet is required.":"Install @salyra-ui/"+t+" and your framework. Import styles.css once. ThemePalette and ThemeExport are ready-made presets and use @salyra-ui/theme-studio/styles.min.css. Astro receives explicit value/theme seeds for its server-rendered controls."}
`}]}function qe(t,e){const o=`composition-${e}`;t.innerHTML=`<div class="composition-example" data-example="composition"><div class="example-toolbar"><div class="view-tabs" role="tablist" aria-label="Composition view"><button type="button" role="tab" aria-selected="true" data-composition-view="preview" aria-controls="${o}-preview">Preview</button><button type="button" role="tab" aria-selected="false" data-composition-view="code" aria-controls="${o}-code">Code</button></div></div><div id="${o}-preview" role="tabpanel" data-preview></div><div id="${o}-code" role="tabpanel" data-code hidden></div></div>`;const r=t.querySelector("[data-preview]"),a=t.querySelector("[data-code]");X(a,b=>Xe[e][b],{label:"Composable controls",files:b=>Qr(e,b),downloadName:()=>e+"-composition"});const s=new DOMParser().parseFromString(Xe[e].Vanilla,"text/html");s.querySelectorAll("script").forEach(b=>b.remove()),r.append(...Array.from(s.body.children));const i=r.firstElementChild,l=[];if(e==="color-picker"){const b=fe("#5268E080"),d=tt(i,b),u=()=>{i.querySelector("output").textContent=b.getSnapshot().value};u(),l.push(b.subscribe(u),d.destroy)}else{const b=te({theme:U("#5268E0"),mode:"dark",modeStorage:!1}),d=et(i,b),u=zt(i,b,{roles:["primary","accent"]}),p=()=>{i.querySelector("[data-configuration]").textContent=u.getConfiguration().json};p(),l.push(b.subscribe(p),u.destroy,d)}const m=t.querySelectorAll(".example-toolbar button[data-composition-view]");return m.forEach(b=>b.addEventListener("click",()=>{const d=b.dataset.compositionView==="preview";r.hidden=!d,a.hidden=d,m.forEach(u=>u.setAttribute("aria-selected",String(u===b)))})),()=>{l.reverse().forEach(b=>b()),t.replaceChildren()}}const Ye="#5268E0",ee=t=>`<div class="recipe-actions">${t}</div>`,H=(t,e)=>`<button type="button" data-action="${t}">${e}</button>`,He=(t,e,o)=>`<label>${t}<select aria-label="${t}" data-${e}>${o}</select></label>`,N=(t,e,o)=>{t.querySelector(`[data-action="${e}"]`).onclick=o},K=(t,e)=>{t.querySelector("[data-result]").textContent=e};function ea(t,e){t.classList.add("workflow-preview");const o=[],r=(l,m)=>{o.push(l.subscribe(m))},a=fe("#5268E080");t.innerHTML='<div data-picker></div><div data-controls></div><pre data-result aria-live="polite"></pre>';const s=jt(t.querySelector("[data-picker]"),{store:a});o.push(s.destroy);const i=t.querySelector("[data-controls]");if(e==="history"){const l=It(a,{limit:20});i.innerHTML=ee(H("undo","Undo")+H("redo","Redo")),N(t,"undo",l.undo),N(t,"redo",l.redo);const m=()=>{const b=l.getSnapshot();t.querySelector('[data-action="undo"]').disabled=!b.canUndo,t.querySelector('[data-action="redo"]').disabled=!b.canRedo,K(t,`${a.getSnapshot().value}
History position ${b.index+1} of ${b.length}`)};r(l,m),r(a,m),o.push($e(t,l),l.destroy),m()}else if(e==="collections"){const l=Qe({limit:8,favorites:[Ye,"#277D59"],storage:Ft("examples:recent-colors")});l.load(),i.innerHTML=ee(H("remember","Save to recent")+H("favorite","Toggle favorite")+H("clear","Clear recent"))+"<div data-recent></div><div data-favorites></div>";const m=De(t.querySelector("[data-recent]"),a,l,{label:"Recent colors"}),b=De(t.querySelector("[data-favorites]"),a,l,{kind:"favorites",label:"Favorite colors",classes:{item:"workflow-swatch"}});o.push(m.destroy,b.destroy),N(t,"remember",()=>l.remember(a.getSnapshot().value)),N(t,"favorite",()=>l.toggleFavorite(a.getSnapshot().value)),N(t,"clear",l.clearRecent);const d=()=>K(t,JSON.stringify(l.getSnapshot(),null,2));r(l,d),d()}else if(e==="contrast"){i.innerHTML='<label class="workflow-field">Background<input type="color" data-background value="#ffffff"></label>'+He("Text size","text",'<option value="normal">Normal</option><option value="large">Large</option>')+"<article data-text-sample>Text on the selected background</article>"+ee(H("suggest","Use suggested foreground"));const l=t.querySelector("[data-background]"),m=t.querySelector("[data-text]"),b=()=>Be(a.getSnapshot().value,l.value,{text:m.value}),d=()=>{const u=b(),p=t.querySelector("[data-text-sample]");p.style.color=a.getSnapshot().value,p.style.background=l.value,K(t,`Contrast ${u.ratio.toFixed(2)}:1
AA ${u.aa?"passes":"fails"}
AAA ${u.aaa?"passes":"fails"}
Suggested foreground ${u.suggestedForeground}`)};l.oninput=d,m.onchange=d,N(t,"suggest",()=>a.setHex(b().suggestedForeground)),r(a,d),d()}return()=>{o.forEach(l=>l()),t.replaceChildren()}}function ta(t,e){var a;t.classList.add("workflow-preview");const o=[],r=(s,i)=>{o.push(s.subscribe(i))};if(e==="schema"){const s=U(Ye);t.innerHTML=ee(H("legacy","Unversioned theme")+H("v0","Version 0")+H("future","Future version"))+'<label class="workflow-field">Saved theme JSON<textarea data-json rows="10" spellcheck="false"></textarea></label>'+ee(H("validate","Validate & migrate"))+'<pre data-result role="status"></pre>';const i=t.querySelector("[data-json]"),l=m=>{const b={...s};delete b.schemaVersion,m!==void 0&&(b.schemaVersion=m),i.value=JSON.stringify(b,null,2),K(t,"Choose Validate & migrate to read this data.")};N(t,"legacy",()=>l()),N(t,"v0",()=>l(0)),N(t,"future",()=>l(99)),N(t,"validate",()=>{try{const m=Oo(JSON.parse(i.value));K(t,`Loaded ${m.name}
schemaVersion: ${m.schemaVersion}`)}catch(m){K(t,m instanceof Error?m.message:"Invalid theme data")}}),l()}else{const s=te({theme:U(Ye),mode:"light",modeStorage:!1}),i=e==="locks"||e==="conflict"?qt(s):void 0,l=(i==null?void 0:i.store)??s;t.innerHTML='<div data-picker></div><div data-controls></div><div data-theme-sample class="recipe-preview"><h3>Applied theme</h3><button type="button">Save changes</button></div><pre data-result aria-live="polite"></pre>',e==="locks"&&(t.querySelector("[data-theme-sample] h3").textContent="Generated theme");const m=t.querySelector("[data-controls]"),b=ot(t.querySelector("[data-picker]"),{store:l,modeStorage:!1,picker:{view:"area",roles:["primary","secondary","accent"],controls:!1},radius:["card"],width:["button"],backgroundControl:e==="locks"});(a=b.element.querySelector("details"))==null||a.remove(),o.push(b.destroy);const d=()=>{t.querySelector("[data-theme-sample]").style.cssText=s.getSnapshot().style};if(r(s,d),d(),e==="history"){const u=Vo(l,{limit:20});m.innerHTML=ee(H("undo","Undo")+H("redo","Redo")),N(t,"undo",u.undo),N(t,"redo",u.redo);const p=()=>{const c=u.getSnapshot();t.querySelector('[data-action="undo"]').disabled=!c.canUndo,t.querySelector('[data-action="redo"]').disabled=!c.canRedo,K(t,`${l.getSnapshot().theme.name}
History position ${c.index+1} of ${c.length}`)};r(u,p),o.push($e(t,u),u.destroy),p()}else if(e==="locks"){m.innerHTML='<fieldset class="workflow-locks"><legend>Keep during generation</legend>'+[...Te,"background"].map(p=>`<label><input type="checkbox" data-lock="${p}">${p}</label>`).join("")+'</fieldset><label class="workflow-field">New primary<input data-seed type="color" value="#c25d3d"></label>'+ee(H("generate","Generate theme"));for(const p of m.querySelectorAll("[data-lock]"))p.onchange=()=>i.setLocked(p.dataset.lock,p.checked);N(t,"generate",()=>l.generate(t.querySelector("[data-seed]").value));const u=()=>{const p=l.getSnapshot();K(t,JSON.stringify({locked:i.getSnapshot().locked,colors:Object.fromEntries(Te.map(c=>[c,Ie(p.theme,c)])),background:p.theme.structure.websitePreset.background},null,2)),t.querySelector("[data-theme-sample]").style.cssText=p.style};r(l,u),r(i,u),u()}else if(e==="collections"){const u=Ht({limit:8,favorites:[U("#277D59",{name:"Forest"})],storage:Nt("examples:saved-themes")});u.load(),m.innerHTML=ee(H("remember","Save to recent")+H("favorite","Toggle favorite"))+He("Recent themes","recent","")+He("Favorite themes","favorites",""),N(t,"remember",()=>u.remember(l.getSnapshot().theme)),N(t,"favorite",()=>u.toggleFavorite(l.getSnapshot().theme));const p=()=>{const c=u.getSnapshot();for(const h of["recent","favorites"]){const g=t.querySelector(`[data-${h}]`);g.replaceChildren(new Option("Choose a theme",""));for(const v of c[h])g.add(new Option(v.name,v.id));g.disabled=!c[h].length}K(t,JSON.stringify({recent:c.recent.map(h=>({id:h.id,name:h.name})),favorites:c.favorites.map(h=>({id:h.id,name:h.name}))},null,2))};for(const c of["recent","favorites"])t.querySelector(`[data-${c}]`).onchange=h=>{const g=u.getSnapshot()[c].find(v=>v.id===h.currentTarget.value);g&&l.setTheme(g)};r(u,p),p()}else if(e==="contrast"){m.innerHTML='<div data-pairs class="workflow-pairs"></div>';const u=()=>{const p=l.getSnapshot(),c=t.querySelector("[data-pairs]");c.replaceChildren();const h=Te.map(g=>{const v=jo(p,g),C=document.createElement("article");return C.style.background=Ie(p.theme,g),C.style.color=v.foreground,C.textContent=`${g} ${v.ratio.toFixed(2)}:1`,c.append(C),`${g}
AA ${v.aa?"passes":"fails"} · AAA ${v.aaa?"passes":"fails"}`});K(t,h.join(`

`))};r(l,u),u()}else if(e==="tailwind"){m.innerHTML='<fieldset class="workflow-locks"><legend>Export fields</legend>'+Te.map(c=>`<label><input type="checkbox" data-role="${c}" ${c==="primary"?"checked":""}>${c}</label>`).join("")+'<label><input type="checkbox" data-radius>Card radius</label><label><input type="checkbox" data-width>Button border width</label><label><input type="checkbox" data-background>Background</label></fieldset>'+He("Appearance","appearance",'<option value="light">Light</option><option value="dark">Dark</option><option value="both">Light & dark</option>')+ee(H("copy","Copy Tailwind CSS"))+'<p data-copy-status role="status"></p>';const u=()=>({roles:[...m.querySelectorAll("[data-role]:checked")].map(c=>c.dataset.role),radius:t.querySelector("[data-radius]").checked?["card"]:[],width:t.querySelector("[data-width]").checked?["button"]:[],background:t.querySelector("[data-background]").checked,modes:t.querySelector("[data-appearance]").value==="both"?["light","dark"]:[t.querySelector("[data-appearance]").value]}),p=()=>K(t,j(l.getSnapshot(),u()).tailwind);m.onchange=p,r(l,p),p(),N(t,"copy",()=>{navigator.clipboard.writeText(j(l.getSnapshot(),u()).tailwind).then(()=>{t.querySelector("[data-copy-status]").textContent="Tailwind CSS copied."},()=>{t.querySelector("[data-copy-status]").textContent="Select the CSS and copy it with your keyboard."})})}else if(e==="conflict"){m.innerHTML=ee(H("external","Simulate external update")+H("apply","Apply draft")+H("cancel","Load newer theme")+H("force","Replace with draft"))+'<p data-conflict role="status"></p>';let u=0;N(t,"external",()=>s.setTheme(U(++u%2?"#C25D3D":"#277D59",{name:`External theme ${u}`}))),N(t,"apply",()=>i.apply()),N(t,"cancel",i.cancel),N(t,"force",()=>i.apply({force:!0}));const p=()=>{const c=i.getSnapshot();t.querySelector('[data-action="apply"]').disabled=!c.dirty||c.conflict,t.querySelector('[data-action="force"]').hidden=!c.conflict,t.querySelector('[data-action="cancel"]').disabled=!c.dirty&&!c.conflict,t.querySelector("[data-conflict]").textContent=c.conflict?"The applied theme changed. Load it or explicitly replace it.":c.dirty?"Unapplied draft":"Up to date",K(t,JSON.stringify({draft:l.getSnapshot().theme.name,applied:s.getSnapshot().theme.name,conflict:c.conflict},null,2))};r(i,p),r(l,p),r(s,p),o.push($e(t,i.history)),p()}i&&o.push(i.destroy)}return()=>{o.forEach(s=>s()),t.replaceChildren()}}const ro={"color-picker":[{id:"history",title:"Undo & redo",description:"Drag the picker or enter a color. Each drag is one history step. Undo restores color and alpha together."},{id:"collections",title:"Recent & favorite colors",description:"Save a color to recent colors or add it to favorites. Click a swatch to select it. Each list is limited to eight colors and saved in this browser."},{id:"contrast",title:"Text contrast",description:"Set a text color, opacity and background. Inspect the contrast ratio, AA and AAA results. Apply the suggested black or white only when you choose to."}],"theme-studio":[{id:"history",title:"Theme history",description:"Undo color, theme name, radius and border changes. A drag or field edit is recorded as one step."},{id:"locks",title:"Generation locks",description:"Lock any color or the background, then generate from a new primary. Locked fields stay unchanged. You can still edit them manually."},{id:"collections",title:"Recent & favorite themes",description:"Save the current theme, edit it and save again. A theme with the same ID replaces its earlier revision in the list."},{id:"contrast",title:"Palette contrast",description:"Inspect the foreground and default color of each palette. The checker reports contrast without changing your theme."},{id:"tailwind",title:"Selected Tailwind tokens",description:"Choose colors, radius, border width and appearance. The stylesheet contains utilities only for the fields you select."},{id:"conflict",title:"External changes",description:"Edit a draft, then simulate a theme change from another application. Cancel loads the newer theme. Replace explicitly applies your draft over it."},{id:"schema",title:"Saved theme versions",description:"Load an older unversioned theme or a version 0 theme. Both migrate to version 1. An unsupported future version is rejected."}]},oa={"color-picker":{history:`import {
  createColorStore,
  createColorHistory,
  mountColorPicker,
  mountHistory,
} from '@salyra-ui/color-picker/vanilla';
import { actions, button, listenButton, output } from './workflow-ui';
export function mountWorkflow(host: HTMLElement): () => void {
  host.classList.add('workflow-preview');
  const cleanup: (() => void)[] = [];
  const subscribe = (
    source: {
      subscribe: (fn: () => void) => () => void;
    },
    update: () => void,
  ) => {
    cleanup.push(source.subscribe(update));
  };
  const store = createColorStore('#5268E080');
  host.innerHTML =
    '<div data-picker></div><div data-controls></div><pre data-result aria-live="polite"></pre>';
  const picker = mountColorPicker(
    host.querySelector<HTMLElement>('[data-picker]')!,
    { store },
  );
  cleanup.push(picker.destroy);
  const controls = host.querySelector<HTMLElement>('[data-controls]')!;
  {
    const history = createColorHistory(store, { limit: 20 });
    controls.innerHTML = actions(
      button('undo', 'Undo') + button('redo', 'Redo'),
    );
    listenButton(host, 'undo', history.undo);
    listenButton(host, 'redo', history.redo);
    const update = () => {
      const state = history.getSnapshot();
      host.querySelector<HTMLButtonElement>('[data-action="undo"]')!.disabled =
        !state.canUndo;
      host.querySelector<HTMLButtonElement>('[data-action="redo"]')!.disabled =
        !state.canRedo;
      output(
        host,
        \`\${store.getSnapshot().value}\\nHistory position \${state.index + 1} of \${state.length}\`,
      );
    };
    subscribe(history, update);
    subscribe(store, update);
    cleanup.push(mountHistory(host, history), history.destroy);
    update();
  }
  return () => {
    cleanup.forEach((stop) => stop());
    host.replaceChildren();
  };
}
`,collections:`import {
  createColorStore,
  createColorCollection,
  browserColorStorage,
  mountColorPicker,
  mountColorCollection,
} from '@salyra-ui/color-picker/vanilla';
import { seed, actions, button, listenButton, output } from './workflow-ui';
export function mountWorkflow(host: HTMLElement): () => void {
  host.classList.add('workflow-preview');
  const cleanup: (() => void)[] = [];
  const subscribe = (
    source: {
      subscribe: (fn: () => void) => () => void;
    },
    update: () => void,
  ) => {
    cleanup.push(source.subscribe(update));
  };
  const store = createColorStore('#5268E080');
  host.innerHTML =
    '<div data-picker></div><div data-controls></div><pre data-result aria-live="polite"></pre>';
  const picker = mountColorPicker(
    host.querySelector<HTMLElement>('[data-picker]')!,
    { store },
  );
  cleanup.push(picker.destroy);
  const controls = host.querySelector<HTMLElement>('[data-controls]')!;
  {
    const collection = createColorCollection({
      limit: 8,
      favorites: [seed, '#277D59'],
      storage: browserColorStorage('examples:recent-colors'),
    });
    collection.load();
    controls.innerHTML =
      actions(
        button('remember', 'Save to recent') +
          button('favorite', 'Toggle favorite') +
          button('clear', 'Clear recent'),
      ) + '<div data-recent></div><div data-favorites></div>';
    const recent = mountColorCollection(
      host.querySelector<HTMLElement>('[data-recent]')!,
      store,
      collection,
      { label: 'Recent colors' },
    );
    const favorites = mountColorCollection(
      host.querySelector<HTMLElement>('[data-favorites]')!,
      store,
      collection,
      {
        kind: 'favorites',
        label: 'Favorite colors',
        classes: { item: 'workflow-swatch' },
      },
    );
    cleanup.push(recent.destroy, favorites.destroy);
    listenButton(host, 'remember', () =>
      collection.remember(store.getSnapshot().value),
    );
    listenButton(host, 'favorite', () =>
      collection.toggleFavorite(store.getSnapshot().value),
    );
    listenButton(host, 'clear', collection.clearRecent);
    const update = () =>
      output(host, JSON.stringify(collection.getSnapshot(), null, 2));
    subscribe(collection, update);
    update();
  }
  return () => {
    cleanup.forEach((stop) => stop());
    host.replaceChildren();
  };
}
`,contrast:`import {
  createColorStore,
  mountColorPicker,
  colorContrast,
} from '@salyra-ui/color-picker/vanilla';
import { actions, button, field, listenButton, output } from './workflow-ui';
export function mountWorkflow(host: HTMLElement): () => void {
  host.classList.add('workflow-preview');
  const cleanup: (() => void)[] = [];
  const subscribe = (
    source: {
      subscribe: (fn: () => void) => () => void;
    },
    update: () => void,
  ) => {
    cleanup.push(source.subscribe(update));
  };
  const store = createColorStore('#5268E080');
  host.innerHTML =
    '<div data-picker></div><div data-controls></div><pre data-result aria-live="polite"></pre>';
  const picker = mountColorPicker(
    host.querySelector<HTMLElement>('[data-picker]')!,
    { store },
  );
  cleanup.push(picker.destroy);
  const controls = host.querySelector<HTMLElement>('[data-controls]')!;
  {
    controls.innerHTML =
      '<label class="workflow-field">Background<input type="color" data-background value="#ffffff"></label>' +
      field(
        'Text size',
        'text',
        '<option value="normal">Normal</option><option value="large">Large</option>',
      ) +
      '<article data-text-sample>Text on the selected background</article>' +
      actions(button('suggest', 'Use suggested foreground'));
    const background =
        host.querySelector<HTMLInputElement>('[data-background]')!,
      text = host.querySelector<HTMLSelectElement>('[data-text]')!;
    const result = () =>
      colorContrast(store.getSnapshot().value, background.value, {
        text: text.value as 'normal' | 'large',
      });
    const update = () => {
      const c = result(),
        sample = host.querySelector<HTMLElement>('[data-text-sample]')!;
      sample.style.color = store.getSnapshot().value;
      sample.style.background = background.value;
      output(
        host,
        \`Contrast \${c.ratio.toFixed(2)}:1\\nAA \${c.aa ? 'passes' : 'fails'}\\nAAA \${c.aaa ? 'passes' : 'fails'}\\nSuggested foreground \${c.suggestedForeground}\`,
      );
    };
    background.oninput = update;
    text.onchange = update;
    listenButton(host, 'suggest', () =>
      store.setHex(result().suggestedForeground),
    );
    subscribe(store, update);
    update();
  }
  return () => {
    cleanup.forEach((stop) => stop());
    host.replaceChildren();
  };
}
`},"theme-studio":{history:`import {
  createThemeStore,
  createThemeHistory,
  mountThemeKit,
  generateTheme,
  roles,
} from '@salyra-ui/theme-studio/vanilla';
import { mountHistory } from '@salyra-ui/color-picker';
import { seed, actions, button, listenButton, output } from './workflow-ui';
export function mountWorkflow(host: HTMLElement): () => void {
  host.classList.add('workflow-preview');
  const cleanup: (() => void)[] = [];
  const subscribe = (
    source: {
      subscribe: (fn: () => void) => () => void;
    },
    update: () => void,
  ) => {
    cleanup.push(source.subscribe(update));
  };
  {
    const target = createThemeStore({
      theme: generateTheme(seed),
      mode: 'light',
      modeStorage: false,
    });
    const store = target;
    host.innerHTML =
      '<div data-picker></div><div data-controls></div><div data-theme-sample class="recipe-preview"><h3>Applied theme</h3><button type="button">Save changes</button></div><pre data-result aria-live="polite"></pre>';
    const controls = host.querySelector<HTMLElement>('[data-controls]')!;
    const picker = mountThemeKit(
      host.querySelector<HTMLElement>('[data-picker]')!,
      {
        store,
        modeStorage: false,
        picker: {
          view: 'area',
          roles: ['primary', 'secondary', 'accent'],
          controls: false,
        },
        radius: ['card'],
        width: ['button'],
        backgroundControl: false,
      },
    );
    picker.element.querySelector('details')?.remove();
    cleanup.push(picker.destroy);
    const updateSample = () => {
      host.querySelector<HTMLElement>('[data-theme-sample]')!.style.cssText =
        target.getSnapshot().style;
    };
    subscribe(target, updateSample);
    updateSample();
    {
      const history = createThemeHistory(store, { limit: 20 });
      controls.innerHTML = actions(
        button('undo', 'Undo') + button('redo', 'Redo'),
      );
      listenButton(host, 'undo', history.undo);
      listenButton(host, 'redo', history.redo);
      const update = () => {
        const s = history.getSnapshot();
        host.querySelector<HTMLButtonElement>(
          '[data-action="undo"]',
        )!.disabled = !s.canUndo;
        host.querySelector<HTMLButtonElement>(
          '[data-action="redo"]',
        )!.disabled = !s.canRedo;
        output(
          host,
          \`\${store.getSnapshot().theme.name}\\nHistory position \${s.index + 1} of \${s.length}\`,
        );
      };
      subscribe(history, update);
      cleanup.push(mountHistory(host, history), history.destroy);
      update();
    }
  }
  return () => {
    cleanup.forEach((stop) => stop());
    host.replaceChildren();
  };
}
`,locks:`import {
  createThemeStore,
  createThemeEditor,
  mountThemeKit,
  themeColor,
  generateTheme,
  roles,
  type Role,
} from '@salyra-ui/theme-studio/vanilla';
import { seed, actions, button, listenButton, output } from './workflow-ui';
export function mountWorkflow(host: HTMLElement): () => void {
  host.classList.add('workflow-preview');
  const cleanup: (() => void)[] = [];
  const subscribe = (
    source: {
      subscribe: (fn: () => void) => () => void;
    },
    update: () => void,
  ) => {
    cleanup.push(source.subscribe(update));
  };
  {
    const target = createThemeStore({
      theme: generateTheme(seed),
      mode: 'light',
      modeStorage: false,
    });
    const editor = createThemeEditor(target);
    const store = editor?.store ?? target;
    host.innerHTML =
      '<div data-picker></div><div data-controls></div><div data-theme-sample class="recipe-preview"><h3>Applied theme</h3><button type="button">Save changes</button></div><pre data-result aria-live="polite"></pre>';
    host.querySelector('[data-theme-sample] h3')!.textContent =
      'Generated theme';
    const controls = host.querySelector<HTMLElement>('[data-controls]')!;
    const picker = mountThemeKit(
      host.querySelector<HTMLElement>('[data-picker]')!,
      {
        store,
        modeStorage: false,
        picker: {
          view: 'area',
          roles: ['primary', 'secondary', 'accent'],
          controls: false,
        },
        radius: ['card'],
        width: ['button'],
        backgroundControl: true,
      },
    );
    picker.element.querySelector('details')?.remove();
    cleanup.push(picker.destroy);
    const updateSample = () => {
      host.querySelector<HTMLElement>('[data-theme-sample]')!.style.cssText =
        target.getSnapshot().style;
    };
    subscribe(target, updateSample);
    updateSample();
    {
      controls.innerHTML =
        '<fieldset class="workflow-locks"><legend>Keep during generation</legend>' +
        [...roles, 'background']
          .map(
            (role) =>
              \`<label><input type="checkbox" data-lock="\${role}">\${role}</label>\`,
          )
          .join('') +
        '</fieldset><label class="workflow-field">New primary<input data-seed type="color" value="#c25d3d"></label>' +
        actions(button('generate', 'Generate theme'));
      for (const input of controls.querySelectorAll<HTMLInputElement>(
        '[data-lock]',
      ))
        input.onchange = () =>
          editor!.setLocked(
            input.dataset.lock as Role | 'background',
            input.checked,
          );
      listenButton(host, 'generate', () =>
        store.generate(
          host.querySelector<HTMLInputElement>('[data-seed]')!.value,
        ),
      );
      const update = () => {
        const state = store.getSnapshot();
        output(
          host,
          JSON.stringify(
            {
              locked: editor!.getSnapshot().locked,
              colors: Object.fromEntries(
                roles.map((role) => [role, themeColor(state.theme, role)]),
              ),
              background: state.theme.structure.websitePreset.background,
            },
            null,
            2,
          ),
        );
        host.querySelector<HTMLElement>('[data-theme-sample]')!.style.cssText =
          state.style;
      };
      subscribe(store, update);
      subscribe(editor!, update);
      update();
    }
    if (editor) cleanup.push(editor.destroy);
  }
  return () => {
    cleanup.forEach((stop) => stop());
    host.replaceChildren();
  };
}
`,collections:`import {
  createThemeStore,
  createThemeCollection,
  browserThemeCollectionStorage,
  mountThemeKit,
  generateTheme,
  roles,
} from '@salyra-ui/theme-studio/vanilla';
import {
  seed,
  actions,
  button,
  field,
  listenButton,
  output,
} from './workflow-ui';
export function mountWorkflow(host: HTMLElement): () => void {
  host.classList.add('workflow-preview');
  const cleanup: (() => void)[] = [];
  const subscribe = (
    source: {
      subscribe: (fn: () => void) => () => void;
    },
    update: () => void,
  ) => {
    cleanup.push(source.subscribe(update));
  };
  {
    const target = createThemeStore({
      theme: generateTheme(seed),
      mode: 'light',
      modeStorage: false,
    });
    const store = target;
    host.innerHTML =
      '<div data-picker></div><div data-controls></div><div data-theme-sample class="recipe-preview"><h3>Applied theme</h3><button type="button">Save changes</button></div><pre data-result aria-live="polite"></pre>';
    const controls = host.querySelector<HTMLElement>('[data-controls]')!;
    const picker = mountThemeKit(
      host.querySelector<HTMLElement>('[data-picker]')!,
      {
        store,
        modeStorage: false,
        picker: {
          view: 'area',
          roles: ['primary', 'secondary', 'accent'],
          controls: false,
        },
        radius: ['card'],
        width: ['button'],
        backgroundControl: false,
      },
    );
    picker.element.querySelector('details')?.remove();
    cleanup.push(picker.destroy);
    const updateSample = () => {
      host.querySelector<HTMLElement>('[data-theme-sample]')!.style.cssText =
        target.getSnapshot().style;
    };
    subscribe(target, updateSample);
    updateSample();
    {
      const collection = createThemeCollection({
        limit: 8,
        favorites: [generateTheme('#277D59', { name: 'Forest' })],
        storage: browserThemeCollectionStorage('examples:saved-themes'),
      });
      collection.load();
      controls.innerHTML =
        actions(
          button('remember', 'Save to recent') +
            button('favorite', 'Toggle favorite'),
        ) +
        field('Recent themes', 'recent', '') +
        field('Favorite themes', 'favorites', '');
      listenButton(host, 'remember', () =>
        collection.remember(store.getSnapshot().theme),
      );
      listenButton(host, 'favorite', () =>
        collection.toggleFavorite(store.getSnapshot().theme),
      );
      const update = () => {
        const state = collection.getSnapshot();
        for (const kind of ['recent', 'favorites'] as const) {
          const select = host.querySelector<HTMLSelectElement>(
            \`[data-\${kind}]\`,
          )!;
          select.replaceChildren(new Option('Choose a theme', ''));
          for (const theme of state[kind])
            select.add(new Option(theme.name, theme.id));
          select.disabled = !state[kind].length;
        }
        output(
          host,
          JSON.stringify(
            {
              recent: state.recent.map((t) => ({ id: t.id, name: t.name })),
              favorites: state.favorites.map((t) => ({
                id: t.id,
                name: t.name,
              })),
            },
            null,
            2,
          ),
        );
      };
      for (const kind of ['recent', 'favorites'] as const)
        host.querySelector<HTMLSelectElement>(\`[data-\${kind}]\`)!.onchange = (
          e,
        ) => {
          const theme = collection
            .getSnapshot()
            [kind].find(
              (t) => t.id === (e.currentTarget as HTMLSelectElement).value,
            );
          if (theme) store.setTheme(theme);
        };
      subscribe(collection, update);
      update();
    }
  }
  return () => {
    cleanup.forEach((stop) => stop());
    host.replaceChildren();
  };
}
`,contrast:`import {
  createThemeStore,
  mountThemeKit,
  themeColor,
  themeContrast,
  generateTheme,
  roles,
} from '@salyra-ui/theme-studio/vanilla';
import { seed, output } from './workflow-ui';
export function mountWorkflow(host: HTMLElement): () => void {
  host.classList.add('workflow-preview');
  const cleanup: (() => void)[] = [];
  const subscribe = (
    source: {
      subscribe: (fn: () => void) => () => void;
    },
    update: () => void,
  ) => {
    cleanup.push(source.subscribe(update));
  };
  {
    const target = createThemeStore({
      theme: generateTheme(seed),
      mode: 'light',
      modeStorage: false,
    });
    const store = target;
    host.innerHTML =
      '<div data-picker></div><div data-controls></div><div data-theme-sample class="recipe-preview"><h3>Applied theme</h3><button type="button">Save changes</button></div><pre data-result aria-live="polite"></pre>';
    const controls = host.querySelector<HTMLElement>('[data-controls]')!;
    const picker = mountThemeKit(
      host.querySelector<HTMLElement>('[data-picker]')!,
      {
        store,
        modeStorage: false,
        picker: {
          view: 'area',
          roles: ['primary', 'secondary', 'accent'],
          controls: false,
        },
        radius: ['card'],
        width: ['button'],
        backgroundControl: false,
      },
    );
    picker.element.querySelector('details')?.remove();
    cleanup.push(picker.destroy);
    const updateSample = () => {
      host.querySelector<HTMLElement>('[data-theme-sample]')!.style.cssText =
        target.getSnapshot().style;
    };
    subscribe(target, updateSample);
    updateSample();
    {
      controls.innerHTML = '<div data-pairs class="workflow-pairs"></div>';
      const update = () => {
        const state = store.getSnapshot(),
          pairs = host.querySelector<HTMLElement>('[data-pairs]')!;
        pairs.replaceChildren();
        const values = roles.map((role) => {
          const result = themeContrast(state, role),
            item = document.createElement('article');
          item.style.background = themeColor(state.theme, role);
          item.style.color = result.foreground;
          item.textContent = \`\${role} \${result.ratio.toFixed(2)}:1\`;
          pairs.append(item);
          return \`\${role}\\nAA \${result.aa ? 'passes' : 'fails'} · AAA \${result.aaa ? 'passes' : 'fails'}\`;
        });
        output(host, values.join('\\n\\n'));
      };
      subscribe(store, update);
      update();
    }
  }
  return () => {
    cleanup.forEach((stop) => stop());
    host.replaceChildren();
  };
}
`,tailwind:`import {
  createThemeStore,
  mountThemeKit,
  themeConfiguration,
  generateTheme,
  roles,
  type Role,
  type TokenSelection,
} from '@salyra-ui/theme-studio/vanilla';
import {
  seed,
  actions,
  button,
  field,
  listenButton,
  output,
} from './workflow-ui';
export function mountWorkflow(host: HTMLElement): () => void {
  host.classList.add('workflow-preview');
  const cleanup: (() => void)[] = [];
  const subscribe = (
    source: {
      subscribe: (fn: () => void) => () => void;
    },
    update: () => void,
  ) => {
    cleanup.push(source.subscribe(update));
  };
  {
    const target = createThemeStore({
      theme: generateTheme(seed),
      mode: 'light',
      modeStorage: false,
    });
    const store = target;
    host.innerHTML =
      '<div data-picker></div><div data-controls></div><div data-theme-sample class="recipe-preview"><h3>Applied theme</h3><button type="button">Save changes</button></div><pre data-result aria-live="polite"></pre>';
    const controls = host.querySelector<HTMLElement>('[data-controls]')!;
    const picker = mountThemeKit(
      host.querySelector<HTMLElement>('[data-picker]')!,
      {
        store,
        modeStorage: false,
        picker: {
          view: 'area',
          roles: ['primary', 'secondary', 'accent'],
          controls: false,
        },
        radius: ['card'],
        width: ['button'],
        backgroundControl: false,
      },
    );
    picker.element.querySelector('details')?.remove();
    cleanup.push(picker.destroy);
    const updateSample = () => {
      host.querySelector<HTMLElement>('[data-theme-sample]')!.style.cssText =
        target.getSnapshot().style;
    };
    subscribe(target, updateSample);
    updateSample();
    {
      controls.innerHTML =
        '<fieldset class="workflow-locks"><legend>Export fields</legend>' +
        roles
          .map(
            (role) =>
              \`<label><input type="checkbox" data-role="\${role}" \${role === 'primary' ? 'checked' : ''}>\${role}</label>\`,
          )
          .join('') +
        '<label><input type="checkbox" data-radius>Card radius</label><label><input type="checkbox" data-width>Button border width</label><label><input type="checkbox" data-background>Background</label></fieldset>' +
        field(
          'Appearance',
          'appearance',
          '<option value="light">Light</option><option value="dark">Dark</option><option value="both">Light & dark</option>',
        ) +
        actions(button('copy', 'Copy Tailwind CSS')) +
        '<p data-copy-status role="status"></p>';
      const selection = (): TokenSelection => ({
        roles: [
          ...controls.querySelectorAll<HTMLInputElement>('[data-role]:checked'),
        ].map((e) => e.dataset.role as Role),
        radius: host.querySelector<HTMLInputElement>('[data-radius]')!.checked
          ? ['card']
          : [],
        width: host.querySelector<HTMLInputElement>('[data-width]')!.checked
          ? ['button']
          : [],
        background:
          host.querySelector<HTMLInputElement>('[data-background]')!.checked,
        modes:
          host.querySelector<HTMLSelectElement>('[data-appearance]')!.value ===
          'both'
            ? ['light', 'dark']
            : [
                host.querySelector<HTMLSelectElement>('[data-appearance]')!
                  .value as 'light' | 'dark',
              ],
      });
      const update = () =>
        output(
          host,
          themeConfiguration(store.getSnapshot(), selection()).tailwind,
        );
      controls.onchange = update;
      subscribe(store, update);
      update();
      listenButton(host, 'copy', () => {
        navigator.clipboard
          .writeText(
            themeConfiguration(store.getSnapshot(), selection()).tailwind,
          )
          .then(
            () => {
              host.querySelector('[data-copy-status]')!.textContent =
                'Tailwind CSS copied.';
            },
            () => {
              host.querySelector('[data-copy-status]')!.textContent =
                'Select the CSS and copy it with your keyboard.';
            },
          );
      });
    }
  }
  return () => {
    cleanup.forEach((stop) => stop());
    host.replaceChildren();
  };
}
`,conflict:`import {
  createThemeStore,
  createThemeEditor,
  mountThemeKit,
  generateTheme,
  roles,
} from '@salyra-ui/theme-studio/vanilla';
import { mountHistory } from '@salyra-ui/color-picker';
import { seed, actions, button, listenButton, output } from './workflow-ui';
export function mountWorkflow(host: HTMLElement): () => void {
  host.classList.add('workflow-preview');
  const cleanup: (() => void)[] = [];
  const subscribe = (
    source: {
      subscribe: (fn: () => void) => () => void;
    },
    update: () => void,
  ) => {
    cleanup.push(source.subscribe(update));
  };
  {
    const target = createThemeStore({
      theme: generateTheme(seed),
      mode: 'light',
      modeStorage: false,
    });
    const editor = createThemeEditor(target);
    const store = editor?.store ?? target;
    host.innerHTML =
      '<div data-picker></div><div data-controls></div><div data-theme-sample class="recipe-preview"><h3>Applied theme</h3><button type="button">Save changes</button></div><pre data-result aria-live="polite"></pre>';
    const controls = host.querySelector<HTMLElement>('[data-controls]')!;
    const picker = mountThemeKit(
      host.querySelector<HTMLElement>('[data-picker]')!,
      {
        store,
        modeStorage: false,
        picker: {
          view: 'area',
          roles: ['primary', 'secondary', 'accent'],
          controls: false,
        },
        radius: ['card'],
        width: ['button'],
        backgroundControl: false,
      },
    );
    picker.element.querySelector('details')?.remove();
    cleanup.push(picker.destroy);
    const updateSample = () => {
      host.querySelector<HTMLElement>('[data-theme-sample]')!.style.cssText =
        target.getSnapshot().style;
    };
    subscribe(target, updateSample);
    updateSample();
    {
      controls.innerHTML =
        actions(
          button('external', 'Simulate external update') +
            button('apply', 'Apply draft') +
            button('cancel', 'Load newer theme') +
            button('force', 'Replace with draft'),
        ) + '<p data-conflict role="status"></p>';
      let externalRevision = 0;
      listenButton(host, 'external', () =>
        target.setTheme(
          generateTheme(++externalRevision % 2 ? '#C25D3D' : '#277D59', {
            name: \`External theme \${externalRevision}\`,
          }),
        ),
      );
      listenButton(host, 'apply', () => editor!.apply());
      listenButton(host, 'cancel', editor!.cancel);
      listenButton(host, 'force', () => editor!.apply({ force: true }));
      const update = () => {
        const state = editor!.getSnapshot();
        host.querySelector<HTMLButtonElement>(
          '[data-action="apply"]',
        )!.disabled = !state.dirty || state.conflict;
        host.querySelector<HTMLButtonElement>('[data-action="force"]')!.hidden =
          !state.conflict;
        host.querySelector<HTMLButtonElement>(
          '[data-action="cancel"]',
        )!.disabled = !state.dirty && !state.conflict;
        host.querySelector('[data-conflict]')!.textContent = state.conflict
          ? 'The applied theme changed. Load it or explicitly replace it.'
          : state.dirty
            ? 'Unapplied draft'
            : 'Up to date';
        output(
          host,
          JSON.stringify(
            {
              draft: store.getSnapshot().theme.name,
              applied: target.getSnapshot().theme.name,
              conflict: state.conflict,
            },
            null,
            2,
          ),
        );
      };
      subscribe(editor!, update);
      subscribe(store, update);
      subscribe(target, update);
      cleanup.push(mountHistory(host, editor!.history));
      update();
    }
    if (editor) cleanup.push(editor.destroy);
  }
  return () => {
    cleanup.forEach((stop) => stop());
    host.replaceChildren();
  };
}
`,schema:`import { generateTheme, parseTheme } from '@salyra-ui/theme-studio/vanilla';
import { seed, actions, button, listenButton, output } from './workflow-ui';
export function mountWorkflow(host: HTMLElement): () => void {
  host.classList.add('workflow-preview');
  const cleanup: (() => void)[] = [];
  const subscribe = (
    source: {
      subscribe: (fn: () => void) => () => void;
    },
    update: () => void,
  ) => {
    cleanup.push(source.subscribe(update));
  };
  {
    const initial = generateTheme(seed);
    host.innerHTML =
      actions(
        button('legacy', 'Unversioned theme') +
          button('v0', 'Version 0') +
          button('future', 'Future version'),
      ) +
      '<label class="workflow-field">Saved theme JSON<textarea data-json rows="10" spellcheck="false"></textarea></label>' +
      actions(button('validate', 'Validate & migrate')) +
      '<pre data-result role="status"></pre>';
    const area = host.querySelector<HTMLTextAreaElement>('[data-json]')!;
    const show = (version?: number) => {
      const saved = { ...initial } as Record<string, unknown>;
      delete saved.schemaVersion;
      if (version !== undefined) saved.schemaVersion = version;
      area.value = JSON.stringify(saved, null, 2);
      output(host, 'Choose Validate & migrate to read this data.');
    };
    listenButton(host, 'legacy', () => show());
    listenButton(host, 'v0', () => show(0));
    listenButton(host, 'future', () => show(99));
    listenButton(host, 'validate', () => {
      try {
        const theme = parseTheme(JSON.parse(area.value));
        output(
          host,
          \`Loaded \${theme.name}\\nschemaVersion: \${theme.schemaVersion}\`,
        );
      } catch (error) {
        output(
          host,
          error instanceof Error ? error.message : 'Invalid theme data',
        );
      }
    });
    show();
  }
  return () => {
    cleanup.forEach((stop) => stop());
    host.replaceChildren();
  };
}
`}},ra=`export const seed = '#5268E0';
export const actions = (buttons: string) =>
  \`<div class="recipe-actions">\${buttons}</div>\`;
export const button = (id: string, label: string) =>
  \`<button type="button" data-action="\${id}">\${label}</button>\`;
export const field = (label: string, selector: string, options: string) =>
  \`<label>\${label}<select aria-label="\${label}" data-\${selector}>\${options}</select></label>\`;
export const listenButton = (
  host: HTMLElement,
  id: string,
  run: () => void,
) => {
  host.querySelector<HTMLButtonElement>(\`[data-action="\${id}"]\`)!.onclick = run;
};
export const output = (host: HTMLElement, value: string) => {
  host.querySelector('[data-result]')!.textContent = value;
};
`,St=`@import '@salyra-ui/color-picker/styles.min.css';
@import '@salyra-ui/theme-studio/styles.min.css';
body { font-family: Helvetica, Arial, sans-serif; max-width: 860px; margin: 40px auto; padding: 0 20px; }
.workflow-preview { display: grid; gap: 24px; }
.workflow-preview > [data-picker] { max-width: 360px; }
.recipe-actions { display: flex; flex-wrap: wrap; gap: 8px; margin: 20px 0; }
button, input, select, textarea { font: inherit; }
button { padding: 8px 12px; border: 1px solid #ddd; background: white; cursor: pointer; }
button:disabled { opacity: .4; cursor: default; }
.workflow-field { display: grid; gap: 8px; margin: 16px 0; }
.workflow-locks { display: flex; flex-wrap: wrap; gap: 16px; }
[data-controls] > label { display: flex; gap: 12px; margin: 12px 0; align-items: center; }
[data-text-sample] { padding: 24px; font-size: 24px; }
.workflow-pairs { display: flex; gap: 12px; }
.workflow-pairs article { padding: 24px; flex: 1; }
.recipe-preview { background: hsl(var(--background)); color: hsl(var(--foreground)); padding: 24px; border-radius: var(--border-radius-card); border: var(--border-width-card) solid currentColor; }
.recipe-preview button { background: hsl(var(--primary)); color: hsl(var(--primary-foreground)); border: var(--border-width-button) solid currentColor; }
pre { overflow: auto; max-height: 400px; white-space: pre-wrap; background: #f7f7f8; padding: 20px; }
textarea { width:100%; box-sizing:border-box; }
`;function aa(t,e){return[{name:"workflow.ts",code:oa[t][e]},{name:"main.ts",code:`import { mountWorkflow } from './workflow';
import './styles.css';

const cleanup = mountWorkflow(document.querySelector<HTMLElement>('#example')!);
// Call cleanup() when removing this view.
window.addEventListener('pagehide', cleanup, { once: true });`},{name:"workflow-ui.ts",code:ra},{name:"styles.css",code:t==="color-picker"?St.replace(`@import '@salyra-ui/theme-studio/styles.min.css';
`,""):St.replace(`@import '@salyra-ui/color-picker/styles.min.css';
`,"")},{name:"index.html",code:'<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Salyra UI workflow</title></head><body><main id="example"></main><script type="module" src="/main.ts"><\/script></body></html>'},{name:"package.json",code:JSON.stringify({private:!0,type:"module",scripts:{dev:"vite",build:"vite build"},dependencies:{[`@salyra-ui/${t}`]:"^1.0.0"},devDependencies:{vite:"^6.1.0",typescript:"~5.8.3"}},null,2)},{name:"README.md",code:`# ${ro[t].find(o=>o.id===e).title}

Run npm install, then npm run dev.

This example uses Vanilla controls and framework-independent helpers. The same helpers work with every native framework provider. See the ${t==="color-picker"?"Forms & saved colors":"Draft & Apply"} example for complete native framework components.
`}]}function Tt(t,e){const o=ro[e];let r=o[0].id,a;t.classList.add("workflow-gallery"),t.innerHTML=`<div class="workflow-selector"><label>Workflow<select aria-label="${e==="color-picker"?"Color picker":"Theme studio"} workflow">${o.map(d=>`<option value="${d.id}">${q(d.title)}</option>`).join("")}</select></label><div class="view-tabs" role="group" aria-label="Workflow display"><button type="button" data-workflow-view="preview" aria-pressed="true">Preview</button><button type="button" data-workflow-view="code" aria-pressed="false">Code</button></div></div><div class="workflow-summary"><h3></h3><p></p><span>Vanilla controls · Framework-independent core</span></div><div data-workflow-preview></div><div data-workflow-code hidden></div>`;const s=t.querySelector("[data-workflow-preview]"),i=t.querySelector("[data-workflow-code]"),l=X(i,()=>"",{file:"TypeScript",baseName:e+"-workflow",downloadName:()=>`${e}-${r}`,files:()=>aa(e,r)}),m=()=>{a==null||a();const d=o.find(u=>u.id===r);t.querySelector("h3").textContent=d.title,t.querySelector(".workflow-summary p").textContent=d.description,a=(e==="color-picker"?ea:ta)(s,r),l.refresh()};t.querySelector("select").onchange=d=>{r=d.currentTarget.value,m()};const b=t.querySelectorAll(".workflow-selector button[data-workflow-view]");for(const d of b)d.onclick=()=>{const u=d.dataset.workflowView==="code";s.hidden=u,i.hidden=!u;for(const p of b)p.setAttribute("aria-pressed",String(p===d))};return m(),()=>{a==null||a(),t.replaceChildren()}}function sa(t){const e=["React","Svelte","Vue","Angular","Astro"];return/^use(Color|Theme)/.test(t)?e.filter(o=>o!=="Astro"):/^provide/.test(t)?["Svelte","Vue"]:/^watch/.test(t)?["Vue"]:t.endsWith("Context")||t.endsWith("Primitives")?["Angular"]:["ColorPicker","ThemeStudio","ColorMarkerThumb"].includes(t)?["React","Svelte","Vue"]:["ColorWheelSurface","ThemePickerWheel","ColorFormatTrigger"].includes(t)?e.filter(o=>o!=="Angular"||t==="ColorFormatTrigger"):["ThemeWheel"].includes(t)?e.filter(o=>o!=="Astro"):t==="ThemeColor"?e.filter(o=>o!=="Angular"):e}const Le=(t,e,o,r,a)=>({key:t,type:e,default:o,description:r,example:a}),na={"ColorPicker.Root":["[cpRoot], [store], [value], [disabled], (valueChange)","ColorStore, HEX string, boolean, string event",'<section cpRoot [value]="color" (valueChange)="color=$event">...</section>'],"ColorPicker.Area / Wheel":["[cpArea] or [cpWheel], [cpMarkers], [cpActiveId], (markerSelect), (markerChange)","ColorMarker[], string, string event, {id, hsv} event",'<div cpWheel [cpMarkers]="markers" [cpActiveId]="active" (markerSelect)="active=$event">...</div>'],"ColorPicker.Thumb / Marker":["cpThumb","Native span directive",'<span cpThumb class="my-dot"></span>'],"ColorPicker.Slider":["[cpSlider], [disabled], aria-label","'h' | 's' | 'v' | 'alpha', boolean, string",'<input cpSlider="alpha" aria-label="Opacity" />'],"ColorPicker.Input / ChannelInput":["cpInput, [format], [index], [disabled], aria-label","ColorFormat, 0 | 1 | 2, boolean, string",'<input cpInput format="rgb" [index]="0" aria-label="Red" />'],"ColorPicker.FormatTrigger":["cpFormatTrigger, [format], [disabled]","ColorFormat, boolean",'<button cpFormatTrigger format="rgb">RGB channels</button>'],"ThemeStudio.Root / Scope":["tkRoot with [store] / [options], tkScope","ThemeStore / ThemeOptions",'<section tkRoot [store]="store"><div tkScope>...</div></section>'],"ThemeStudio.PickerRoot":["tkPickerRoot with [picker] / [options]","ThemePickerStore / ThemePickerOptions",`<section tkPickerRoot [options]="{roles:['primary']}">...</section>`],"ThemeStudio.RoleTrigger":["[tkRoleTrigger], [disabled]","'primary' | 'secondary' | 'accent', boolean",'<button tkRoleTrigger="accent">Highlight</button>'],"ThemeStudio.GeometryInput":["[tkGeometry], [target], [disabled], aria-label","'radius' | 'width', Target, boolean, string",'<input tkGeometry="width" target="card" aria-label="Card border" />']};function ia(t){const e=na[t.name],o=[];return e&&o.push(Le("Angular bindings",e[0]+" / "+e[1],"Declared directive defaults",t.name==="ColorPicker.Thumb / Marker"?"cpThumb positions a single thumb. Angular has no ColorMarkerThumb export. Put your own buttons with data-marker-id inside a cpWheel with cpMarkers for multiple markers.":"Import the named directive in the standalone component imports array. Angular bindings use these names rather than the React compound component syntax. Put classes, styles, ARIA labels and event handlers on your native host element.",e[2])),t.name==="ColorPicker.Root"&&o.push(Le("Astro Root props","value?: HEX string, disabled?: boolean, native div attributes","'#6366F1' / false","ColorRoot.astro seeds a cp-provider and a cp-compose binding boundary. It accepts serializable props and a slot, not a store or change callback. Use the custom element store in browser code. Angular uses value rather than defaultValue. Vue also accepts modelValue through v-model.",'<ColorRoot value="#5268E080"><ColorField value="#5268E080" /></ColorRoot>')),["ColorPicker.Slider","ColorPicker.Input / ChannelInput"].includes(t.name)&&o.push(Le("Astro value","HEX string","'#6366F1'","Seeds the native range or input during server rendering. Match the root seed. A form value attribute is a color seed here, rather than the slider channel number.",'value="#5268E080"')),t.name==="ThemeStudio.Wheel"&&o.push(Le("Angular / Vanilla wheel",'data-tk-control="wheel" with data-marker-id buttons',"Your own markup","There is no Angular ThemePickerWheel directive. Use the ready ThemeWheel with an explicit picker, or mountThemeControls() on an owned DOM subtree with wheel and marker attributes. Destroy those bindings with the owning component.",'<div data-tk-control="wheel"><button data-marker-id="primary">Brand</button></div>')),o.length?{...t,fields:[...t.fields,...o]}:t}const S=(t,e,o,r,a)=>({key:t,type:e,default:o,description:r,example:a,required:o==="Required"}),_=(t,e,o,r,a)=>({id:t.toLowerCase().replace(/[^a-z0-9]+/g,"-"),name:t,kind:"Component",description:e,fields:o,example:{file:"Composition.tsx",code:`import { ${a==="color-picker"?"ColorPicker":"ThemeStudio"}, create${a==="color-picker"?"Color":"Theme"}Store } from '@salyra-ui/${a}/react';

${r}`}}),se=S("native attributes","HTML attributes, events and ref","No extra attributes","Forwards classes, style, id, name, ARIA attributes and events to the actual control or scope. React, Svelte and Vue context roots render no element. Angular uses a directive on your element, while Astro uses a custom element. Svelte uses class and bind:ref, React uses className and ref, Vue exposes element on the component ref.",'id="brand" aria-describedby="brand-help"');function la(t){return t==="color-picker"?[_("ColorPicker.Root","Shares one color store without rendering a wrapper or fieldset.",[S("store","ColorStore","Created internally","Uses an existing store. Keep its identity stable for the lifetime of the root.","store={store}"),S("value","HEX string","Uses defaultValue","Synchronizes external value changes. React uses value/onValueChange, Svelte supports bind:value, Vue supports v-model. The value includes alpha when present.",'value="#5268E080"'),S("defaultValue","HEX string","'#6366F1'","Seeds an internally created store once. Use this for uncontrolled editing.",'defaultValue="#277D59"'),S("disabled","boolean","Store setting","Disables the native primitive controls and pointer surfaces. Does not prevent programmatic store changes.","disabled={true}"),S("onValueChange","(value: string) => void","No callback","Receives actual color/alpha changes, excluding format and view changes. Vue emits valueChange as well as update:modelValue.","onValueChange={setValue}"),S("children","Framework content","Required","Arrange any elements and primitive controls inside this context.","<ColorPicker.Input />")],`const store=createColorStore("#5268E080");
<ColorPicker.Root store={store}><label>Brand<ColorPicker.Input /></label></ColorPicker.Root>`,t),_("ColorPicker.Area / Wheel","Interactive color surface. Add a Thumb yourself or supply Marker components for a multi-color wheel.",[se,S("view (Area / ColorPlane only)","'area' | 'wheel'","'area'","Changes the surface geometry. ColorPicker.Wheel and ColorWheelSurface always use wheel geometry.",'view="wheel"'),S("children","Framework content","No thumb","Owns the complete surface content. No selection dot is inserted automatically. Give the surface dimensions and the thumb a visible size.",'<ColorPicker.Thumb className="my-dot" />'),S("markers","readonly ColorMarker[]","Single store color","Enables generic multi-marker interaction. Supply marker nodes with matching ids. Theme roles are not part of color picker.","markers={markers}"),S("activeId","string","First marker id","Identifies the marker moved by an empty-surface interaction.",'activeId="brand"'),S("onSelect","(id: string) => void","No callback","Selects the clicked marker without relocating either color.","onSelect={setActiveId}"),S("onMarkerChange","(id: string, hsv: Partial<HSV>) => void","No callback","Receives pointer and keyboard edits for one marker. Update the source markers.","onMarkerChange={updateMarker}"),S("Astro value","HEX string","'#6366F1'","Seeds the server-rendered surface. Pass the same value to ColorRoot, ColorPlane and ColorThumb. The browser follows the root store. Astro surfaces do not accept the React multi-marker callbacks.",'value="#5268E080"')],'<ColorPicker.Root><ColorPicker.Wheel style={{width:240}}><ColorPicker.Thumb style={{width:16,height:16,border:"2px solid white"}} /></ColorPicker.Wheel></ColorPicker.Root>',t),_("ColorPicker.Thumb / Marker","Positions your own selection element. Thumb follows the nearest surface. Marker represents an explicitly supplied color.",[se,S("Astro value / view","HEX string / 'area' | 'wheel'","'#6366F1' / 'area'","Seeds the position of ColorThumb.astro during SSR. Match the parent surface. Browser bindings update the thumb from context.",'value="#5268E080" view="wheel"'),S("marker","ColorMarker","Required for Marker","Object with id, color: {h,s,v,hex}, optional label and ariaLabel. Marker emits no color updates by itself.","marker={markers[0]}"),S("active","boolean","false","Sets aria-pressed and data-state on a Marker.","active={activeId === marker.id}"),S("children","Framework content","No content for Thumb, marker.label for Marker","Use text, an icon or any custom content inside the element. Classes control its shape and decoration.","<span>Brand</span>")],'<ColorPicker.Root><ColorPicker.Area style={{height:180}}><ColorPicker.Thumb className="square-dot">Pick</ColorPicker.Thumb></ColorPicker.Area></ColorPicker.Root>',t),_("ColorPicker.Slider","A native range input with color-store behavior. Labels and layout belong to your application.",[se,S("channel","'h' | 's' | 'v' | 'alpha'","'h'","Hue uses degrees from 0 to 359. Saturation and brightness use 0 to 100. Alpha uses 0 to 100 percent with a 0.1 step. The store keeps alpha from 0 to 1.",'channel="alpha"'),S("disabled","boolean","false","Disables this input independently of the root. A disabled root also disables it.","disabled={true}")],'<ColorPicker.Root><label>Opacity<ColorPicker.Slider channel="alpha" /></label></ColorPicker.Root>',t),_("ColorPicker.Input / ChannelInput","A native input with validated local drafts. Invalid or incomplete text never enters the store.",[se,S("format","'hex' | 'rgb' | 'hsl' | 'hsv' | 'oklch' | 'oklab'","Current store format","Chooses the text syntax. Changing the store format updates inputs without a fixed format.",'format="hsl"'),S("index","0 | 1 | 2","Formatted text input","Enables a numeric channel field. Requires an explicit non-hex format. RGB channels use 0–255, HSL/HSV use degrees and percentages, OKLCH/OKLab lightness uses percentages.",'format="rgb" index={0}')],'<ColorPicker.Root><label>Red<ColorPicker.ChannelInput format="rgb" index={0} /></label><label>HEX<ColorPicker.Input format="hex" /></label></ColorPicker.Root>',t),_("ColorPicker.FormatTrigger","A native button for changing format, with your own content and events.",[se,S("format","'hex' | 'rgb' | 'hsl' | 'hsv' | 'oklch' | 'oklab'","Next supported format","Selects a fixed format when supplied, otherwise cycles through all formats.",'format="oklch"'),S("children / render","Framework content / React render callback","Current format in uppercase","React supports render(snapshot), Svelte accepts a children(snapshot) snippet, Vue exposes state in its default slot.","render={state => `Next after ${state.format}`}"),S("event cancellation","event.preventDefault()","Changes format after your handler","Cancel the click to keep the current format.","onClick={event => event.preventDefault()}")],'<ColorPicker.Root><ColorPicker.FormatTrigger format="rgb">RGB channels</ColorPicker.FormatTrigger></ColorPicker.Root>',t)]:[_("ThemeStudio.Root / Scope","Root provides theme state and lifecycle. Scope applies variables to a container you can style. ThemeProvider composes both with a disabled controls boundary.",[S("store","ThemeStore","Created internally","Root only. Uses the supplied store. Keep its identity stable for the lifetime of Root. Scope uses the nearest Root context and has no store prop in React, Svelte or Vue.","store={store}"),S("options","ThemeOptions","{}","Root only. Uses the same ThemeOptions documented under ThemeProvider. Initial theme, fallback, loader, storage, appearance and selection options initialize the store. Use its methods for subsequent updates.",'options={{theme,mode:"dark",modeStorage:false}}'),se,S("Astro Scope options","AstroThemeOptions","{}","Pass the same serializable options to ThemeRoot and ThemeVariableScope for matching server-rendered variables and loading state. Browser Scope follows the nearest Root. Vanilla uses tk-root and tk-scope, or bindThemeScope(element, store) for ordinary HTML.","<ThemeRoot options={options}><ThemeVariableScope options={options}>...</ThemeVariableScope></ThemeRoot>"),S("Scope children","Framework content","No content","Place themed elements inside Scope. You can use more than one Scope under a Root. Portalled content needs its own scope or copied variables.",'<ThemeStudio.Scope className="application">...</ThemeStudio.Scope>')],`const store=createThemeStore({modeStorage:false});
<ThemeStudio.Root store={store}><ThemeStudio.Scope><button>Continue</button></ThemeStudio.Scope></ThemeStudio.Root>`,t),_("ThemeStudio.PickerRoot","Connects color-picker primitives to the selected theme roles. Renders no role selectors, labels or surfaces.",[S("roles","readonly ('primary' | 'secondary' | 'accent')[]","All three roles","Registers only these roles for exports and limits role selection to them. Requires at least one unique role.",'roles={["primary","accent"]}'),S("activeRole","'primary' | 'secondary' | 'accent'","First selected role","Chooses which color feeds the shared slider and input controls. It must be included in roles.",'activeRole="accent"'),S("picker","ThemePickerStore","Created internally","Shares an existing picker controller.","picker={picker}"),S("disabled","boolean","false","Disables the active color controls and wheel. Theme-level disabled also applies.","disabled={true}"),S("view","'area' | 'wheel' | 'shared-wheel'","'shared-wheel'","Keeps picker view state for your own layout. PickerRoot never renders or switches surfaces by itself.",'view="wheel"'),S("controls","boolean","No rendering effect","Preset option accepted for compatibility with ThemePickerOptions. PickerRoot renders no controls regardless of this value. Arrange your own primitives in its children.","controls={false}"),S("children","Framework content","Required","Receives the picker context and active color context. ColorPicker.Input and Slider inside it edit only the active theme role.",'<ColorPicker.Input format="hex" />')],'<ThemeStudio.Root><ThemeStudio.PickerRoot roles={["primary"]}><ThemeStudio.Wheel /></ThemeStudio.PickerRoot></ThemeStudio.Root>',t),_("ThemeStudio.RoleTrigger","A native button that selects one theme role without moving its color.",[se,S("role","'primary' | 'secondary' | 'accent'","Required","Role to select. A role outside PickerRoot.roles is disabled.",'role="accent"'),S("children","Framework content","Role name","Use your own label or icon. Selection is exposed through aria-pressed and data-state.","Highlight")],'<ThemeStudio.Root><ThemeStudio.PickerRoot><ThemeStudio.RoleTrigger role="accent">Highlight</ThemeStudio.RoleTrigger></ThemeStudio.PickerRoot></ThemeStudio.Root>',t),_("ThemeStudio.Wheel","A color-picker wheel connected to the current theme picker, with optional custom marker markup.",[se,S("Astro theme / roles","Theme / readonly ('primary' | 'secondary' | 'accent')[]","Default theme / all three roles","ThemePickerWheel.astro uses these seeds to render initial markers. Pass the same theme and roles as Root and PickerRoot. React, Svelte and Vue read them from context instead.",'theme={theme} roles={["primary"]}'),S("children","Framework content","Markers for the selected roles","Supply ColorPicker.Marker elements to replace the default markers. useThemePicker() exposes their colors and active role. One selected role uses an unlabeled small dot.","<CustomThemeMarkers />")],'<ThemeStudio.Root><ThemeStudio.PickerRoot roles={["primary","accent"]}><ThemeStudio.Wheel className="my-wheel" /></ThemeStudio.PickerRoot></ThemeStudio.Root>',t),_("ThemeStudio.GeometryInput","A native numeric input that registers only its own geometry field for export.",[se,S("kind","'radius' | 'width'","'radius'","Radius is measured in rem. Border width is measured in px. Valid values are from 0 to 1000.",'kind="width"'),S("target","'DEFAULT' | 'input' | 'card' | 'popover' | 'button' | 'table' | 'picker'","'DEFAULT'","Selects the component token edited by this input. Mounting card radius does not register other radius or width tokens.",'target="card"'),S("Astro theme","Theme","Generated default theme","ThemeGeometryInput.astro reads this seed for its initial value. Pass the same theme used by ThemeRoot options. Browser updates follow context.","theme={theme}")],'<ThemeStudio.Root><label>Card corners<ThemeStudio.GeometryInput kind="radius" target="card" /></label></ThemeStudio.Root>',t)]}const f=(t,e,o,r,a)=>({key:t,type:e,default:o,description:r,example:a,required:o==="Required",readOnly:o!=="Required"&&["ratio / aa / aaa","suggestedForeground","history","Theme.schemaVersion","ThemeConfiguration.schemaVersion"].includes(t)||t==="store"&&o==="Isolated draft"}),Q=(t,e,o,r,a,s)=>({id:t.toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/-$/,""),name:t,kind:"Function",description:e,fields:o,example:{file:"Usage.ts",code:`import { ${a} } from '@salyra-ui/${r}';

${s}`}}),ao=[Q("createColorHistory","Keeps undo and redo steps for color and alpha edits. Changing the displayed format or surface does not add a step.",[f("store","ColorStore","Required","The color store to observe and restore.","createColorHistory(store)"),f("options.limit","positive integer","100","Maximum undo steps retained in memory. Older steps are dropped.","{ limit: 50 }"),f("begin() / end()","() => void","No transaction","Group several updates into one step. Transactions may be nested.","history.begin(); store.setAlpha(.5); history.end();"),f("undo() / redo()","() => void","No effect at the end of history","Restore color and alpha without changing format, view or disabled state. New edits discard the redo branch.","history.undo()"),f("getSnapshot()","{ canUndo, canRedo, length, index }","One initial entry","Read button availability. Subscribe to receive a new immutable snapshot after a history change.","history.getSnapshot().canUndo"),f("clear() / destroy()","() => void","Explicit cleanup","clear keeps the current value as the starting point. destroy releases subscriptions.","history.destroy()")],"color-picker","createColorStore, createColorHistory",`const store = createColorStore("#5268E080");
const history = createColorHistory(store, { limit: 50 });
history.begin();
store.setHex("#123456");
store.setAlpha(.5);
history.end();
history.undo();
history.redo();
history.destroy();`),Q("mountHistory","Groups pointer drags, held arrow keys and text-field edits on an editor root. Works with every framework.",[f("root","HTMLElement","Required","The editor element whose gestures belong to this history. Mount after the DOM exists.","mountHistory(element, history)"),f("history","HistoryController","Required","A color or theme history controller.","createColorHistory(store)"),f("return value","() => void","Cleanup","Remove root/document listeners and finish any open transaction. Call on unmount.","detach()"),f("keyboard shortcut","Ctrl/Cmd+Z, Shift+Ctrl/Cmd+Z","Enabled outside editable fields","Undo and redo on surfaces/buttons. Text inputs retain their native editing shortcuts.","Focus the surface, then press Ctrl+Z.")],"color-picker","createColorStore, createColorHistory, mountHistory",`const history = createColorHistory(createColorStore());
const element = document.getElementById("editor")!;
const detach = mountHistory(element, history);
// On unmount:
detach();
history.destroy();`),Q("bindColorForm","Adds one real form field for the selected color. Handles native validation, disabled state and form reset.",[f("root","HTMLElement","Required","An element inside the form, or the form itself.","bindColorForm(form, store, options)"),f("options.name","nonempty string","Required","Key included in FormData and normal form submission.",'{ name: "brandColor" }'),f("options.format","'hex' | 'rgb' | 'hsl' | 'hsv' | 'oklch' | 'oklab'","'hex'","Serialization format. HEX includes alpha. Other formats use the same strings as formatColor.",'{ format: "hsl" }'),f("options.defaultValue","HEX string","Current RGBA color at mount","Color restored by an uncancelled form reset.",'{ defaultValue: "#5268E080" }'),f("options.required / disabled","boolean","false","Native field constraints. Store disabled state also excludes the field from submission.","{ required: true }"),f("options.validate","(value: string) => string | undefined","No custom validation","Return an error message to make the field invalid, or undefined to accept the value.",'{ validate: value => value === "#000000" ? "Choose another color" : undefined }'),f("return value","{ input, getValue(), destroy() }","Mounted field","Read the submitted string or clean up the field and reset listener.","field.destroy()")],"color-picker","createColorStore, bindColorForm",`const store = createColorStore("#5268E080");
const form = document.querySelector<HTMLFormElement>("form")!;
const field = bindColorForm(form, store, { name: "brandColor", required: true });
console.log(new FormData(form).get("brandColor"));
// On unmount:
field.destroy();`),Q("colorContrast","Measures text contrast after compositing alpha over the background and canvas. It does not change the selected color.",[f("foreground / background","HEX strings with optional alpha","Required","Text color and the surface behind it.",'colorContrast("#00000080", "#FFFFFF")'),f("options.canvas","opaque HEX string","'#FFFFFF'","Surface below a transparent background. Transparent canvases are rejected.",'{ canvas: "#171717" }'),f("options.text","'normal' | 'large'","'normal'","Uses AA/AAA thresholds for normal or large text.",'{ text: "large" }'),f("ratio / aa / aaa","number / boolean / boolean","Calculated","Full-precision contrast ratio and pass/fail results. Rounding is for display only.","result.ratio.toFixed(2)"),f("suggestedForeground","opaque HEX string","Black or white","The stronger of black and white on the rendered background. Apply only after user choice.","store.setHex(result.suggestedForeground)")],"color-picker","colorContrast",`const result = colorContrast("#5268E080", "#FFFFFF");
console.log(result.ratio, result.aa, result.aaa, result.suggestedForeground);`),Q("createColorCollection","Keeps bounded recent and favorite colors independently of theme roles. Persistence is optional and begins on load().",[f("options.limit","integer from 1 to 1000","12","Maximum colors in each list. HEX values are normalized and deduplicated.","{ limit: 8 }"),f("options.favorites","readonly HEX string[]","[]","Initial favorites before a valid saved collection is loaded.",'{ favorites: ["#5268E0", "#277D59"] }'),f("options.storage","{ read(), write(snapshot) }","No persistence","Supply browserColorStorage(key) or your own synchronous storage adapter. Storage failures keep in-memory state usable.",'{ storage: browserColorStorage("app:colors") }'),f("load()","() => void","Explicit mount step","Reads persistence. Call on the client so server and hydration snapshots remain identical.","collection.load()"),f("remember(color)","(HEX string) => void","Explicit action","Moves a color to the front of recent colors. Call after selection or Save, rather than on every drag sample.","collection.remember(store.getSnapshot().value)"),f("toggleFavorite(color)","(HEX string) => void","Explicit action","Adds or removes a favorite color.",'collection.toggleFavorite("#5268E0")'),f("getSnapshot() / subscribe()","ColorCollectionSnapshot / subscription","Immutable arrays","Read recent and favorites arrays. Subscribe for UI updates. clearRecent() removes only recent colors.","collection.getSnapshot().favorites")],"color-picker","createColorCollection, browserColorStorage",`const collection = createColorCollection({ favorites: ["#5268E0"], storage: browserColorStorage("app:colors") });
// On client mount:
collection.load();
collection.remember("#12345680");
collection.toggleFavorite("#12345680");`)];ao.push({id:"colorcollection",name:"ColorCollection",kind:"Component",description:"Displays recent or favorite swatches and applies the selected value to the nearest color context.",fields:[f("collection","ColorCollectionStore","Required","Collection whose colors this component renders.","collection={collection}"),f("kind","'recent' | 'favorites'","'recent'","Selects one list. Use two components to show both lists.",'kind="favorites"'),f("label","string","'Recent colors'","Visible legend. Set your own label when showing favorites.",'label="Saved brand colors"'),f("classes","{ root?, item?, label? }","{}","Classes for the fieldset, each swatch container/button and legend. Color fill comes from the selected HEX value.",'classes={{ root: "brand-list", item: "brand-swatch", label: "brand-label" }}'),f("renderLabel","(color: string) => ReactNode","No item text","React only. Supplies custom content for each color button. Vanilla mountColorCollection accepts a callback returning text. The Svelte, Vue and Angular presets support classes but do not accept a custom item renderer. Compose your own list with ColorSwatch when you need custom content.","renderLabel={value => value}"),f("Astro colors","readonly HEX string[]","[]","Astro renders serializable initial colors. On the client, cp-collection.setCollection(collection) connects a live collection.",'colors={["#5268E0"]}')],example:{file:"Collection.tsx",code:`import { useState } from 'react';
import { ColorProvider, ColorCollection, createColorCollection } from '@salyra-ui/color-picker/react';
export default function Collection() {
  const [collection] = useState(() => createColorCollection({favorites:['#5268E0','#277D59']}));
  return <ColorProvider><ColorCollection collection={collection} kind="favorites" label="Saved colors" classes={{item:'brand-swatch'}} /></ColorProvider>;
}`}});const ca=[Q("createThemeEditor","Creates a separate draft store that works with every provider. The applied store changes only on Apply unless live editing is enabled.",[f("target","ThemeStore","Required","Applied context to edit. Pass editor.store to the editor provider and keep target around the application preview.","createThemeEditor(target)"),f("options.live","boolean","false","Apply each draft change immediately. setLive(true) commits the current draft first.","{ live: true }"),f("options.historyLimit","positive integer","100","Maximum undo steps in editor.history.","{ historyLimit: 50 }"),f("options.locked","readonly ThemeLock[]","[]","Initial generation locks. primary, secondary, accent and background affect regeneration. Radius/width are already preserved by generation.",'{ locked: ["accent", "background"] }'),f("store","ThemeStore","Isolated draft","Use existing picker, name, mode and geometry components against this store. Draft persistence is disabled by default.","<ThemeProvider store={editor.store}>...</ThemeProvider>"),f("history","HistoryController","One initial entry","Undo or redo draft edits. Use mountHistory(root, editor.history) to group drags and field edits.","editor.history.undo()"),f("setLive(live)","(boolean) => void","false","Enable immediate application or return to draft editing. Enabling commits the current draft.","editor.setLive(true)"),f("subscribe(listener)","(listener: () => void) => () => void","Explicit subscription","Observe dirty, conflict, live and locked state. The returned function unsubscribes.","const unsubscribe = editor.subscribe(renderButtons)"),f("apply({ force? })","({ force?: boolean }) => void","force: false","Commit theme and mode. A remote change during editing raises conflict. force explicitly replaces that newer applied theme.","editor.apply({ force: true })"),f("cancel()","() => void","Explicit action","Load the latest applied theme and mode, clear dirty/conflict state and reset draft history.","editor.cancel()"),f("setLocked(field, locked?)","(ThemeLock, boolean) => void","locked: true","Exclude a field from regeneration. Manual color editing remains available.",'editor.setLocked("accent", true)'),f("getSnapshot()","{ dirty, conflict, live, locked }","No edits","State for Apply/Cancel buttons, conflict text and lock controls. Subscribe for changes.","editor.getSnapshot().dirty"),f("destroy()","() => void","Explicit cleanup","Remove source/draft subscriptions and dispose history. Detach mounted gesture listeners separately.","editor.destroy()")],"theme-studio","createThemeStore, createThemeEditor",`const target = createThemeStore({modeStorage:false});
const editor = createThemeEditor(target, {locked:["accent"]});
editor.store.setColor("primary", "#123456");
editor.apply();
editor.store.setName("Another draft");
editor.cancel();
editor.destroy();`),Q("createThemeHistory","Tracks theme and appearance preference changes. Loading status, disabled state, export field registration and system appearance changes do not add history steps.",[f("store","ThemeStore","Required","Applied or draft store whose editable values should be restored.","createThemeHistory(store)"),f("options.limit","positive integer","100","Maximum undo steps. Methods and gesture mounting match createColorHistory.","{limit:50}"),f("begin() / end() / undo() / redo()","() => void","No transaction","Group a drag or multiple setters and restore it as one action.",'history.begin(); store.setName("Brand"); history.end();')],"theme-studio","createThemeStore, createThemeHistory",`const store = createThemeStore();
const history = createThemeHistory(store);
history.begin();
store.setName("Brand");
store.setBorder("radius", "card", .75);
history.end();
history.undo();
history.destroy();`),Q("themeTailwind","Exports selected runtime variables and Tailwind 4 utility mappings. Colors map to bg/text utilities, radius to rounded utilities and width to custom border utilities.",[f("state","ThemeSnapshot","Required","Current theme and resolved appearance.","themeTailwind(store.getSnapshot())"),f("options.selection","TokenSelection","Store selection, otherwise all tokens","Only the configured roles, geometry and background are included. modes selects one or both appearance modes.",'{selection:{roles:["primary"],radius:["card"],width:["button"]}}'),f("options.selector","CSS selector","':root'","Scope for runtime variables of the first exported appearance mode.",'{selector:".app-theme"}'),f("options.darkSelector","CSS selector","'.dark'","Scope for dark variables when both modes are exported. Match the application class or data attribute.",`{darkSelector:'.app-theme[data-mode="dark"]'}`),f("return value","string","Tailwind CSS","Import after Tailwind. bg-primary, text-primary-foreground, rounded-card and border-button exist only for exported fields.","config.tailwind")],"theme-studio","createThemeStore, themeTailwind",`const store = createThemeStore({selection:{roles:["primary"],radius:["card"],width:["button"],background:true,modes:["light","dark"]}});
const css = themeTailwind(store.getSnapshot(), {selector:".app-theme",darkSelector:'.app-theme[data-mode="dark"]'});
console.log(css);`),Q("themeContrast","Checks a theme role foreground against its default palette color using the same contrast result as colorContrast.",[f("state","ThemeSnapshot","Required","Theme to inspect.","themeContrast(store.getSnapshot())"),f("role","'primary' | 'secondary' | 'accent'","'primary'","Palette whose text/surface pair should be measured.",'themeContrast(store.getSnapshot(), "accent")'),f("return value","ContrastResult","Calculated","ratio, aa, aaa and suggestedForeground. This helper does not modify the theme.","result.aa")],"theme-studio","createThemeStore, themeContrast",`const store = createThemeStore();
const result = themeContrast(store.getSnapshot(), "primary");
console.log(result.ratio, result.aa);`),Q("createThemeCollection","Keeps recent and favorite complete themes for your existing preset selector. Themes with the same ID replace the previous saved value.",[f("options.limit","integer from 1 to 1000","12","Maximum themes in each list.","{limit:8}"),f("options.favorites","readonly Theme[]","[]","Initial complete themes. Inputs are validated and frozen.",'{favorites:[generateTheme("#5268E0")]}'),f("options.storage","ThemeCollectionStorage","No persistence","Use browserThemeCollectionStorage(key) or synchronous read/write methods. Call load() on client mount.",'{storage:browserThemeCollectionStorage("app:theme-library")}'),f("remember(theme) / toggleFavorite(theme)","(Theme) => void","Explicit action","Store the applied theme after Apply, or toggle a favorite by its ID.","collection.remember(store.getSnapshot().theme)"),f("getSnapshot()","{ recent: readonly Theme[], favorites: readonly Theme[] }","Immutable arrays","Pass the favorites or recent list to ThemeSelect. Subscribe to keep a reactive list current.","collection.getSnapshot().favorites")],"theme-studio","createThemeCollection, browserThemeCollectionStorage, generateTheme",`const collection = createThemeCollection({favorites:[generateTheme("#5268E0")],storage:browserThemeCollectionStorage("app:theme-library")});
// On client mount:
collection.load();
collection.remember(generateTheme("#277D59"));`),Q("Theme schema version","Current themes and configuration exports use schemaVersion: 1. Older unversioned and version 0 themes are upgraded by parseTheme.",[f("Theme.schemaVersion","1","Added by parseTheme","Stored format version. Missing values on old input are accepted. Unsupported versions fail before being applied.","parseTheme(saved).schemaVersion"),f("ThemeConfiguration.schemaVersion","1","Always present","Version of exported configuration JSON. Partial exports still contain only selected fields.","JSON.parse(config.json).schemaVersion"),f("mergeThemeConfiguration(base, saved)","Theme","Validated merge","Load partial JSON over a full base. Version validation also applies to the merged theme.","mergeThemeConfiguration(base, saved)")],"theme-studio","generateTheme, parseTheme",`const theme = generateTheme("#5268E0");
const saved = JSON.stringify(theme);
const restored = parseTheme(JSON.parse(saved));
console.log(restored.schemaVersion);`)];function da(t){return t==="color-picker"?ao:ca}const pa={"color-picker":{"ColorPicker.Root":["ColorRoot","ColorPicker"],"ColorPicker.Area / Wheel":["ColorPlane","ColorWheelSurface"],"ColorPicker.Thumb / Marker":["ColorThumb","ColorMarkerThumb"],"ColorPicker.Slider":["ColorRange"],"ColorPicker.Input / ChannelInput":["ColorField"],"ColorPicker.FormatTrigger":["ColorFormatTrigger"],ColorProvider:["ColorProvider"],ColorArea:["ColorArea"],ColorWheel:["ColorWheel"],ColorSlider:["ColorSlider"],ColorInput:["ColorInput"],ColorChannelInput:["ColorChannelInput"],ColorTextInput:["ColorTextInput"],ColorAlphaInput:["ColorAlphaInput"],ColorFormatSelect:["ColorFormatSelect"],ColorMode:["ColorMode"],"ColorViewSelect / ColorSurface":["ColorViewSelect","ColorSurface"],"ColorSwatch / ColorPreview":["ColorSwatch","ColorPreview"],ColorCollection:["ColorCollection"],"useColorStore / useColor":["useColorStore","useColor"],"Context setup":["provideColor","watchColor","ColorContext","ColorSurfaceContext","colorPickerPrimitives"]},"theme-studio":{"ThemeStudio.Root / Scope":["ThemeRoot","ThemeVariableScope","ThemeStudio"],"ThemeStudio.PickerRoot":["ThemePickerRoot"],"ThemeStudio.RoleTrigger":["ThemeRoleTrigger"],"ThemeStudio.Wheel":["ThemePickerWheel"],"ThemeStudio.GeometryInput":["ThemeGeometryInput"],ThemeProvider:["ThemeProvider"],ThemePicker:["ThemePicker"],"ThemeGenerator / ThemeColor":["ThemeGenerator","ThemeColor"],ThemeHarmony:["ThemeHarmony"],ThemeBackground:["ThemeBackground"],"ThemeBorder / ThemeRadius / ThemeBorderWidth":["ThemeBorder","ThemeRadius","ThemeBorderWidth"],ThemePalette:["ThemePalette"],ThemeMode:["ThemeMode"],useThemeMode:["useThemeMode"],ThemeName:["ThemeName"],"ThemeSelect / ThemeSwatch":["ThemeSelect","ThemeSwatch"],"ThemeLoading / ThemeReady / ThemeError":["ThemeLoading","ThemeReady","ThemeError"],ThemeExport:["ThemeExport"],ThemeWheel:["ThemeWheel"],"useThemeStore / useTheme":["useThemeStore","useTheme"],"useThemePickerStore / useThemePicker":["useThemePickerStore","useThemePicker"],"Context setup":["provideTheme","watchTheme","provideThemePicker","ThemeContext","ThemePickerContext","themeStudioPrimitives"]}},L=(t,e,o,r,a)=>({key:t,type:e,default:o,description:r,example:a,required:o==="Required"}),ue=(t,e,o,r,a,s,i,l)=>({id:t.toLowerCase().replace(/[^a-z0-9]+/g,"-"),name:t,kind:e,description:o,fields:r,note:l,example:{file:"Context.tsx",code:`import { ${s} } from '@salyra-ui/${a}/react';

${i}`}}),Ct="Call context helpers inside a descendant component, not the component that creates the Root. React returns a snapshot and rerenders on changes. Svelte returns a readable store, accessed with $state in markup. Vue returns a shallow ref, accessed with state.value in setup and unwrapped in templates. Angular returns a readonly signal, read with state(). Call Svelte helpers during component initialization, Vue helpers in setup and Angular helpers in an injection context. Astro and Vanilla use store.getSnapshot() and store.subscribe() in browser code instead of these hooks.";function ma(t){const e=t==="color-picker",o=e?"Color":"Theme",r=[ue(`use${o}Store / use${o}`,"Function",`Read the nearest ${e?"ColorProvider or ColorPicker.Root":"ThemeProvider or ThemeStudio.Root"} context. The store provides actions and the snapshot provides reactive values.`,[L(`use${o}Store()`,`${o}Store`,"Nearest root","Returns the stable context store. Calling outside a root throws. This helper does not subscribe or create a store.",`const store = use${o}Store()`),L(`use${o}()`,`${o}Snapshot (adapter-specific reactive wrapper)`,"Current snapshot","Subscribes to changes and cleans up with the framework component. See the adapter rules below.",`const state = use${o}()`)],t,`use${o}Store, use${o}`,e?`export function SelectedColor() {
  const state = useColor();
  const store = useColorStore();
  return <button onClick={() => store.setHex("#277D59")}>{state.value}</button>;
}`:`export function SelectedTheme() {
  const state = useTheme();
  const store = useThemeStore();
  return <button onClick={() => store.setMode("dark")}>{state.theme.name}</button>;
}`,Ct)];if(e||r.push(ue("useThemePickerStore / useThemePicker","Function","Read the active role and controller inside ThemeStudio.PickerRoot. Theme context alone is not a picker context.",[L("useThemePickerStore()","ThemePickerStore","Nearest PickerRoot","Returns actions such as selectRole(), setRoles(), setHSV() and activeColor. Throws outside a picker root.","const picker = useThemePickerStore()"),L("useThemePicker()","ThemePickerSnapshot (adapter-specific reactive wrapper)","Current picker snapshot","Reads roles, activeRole, view and colors. Each color snapshot contains its own disabled state. Uses the same adapter subscription rules as useTheme().","const state = useThemePicker()")],t,"useThemePickerStore, useThemePicker",`export function ActiveRole() {
  const picker = useThemePickerStore();
  const state = useThemePicker();
  return <button onClick={() => picker.selectRole(state.roles[0])}>{state.activeRole}</button>;
}`,Ct),ue("ThemeWheel","Component","Ready-made shared wheel driven by an explicit picker controller. Use ThemeStudio.Wheel when you want native attributes, custom classes and marker children.",[L("picker","ThemePickerStore","Required","Use the same mounted picker as your role controls. This component subscribes to it but does not mount it or own its lifecycle.","picker={picker}")],t,"ThemeStudio, ThemeWheel, useThemePickerStore",`function Wheel() {
  const picker = useThemePickerStore();
  return <ThemeWheel picker={picker} />;
}
export function Editor() {
  return <ThemeStudio.Root><ThemeStudio.PickerRoot roles={["primary", "accent"]}><Wheel /></ThemeStudio.PickerRoot></ThemeStudio.Root>;
}`,'Available in React, Svelte, Vue and Angular. Astro uses ThemePickerWheel.astro. Vanilla uses data-tk-control="wheel" under mountThemeControls(). ThemeWheel is a preset and uses the optional package CSS.')),r.push(ue("Context setup","Function","Advanced adapter helpers for supplying context from your own wrapper. Root is the usual entry point because it also owns lifecycle.",[L(`provide${o}(store)`,`Svelte / Vue: ${o}Store`,"No context until supplied","Call during Svelte initialization or Vue setup. Supplies context only. Does not mount loading, storage or browser listeners.",`provide${o}(store)`),L(`watch${o}(store)`,`Vue: ShallowRef<${o}Snapshot>`,"Current snapshot","Subscribes to an explicit store in Vue setup and unsubscribes on scope disposal. Does not require an injected root.",`const state = watch${o}(store)`),L(`${o}Context`,"Angular injectable","Provided by the matching Root or Provider","Infrastructure for directives and components. configure(store) changes its backing store. Use use"+o+"Store() in application code rather than configuring a shared service.",`const store = use${o}Store()`),...e?[L("ColorSurfaceContext","Angular injectable","Provided by cpArea / cpWheel","Shares the surface view with cpThumb. Provided by the surface directive, not the color root.","<div cpWheel><span cpThumb></span></div>")]:[L("provideThemePicker(picker)","Svelte / Vue: ThemePickerStore","No picker context until supplied","Provides picker context only. A custom wrapper must also provide the active color store and mount/clean up the picker. Prefer ThemeStudio.PickerRoot.","provideThemePicker(picker)"),L("ThemePickerContext","Angular injectable","Provided by tkPickerRoot","Holds the nearest picker controller. configure(picker) changes the backing controller. Prefer useThemePickerStore() for actions.","const picker = useThemePickerStore()")],L(e?"colorPickerPrimitives":"themeStudioPrimitives","Angular: readonly directive array","All headless directives","Spread into a standalone component imports array to register the primitive directives. Ready-made components are imported separately.",`imports: [...${e?"colorPickerPrimitives":"themeStudioPrimitives"}]`)],t,`use${o}Store`,`export function CustomAction() {
  const store = use${o}Store();
  return <button onClick={() => store.setDisabled(true)}>Lock editing</button>;
}`,"These are adapter-specific exports. provide*/watch* are Svelte or Vue helpers, injectable context classes and primitive arrays belong to Angular. React context hooks need a matching Root above the calling component. They are not Astro or Vanilla APIs."),ue(e?"mountColorControls":"mountThemeControls","Function","Bind existing HTML without generating a layout. Your application owns labels, classes, content and teardown.",[L("root","HTMLElement","Required","Container holding the data attributes below. Mount once and destroy before remounting or replacing its markup.",'document.querySelector<HTMLElement>("#editor")!'),L("store",`${o}Store`,"Required","Existing store shared with the rest of your application.",`create${o}Store()`),...e?[]:[L("options","ThemePickerOptions","{}","roles, activeRole, view, disabled and controls options for the picker controller. The function registers roles and each mounted geometry field for export.",'{roles:["primary"],activeRole:"primary"}')],L("data-cp-control","'area' | 'wheel' | 'slider' | 'input' | 'format'","No behavior without an attribute",'Surfaces contain data-cp-part="thumb". Sliders use data-channel h/s/v/alpha. Inputs optionally use data-format and data-index. A format button with no data-format cycles formats.','<input data-cp-control="slider" data-channel="alpha" />'),...e?[]:[L("data-tk-control","'wheel' | 'role' | 'geometry'","No behavior without an attribute","Role buttons use data-role. Geometry inputs use data-kind radius/width and data-target. Wheel children use data-marker-id matching selected roles. Other color controls connect to the active role.",'<input data-tk-control="geometry" data-kind="radius" data-target="card" />')],L("return value",e?"{store, destroy()}":"{store, picker, getConfiguration(), destroy()}","One bound editor","destroy() removes subscriptions and handlers. It does not remove your HTML or stop the externally owned theme store. Theme getConfiguration() exports only registered or explicitly selected fields.","controls.destroy()")],t,`create${o}Store`,`const store = create${o}Store();
console.log(store.getSnapshot());`,"Vanilla export. Astro primitives use these bindings internally. Native attributes and your own click handlers stay on the actual elements. Call preventDefault() to cancel the default format or role action.")),!e){const i=ue("ThemePickerSnapshot","Return value","Reactive picker state returned by getSnapshot() and useThemePicker(). All colors are available internally, while roles controls the visible and exported subset.",[L("roles","readonly ('primary' | 'secondary' | 'accent')[]","Configured roles","Nonempty unique list of visible roles. Switching roles does not recolor their palettes.","state.roles"),L("activeRole","'primary' | 'secondary' | 'accent'","First configured role","The selected role edited by activeColor. Always belongs to roles.","state.activeRole"),L("view","'area' | 'wheel' | 'shared-wheel'","'shared-wheel'","The selected view state. Custom compositions decide what markup to render for it.","state.view"),L("colors","Readonly<Record<Role, ColorSnapshot>>","All three role snapshots","Color, alpha, format, view and disabled state for each role. These internal snapshots are not an export selection.","state.colors[state.activeRole].hex")],t,"createThemeStore, createThemePickerStore",`const store = createThemeStore({modeStorage:false});
const picker = createThemePickerStore(store,{roles:["primary"]});
console.log(picker.getSnapshot().colors.primary.hex);`);i.example.file="PickerSnapshot.ts",r.push(i)}const a=r.find(i=>i.name===(e?"mountColorControls":"mountThemeControls"));a.example={file:"NativeControls.ts",code:`import { create${o}Store, mount${o}Controls${e?"":", bindThemeScope"} } from '@salyra-ui/${t}/vanilla';

const root = document.createElement('section');
root.innerHTML = '${e?'<label>Opacity<input data-cp-control="slider" data-channel="alpha" /></label>':'<label>Primary<input data-cp-control="input" data-format="hex" /></label><label>Card corners<input data-tk-control="geometry" data-kind="radius" data-target="card" /></label>'}';
const store = create${o}Store(${e?"'#5268E080'":"{modeStorage:false}"});
${e?"":"const detachScope = bindThemeScope(root, store);"}
const controls = mount${o}Controls(root, store${e?"":', {roles:["primary"]}'});
document.body.append(root);
// When this editor is removed:
controls.destroy();
${e?"":"detachScope();"}
root.remove();`},e||r.push(ue("bindThemeScope","Function","Apply the theme variables to an existing HTML container independently of editor controls.",[L("element","HTMLElement","Required","CSS inheritance is limited to this subtree. Portals outside it need a separate scope binding.",'document.querySelector<HTMLElement>("#preview")!'),L("store","ThemeStore","Required","The state used for CSS variables and data-mode, data-mode-preference, data-theme, data-theme-status and data-disabled attributes. Binding a scope does not create an isolated store.","bindThemeScope(element, store)"),L("return value","() => void","Active subscription","Call to unsubscribe and restore previous values of theme-owned CSS properties. Other inline styles are preserved. Scope data attributes are left on the element.","detach()")],t,"createThemeStore, bindThemeScope",`const store = createThemeStore({modeStorage:false});
const element = document.createElement("section");
const detach = bindThemeScope(element, store);
store.setMode("dark");
detach();`));const s=r.find(i=>i.name==="bindThemeScope");return s&&(s.example.file="Scope.ts",s.example.code=s.example.code.replace("/react","/vanilla")),r}const n=(t,e,o,r,a,s=!1)=>({key:t,type:e,default:o,description:r,example:a,required:s}),ge="'hex' | 'rgb' | 'hsl' | 'hsv' | 'oklch' | 'oklab'",pe="'primary' | 'secondary' | 'accent'",Se="'DEFAULT' | 'input' | 'card' | 'popover' | 'button' | 'table' | 'picker'",ce="'system' | 'light' | 'dark'",Ne="'analogous' | 'triadic' | 'split-complementary'",so="50 | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900 | 950",Z=n("className","string","''","Adds a CSS class to the component root. The existing component class stays in place.",'className="brand-picker"'),be=n("classes","ColorPartClasses","{}","Assigns classes to individual parts. See ColorPartClasses below for the supported keys.","classes={{ root: 'brand-area', thumb: 'brand-dot', text: 'dot-label' }}"),le=n("className","string","''","Adds your CSS class to the root element.",'className="brand-theme"'),Ae=n("disabled","boolean","false","Blocks pointer, keyboard and form editing. Values stay visible and programmatic store updates remain available.","disabled={true}"),wt=n("role",pe,"'primary'","Chooses the theme palette this component reads or edits. Primary is the main color, secondary is the supporting color and accent is the emphasis color.",'role="accent"'),R=(t,e,o)=>({file:"Usage.tsx",code:`import { ${[t==="color-picker"?"ColorProvider":"ThemeProvider",...t==="theme-studio"?["generateTheme"]:[],...e].filter((r,a,s)=>s.indexOf(r)===a).join(", ")} } from '@salyra-ui/${t}/react';
import '@salyra-ui/${t}/styles.min.css';

export function Example() {
  return ${t==="color-picker"?'<ColorProvider value="#5268E0">':'<ThemeProvider theme={generateTheme("#5268E0")} modeStorage={false}>'}
    ${o}
  </${t==="color-picker"?"ColorProvider":"ThemeProvider"}>;
}`}),J=(t,e,o)=>({file:"usage.ts",code:`import { ${e.join(", ")} } from '@salyra-ui/${t}';

${o}`}),k=(t,e,o,r,a,s)=>({id:t==="ThemeConfiguration"?"theme-configuration":t.toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/-$/,""),name:t,kind:e,description:o,fields:r,example:a,note:s}),_e=[k("ColorProvider","Component","Shares one selected color with its surfaces, sliders, inputs and format controls.",[n("value","HEX string","'#6366F1'","Sets the initial color. React also applies subsequent value changes. Accepts short or full hex, with optional alpha.",'value="#5268E080"'),n("store","ColorStore","Created internally","Uses an existing store instead of creating one. Supply it when several consumers must share state or you need a starting format other than hex.","store={createColorStore('#5268E0', 'hsl')}"),n("view","'area' | 'wheel'","'area'","Sets the initial surface for a new store. area shows a rectangle and wheel shows a circle. With a supplied store, its own view is used.",'view="wheel"'),{...Ae,default:"false for a new store",description:`${Ae.description} Omitting this property preserves the state of a supplied store.`},n("onChange","(hex: string) => void","No callback","Receives RGBA hex after an actual color change. Format and view changes do not call it. It does not emit the initial value.","onChange={(hex) => console.log(hex)}"),n("children","ReactNode","None","The controls that share this color context. A nested ColorProvider creates an independent context.","<ColorProvider><ColorArea /></ColorProvider>",!0)],R("color-picker",["ColorWheel","ColorSlider","ColorInput"],'<ColorWheel /><ColorSlider channel="v" /><ColorSlider channel="alpha" /><ColorInput />'),"Use useColorStore() and useColor() inside a child of the provider. Svelte and Vue expose reactive store reads. Vanilla uses cp-provider.setStore(store) and the color-change DOM event."),k("ColorArea","Component","A rectangle that edits saturation horizontally and brightness vertically. Hue and alpha stay unchanged.",[Z,be,n("label","string","'Saturation and brightness'","Names the surface for assistive technology. Current saturation and brightness are appended to this label.",'label="Brand color"'),n("style","React.CSSProperties","{}","Overrides root dimensions or adds CSS variables. In Svelte and Astro, style is a CSS string.","style={{ minHeight: 200 }}"),n("thumbText","ReactNode","No text","Renders content inside the single selection dot. Svelte and Astro accept a string. Vue also supports its thumb slot.",'thumbText="C"'),n("renderThumb","(state: ColorSnapshot) => ReactNode","Uses thumbText","React render callback for dynamic dot content. Svelte uses a thumb snippet and Vue uses a thumb slot.","renderThumb={(state) => Math.round(state.s)}")],R("color-picker",["ColorArea","ColorSlider"],'<ColorArea thumbText="C" classes={{ thumb: "brand-dot" }} /><ColorSlider channel="h" />')),k("ColorWheel","Component","A circle that edits hue by angle and saturation by distance from the center. Pair it with a brightness slider.",[Z,be,n("label","string","'Hue and saturation wheel'","Accessible name for the picking surface.",'label="Choose a color"'),n("style","React.CSSProperties","{}","Adds root styling and CSS variables. It does not change color calculations.","style={{ maxWidth: 280 }}"),n("thumbText","ReactNode","No text","Content inside the single color dot. It is used when markers is omitted.",'thumbText="C"'),n("markers","readonly ColorMarker[]","One store-controlled dot","Enables multiple independently controlled markers. Each marker needs a unique id and a color. This is a generic color-picker capability, with no theme roles built in.",'markers={[{ id: "brand", color: { h: 220, s: 60, v: 80, hex: "#527ACC" }, label: "B" }]}'),n("activeId","string","First marker for keyboard editing","Identifies the active marker. Pass this explicitly to keep visual selection and keyboard editing in sync.",'activeId="brand"'),n("onSelect","(id: string) => void","No callback","Receives the clicked marker id. Update your activeId in response. Selecting a marker does not move it.","onSelect={(id) => setActiveId(id)}"),n("onMarkerChange","(id: string, hsv: Partial<HSV>) => void","No callback","Receives marker edits from a drag or keyboard action. Update that marker in your state.","onMarkerChange={(id, hsv) => updateMarker(id, hsv)}"),n("renderMarker","(marker: ColorMarker, active: boolean) => ReactNode","Uses marker.label","Replaces marker text in React. Svelte uses a marker snippet and Vue a marker slot. A single marker has a small dot by default.","renderMarker={(marker) => marker.label}")],R("color-picker",["ColorWheel","ColorSlider"],'<ColorWheel thumbText="C" /><ColorSlider channel="v" /><ColorSlider channel="alpha" />')),k("ColorSlider","Component","Edits one HSV or alpha channel while keeping the other channels. Brightness and saturation tracks reflect the selected color.",[n("channel","'h' | 's' | 'v' | 'alpha'","'h'","h edits hue from 0 to 359 degrees. s edits saturation, v edits brightness and alpha edits opacity, each from 0 to 100 in the UI.",'channel="alpha"'),n("label","string","Hue / Saturation / Brightness / Alpha","Replaces the visible and accessible label for the selected channel.",'label="Opacity"'),Z,be],R("color-picker",["ColorSlider"],'<ColorSlider channel="alpha" label="Opacity" classes={{ track: "opacity-track" }} />')),k("ColorInput","Component","Displays one HEX field or three separate numeric channel fields for the selected format.",[n("format",ge,"Current store format","Locks this input to one format. Omit it to follow ColorFormatSelect or ColorMode. Does not change the store format.",'format="rgb"'),n("label","string","Uppercase format name","Labels the HEX input or the numeric field group. Individual numeric labels remain R/G/B, H/S/L and the corresponding channel names.",'label="Brand RGB"'),Z,be],R("color-picker",["ColorInput","ColorFormatSelect"],'<ColorFormatSelect /><ColorInput /><ColorInput format="rgb" label="Fixed RGB fields" />')),k("ColorChannelInput","Component","Displays one numeric channel from a fixed format. Alpha has its own component.",[n("format","'rgb' | 'hsl' | 'hsv' | 'oklch' | 'oklab'","None","Selects the channel model. HEX is excluded because it has no separate numeric channels. See Channel values for index mappings and ranges.",'format="hsl"',!0),n("index","0 | 1 | 2","None","Selects a channel in format order. For RGB, 0 is red, 1 is green and 2 is blue.","index={1}",!0),Z,be],R("color-picker",["ColorChannelInput"],'<ColorChannelInput format="hsl" index={0} /><ColorChannelInput format="hsl" index={1} /><ColorChannelInput format="hsl" index={2} />')),k("ColorTextInput","Component","An optional single text field for a full formatted color. Use ColorInput for separate numeric channel fields.",[n("format",ge,"Current store format","Chooses how the text is parsed and displayed. Invalid input is marked and restored on blur or Enter.",'format="oklch"'),n("label","string","Uppercase format name","Sets the visible input label.",'label="CSS color"'),Z,be],R("color-picker",["ColorTextInput"],'<ColorTextInput format="hex" label="Color value" />')),k("ColorAlphaInput","Component","Edits opacity numerically as a percentage. The stored alpha uses 0 to 1.",[n("label","string","'Alpha'","Replaces the visible and accessible label. The percent unit remains visible.",'label="Opacity"'),Z,be,n("value range","number: 0 to 100","Store alpha × 100","The input uses a 0.1 step. Empty, non-finite or out-of-range drafts are invalid and restore on blur.","50% in this field equals store.setAlpha(0.5)")],R("color-picker",["ColorAlphaInput"],'<ColorAlphaInput label="Opacity" />'),"value range describes the input constraint. It is not a component prop."),k("ColorFormatSelect","Component","Chooses which format the following ColorInput displays. The selected color does not change.",[n("label","string","'Color format'","Replaces the dropdown label. The six format choices remain HEX, RGB, HSL, HSV, OKLCH and OKLAB.",'label="Display format"'),Z],R("color-picker",["ColorFormatSelect","ColorInput"],'<ColorFormatSelect label="Display format" /><ColorInput />')),k("ColorMode","Component","A button that cycles through hex, rgb, hsl, hsv, oklch and oklab, then returns to hex.",[Z,n("children","ReactNode | ((format: ColorFormat) => ReactNode)","Current format + switch indicator","Replaces the button content with text, an icon or dynamic markup. The callback receives the lowercase format key.","<ColorMode>{(format) => `Change ${format.toUpperCase()}`}</ColorMode>")],R("color-picker",["ColorMode","ColorInput"],"<ColorInput /><ColorMode>{(format) => `Change ${format.toUpperCase()}`}</ColorMode>"),"Svelte: children(format) snippet. Vue: default slot with format. Angular: projected template with let-format. Astro: slot content. Vanilla: cp-mode data-custom with your button, and data-color-format on the span that should follow the format."),k("ColorViewSelect / ColorSurface","Component","ColorViewSelect chooses a layout. ColorSurface renders the chosen surface and its matching hue or brightness slider.",[n("label","string on ColorViewSelect","'Picker view'","Labels the view dropdown. area is displayed as Rectangle and wheel as Wheel.",'label="Layout"'),{...Z,description:"Adds a root class to ColorViewSelect. ColorSurface has no React props and uses the current store view."}],R("color-picker",["ColorViewSelect","ColorSurface","ColorInput"],'<ColorViewSelect label="Layout" /><ColorSurface /><ColorInput />')),k("ColorSwatch / ColorPreview","Component","ColorSwatch applies a supplied color on click. ColorPreview displays the selected RGBA value.",[n("value","HEX string on ColorSwatch","None","The preset color applied by the swatch. ColorPreview reads the store instead of taking a value.",'value="#277D59"',!0),n("label","string on ColorSwatch","The value string","Accessible name for the swatch button.",'label="Forest green"'),Z],R("color-picker",["ColorSwatch","ColorPreview"],'<ColorSwatch value="#277D59" label="Forest green" /><ColorPreview />')),k("ColorPartClasses","Styling","Part-level CSS class names used by the surface, slider and input components. Unsupported keys are ignored by that component.",[n("root","string","''","Adds a class to the control root. Supported by surfaces, sliders and inputs.","classes={{ root: 'brand-control' }}"),n("thumb","string","''","Styles the single selection dot in ColorArea or ColorWheel.","classes={{ thumb: 'square-dot' }}"),n("marker","string","''","Styles each interactive marker in a multi-marker ColorWheel.","classes={{ marker: 'brand-marker' }}"),n("text","string","''","Styles surface dot/marker text or a numeric channel label.","classes={{ text: 'dot-text' }}"),n("label","string","''","Adds a class to the label wrapper in sliders and inputs.","classes={{ label: 'field-label' }}"),n("track","string","''","Adds a class to the range input in ColorSlider.","classes={{ track: 'wide-track' }}"),n("input","string","''","Adds a class to the actual text, numeric or range input.","classes={{ input: 'brand-input' }}")],R("color-picker",["ColorArea","ColorSlider"],'<ColorArea classes={{ root: "brand-area", thumb: "square-dot", text: "dot-text" }} thumbText="C" /><ColorSlider classes={{ label: "field-label", track: "wide-track" }} />')),k("Channel values","Return value","The accepted input ranges and channel order for numeric controls. OKLCH and OKLab lightness is displayed as a percentage but returned as a 0 to 1 number.",[n("rgb","{ r, g, b, alpha }","Current color","Indexes 0/1/2 map to R/G/B, each from 0 to 255. Input step is 1. Returned alpha is 0 to 1.","store.getValue('rgb').r"),n("hsl","{ h, s, l, alpha }","Current color","Indexes 0/1/2 map to H/S/L. Hue is 0 to 360 degrees, saturation and lightness are 0 to 100%. Percent input step is 0.1.","store.getValue('hsl').l"),n("hsv","{ h, s, v, alpha }","Current color","Indexes 0/1/2 map to H/S/V. Hue is 0 to 360 degrees, saturation and brightness are 0 to 100%. HSV is a picker model, not a CSS color function.","store.getValue('hsv').v"),n("oklch","{ l, c, h, alpha }","Current color","Indexes 0/1/2 map to L/C/H. Input L is 0 to 100%, C is 0 to 0.4 and H is 0 to 360 degrees. Returned l is 0 to 1.","store.getValue('oklch').l"),n("oklab","{ l, a, b, alpha }","Current color","Indexes 0/1/2 map to L/a/b. Input L is 0 to 100%, a and b are -0.4 to 0.4. Returned l is 0 to 1. Chroma-axis input step is 0.001.","store.getValue('oklab').a")],J("color-picker",["createColorStore"],`const store = createColorStore('#5268E080');
const rgb = store.getValue('rgb');
const oklch = store.getValue('oklch');
console.log(rgb.r, rgb.alpha, oklch.l);`)),k("createColorStore","Function","Creates color state without mounting a UI. Arguments are positional.",[n("value (argument 1)","HEX string","'#6366F1'","Seeds the selected color and alpha. The opaque RGB base and alpha are stored separately.","createColorStore('#5268E080')"),n("format (argument 2)",ge,"'hex'","Seeds the displayed format. Use lowercase keys.","createColorStore('#5268E0', 'hsl')"),n("view (argument 3)","'area' | 'wheel'","'area'","Seeds the initial surface layout.","createColorStore('#5268E0', 'hex', 'wheel')"),n("disabled (argument 4)","boolean","false","Seeds the interaction state. You can change it later with setDisabled().","createColorStore('#5268E0', 'hex', 'area', true)")],J("color-picker",["createColorStore"],`const store = createColorStore('#5268E080', 'hsl', 'wheel');
console.log(store.getValue('hsl'));`)),k("ColorStore","Methods","Read color state, subscribe to changes or update it programmatically.",[n("getColor()","() => ColorInfo","Current color","Returns the nearest name, matching metadata, all numeric formats and formatted strings. See ColorInfo for every field.","const color = store.getColor()"),n("getValue(format)",`(format: ${ge}) => string | channel object`,"None","Reads only the requested format. hex returns RGBA hex. Other formats return numeric channel objects with alpha.","store.getValue('hex')"),n("getSnapshot()","() => ColorSnapshot","Current state","Reads h, s, v, alpha, hex, value, format, view and disabled. hex is opaque RGB, value includes alpha when needed.","const { value, alpha } = store.getSnapshot()"),n("getServerSnapshot()","() => ColorSnapshot","Initial state","Returns the immutable initial seed for server rendering and hydration.","store.getServerSnapshot().value"),n("subscribe(listener)","(() => void) => unsubscribe","None","Runs after a state update, including format or disabled changes. Call the returned function when removing the consumer.","const unsubscribe = store.subscribe(() => console.log(store.getSnapshot()))"),n("setHex(value)","(HEX string) => void","None","Replaces RGB and alpha. Opaque hex resets alpha to 1.","store.setHex('#277D5980')"),n("setHSV(patch)","(Partial<{ h: number, s: number, v: number }>) => void","None","Updates only supplied HSV channels. Hue wraps around 360, saturation and brightness clamp to 0 to 100. Alpha stays unchanged.","store.setHSV({ h: 140, s: 60 })"),n("setAlpha(alpha)","(number: 0 to 1) => void","None","Changes only opacity. Rejects non-finite or out-of-range values.","store.setAlpha(0.5)"),n("setFormat(format)",`(${ge}) => void`,"None","Changes the displayed format without changing the color.","store.setFormat('oklch')"),n("setView(view)","('area' | 'wheel') => void","None","Switches layout for components that follow the store view.","store.setView('wheel')"),n("setDisabled(disabled)","(boolean) => void","None","Disables editing. Programmatic methods still work so external data can update a disabled preview.","store.setDisabled(true)")],J("color-picker",["createColorStore"],`const store = createColorStore('#5268E0');
const unsubscribe = store.subscribe(() => console.log(store.getColor()));
store.setHSV({ h: 140 });
store.setAlpha(0.5);
unsubscribe();`)),k("ColorInfo","Return value","The object returned by getColor(). Naming compares the opaque color against the bundled list and does not depend on alpha.",[n("name","string","Nearest named color","Display name from the bundled color list.","store.getColor().name"),n("slug","string","Normalized name","Lowercase name with spaces replaced by hyphens and apostrophes/slashes removed.","store.getColor().slug"),n("matchedHex","HEX string","Nearest named RGB color","The named color used for the match. It can differ from the selected hex.","store.getColor().matchedHex"),n("exact","boolean","Computed","True when the opaque selected RGB color exactly matches the named entry.","store.getColor().exact"),n("hex","string","Current RGBA color","Returns #RRGGBB for full opacity or #RRGGBBAA when alpha is below 1.","store.getColor().hex"),n("alpha","number: 0 to 1","Current opacity","Opacity as a numeric fraction.","store.getColor().alpha"),...["rgb","hsl","hsv","oklch","oklab"].map(t=>n(t,"Numeric channel object + alpha","Current color","Returns the numeric channels for this format. See Channel values for the individual field names and units.",`store.getColor().${t}`)),n("formats","Record<ColorFormat, string>","Current formatted values","Formatted channel strings. Wrap hsl, oklch, oklab and rgb in the matching CSS function when using them in styles. HSV has no CSS function.","`hsl(${store.getColor().formats.hsl})`")],J("color-picker",["createColorStore"],"const color = createColorStore('#5268E080').getColor();\nconsole.log(color.name, color.exact, color.hex);\nconst background = `hsl(${color.formats.hsl})`;\nconsole.log(background);")),k("mountColorPicker","Function","Mounts a complete Vanilla picker into a DOM element and returns its store, value readers and cleanup.",[n("element (argument 1)","HTMLElement","None","The DOM container that receives the generated provider and controls.","document.querySelector<HTMLElement>('#picker')!",!0),n("options.value","HEX string","'#6366F1'","Initial color for an internally created store.","{ value: '#5268E0' }"),n("options.format",ge,"'hex'","Initial input format for an internally created store.","{ format: 'rgb' }"),n("options.view","'area' | 'wheel'","'area'","Initial layout for an internally created store.","{ view: 'wheel' }"),n("options.store","ColorStore","Created internally","Shares an existing store. Its value, view and format take priority over the initial options.","{ store }"),n("options.disabled","boolean","Supplied store state / false","Overrides disabled when provided. Omitting it preserves a supplied store state.","{ disabled: true }"),n("options.className","string","''","Class applied to the generated cp-provider.","{ className: 'brand-picker' }"),n("options.onChange","(color: ColorInfo) => void","No callback","Receives the initial ColorInfo immediately and then actual color changes. Unlike ColorProvider, this callback receives the full object.","{ onChange: (color) => console.log(color.name, color.hex) }"),n("return value","{ element, store, getColor, getValue, destroy }","Mounted instance","Call destroy() to remove the generated provider and its listeners before mounting again into the same container.","picker.destroy()")],{file:"usage.ts",code:`import { mountColorPicker } from '@salyra-ui/color-picker/vanilla';
import '@salyra-ui/color-picker/vanilla/styles.css';

const picker = mountColorPicker(document.querySelector<HTMLElement>('#picker')!, {
  value: '#5268E080', format: 'rgb', view: 'wheel',
  onChange: (color) => console.log(color.name, color.hex),
});
// When the host is removed:
picker.destroy();`})],ha=[n("theme","Theme","Built-in Indigo theme","Supplies a complete theme that renders immediately. It takes priority over the stored cache. Use store.setTheme() for later changes to an initialized provider.","theme={generateTheme('#277D59')}"),n("fallbackTheme","Theme","Built-in Indigo theme","Applies when loading rejects, returns invalid theme data or times out. It must be a complete valid Theme. It does not define loading content.","fallbackTheme={generateTheme('#5268E0')}"),n("loadTheme","(signal: AbortSignal) => unknown | Promise<unknown>","No request","Loads a complete theme. Pass the signal to fetch so stop() and superseded requests can cancel it. Invalid responses use fallbackTheme.",'loadTheme={createHttpThemeLoader("/api/theme")}'),n("mode",ce,"'system'","system follows the device after mount. light and dark force a fixed appearance. Saved mode storage can replace this seed when the provider mounts.",'mode="dark"'),n("systemMode","'light' | 'dark'","'light'","Provides a deterministic SSR appearance when mode is system. Browser media preference replaces it after mount. Has no visible effect while mode is fixed.",'systemMode="dark"'),n("modeStorage","ModeStorage | false","browserModeStorage('theme-studio:mode')","Saves the appearance preference independently from theme data. false disables storage, while system still follows the device. See ModeStorage for its methods.","modeStorage={false}"),n("storage","ThemeStorage","No theme cache","Reads and writes full theme data. With no supplied theme, the cache can seed the context before the loader revalidates. See ThemeStorage for its methods.",'storage={browserStorage("app:theme")}'),n("background","'neutral' | 'tinted'","Uses the supplied theme","neutral generates grayscale surfaces. tinted gives light and dark surfaces a subtle hue from primary. Omitting it preserves the supplied background configuration.",'background="tinted"'),n("selection","TokenSelection","Mounted fields, or full export","Limits theme, JSON and CSS exports. Explicit selection takes priority over automatically registered fields and is available during SSR. See TokenSelection for each key.",'selection={{ roles: ["primary"], radius: ["card"], width: ["button"] }}'),Ae,n("timeoutMs","Positive finite number, milliseconds","10000","Maximum loader duration. A request that never completes uses the fallback when this timer expires.","timeoutMs={5000}"),n("revalidateOnFocus","boolean","false","Reloads through loadTheme when the page becomes active again. The current usable theme stays visible during refresh.","revalidateOnFocus={true}"),n("revalidateIntervalMs","Positive finite number, milliseconds","No polling","Reloads at this interval while the page is visible. The HTTP loader can use ETag and 304 responses to avoid downloading unchanged themes.","revalidateIntervalMs={60000}")],ua="const store = createThemeStore({ theme: generateTheme('#5268E0'), mode: 'light', modeStorage: false });",ne=(t,e=[])=>J("theme-studio",["createThemeStore","generateTheme",...e],`${ua}
${t}`),it=[k("ThemeProvider","Component","Ready composition of ThemeStudio.Root and ThemeStudio.Scope with a disabled controls boundary.",[...ha,n("store","ThemeStore","Created from options","Uses an existing store. Its snapshot seeds the provider. Pass matching lifecycle options for loading, cache and mode persistence.","store={store}"),le,n("scopeProps","React HTMLAttributes<HTMLDivElement> | Astro HTMLAttributes<div>","{}","Native id, ARIA attributes, events, classes and style for the actual scope. Svelte and Vue accept these attributes directly on ThemeProvider. React ref and Svelte bind:ref target the scope element.",'scopeProps={{ id: "app-theme", "aria-label": "Themed app" }}'),n("style","React.CSSProperties","{}","Adds root styling. Explicit style properties override generated CSS variables on this scope.","style={{ padding: 24 }}"),n("children","ReactNode","None","The application and controls that share this theme. A nested provider creates an independent scope.","<ThemeProvider><ThemePicker /></ThemeProvider>",!0)],R("theme-studio",["ThemePicker","ThemePalette","ThemeExport"],'<ThemePicker roles={["primary"]} controls={false} /><ThemePalette /><ThemeExport />'),"React passes ThemeOptions directly as props. Svelte, Vue and Angular pass an options object. Initial options seed the store once. Root owns loading, storage and cleanup. Scope owns CSS variables. For later edits use store methods. Use Root and Scope directly when you want your own markup. Astro replaces loader and cache functions with src, storageKey and modeStorageKey."),k("Astro provider options","Options","Astro supports the serializable ThemeOptions plus these browser loading and persistence keys.",[n("src","URL string","No client fetch","Starts a browser request for theme JSON. It replaces loadTheme, which cannot be serialized into HTML.",'src="/api/theme"'),n("storageKey","string","No theme cache","Creates a browser theme cache with this key. It replaces a custom ThemeStorage object.",'storageKey="app:theme"'),n("modeStorageKey","string","'theme-studio:mode'","Chooses the appearance persistence key for the browser.",'modeStorageKey="app:mode"'),n("modeStorage","false","Browser persistence enabled","Disables browser appearance persistence. Custom function-based ModeStorage is not an Astro prop.","modeStorage={false}"),n("class","string","''","Adds a class to the generated Astro theme scope.",'class="brand-theme"')],{file:"options.ts",code:`import { generateTheme } from '@salyra-ui/theme-studio';

const props = {
  fallbackTheme: generateTheme('#5268E0'),
  src: '/api/theme', storageKey: 'app:theme', modeStorageKey: 'app:mode',
};
// Pass these serializable props to Astro ThemeProvider.
console.log(props);`}),k("ThemePicker","Component","Edits the selected theme roles with a rectangle, separate wheel or shared wheel.",[n("roles",`readonly (${pe})[]`,"['primary', 'secondary', 'accent']","Chooses editable palettes. At least one unique role is required. A one-role picker uses a small unlabeled dot and hides role tabs.",'roles={["primary", "accent"]}'),n("activeRole",pe,"First selected role","Chooses the color initially connected to brightness and format fields. It must be included in roles.",'activeRole="accent"'),n("view","'area' | 'wheel' | 'shared-wheel'","'shared-wheel'","area shows a rectangle for the active role. wheel shows one active color on a circle. shared-wheel shows all selected role markers together.",'view="shared-wheel"'),n("controls","boolean","false for one role, true otherwise","Shows or hides the view and visible-role selectors. Set false for a fixed editor composition.","controls={false}"),Ae,n("picker","ThemePickerStore","Created internally","Uses a picker controller created with createThemePickerStore(themeStore, options). It keeps role, active-role and view state separate from the theme.","picker={picker}"),n("children","ReactNode","Slider, format select, inputs and format button","Replaces the default lower control group. The role controls and picking surface still render.",'<ThemePicker><ColorSlider channel="v" /><ColorInput /></ThemePicker>')],R("theme-studio",["ThemePicker"],'<ThemePicker roles={["primary", "accent"]} activeRole="accent" view="shared-wheel" controls={false} />'),"React creates its picker controller from initial props. Use picker.setRoles(), selectRole() and setView() for programmatic changes after mount. Disabled can be local to this picker or inherited from ThemeProvider."),k("ThemeGenerator / ThemeColor","Component","Connects a color-picker composition to one theme palette. ThemeColor is an alias of ThemeGenerator.",[wt,n("wheel","boolean","false","Chooses the initial wheel instead of area when the generator creates its color context.","wheel={true}"),Ae,le,n("children","ReactNode","View selector, surface and format controls","Replaces the default composition. Put color-picker components inside to use the linked color store.",'<ThemeGenerator role="accent"><ColorWheel /><ColorInput /></ThemeGenerator>')],R("theme-studio",["ThemeGenerator"],'<ThemeGenerator role="accent" wheel disabled={false} />'),'Import custom color controls from the matching color-picker adapter. In Angular, set [custom]="true" when projecting your own generator composition. Mounted generators register their role for automatic export selection.'),k("ThemeHarmony","Component","Selects a color harmony. The Generate action derives secondary and accent from primary.",[n("label","string","'Color harmony'","Replaces the harmony dropdown label.",'label="Palette relationship"'),n("harmony values",Ne,"Theme harmony / 'analogous'","analogous rotates secondary by -30° and accent by +30°. triadic uses +120° and +240°. split-complementary uses +150° and +210°. Choosing a formula alone does not regenerate the colors.",'store.setHarmony("triadic"); store.generateHarmony()')],R("theme-studio",["ThemeHarmony"],'<ThemeHarmony label="Palette relationship" />'),"harmony values describes the dropdown choices, not a component prop. For programmatic control, use setHarmony() followed by generateHarmony(). Manual edits remain possible afterward."),k("ThemeBackground","Component","A checkbox that enables a primary-tinted surface palette or restores neutral surfaces.",[n("label","string","'Tint background with primary'","Replaces the checkbox text. Checked applies tinted and unchecked applies neutral.",'label="Use brand-colored surfaces"'),le],R("theme-studio",["ThemeBackground"],'<ThemeBackground label="Use brand-colored surfaces" />'),"Mounting this control registers background and foreground fields for export. The active appearance is exported unless selection.modes includes both light and dark."),k("ThemeBorder / ThemeRadius / ThemeBorderWidth","Component","Edits one radius or border-width token. Each target is independent and each mounted field is registered for export. Incomplete input stays in the field while focused. Blur, Enter or Escape restores the current valid value.",[n("kind","'width' | 'radius'","'width' on ThemeBorder","width uses px with step 1. radius uses rem with step 0.125. ThemeRadius fixes kind to radius and ThemeBorderWidth fixes it to width.",'kind="radius"'),n("target",Se,"'DEFAULT'","Chooses the token to edit. DEFAULT is the shared default token. The named targets affect their own CSS variables, not the other targets.",'target="button"'),n("label","string","Target + radius or border width","Replaces the input label. Units still appear next to the field.",'label="Button corner radius"'),n("numeric range","number: 0 to 1000","Current theme token","Rejects negative, non-finite and out-of-range edits. A newly generated theme starts at 0.5 rem radius and 1 px width for every target.",'store.setBorder("radius", "button", 0.75)')],R("theme-studio",["ThemeRadius","ThemeBorderWidth"],'<ThemeRadius target="button" label="Button corner radius" /><ThemeBorderWidth target="card" label="Card border width" />'),"numeric range describes the input constraint. It is not a prop. Geometry selection uses the same targets as the controls and does not export omitted fields."),k("ThemePalette","Component","Displays eleven generated shades for one role. Color values always come from the current theme.",[wt,n("shape","'square' | 'circle' | 'joined'","'square'","square gives separate swatches. circle makes round swatches. joined removes the gap and rounds only the strip ends.",'shape="joined"'),le,n("classes","PaletteClasses","{}","Assigns root, item, swatch and label classes. See Palette styling for each nested key.",'classes={{ root: "brand-palette", label: "shade-label" }}'),n("labels","Partial<Record<Shade, string>>","Shade number",`Replaces the text for individual shade labels. Shade keys are ${so}. Unspecified shades keep their numbers.`,'labels={{ 500: "Brand", 950: "Ink" }}'),n("shadeClasses","Partial<Record<Shade, string>>","{}","Adds a class to the item wrapper for a specific shade, including its label and swatch.",'shadeClasses={{ 500: "featured-shade" }}')],R("theme-studio",["ThemePalette"],'<ThemePalette role="primary" shape="joined" labels={{ 500: "Brand" }} classes={{ root: "brand-palette", label: "shade-label" }} />')),k("Palette styling","Styling","Nested PaletteClasses keys and CSS variables. Class names are strings, while geometry is set with CSS variables.",[n("classes.root","string","''","Styles the palette grid and hosts its sizing variables.",'classes={{ root: "brand-palette" }}'),n("classes.item","string","''","Styles every shade wrapper, including the label and swatch.",'classes={{ item: "shade-item" }}'),n("classes.swatch","string","''","Styles the color surface shape, outline and size. The background color is supplied by the theme.",'classes={{ swatch: "shade-surface" }}'),n("classes.label","string","''","Styles the shade label text.",'classes={{ label: "shade-caption" }}'),n("--tk-palette-gap","CSS length","4px","Spacing between separate swatches. joined always uses zero gap.",".brand-palette { --tk-palette-gap: 8px; }"),n("--tk-swatch-height","CSS length","48px","Height of each swatch. Circle width is limited to this height.",".brand-palette { --tk-swatch-height: 64px; }"),n("--tk-swatch-radius","CSS length","4px square / 8px joined","Corner radius for square swatches and joined strip ends. Circle stays round.",".brand-palette { --tk-swatch-radius: 10px; }"),n("--tk-shade-label-size","CSS font-size","11px","Font size of the shade labels.",".brand-palette { --tk-shade-label-size: 12px; }")],R("theme-studio",["ThemePalette"],'<ThemePalette shape="circle" classes={{ root: "brand-palette", item: "shade-item", swatch: "shade-surface", label: "shade-caption" }} />')),k("ThemeMode","Component","A customizable appearance button. Give it a value for a fixed choice or omit value to cycle.",[n("value",ce,"Cycle on click","With value, the button selects that mode and indicates whether it is active. Without value, clicks cycle system, light, dark and back to system.",'value="dark"'),n("labels","Record<ModePreference, ReactNode>","System / Light mode / Dark mode","Replaces the default content for each mode when children is omitted.",'labels={{ system: "Device", light: "Day", dark: "Night" }}'),n("children","ReactNode | ((mode: ReturnType<typeof useThemeMode>) => ReactNode)","Uses labels","Replaces button content with text, an icon or a render callback. The callback can read preference and resolvedMode.",'<ThemeMode value="dark">Night</ThemeMode>'),le],R("theme-studio",["ThemeMode"],'<ThemeMode value="system">Device</ThemeMode><ThemeMode value="light">Day</ThemeMode><ThemeMode value="dark">Night</ThemeMode>'),"Svelte uses a children(mode) snippet and Vue a scoped slot. React labels is a convenience prop. Angular and Astro use projected content or slots. The provider owns mode persistence."),k("useThemeMode","Return value","Reads the current appearance and provides actions for your own buttons, toggles or dropdowns.",[n("preference",ce,"Provider preference","The saved user choice. system remains system even when resolvedMode is dark.","const mode = useThemeMode(); mode.preference"),n("resolvedMode","'light' | 'dark'","Resolved appearance","The mode currently applied to CSS variables and color-scheme.","mode.resolvedMode"),n("setMode(value)",`(${ce}) => void`,"None","Applies a specific preference and persists it through the provider mode storage.",'mode.setMode("system")'),n("cycle()","() => void","None","Advances system to light, light to dark and dark to system.","mode.cycle()")],{file:"Usage.tsx",code:`import { useThemeMode } from '@salyra-ui/theme-studio/react';

// Render inside ThemeProvider.
export function AppearanceButton() {
  const mode = useThemeMode();
  return <button aria-pressed={mode.preference === 'dark'} onClick={() => mode.setMode('dark')}>Night</button>;
}`}),k("ThemeName","Component","Edits the theme name while keeping a suggested name based on primary available.",[n("label","string","'Theme name'","Replaces the input label.",'label="Theme title"'),le,n("children","(value: { name, suggestedName, setName }) => ReactNode","Default name input","React callback for a custom input. name is the current title, suggestedName is the primary color name and setName changes the title. Empty string is a custom name until reset.","<ThemeName>{({ name }) => <span>{name}</span>}</ThemeName>")],R("theme-studio",["ThemeName"],'<ThemeName label="Theme title" />'),"Custom names survive later color edits. Calling store.setName() with no argument restores automatic naming. The default input limits names to 200 characters and resets an empty name on blur."),k("ThemeSelect / ThemeSwatch","Component","Applies a complete theme from a dropdown or a preset button.",[n("themes","readonly Theme[] on ThemeSelect","None","Preset list. Each theme must have a unique id. Empty lists disable the dropdown. Presets apply full theme data but keep the appearance preference.",'themes={[generateTheme("#5268E0"), generateTheme("#277D59")]}',!0),n("theme","Theme on ThemeSwatch","None","The full theme applied when this button is clicked.",'theme={generateTheme("#277D59", { name: "Forest" })}',!0),n("label","string on ThemeSelect","'Saved themes'","Replaces the dropdown label.",'label="Choose a theme"'),n("children","ReactNode on ThemeSwatch","theme.name","Custom preset button content. ThemeSelect uses theme names for its options.","<ThemeSwatch theme={theme}>Use this theme</ThemeSwatch>"),le],R("theme-studio",["ThemeSelect","ThemeSwatch"],'<ThemeSelect themes={[generateTheme("#5268E0"), generateTheme("#277D59")]} /><ThemeSwatch theme={generateTheme("#277D59", { name: "Forest" })}>Forest</ThemeSwatch>')),k("ThemeLoading / ThemeReady / ThemeError","Component","Separates loading content, usable theme content and error recovery. Ready and Error can be visible together when a fallback is applied.",[n("ThemeLoading.children","ReactNode","None","Renders only while status is loading and no usable theme is available. A background refresh keeps current content visible.","<ThemeLoading><p>Loading theme</p></ThemeLoading>",!0),n("ThemeReady.children","ReactNode","None","Renders when status is ready or fallback. It includes the application that should use the theme.","<ThemeReady><p>Application content</p></ThemeReady>",!0),n("ThemeError.children","(error: Error, retry: () => Promise<void>) => ReactNode","None","Renders when the context has an error. retry runs store.reload(). Use it for your own message and retry button.","<ThemeError>{(error, retry) => <button onClick={() => void retry()}>Retry</button>}</ThemeError>",!0)],R("theme-studio",["ThemeLoading","ThemeReady","ThemeError"],"<ThemeLoading><p>Loading theme</p></ThemeLoading><ThemeReady><p>Application content</p></ThemeReady><ThemeError>{(error, retry) => <button onClick={() => void retry()}>{error.message}: Retry</button>}</ThemeError>"),"In Svelte and Vue, error and retry are snippet/slot values. Angular exposes a projected error template. Vanilla uses tk-loading, tk-ready and tk-error, with data-tk-retry on your retry button."),k("ThemeExport","Component","Displays the selected JSON, CSS or Tailwind output, or passes the full configuration to your own UI.",[n("format","'json' | 'css' | 'tailwind'","'json'","Chooses which string is displayed by the default output. Does not affect the fields in the configuration.",'format="css"'),n("selection","TokenSelection","Provider selection / mounted fields","Overrides the export selection for this component. Omitted selection uses the snapshot selection, or full output when no fields are registered.",'selection={{ roles: ["primary"], radius: ["card"] }}'),n("onChange","(configuration: ThemeConfiguration) => void","No callback","React callback receives the initial configuration and subsequent theme or appearance updates.","onChange={(config) => console.log(config.json)}"),n("children","(configuration: ThemeConfiguration) => ReactNode","pre containing output string","Renders your own export UI. configuration includes selected theme data, tokens, JSON and CSS.","<ThemeExport>{(config) => <pre>{config.json}</pre>}</ThemeExport>"),le],R("theme-studio",["ThemeExport"],'<ThemeExport format="json" selection={{ roles: ["primary"], radius: ["card"], width: ["button"] }} />')),k("TokenSelection","Options","Chooses which fields are exported. A selection filters theme, JSON and CSS without discarding the full internal theme.",[n("roles",`readonly (${pe})[]`,"['primary']","Includes these palettes. [] excludes all color palettes. Each included role still contains its shades, DEFAULT and foreground.",'{ roles: ["primary", "accent"] }'),n("radius",`readonly (${Se})[]`,"[]","Includes only these radius tokens. Each target is independent.",'{ radius: ["card", "input"] }'),n("width",`readonly (${Se})[]`,"[]","Includes only these border-width tokens.",'{ width: ["button"] }'),n("background","boolean","false","Includes background, foreground and color-scheme. Without it, website surface colors are omitted.","{ background: true }"),n("mode","'light' | 'dark'","Resolved active mode","Chooses the surface mode used by CSS and by a single-mode JSON export. Does not change the active context.",'{ background: true, mode: "dark" }'),n("modes","readonly ('light' | 'dark')[]","Only mode / resolved active mode","Select one or both background/foreground branches for JSON. An empty array is invalid. Both modes keep mode preference and systemMode metadata. CSS declarations still describe one mode.",'{ background: true, modes: ["light", "dark"] }')],ne(`const config = themeConfiguration(store.getSnapshot(), {
  roles: ["primary"], radius: ["card"], width: ["button"],
  background: true, modes: ["dark"], mode: "dark",
});
console.log(config.json);`,["themeConfiguration"]),"These defaults apply when a selection object is supplied. Without a selection or registered editor fields, themeConfiguration returns the full theme. Explicit provider selection is the reliable way to seed a partial SSR export."),k("ThemeConfiguration","Return value","Call themeConfiguration(snapshot, selection?) to read export data. The result retains the full theme separately from the selected output.",[n("theme","SelectedTheme","Selected fields / full theme","The theme fields chosen by selection. Omitted roles, geometry and appearance branches are absent.","config.theme.structure.userPreset?.primary"),n("sourceTheme","Theme","Full internal theme","Complete context for application rendering. It is not serialized into config.json.","config.sourceTheme.structure.userPreset.accent"),n("mode","'light' | 'dark'","Snapshot resolved mode","The current resolved context appearance. selection.mode can override exported surface values without changing this field.","config.mode"),n("modePreference",ce,"Snapshot preference","The selected system/light/dark preference.","config.modePreference"),n("systemMode","'light' | 'dark'","Snapshot system appearance","Device appearance, or the server seed before mount.","config.systemMode"),n("tokens","Readonly<Record<string, string>>","Selected CSS tokens","Map of variable names to values, such as --primary and --border-radius-card. Values retain their CSS units.",'config.tokens["--border-radius-card"]'),n("css","string","Selected declarations","CSS declarations without a selector. Wrap them in your chosen scope or apply them as an inline style.","`.app { ${config.css} }`"),n("schemaVersion","1","Current schema","Format version written into saved configuration JSON.","config.schemaVersion"),n("tailwind","string","Selected tokens with utility mappings","Tailwind 4 stylesheet for the configured fields. Import after Tailwind CSS.","config.tailwind"),n("json","string","Selected theme + mode metadata","Serialized export. A partial theme must be merged into a full base before loading it as a complete Theme.","mergeThemeConfiguration(config.sourceTheme, config.json)")],ne(`const config = themeConfiguration(store.getSnapshot(), { roles: ["primary"] });
const updated = mergeThemeConfiguration(config.sourceTheme, config.json);
store.setTheme(updated);`,["themeConfiguration","mergeThemeConfiguration"])),k("ThemeStore","Methods","The framework-independent state shared by providers, editors and application consumers.",[n("getSnapshot()","() => ThemeSnapshot","Current state","Reads full theme, mode, modePreference, systemMode, background, status, pending, error, style, selection and disabled.","const { theme, pending } = store.getSnapshot()"),n("getServerSnapshot()","() => ThemeSnapshot","Initial immutable snapshot","Reads the original seed used for server rendering and hydration. Create a separate store for each request.","store.getServerSnapshot().style"),n("subscribe(listener)","(() => void) => unsubscribe","None","Notifies after state changes. Call the returned cleanup when removing the consumer.","const stop = store.subscribe(() => console.log(store.getSnapshot()))"),n("start()","() => Promise<void>","None","Reads the cache and runs the loader. Framework providers mount this automatically.","await store.start()"),n("reload()","() => Promise<void>","None","Runs the loader again without restoring cache. Keeps the current usable theme visible while pending.","await store.reload()"),n("stop()","() => void","None","Cancels in-flight loading. Provider cleanup also removes browser listeners.","store.stop()"),n("setTheme(theme)","(Theme) => void","None","Validates and applies a complete theme. Keeps the current appearance preference.",'store.setTheme(generateTheme("#277D59"))'),n("setColor(role, hex)",`(${pe}, HEX string) => void`,"None","Regenerates only that role palette. Changing primary updates automatic naming and generated backgrounds, but does not regenerate sibling colors.",'store.setColor("accent", "#C25D3D")'),n("setBorder(kind, target, value)","('radius' | 'width', Target, number: 0 to 1000) => void","None","Updates one geometry token. radius is rem and width is px. See geometry controls for target names.",'store.setBorder("radius", "card", 0.75)'),n("setName(name?)","(string | undefined) => void","Suggested name when omitted","Sets a custom name or resets it to the primary color suggestion.",'store.setName("Project theme")'),n("setMode(mode)",`(${ce}) => void`,"None","Changes appearance preference. Persistence is handled by the mounted provider.",'store.setMode("dark")'),n("setSystemMode(mode)","('light' | 'dark') => void","None","Updates the resolved system appearance. Affects visible mode only when preference is system.",'store.setSystemMode("dark")'),n("setBackground(mode)","('neutral' | 'tinted') => void","None","Regenerates surface colors using the current primary color.",'store.setBackground("tinted")'),n("setHarmony(harmony)",`(${Ne}) => void`,"None","Stores a harmony choice without changing palette colors.",'store.setHarmony("triadic")'),n("generateHarmony()","() => void","None","Regenerates secondary and accent from current primary using the chosen harmony.","store.generateHarmony()"),n("generate(seed, options?)","(HEX string, { roles?, harmony?, name? }) => void","All roles when roles omitted","Generates new palettes against the current theme base. Omitted roles keep their palettes when roles is supplied. Existing geometry remains.",'store.generate("#277D59", { roles: ["primary"], name: "Forest" })'),n("setSelection(selection)","(TokenSelection) => void","None","Sets an explicit export scope that takes priority over mounted field registrations.",'store.setSelection({ roles: ["primary"], width: ["button"] })'),n("registerFields(selection)","(TokenSelection) => { update, destroy }","None","Registers mounted editor fields for automatic export scope. update changes its fields and destroy removes the registration.",'const fields = store.registerFields({ radius: ["card"], roles: [] })'),n("setDisabled(disabled)","(boolean) => void","None","Changes global editing state while keeping theme data available.","store.setDisabled(true)")],ne(`store.setColor("primary", "#277D59");
store.setBorder("radius", "card", 0.75);
store.setName("Forest");
store.setSelection({ roles: ["primary"], radius: ["card"] });`)),k("ThemeSnapshot","Return value","State read through getSnapshot(), useTheme() or the adapter reactive context.",[n("theme","Theme","Current full theme","The complete internal theme even when exports select only some fields.","store.getSnapshot().theme"),n("mode","'light' | 'dark'","Resolved appearance","The appearance currently used by the scope.","store.getSnapshot().mode"),n("modePreference",ce,"Initial 'system' unless configured","The selected appearance preference, before system resolution.","store.getSnapshot().modePreference"),n("systemMode","'light' | 'dark'","Initial 'light' unless configured","The server seed or mounted browser preference.","store.getSnapshot().systemMode"),n("background","'neutral' | 'tinted' | 'preserve'","Theme background mode","preserve means supplied surface colors are kept. neutral and tinted regenerate surfaces when primary changes.","store.getSnapshot().background"),n("status","'loading' | 'ready' | 'fallback'","Determined by options","loading has no usable resolved theme. ready uses supplied, cached or loaded data. fallback uses fallbackTheme after a failure.",'store.getSnapshot().status === "fallback"'),n("pending","boolean","Loader state","True while a request is running, including background refresh. It can be true while status is ready.","store.getSnapshot().pending"),n("error","Error | null","null","The last loader failure when present. A fallback theme can remain usable while this is non-null.","store.getSnapshot().error?.message"),n("style","string","Full theme CSS declarations","Declarations for the complete active theme scope. Export filtering does not limit application styling.","store.getSnapshot().style"),n("selection","TokenSelection | undefined","Explicit or mounted selection","Current export scope. undefined means no explicit or registered selection.","store.getSnapshot().selection?.roles"),n("disabled","boolean","false","Whether user editing is blocked by this context.","store.getSnapshot().disabled")],ne(`const { status, pending, error, mode } = store.getSnapshot();
console.log(status, pending, error?.message, mode);`)),k("createThemeStore","Function","Creates theme state without a DOM scope. Accepts the ThemeOptions documented under ThemeProvider.",[n("options","ThemeOptions","{}","Includes theme, fallbackTheme, loader, mode, storage, selection and disabled options. Constructing a store does not start a fetch or read browser storage.",'createThemeStore({ theme: generateTheme("#5268E0"), mode: "dark" })'),n("return value","ThemeStore","New isolated state","Use with a provider, or mount its lifecycle manually through mountThemeStore(). Core generation and read methods work on the server.","const cleanup = mountThemeStore(store, options.storage, options)")],J("theme-studio",["createThemeStore","generateTheme"],`const store = createThemeStore({
  theme: generateTheme("#5268E0"), mode: "dark", modeStorage: false,
  selection: { roles: ["primary"], radius: ["card"] },
});
console.log(store.getSnapshot().theme.name);`)),k("generateTheme","Function","Builds a full Theme from a seed color. Export selection is a separate step.",[n("seed (argument 1)","Opaque HEX string","None","The primary color used to generate the theme. Theme palettes use opaque HSL channels.",'generateTheme("#5268E0")',!0),n("options.id","string","custom- + seed hex","Stable theme identifier for selection and persistence.",'{ id: "brand-blue" }'),n("options.name","string","Suggested color name / custom base name","Sets a custom theme name. Omit to use the primary color suggestion or preserve a custom base name.",'{ name: "Brand blue" }'),n("options.harmony",Ne,"Base harmony / 'analogous'","Formula used to generate secondary and accent. See ThemeHarmony for exact hue offsets.",'{ harmony: "triadic" }'),n("options.base","Theme","New default geometry and surfaces","Keeps existing geometry and unselected palettes. Used with roles to update part of a full theme.",'{ base: existingTheme, roles: ["primary"] }'),n("options.roles",`readonly (${pe})[]`,"All three roles","Selects palettes to regenerate. With a base, unselected roles stay unchanged. This does not create a partial exported Theme.",'{ roles: ["primary"] }'),n("options.background","'neutral' | 'tinted' | 'preserve'","Base setting / 'neutral'","neutral creates grayscale surfaces, tinted uses primary hue and preserve keeps supplied base surfaces.",'{ background: "tinted" }')],J("theme-studio",["generateTheme"],`const theme = generateTheme("#5268E0", {
  id: "brand-blue", name: "Brand blue", harmony: "triadic", background: "tinted",
});
console.log(theme.structure.userPreset.primary[500]);`)),k("ThemeStorage / ModeStorage","Options","Storage contracts passed to ThemeProvider. ThemeStorage saves complete themes, while ModeStorage saves system/light/dark preferences.",[n("ThemeStorage.read","() => unknown | Promise<unknown>","None","Returns a cached theme or saved snapshot. Invalid data is ignored and loading can continue.",'read: () => JSON.parse(localStorage.getItem("app:theme") ?? "null")',!0),n("ThemeStorage.write","(theme: Theme) => void | Promise<void>","None","Persists a complete theme after changes. It receives full context data, not a partial editor export.",'write: (theme) => localStorage.setItem("app:theme", JSON.stringify(theme))',!0),n("ThemeStorage.subscribe","(listener: (value: unknown) => void) => cleanup","No remote notifications","Passes external cache changes into the mounted context. The browser adapter uses same-origin storage events.","subscribe: (listener) => subscribeToThemeCache(listener)"),n("ModeStorage.read","() => unknown","None","Returns system, light or dark. Invalid values are ignored.",'read: () => localStorage.getItem("app:mode")',!0),n("ModeStorage.write",`(mode: ${ce}) => void`,"None","Saves appearance preference when it changes.",'write: (mode) => localStorage.setItem("app:mode", mode)',!0),n("ModeStorage.subscribe","(listener: (value: unknown) => void) => cleanup","No remote notifications","Notifies the context when another tab changes the saved preference.","subscribe: (listener) => subscribeToModeCache(listener)")],ne(`const options = {
  theme: store.getSnapshot().theme, storage: browserStorage("app:theme"),
  modeStorage: browserModeStorage("app:mode"),
};
console.log(options);`,["browserStorage","browserModeStorage"]),"browserStorage(key) defaults to @salyra-ui/theme-studio. browserModeStorage(key) defaults to theme-studio:mode. Both are safe to construct during SSR because browser access is deferred until mount."),k("createHttpThemeLoader","Function","Creates an abortable HTTP loader with ETag revalidation and 304 support. Instantiate one loader per context.",[n("url (argument 1)","URL string","None","Endpoint that returns a complete Theme as JSON. Invalid JSON, invalid themes and unsuccessful responses reject and use provider fallback.",'createHttpThemeLoader("/api/theme")',!0),n("options.fetch","typeof fetch","Global fetch","Overrides the request function, for example for a supplied fetch implementation.","{ fetch: customFetch }"),n("options.headers","HeadersInit","No extra headers","Adds request headers. The loader supplies If-None-Match when a previous ETag is available.",'{ headers: { Accept: "application/json" } }'),n("options.credentials","'omit' | 'same-origin' | 'include'","Browser fetch default","Controls whether cookies and credentials are sent.",'{ credentials: "include" }'),n("invalidate()","() => void on returned loader","None","Clears the in-memory cached theme and ETag. The next call makes a fresh request.","loader.invalidate()")],J("theme-studio",["createThemeStore","createHttpThemeLoader","generateTheme"],`const loader = createHttpThemeLoader("/api/theme", { credentials: "same-origin" });
const store = createThemeStore({ loadTheme: loader, fallbackTheme: generateTheme("#5268E0") });
// A provider mounts this lifecycle automatically.
void store.start();`)),k("watchThemeUpdates","Function","Connects refresh to focus, polling or external notifications and returns a cleanup function.",[n("store (argument 1)","ThemeStore","None","Context reloaded by the watcher. It should have a loadTheme function.","watchThemeUpdates(store)",!0),n("options.onFocus","boolean","true","Refreshes when the page becomes active and is not hidden. This helper defaults to true, unlike ThemeOptions.revalidateOnFocus.","{ onFocus: false }"),n("options.intervalMs","Positive finite number, milliseconds","No polling","Refreshes at this interval while the page is visible.","{ intervalMs: 60000 }"),n("options.subscribe","(invalidate: () => void) => cleanup","No external notifications","Calls invalidate when another application, SSE stream or WebSocket reports a theme change. Returns your subscription cleanup.","{ subscribe: (invalidate) => connectThemeEvents(invalidate) }"),n("return value","() => void","Cleanup","Removes timers, focus listeners and the external subscription.","stopWatching()")],ne(`const stopWatching = watchThemeUpdates(store, { onFocus: true, intervalMs: 60000 });
// When the consumer unmounts:
stopWatching();`,["watchThemeUpdates"])),k("mountThemeKit","Function","Mounts the complete Vanilla editor. ThemeOptions are accepted alongside these composition options.",[n("element (argument 1)","HTMLElement","None","DOM container for the generated tk-provider and editor.",'document.querySelector<HTMLElement>("#theme-editor")!',!0),n("options.store","ThemeStore","Created internally","Connects the editor to an existing theme context.","{ store }"),n("options.themes","readonly Theme[]","[]","Supplies preset dropdown entries. With one picker role, the default complete layout hides presets and harmony controls.",'{ themes: [generateTheme("#5268E0"), generateTheme("#277D59")] }'),n("options.picker","ThemePickerOptions","All roles, shared-wheel","Sets picker roles, activeRole, view, controls and local disabled. See ThemePicker for these keys.",'{ picker: { roles: ["primary"], view: "wheel", controls: false } }'),n("options.radius",`readonly (${Se})[]`,"['card']","Adds exactly these radius fields. [] adds none.",'{ radius: ["card", "button"] }'),n("options.width",`readonly (${Se})[]`,"['card']","Adds exactly these border-width fields. [] adds none.",'{ width: ["input"] }'),n("options.backgroundControl","boolean","true","Shows the surface tint checkbox. false omits it and its automatic export registration.","{ backgroundControl: false }"),n("options.className","string","''","Adds a CSS class to the generated tk-provider scope.",'{ className: "brand-editor" }'),n("options.onChange","(configuration: ThemeConfiguration) => void","No callback","Receives configuration after theme-change events. It does not emit the initial configuration. Read getConfiguration() for the initial output.","{ onChange: (config) => console.log(config.json) }"),n("return value","{ element, store, getConfiguration, destroy }","Mounted instance","getConfiguration(selection?) returns the selected output. destroy() removes the generated provider and listeners.",'editor.getConfiguration({ roles: ["primary"] })')],{file:"usage.ts",code:`import { mountThemeKit, generateTheme } from "@salyra-ui/theme-studio/vanilla";
import "@salyra-ui/theme-studio/vanilla/styles.css";

const editor = mountThemeKit(document.querySelector<HTMLElement>("#theme-editor")!, {
  theme: generateTheme("#5268E0"), modeStorage: false,
  picker: { roles: ["primary"], controls: false },
  radius: ["card"], width: ["button"], backgroundControl: false,
});
console.log(editor.getConfiguration().json);
// When the host is removed:
editor.destroy();`})];_e.push(k("ColorMarker","Options","One controlled marker supplied to ColorWheel.markers. Position follows HSV, while hex supplies its displayed background.",[n("id","string","None","Unique identifier used by activeId and marker callbacks.",'{ id: "brand" }',!0),n("color.h","number: hue in degrees","None","Controls the marker angle. Use normalized hue from 0 to 360.",'{ color: { h: 220, s: 60, v: 80, hex: "#527ACC" } }',!0),n("color.s","number: 0 to 100","None","Controls distance from the center. Zero sits in the center and 100 on the edge.",'{ color: { h: 220, s: 60, v: 80, hex: "#527ACC" } }',!0),n("color.v","number: 0 to 100","None","Brightness retained when the marker is edited.",'{ color: { h: 220, s: 60, v: 80, hex: "#527ACC" } }',!0),n("color.hex","Opaque HEX string","None","Color displayed on the marker. Keep it in sync with its HSV coordinates.",'{ color: { h: 220, s: 60, v: 80, hex: "#527ACC" } }',!0),n("label","string","No text","Text inside a marker. An omitted label or a single-marker list uses the smaller dot shape.",'{ label: "B" }'),n("ariaLabel","string","Select + id + marker","Accessible button name independent of the visible marker label.",'{ ariaLabel: "Edit brand color" }')],J("color-picker",["createColorStore","type ColorMarker"],`const store = createColorStore("#527ACC");
const markers: ColorMarker[] = [{ id: "brand", color: store.getSnapshot(), label: "B", ariaLabel: "Edit brand color" }];
console.log(markers);`)),k("ColorSnapshot","Return value","Immutable state returned by getSnapshot() and read by useColor(). hex is opaque and value includes alpha.",[n("h","number: 0 to 360","Initial color hue","HSV hue in degrees. Hue is retained for gray colors where it cannot be inferred from RGB.","store.getSnapshot().h"),n("s","number: 0 to 100","Initial color saturation","HSV saturation as a percentage.","store.getSnapshot().s"),n("v","number: 0 to 100","Initial color brightness","HSV brightness as a percentage.","store.getSnapshot().v"),n("hex","Opaque #RRGGBB string","Initial RGB color","Opaque base used for channel conversions and gradient rendering.","store.getSnapshot().hex"),n("value","#RRGGBB or #RRGGBBAA string","Initial color including alpha","Full selected color ready for a CSS hex value.","store.getSnapshot().value"),n("alpha","number: 0 to 1","Parsed from initial hex","Opacity fraction. Independent from HSV channels.","store.getSnapshot().alpha"),n("format",ge,"'hex'","The format followed by ColorInput and format controls.","store.getSnapshot().format"),n("view","'area' | 'wheel'","'area'","The layout followed by ColorSurface.","store.getSnapshot().view"),n("disabled","boolean","false","Editing state used by the provider and picking surface.","store.getSnapshot().disabled")],J("color-picker",["createColorStore"],`const store = createColorStore("#5268E080", "rgb", "wheel");
const { hex, value, alpha, format, view } = store.getSnapshot();
console.log(hex, value, alpha, format, view);`)));it.push(k("Theme","Return value","The complete data object used by providers, presets, loaders and persistence. Generate one with generateTheme(), or validate supplied data with parseTheme().",[n("id","Non-empty string, at most 128 characters","Generated from seed","Stable identifier used by preset selection.","theme.id"),n("name","string, at most 200 characters","Suggested color name","Human-readable theme title. It may be customized.","theme.name"),n("nameSource","'suggested' | 'custom' | undefined","Set by generation / naming","custom preserves the name as primary changes. suggested allows automatic naming.","theme.nameSource"),n("backgroundMode","'neutral' | 'tinted' | 'preserve' | undefined","neutral for a new generated theme","Controls how surface colors respond to primary edits. Missing mode is treated as preserve by the context.","theme.backgroundMode"),n("harmony",Ne+" | undefined","'analogous' for a new theme","Formula used when secondary and accent are explicitly regenerated.","theme.harmony"),n("structure.userPreset.primary","Palette","Generated primary shades","Main color palette, including shade keys, DEFAULT and foreground.","theme.structure.userPreset.primary[500]"),n("structure.userPreset.secondary","Palette","Generated secondary shades","Supporting palette with the same keys as primary.","theme.structure.userPreset.secondary.DEFAULT"),n("structure.userPreset.accent","Palette","Generated accent shades","Emphasis palette with the same keys as primary.","theme.structure.userPreset.accent.foreground"),n("Palette shade keys",so,"Generated HSL channels","Each numeric shade contains HSL channels without the hsl() wrapper. DEFAULT is the base color, and foreground is its contrasting text color.","`hsl(${theme.structure.userPreset.primary[500]})`"),n("structure.websitePreset.background","Record<'light' | 'dark', string>","Generated surfaces","Light and dark background colors stored as HSL channel strings.","theme.structure.websitePreset.background.dark"),n("structure.websitePreset.foreground","Record<'light' | 'dark', string>","Generated text colors","Light and dark foreground colors stored as HSL channel strings.","theme.structure.websitePreset.foreground.light"),n("structure.websitePreset.border.radius","Record<Target, number: 0 to 1000>","0.5 for every target","Corner radius in rem for DEFAULT, input, card, popover, button, table and picker.","theme.structure.websitePreset.border.radius.card"),n("structure.websitePreset.border.width","Record<Target, number: 0 to 1000>","1 for every target","Border thickness in px for DEFAULT, input, card, popover, button, table and picker.","theme.structure.websitePreset.border.width.button")],J("theme-studio",["generateTheme","parseTheme"],`const theme = parseTheme(generateTheme("#5268E0", { name: "Brand blue" }));
console.log(theme.name, theme.structure.userPreset.primary.DEFAULT);`)),k("createThemePickerStore / ThemePickerStore","Methods","A controller for active role, visible roles and layout. Create it with createThemePickerStore(themeStore, options), using the options documented under ThemePicker.",[n("mount()","() => cleanup","Not mounted","Starts theme synchronization and registers editable roles. The ThemePicker component handles this automatically.","const unmount = picker.mount()"),n("getSnapshot()","() => ThemePickerSnapshot","Current picker state","Returns roles, activeRole, view and colors. colors is a record of ColorSnapshot values for all theme roles, even when some are not visible.","picker.getSnapshot().activeRole"),n("getServerSnapshot()","() => ThemePickerSnapshot","Initial picker state","Returns the original seed for server rendering and hydration.","picker.getServerSnapshot().roles"),n("subscribe(listener)","(() => void) => cleanup","None","Notifies after role, view, selection or color changes.","const stop = picker.subscribe(() => console.log(picker.getSnapshot()))"),n("setRoles(roles)",`readonly (${pe})[]`,"None","Replaces the visible editable roles. Requires at least one unique role. If activeRole is removed, the first remaining role becomes active.",'picker.setRoles(["primary", "accent"])'),n("selectRole(role)",pe,"None","Changes which color feeds the shared brightness and input controls. The role must be currently selected.",'picker.selectRole("accent")'),n("setView(view)","'area' | 'wheel' | 'shared-wheel'","None","Changes surface layout without changing theme colors.",'picker.setView("wheel")'),n("setHSV(role, patch)","(Role, Partial<{ h, s, v }>) => void","None","Edits one role and synchronizes its palette with the theme store.",'picker.setHSV("accent", { h: 30 })'),n("activeColor","ColorStore","Current active role","A stable color-store bridge used by the input and slider composition. It follows role changes.",'picker.activeColor.getValue("hex")')],ne(`const picker = createThemePickerStore(store, { roles: ["primary", "accent"], view: "shared-wheel" });
const unmount = picker.mount();
picker.selectRole("accent");
picker.setHSV("accent", { h: 30 });
unmount();`,["createThemePickerStore"])));it.push(k("themeConfiguration","Function","Builds export data from a theme snapshot, using an explicit selection or the current context selection.",[n("snapshot (argument 1)","ThemeSnapshot","None","The state to export. Use getSnapshot() for current data or getServerSnapshot() for the initial server seed.","themeConfiguration(store.getSnapshot())",!0),n("selection (argument 2)","TokenSelection","snapshot.selection / full theme","Overrides context export fields. See TokenSelection for each nested key and its accepted values.",'themeConfiguration(store.getSnapshot(), { roles: ["primary"], width: ["button"] })'),n("return value","ThemeConfiguration","Selected export","Contains schemaVersion, theme, sourceTheme, mode, modePreference, systemMode, tokens, css, tailwind and json.","const config = themeConfiguration(store.getSnapshot())")],ne(`const config = themeConfiguration(store.getSnapshot(), { roles: ["primary"], width: ["button"] });
console.log(config.json, config.css);`,["themeConfiguration"])),k("mergeThemeConfiguration","Function","Applies selected export fields to a complete base theme, preserving fields absent from the export.",[n("base (argument 1)","Theme","None","Full theme that supplies omitted palettes, geometry and appearance data.","mergeThemeConfiguration(store.getSnapshot().theme, config.json)",!0),n("value (argument 2)","JSON string | { theme: SelectedTheme }","None","Serialized editor output or a parsed object with a theme field. Unsupported roles, geometry keys or invalid values are rejected.","mergeThemeConfiguration(base, JSON.parse(config.json))",!0),n("return value","Theme","Validated merged theme","A complete theme ready for setTheme(), presets or persistence. The separate appearance preference is not applied by this function.","store.setTheme(mergeThemeConfiguration(base, config.json))")],ne(`const base = store.getSnapshot().theme;
const config = themeConfiguration(store.getSnapshot(), { roles: ["primary"] });
store.setTheme(mergeThemeConfiguration(base, config.json));`,["themeConfiguration","mergeThemeConfiguration"])),k("browserStorage / browserModeStorage","Function","Creates lazy browser localStorage adapters. Constructing either adapter during SSR does not access the browser.",[n("browserStorage key","string","'@salyra-ui/theme-studio'","Storage key for the full versioned theme payload. It receives changes from other tabs on the same origin.",'browserStorage("app:theme")'),n("browserModeStorage key","string","'theme-studio:mode'","Independent storage key for the system, light or dark preference.",'browserModeStorage("app:mode")'),n("browserStorage return value","ThemeStorage","New storage adapter","Supplies read(), write(theme) and subscribe(listener). Access happens when the provider lifecycle mounts.",'storage: browserStorage("app:theme")'),n("browserModeStorage return value","ModeStorage","New storage adapter","Supplies read(), write(mode) and subscribe(listener). Pass false instead of this adapter to disable appearance persistence.",'modeStorage: browserModeStorage("app:mode")')],J("theme-studio",["createThemeStore","generateTheme","browserStorage","browserModeStorage"],`const options = {
  fallbackTheme: generateTheme("#5268E0"),
  storage: browserStorage("app:theme"), modeStorage: browserModeStorage("app:mode"),
};
const store = createThemeStore(options);
console.log(store.getSnapshot());`)),k("mountThemeStore","Function","Mounts cache writes, loading, mode persistence and refresh listeners for consumers without a framework provider.",[n("store (argument 1)","ThemeStore","None","Store whose lifecycle should start. Framework providers call this helper automatically.","mountThemeStore(store)",!0),n("storage (argument 2)","ThemeStorage","Store creation storage","Theme cache used for writes and same-origin subscription. Omitting it inherits the adapter passed to createThemeStore.","mountThemeStore(store, options.storage)"),n("options (argument 3)","{ modeStorage?, revalidateOnFocus?, revalidateIntervalMs? }","Store creation options","Overrides appearance persistence and refresh behavior. Omitted values inherit createThemeStore options, including modeStorage: false. Loader options belong to createThemeStore.","mountThemeStore(store, options.storage, options)"),n("return value","() => void","Cleanup","Stops requests, timers and listeners, then flushes any queued theme write. Call on unmount.","cleanup()")],J("theme-studio",["createThemeStore","generateTheme","browserStorage","mountThemeStore"],`const options = { theme: generateTheme("#5268E0"), storage: browserStorage("app:theme"), modeStorage: false as const };
const store = createThemeStore(options);
const cleanup = mountThemeStore(store, options.storage, options);
// When the consumer unmounts:
cleanup();`)));function no(t){return[...la(t),...t==="color-picker"?_e:it,...da(t),...ma(t)].map(e=>{if(["ColorArea","ColorWheel","ColorSlider","ColorTextInput","ColorChannelInput"].includes(e.name)&&(e={...e,fields:[...e.fields,n("native attributes","HTML attributes, events and ref","No extra attributes","The React wrapper forwards native attributes to its primitive surface or input. Use aria-describedby, id, name or placeholder as appropriate. Input disabled is local and combines with root disabled. Other adapters follow their own declared props. For fully owned markup use the composition primitives.",'aria-describedby="color-help"')]}),e.name==="createThemePickerStore / ThemePickerStore"&&(e={...e,fields:[...e.fields,n("setDisabled(disabled)","boolean","Initial options.disabled or theme disabled","Disables the picker color controls independently. Theme disabled still applies. Programmatic picker updates remain available.","picker.setDisabled(true)")]}),e.name==="ColorArea"){const o=_e.find(r=>r.name==="ColorWheel");e={...e,fields:[...e.fields,...o.fields.filter(r=>["markers","activeId","onSelect","onMarkerChange"].includes(r.key))],note:"This preset renders its own thumb and does not use children for layout. React also accepts marker callbacks inherited from ColorPlane, but use ColorPicker.Wheel with explicit Marker children for a custom multi-marker layout."}}return{...ia(e),exports:pa[t][e.name]??[]}})}const Ze=t=>`api-${t.id}`,ba=(t,e,o,r)=>r?"Read only":e.includes("return value")?"Returned":e.includes("range")||e==="harmony values"?"Input constraint":/\w+\(/.test(e)?"Method":t.kind==="Return value"||e==="activeColor"?"Read only":o?"Required":"Optional",ga={Theme:"Theme",ThemeStore:"ThemeStore",ThemeSnapshot:"ThemeSnapshot",ThemePickerSnapshot:"ThemePickerSnapshot",ThemePickerStore:"createThemePickerStore / ThemePickerStore",TokenSelection:"TokenSelection",ThemeConfiguration:"ThemeConfiguration",SelectedTheme:"ThemeConfiguration",Palette:"Theme",PaletteClasses:"Palette styling",ThemeStorage:"ThemeStorage / ModeStorage",ModeStorage:"ThemeStorage / ModeStorage",ColorStore:"ColorStore",ColorSnapshot:"ColorSnapshot",ColorInfo:"ColorInfo",ColorMarker:"ColorMarker",ColorPartClasses:"ColorPartClasses"},fa=(t,e)=>t.split(/(\b[A-Z][A-Za-z]+\b)/).map(o=>{const r=e.find(a=>a.name===ga[o]);return r?`<a href="#${Ze(r)}">${q(o)}</a>`:q(o)}).join("");function va(t){const e=no(t);return`<div class="api-reference" data-api-reference>
    <div class="api-reference-intro"><p>Look up a component, property or method. Each entry shows its accepted values, default behavior and an example.</p><label class="api-search">Find an API entry<input type="search" placeholder="Try disabled, roles or setColor" data-api-search autocomplete="off" aria-controls="api-entries"></label></div>
    <p class="api-conventions">Component properties and usage examples use React names. Svelte uses <code>class</code> and snippets, Vue uses <code>class</code> and slots, and Angular uses inputs and templates. See Working examples for complete implementations in all six adapters. Core methods use the same TypeScript API in every adapter.</p>
    <p class="api-search-status" data-api-status role="status" hidden></p>
    <div id="api-entries">${e.map(o=>{var r;return`<article class="api-entry" id="${Ze(o)}" data-api-entry="${o.id}">
      <header class="api-entry-heading"><div><p class="api-kind">${q(o.kind)}</p><h3>${q(o.name)}</h3></div><a href="#${Ze(o)}" aria-label="Link to ${q(o.name)}">#</a></header>
      <p class="api-purpose">${q(o.description)}</p>${(r=o.exports)!=null&&r.length?`<p class="api-note">Related exports: ${o.exports.map(a=>`<code>${q(a)}</code> <small>(${sa(a).join(", ")})</small>`).join(", ")}. Astro components use individual <code>/astro/Name.astro</code> paths. Other exports use the adapter entry.</p>`:""}${o.note?`<p class="api-note">${q(o.note)}</p>`:""}
      <table class="api-properties"><caption>${q(o.name)} ${o.kind==="Methods"?"methods":o.kind==="Return value"?"returned fields":"properties and parameters"}</caption><thead><tr><th scope="col">Key</th><th scope="col">Type / accepted values</th><th scope="col">Default</th><th scope="col">Behavior & example</th></tr></thead><tbody>${o.fields.map(a=>`<tr data-api-property><th scope="row" data-label="Key"><code>${q(a.key)}</code><span class="api-requirement">${ba(o,a.key,a.required,a.readOnly)}</span></th><td data-label="Type / accepted values"><code class="api-type">${fa(a.type,e)}</code></td><td data-label="Default"><code>${q(a.default)}</code></td><td data-label="Behavior & example"><p>${q(a.description)}</p><code class="api-inline-example">${q(a.example)}</code></td></tr>`).join("")}</tbody></table>
      <details class="api-usage"><summary>Usage example <span>${o.example.file.endsWith("tsx")?"React":"TypeScript"}</span></summary><div data-api-code="${o.id}"></div></details>
    </article>`}).join("")}</div></div>`}function ya(t,e){const o=no(e);for(const l of o)X(t.querySelector(`[data-api-code="${l.id}"]`),()=>l.example.code,{file:l.example.file,label:`${l.name} usage`});const r=t.querySelector("[data-api-search]"),a=t.querySelector("[data-api-status]"),s=()=>{var b;const l=r.value.trim().toLowerCase();let m=0;for(const d of o){const u=t.querySelector(`[data-api-entry="${d.id}"]`),p=`${d.name} ${d.description} ${((b=d.exports)==null?void 0:b.join(" "))??""}`.toLowerCase().includes(l);let c=0;u.querySelectorAll("[data-api-property]").forEach(h=>{h.hidden=!!l&&!p&&!h.textContent.toLowerCase().includes(l),h.hidden||c++}),u.hidden=c===0,u.hidden||m++}a.hidden=!l,a.textContent=m?`${m} matching ${m===1?"entry":"entries"}`:"No matching entries. Try a component name, property or accepted value."};r.addEventListener("input",s);const i=l=>{l.target.closest('a[href^="#api-"]')&&r.value&&(r.value="",s())};return t.addEventListener("click",i),()=>{r.removeEventListener("input",s),t.removeEventListener("click",i)}}const Ue=document.querySelector("#app"),oe=document.body.dataset.page??"docs",ka="/__SALYRA_SITE_BASE__/versions/1.0.0/",F=t=>`${ka}${t}`,io=`<a class="brand" href="${F("site.html")}" aria-label="Salyra UI home">salyra<span>/</span>ui<span class="brand-dot" aria-hidden="true"></span></a>`,We=`<a class="skip-link" href="#main">Skip to content</a><header class="site-nav">${io}<nav aria-label="Main navigation"><a ${oe==="color"?'aria-current="page"':""} href="${F("color.html")}">Color picker</a><a ${oe==="generator"?'aria-current="page"':""} href="${F("generator.html")}">Theme studio</a><a ${oe==="docs"?'aria-current="page"':""} href="${F("docs.html")}">Documentation</a><a href="https://github.com/salyra-ui/theme-studio">GitHub</a></nav></header>`,Ge=`<footer>${io}<span>Color picker & theme studio</span><div><a href="https://github.com/salyra-ui/color-picker">Color picker source</a><a href="https://github.com/salyra-ui/theme-studio">Theme studio source</a></div></footer>`,z=[];window.addEventListener("pagehide",t=>{t.persisted||z.forEach(e=>e())});if(oe==="landing"){Ue.innerHTML=`${We}<main id="main"><section class="landing-hero"><div class="hero-copy"><p class="product-label">Salyra UI 1.0.0</p><h1>Color.<br>With controls.</h1><p class="lead">Components in harmony with your stack. Use a ready-made editor or build your own with context roots, native inputs and custom markers.</p><div class="actions"><a class="button solid" href="${F("color.html")}">Explore color picker</a><a class="button" href="${F("generator.html")}">Explore theme studio</a></div></div><div class="hero-component"><div class="preview-label">Color picker <span>Interactive</span></div><div id="hero-picker"></div><div class="hero-color-result"><span id="hero-swatch"></span><div><strong id="hero-name"></strong><code id="hero-value"></code></div></div></div></section><div class="framework-strip"><span>Framework adapters</span>${Xt.map(a=>`<span>${a}</span>`).join("")}</div><section class="product-section"><div class="section-number">01</div><div><h2>Pick a color.</h2><p>Choose a rectangle or a wheel, enter channel values and adjust opacity. Every change gives you the color name and values in all six formats.</p><a class="text-link" href="${F("color.html")}">View color picker examples</a></div><div class="format-index"><span>HEX</span><span>RGB</span><span>HSL</span><span>HSV</span><span>OKLCH</span><span>OKLab</span></div></section><section class="product-section"><div class="section-number">02</div><div><h2>Build a theme.</h2><p>Start with primary, then add secondary and accent if you need them. Choose the radius, borders and backgrounds your editor will control.</p><a class="text-link" href="${F("generator.html")}">View theme studio examples</a></div><div class="role-index"><span>Primary</span><span>Secondary</span><span>Accent</span></div></section><section class="landing-examples"><div class="section-heading"><h2>See the component.<br>Use the code.</h2><p>Try an example, choose your framework and copy its code.</p></div><div id="landing-explorer"></div></section><section id="composition" class="landing-examples"><div class="section-heading"><h2>Your markup.<br>Shared color state.</h2><p>Root connects the controls. You choose the labels, layout, marker and classes. This editor uses the v1 primitives without the default picker stylesheet.</p></div><div id="composition-example"></div><p><a class="text-link" href="${F("docs.html?kit=color-picker#composition")}">See the composition API</a></p></section><section class="feature-grid"><article><h3>Forms, history &amp; saved colors</h3><p>Submit colors with opacity, undo changes and keep recent or favorite colors. Use the same color store across your controls.</p><a class="text-link" href="${F("color.html#workflows")}">Try the color workflows</a></article><article><h3>Edit, then apply</h3><p>Keep a separate draft, undo edits and lock colors during generation. Apply commits your changes. Cancel restores the current theme.</p><a class="text-link" href="${F("generator.html#workflows")}">Try the theme workflows</a></article><article><h3>Predictable rendering</h3><p>Pass a theme to render it immediately. If you load it from an API, choose what appears while loading and which theme to use if the request fails.</p><a class="text-link" href="${F("generator.html#rendering")}">Try the rendering examples</a></article></section></main>${Ge}`;const t=document.querySelector("#hero-picker");t.innerHTML=nt("rectangle");const e=fe("#5268E0"),o=t.querySelector("cp-provider");o.setStore(e),o.querySelector('cp-slider[channel="alpha"]').remove(),o.querySelector("cp-alpha-input").remove(),o.querySelector("cp-mode").remove();const r=()=>{const a=e.getColor();document.querySelector("#hero-swatch").style.background=a.hex,document.querySelector("#hero-name").textContent=a.name,document.querySelector("#hero-value").textContent=a.hex};o.addEventListener("color-change",r),r(),z.push(Re(document.querySelector("#landing-explorer"),"color-picker","wheel")),z.push(qe(document.querySelector("#composition-example"),"color-picker"))}else if(oe==="color"||oe==="generator"){const t=oe==="color",e=t?"color-picker":"theme-studio";Ue.innerHTML=`${We}<main id="main" class="catalog-page"><header class="page-heading"><div><p class="product-label">${t?"Standalone color components":"Theme components & generator"}</p><h1>${t?"color<span>/</span>picker":"theme<span>/</span>studio"}</h1></div><div class="page-intro"><p>${t?"Use the rectangle, wheel or channel inputs to choose a color. Each example includes opacity controls and returns the color name and values in six formats.":"Build an editor for the colors and dimensions your application uses. Try primary on its own, edit three colors together or choose individual radius and border fields."}</p><a class="text-link" href="${F("docs.html?kit="+e)}">${t?"Color picker":"Theme studio"} API & installation</a></div></header><section class="examples-section" aria-labelledby="examples-title"><div class="section-heading"><h2 id="examples-title">Component examples</h2><p>Try each layout in the preview. Open Code to choose a framework and copy the component and its styles.</p></div><div id="kit-explorer"></div></section><section id="workflows" class="examples-section"><div class="section-heading"><h2>Workflow examples</h2><p>Try each helper on its own. Open Code to copy or download the complete Vanilla example. ${t?"Forms &amp; saved colors":"Draft &amp; Apply"} in Working examples includes native components for all six integrations.</p></div><div id="workflow-gallery"></div></section>${t?'<section class="reference-band"><article><h3>One color, six formats</h3><p>Each numeric channel has its own input. Switch formats to read the same color as HEX, RGB, HSL, HSV, OKLCH or OKLab.</p></article><article><h3>Names & alpha</h3><p>Read the nearest name from the bundled color list and check whether it is an exact match. Set opacity with a slider, a numeric input or the store.</p></article><article><h3>Compose your controls</h3><p>Add only the controls your layout needs. In Custom controls, change the dot text, colors and sizes, then copy the component and updated CSS.</p></article></section>':'<section id="rendering" class="examples-section"><div class="section-heading"><h2>Loading & fallback</h2><p>See what appears when a theme is supplied directly, loads successfully, fails to load or times out.</p></div><div id="rendering-lab"></div></section><section class="reference-band"><article><h3>Custom theme names</h3><p>The primary color provides a suggested name. Enter your own name and it stays the same as you edit the theme.</p></article><article><h3>Only the tokens you need</h3><p>JSON and CSS include the selected colors and fields. Primary only exports primary. Radius & borders lets you choose individual fields and one or both appearance modes.</p></article><article><h3>System, light & dark</h3><p>Choose system, light or dark and keep that preference after a refresh. Use the mode hook if you want to build your own buttons or dropdown.</p></article></section>'}<section id="composition" class="examples-section"><div class="section-heading"><h2>Build your own editor</h2><p>${t?"ColorPicker.Root shares the color state. Add only the surfaces, sliders and fields you need, with your own labels and classes.":"ThemeProvider supplies context and a CSS scope in one component. Use Root and Scope separately when the editor and preview need different boundaries. PickerRoot connects your color controls to a theme role."}</p></div><div id="composition-example"></div><p><a class="text-link" href="${F("docs.html?kit="+e+"#composition")}">Composition guide and API</a></p></section><section class="install-section"><div><h2>Install ${t?"color picker":"theme studio"}</h2><p>Install the package, then choose the import for your framework. ${t?"It includes the color core and stylesheet. It does not depend on theme studio.":"It includes the theme core, framework components and styles, with color picker as its dependency."}</p></div><div id="installation"></div></section></main>${Ge}`,z.push(Re(document.querySelector("#kit-explorer"),e)),t||z.push(yt(document.querySelector("#rendering-lab"))),z.push(Tt(document.querySelector("#workflow-gallery"),e)),z.push(qe(document.querySelector("#composition-example"),e)),xt(document.querySelector("#installation"),e)}else{const t=["theme-studio","theme-kit"].includes(new URLSearchParams(location.search).get("kit")??"")?"theme-studio":"color-picker",e=t==="color-picker";Ue.innerHTML=`${We}<div class="docs-layout"><aside class="docs-sidebar"><div class="docs-kit-tabs"><a ${e?'aria-current="page"':""} href="${F("docs.html?kit=color-picker")}">Color picker</a><a ${e?"":'aria-current="page"'} href="${F("docs.html?kit=theme-studio")}">Theme studio</a></div><nav aria-label="Documentation sections"><a href="#overview">Overview</a><a href="#installation">Installation</a><a href="#examples">Examples</a><a href="#workflows">Workflow examples</a><a href="#composition">Composition</a><a href="#output">Output</a><a href="#workflow">${e?"Forms & history":"Draft & history"}</a><a href="#customization">Customization</a>${e?"":'<a href="#rendering">Rendering & fallback</a><a href="#persistence">Persistence & freshness</a>'}<a href="#reference">API reference</a></nav></aside><main id="main" class="docs-content"><section id="overview"><p class="api-note">Version 1.0.0. Context roots, native controls and application-owned markup.</p><p class="product-label">${e?"Color picker":"Theme studio"} documentation</p><h1>${e?"Color picker":"Theme studio"}</h1><p class="lead">${e?"Build a color editor with a rectangle or wheel, sliders and separate channel inputs. The store gives you the selected color in every supported format.":"Set up a shared theme context, then add the editors and controls your application needs. You can supply a theme, choose a preset or load one from an API."}</p><div class="docs-callout">${e?"ColorPicker.Root shares one selected color across its surfaces, sliders and inputs. Arrange those parts in your own layout.":"Theme studio uses color picker for its color controls. Primary, secondary and accent belong to the theme context."}</div></section><section id="installation"><h2>Installation</h2><p>Install the package once. Choose your framework below for the import and stylesheet setup.</p><div id="docs-installation"></div><p>The ready-made components use <code>styles.min.css</code>. Load it once in your application entry or root layout. A custom composition can use only your own CSS. For Angular, add the <code>@import</code> to your <code>styles.css</code> file. The <code>styles.css</code> package export loads the same minified CSS.</p><p>Frameworks are optional peer dependencies. Install the framework your application uses. Importing its entry does not load the other implementations. ${e?"The core can also be used without a UI adapter.":"Theme studio depends on color picker. Its stylesheet includes the color picker styles."}</p><div class="asset-downloads"><table aria-label="Vanilla downloads"><thead><tr><th scope="col">File</th><th scope="col">Standard</th><th scope="col">Minified</th></tr></thead><tbody>${["js","css"].map(r=>`<tr><th scope="row">${r==="js"?"JavaScript":"Stylesheet"}</th><td><a href="${F("downloads/"+t+"."+r)}" download><code>${t}.${r}</code></a></td><td><a href="${F("downloads/"+t+".min."+r)}" download><code>${t}.min.${r}</code></a></td></tr>`).join("")}</tbody></table></div><p class="muted">The Vanilla build runs without a framework. Copy the downloads to your public assets directory. The examples use minified files under /assets/. Use .js and .css filenames for the Standard versions. With a bundler, import the Vanilla module instead of loading the downloaded script. Choose Standard for readable files or Minified for smaller production assets. Both versions have the same API. ${e?"":"Theme studio CSS includes the color picker styles."}</p></section><section id="examples"><h2>Working examples</h2><p>Choose a layout and try its controls. Open Code for the implementation in your framework. For labels, classes and styling, see <a href="#customization">Customization</a>.</p><div id="docs-explorer"></div></section><section id="workflows" class="examples-section"><div class="section-heading"><h2>Workflow examples</h2><p>Try each helper on its own. Open Code to copy or download the complete Vanilla example. ${e?"Forms &amp; saved colors":"Draft &amp; Apply"} in Working examples includes native components for all six integrations.</p></div><div id="workflow-gallery"></div></section><section id="composition"><h2>Composition</h2>${e?'<p>Use ColorPicker.Root for a custom editor with your own markup. Use ColorProvider with the styled components for a ready-made layout. Both share one color store with their descendants. A second Root or Provider with its own store creates an independent picker.</p><div class="docs-diagram"><strong>Custom layout: ColorPicker.Root</strong><div><span>Area / Wheel + Thumb</span><span>Slider</span><span>Input / ChannelInput</span><span>FormatTrigger</span></div></div><p>Use createColorStore() for programmatic updates and subscriptions. React, Svelte, Vue and Angular also expose useColorStore() and useColor() inside a child of ColorProvider. Vanilla and Astro use the native element’s store and bubbling DOM events.</p>':'<p>Choose one entry point. ThemeProvider includes context, a CSS scope and a disabled controls boundary. ThemeStudio.Root provides context without a layout. Put ThemeStudio.Scope below it wherever the theme variables should apply.</p><div class="docs-diagram"><strong>Ready layout</strong><div><span>ThemeProvider → controls and application</span></div></div><div class="docs-diagram"><strong>Your own layout</strong><div><span>ThemeStudio.Root → ThemeStudio.Scope → controls and application</span></div></div><p>You do not need to put Root and Scope inside a Provider for the same theme. Multiple scopes under one Root share its store. A nested Root with a different store creates independent state. Scope alone only changes where CSS variables apply. Portalled content needs its own scope or copied variables.</p>'}<h3>Build the layout yourself</h3><p>The v1 primitives provide behavior and state. Your markup owns labels, spacing, thumb content and controls. ${e?"This example uses a square marker, custom format text and separate native inputs.":"This example uses square markers, custom role buttons and separate native inputs."} Open Code to choose a framework and download the component and its styles.</p><div id="composition-example"></div><p>React, Svelte and Vue expose ColorPicker.Root and ThemeStudio.Root as context-only components. ThemeStudio.Scope applies the CSS variables to your chosen container. Angular provides directives on native elements. Vanilla binds your existing DOM. Astro renders native controls with explicit server seeds and connects them in the browser.</p><div id="composition-code"></div>${e?"":'<h3>Preview a draft inside your application</h3><p>The outer Provider uses the applied store. The nested Root uses editor.store, so edits appear only in the inner Scope. Save calls editor.apply() to update the applied store. Cancel calls editor.cancel() to restore the latest applied theme.</p><div id="draft-scope-code"></div><p>These examples keep appearance storage off so the draft cannot overwrite an app preference. For persistence, configure storage on the applied store and its Provider only. Save here commits local state, it does not send a backend request. If your API must confirm the change first, save editor.store.getSnapshot().theme to your backend before calling apply(). A conflicting external update makes apply() throw. Only use apply({force:true}) when overwriting that update is intentional.</p><p>Keep stores per component instance or server request. Never share a user theme through a server module variable. Every editor is destroyed when its owner is removed. The React example creates its editor in an effect and shows a short loading message before the draft controls mount.</p><p>For undo, generation locks, saved themes and full runnable projects, open <a href="#examples">Working examples</a> and choose Draft &amp; Apply.</p>'}</section><section id="output"><h2>${e?"Names, formats & values":"Theme configuration & tokens"}</h2><p>${e?"Call getColor() to read the name, match status, channels and formatted strings. Use getValue(format) for numeric values in a specific format, or color.formats for a string ready to display. RGB uses 0–255. HSL and HSV use degrees and percentages. OKLCH and OKLab lightness uses 0–1 in the store and 0–100% in the inputs. HSV describes the picker color and is not a CSS color function.":"Pass a selection to themeConfiguration() or ThemeExport to get only the colors and dimensions your editor handles. Mounted editor components register their color and geometry fields automatically. An explicit selection takes priority and also seeds the server export. The same selection applies to theme, JSON and CSS. Backgrounds include only the active appearance unless you explicitly select both modes. Use mergeThemeConfiguration() to apply a partial export to an existing theme."}</p><div id="output-code"></div></section><section id="workflow"><h2>${e?"Forms, history & saved colors":"Draft editing & history"}</h2>${e?"<p>Use bindColorForm to submit the selected color with a normal form. It handles reset, validation and disabled fields. Mount the binding on the client and destroy it on unmount.</p><p>createColorHistory tracks color and alpha changes. mountHistory groups each drag into one undo step. Format and view changes stay outside the color history. Recent and favorite lists are optional, with your own labels and classes.</p>":'<p>createThemeEditor creates a separate store for the draft. Put it around the editing controls and keep the applied store around your application. Apply commits the theme and appearance preference. Cancel reloads the latest applied theme.</p><p>Undo and redo operate on the draft. Lock a color to preserve it when generating a harmony. A locked color can still be edited manually. Live mode applies every change immediately.</p><p>If the applied theme changes while a draft has edits, the editor reports a conflict. Cancel loads the new theme. apply({ force: true }) explicitly replaces it with the draft.</p><p>ThemeExport accepts format="tailwind". The stylesheet maps selected tokens to Tailwind 4 utilities. Radius and border width are exported only when configured. Saved themes and configuration JSON use schemaVersion: 1. parseTheme also accepts older unversioned themes.</p>'}<p>Choose ${e?"Forms & saved colors":"Draft & Apply"} in Working examples. Open Code for a complete project, then use Download files to get the component, controller, styles and project configuration.</p></section><section id="customization"><h2>Customization</h2><p>${e?"Start with the composition example above when you need full control. Put your classes and content directly on each primitive. Root adds no layout. The complete presets also offer classes, labels and render hooks for smaller adjustments.":"Use ThemeStudio.PickerRoot to share the active color across only the controls you mount. Place your own labels around GeometryInput and use RoleTrigger for custom text or icons. ThemeMode accepts custom content, and useThemeMode() lets you build buttons or a dropdown. Call context hooks in a child of ThemeProvider so they can access its store."}</p><h3>${e?"Labels, classes and controls":"Labels, classes and swatches"}</h3><p>Edit the labels and dimensions, then copy the updated component and CSS.</p><div id="custom-explorer"></div><h3>${e?"Styling variables":"Custom appearance buttons"}</h3><div id="custom-code"></div>${e?'<table><thead><tr><th>CSS variable / selector</th><th>Controls</th></tr></thead><tbody><tr><td>--cp-thumb-size / --cp-thumb-radius</td><td>Single color dot size and shape</td></tr><tr><td>--cp-track-height / --cp-track-radius</td><td>Hue and alpha track geometry</td></tr><tr><td>--cp-hue-gradient</td><td>Hue bar background</td></tr><tr><td>[data-cp-part="surface"]</td><td>Picking surface</td></tr><tr><td>[data-cp-part="thumb-text"]</td><td>Thumb content</td></tr></tbody></table>':""}</section>${e?"":'<section id="rendering"><h2>Rendering & fallback</h2><p>A supplied theme renders immediately. If no theme is available, ThemeLoading shows your content while loadTheme() runs. A rejected request, invalid response or timeout applies fallbackTheme. ThemeReady displays the loaded or fallback theme, and ThemeError lets you show a retry action. During revalidation, the current theme stays visible.</p><div id="docs-rendering"></div><h3>Server rendering</h3><p>For server rendering, create a store for each request and supply the theme and resolved mode. Use those same values when hydrating the client. Supply selection on the provider and ThemeExport when the server must return a partial configuration. React, Svelte, Vue, Angular and Astro support this setup. Vanilla elements mount in the browser, while their core can generate CSS on the server. Browser storage and the system preference are read after mount.</p><div id="ssr-code"></div></section><section id="persistence"><h2>Persistence & freshness</h2><p>Use browserStorage() to save the full context and browserModeStorage() to save the appearance preference. A supplied theme takes priority over the browser cache. To restore a cached theme on startup, pass storage and a fallbackTheme.</p><p>A cached theme can appear while the loader checks for an update. The HTTP loader supports ETag and 304 responses. Storage events update other tabs on the same origin. Use focus revalidation, polling or watchThemeUpdates() when changes can come from another application.</p><div id="cache-code"></div><h3>HTTP response</h3><p>Return a full Theme object from the endpoint. Send an ETag that changes whenever the theme changes. Return 304 when If-None-Match matches that revision, or return the updated theme otherwise. For partial editor exports, merge them into the stored theme before returning it to the loader.</p><p>Redis is optional server infrastructure. The browser still needs an HTTP revision/ETag or a notification through SSE/WebSocket to know that a theme changed.</p></section>'}<section id="reference"><h2>API reference</h2>${va(t)}</section></main></div>${Ge}`,z.push(qe(document.querySelector("#composition-example"),t)),z.push(Tt(document.querySelector("#workflow-gallery"),t)),z.push(ya(document.querySelector("#reference"),t)),xt(document.querySelector("#docs-installation"),t),z.push(Re(document.querySelector("#docs-explorer"),t,void 0,"examples")),z.push(Re(document.querySelector("#custom-explorer"),t,"custom","customization")),e||X(document.querySelector("#draft-scope-code"),Uo,{label:"Nested draft preview",baseName:"DraftPreview"});const o=r=>`@salyra-ui/${t}`;X(document.querySelector("#composition-code"),r=>e?`import { createColorStore } from '${o()}';

const store = createColorStore('#5268E080', 'rgb');
store.setHex('#277D59');
store.setHSV({ h: 140 });
store.setAlpha(0.5);
const unsubscribe = store.subscribe(() => console.log(store.getColor()));
// unsubscribe() when the consumer is removed.`:`import { createThemeStore, generateTheme } from '${o()}';

const store = createThemeStore({
  theme: generateTheme('#5268E0'),
  mode: 'system', systemMode: 'light',
});
store.setColor('primary', '#277D59');
store.setName('Project theme');
store.setBorder('radius', 'card', 0.75);
store.setMode('dark');`,{label:"Store updates",file:"store.ts"}),X(document.querySelector("#output-code"),r=>e?`import { createColorStore } from '${o()}';
const store = createColorStore('#5268E080');
const color = store.getColor();

color.name;        // nearest name from the bundled list
color.exact;       // true only for an exact named match
color.hex;         // #RRGGBB or #RRGGBBAA
color.rgb;         // { r, g, b, alpha }
color.hsl;         // { h, s, l, alpha }
color.hsv;         // { h, s, v, alpha }
color.oklch;       // { l, c, h, alpha }
color.oklab;       // { l, a, b, alpha }
color.formats;     // strings for all supported formats
store.getValue('hsl');`:`import { createThemeStore, generateTheme, themeConfiguration,
  mergeThemeConfiguration } from '${o()}';

const store = createThemeStore({ theme: generateTheme('#5268E0'), mode: 'light' });
const config = themeConfiguration(store.getSnapshot(), {
  roles: ['primary'], radius: ['card'], width: ['button'],
});
config.theme;         // primary palette and the two selected fields
config.mode;          // resolved light/dark
config.modePreference;// saved system/light/dark preference
config.css;           // selected tokens as CSS declarations
config.tailwind;      // selected Tailwind 4 utilities
config.schemaVersion;// saved configuration format version
config.json;          // the same selected fields as JSON

const updated = mergeThemeConfiguration(store.getSnapshot().theme, config.json);
store.setTheme(updated);`,{label:"Read values",file:"output.ts"}),X(document.querySelector("#custom-code"),r=>e?`.custom-picker {
  --cp-thumb-size: 22px;
  --cp-thumb-radius: 0;
  --cp-thumb-border: 2px solid white;
  --cp-track-height: 12px;
  --cp-track-radius: 0;
}
.custom-picker [data-cp-part="thumb-text"] { font-size: 10px; }`:Mr(r),e?{label:"Styles",file:"styles.css"}:{label:"Appearance controls",baseName:"AppearanceControls"}),e||(z.push(yt(document.querySelector("#docs-rendering"))),X(document.querySelector("#ssr-code"),()=>`import { createThemeStore, generateTheme, themeConfiguration } from '@salyra-ui/theme-studio';

// Call once per request with the user's theme and saved mode.
export function createThemeSeed() {
  const store = createThemeStore({
    theme: generateTheme('#5268E0'), mode: 'dark', systemMode: 'dark',
    modeStorage: false,
  });
  const { theme, modePreference: mode, systemMode } = store.getServerSnapshot();
  return { options: { theme, mode, systemMode },
    css: themeConfiguration(store.getServerSnapshot()).css };
}

// Pass seed.options to the server and client provider.
// Use seed.css as inline declarations for a server-rendered scope.`,{label:"Server seed",file:"theme-seed.ts"}),X(document.querySelector("#cache-code"),r=>`import { createThemeStore, browserStorage, browserModeStorage,
  generateTheme, createHttpThemeLoader } from '${o()}';

const options = {
  fallbackTheme: generateTheme('#5268E0'),
  storage: browserStorage('app:theme'),
  modeStorage: browserModeStorage('app:mode'),
  loadTheme: createHttpThemeLoader('/api/theme'),
  revalidateOnFocus: true,
  revalidateIntervalMs: 60000,
};
const store = createThemeStore(options);
// Pass options/store to the framework provider.
// Native DOM consumers call mountThemeStore(store, options.storage, options).`,{label:"Cache configuration",file:"theme-options.ts"}))}function xt(t,e){X(t,()=>"",{label:"Installation",files:o=>[{name:"Terminal",code:`npm install @salyra-ui/${e}@1.0.0`},{name:"Imports",code:o==="Astro"?`import ${e==="color-picker"?"ColorProvider":"ThemeProvider"} from '${re(e,o)}/${e==="color-picker"?"ColorProvider":"ThemeProvider"}.astro';`:`import { ${o==="Vanilla"?e==="color-picker"?"mountColorPicker":"mountThemeKit":e==="color-picker"?"ColorProvider, createColorStore":"ThemeProvider, generateTheme"} } from '${re(e,o)}';`},{name:o==="Angular"?"styles.css":"Global styles",code:o==="Angular"?`@import '@salyra-ui/${e}/styles.min.css';`:o==="Vanilla"?`import '@salyra-ui/${e}/styles.min.css';

// Readable CSS alternative (use one stylesheet):
// import '@salyra-ui/${e}/styles.standard.css';`:`import '@salyra-ui/${e}/styles.min.css';`},...o==="Vanilla"?[{name:"Downloaded assets",code:`<link rel="stylesheet" href="/assets/${e}.css">
<script src="/assets/${e}.js"><\/script>`},{name:"Downloaded assets (minified)",code:`<link rel="stylesheet" href="/assets/${e}.min.css">
<script src="/assets/${e}.min.js"><\/script>`}]:[]]})}location.hash&&requestAnimationFrame(()=>{var t;(t=document.getElementById(location.hash.slice(1)))==null||t.scrollIntoView()});if(oe==="color"||oe==="generator"){const t=oe==="color"?"color-picker":"theme-studio",e=document.createElement("section");e.id="composition",e.className="examples-section",e.innerHTML='<div class="section-heading"><h2>Build your own layout</h2><p>Choose the parts you need. Labels, marker content and spacing belong to your application. Open Code for all six integrations.</p></div><div data-composition-example></div>',document.querySelector("main").append(e),z.push(qe(e.querySelector("[data-composition-example]"),t))}requestAnimationFrame(()=>{var e;const t=window.location.hash.slice(1);t&&((e=document.getElementById(t))==null||e.scrollIntoView())});
