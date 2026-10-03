import { Component, DestroyRef, inject } from '@angular/core';
import { ColorField } from '@salyra-ui/color-picker/angular';
import { ThemeProvider, ThemeRoot, ThemeVariableScope, ThemePickerRoot, createThemeStore, createThemeEditor, generateTheme } from '@salyra-ui/theme-studio/angular';
@Component({
  selector:'app-root', standalone:true,
  imports:[ThemeProvider,ThemeRoot,ThemeVariableScope,ThemePickerRoot,ColorField],
  template:`<tk-provider [store]="applied" [options]="options">
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
  </tk-provider>`,
})
export class AppComponent {
  readonly options = {modeStorage:false as const};
  readonly pickerOptions = {roles:['primary'] as const};
  readonly applied = createThemeStore({theme:generateTheme('#5268E0'),...this.options});
  readonly editor = createThemeEditor(this.applied);
  error = '';
  constructor() {inject(DestroyRef).onDestroy(() => this.editor.destroy());}
  save() {try {this.editor.apply();this.error='';} catch(e) {this.error=String(e);}}
}
