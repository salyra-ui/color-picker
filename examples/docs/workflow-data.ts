export const workflows = {
  'color-picker': [
    {
      id: 'history',
      title: 'Undo & redo',
      description:
        'Drag the picker or enter a color. Each drag is one history step. Undo restores color and alpha together.',
    },
    {
      id: 'collections',
      title: 'Recent & favorite colors',
      description:
        'Save a color to recent colors or add it to favorites. Click a swatch to select it. Each list is limited to eight colors and saved in this browser.',
    },
    {
      id: 'contrast',
      title: 'Text contrast',
      description:
        'Set a text color, opacity and background. Inspect the contrast ratio, AA and AAA results. Apply the suggested black or white only when you choose to.',
    },
  ],
  'theme-studio': [
    {
      id: 'history',
      title: 'Theme history',
      description:
        'Undo color, theme name, radius and border changes. A drag or field edit is recorded as one step.',
    },
    {
      id: 'locks',
      title: 'Generation locks',
      description:
        'Lock any color or the background, then generate from a new primary. Locked fields stay unchanged. You can still edit them manually.',
    },
    {
      id: 'collections',
      title: 'Recent & favorite themes',
      description:
        'Save the current theme, edit it and save again. A theme with the same ID replaces its earlier revision in the list.',
    },
    {
      id: 'contrast',
      title: 'Palette contrast',
      description:
        'Inspect the foreground and default color of each palette. The checker reports contrast without changing your theme.',
    },
    {
      id: 'tailwind',
      title: 'Selected Tailwind tokens',
      description:
        'Choose colors, radius, border width and appearance. The stylesheet contains utilities only for the fields you select.',
    },
    {
      id: 'conflict',
      title: 'External changes',
      description:
        'Edit a draft, then simulate a theme change from another application. Cancel loads the newer theme. Replace explicitly applies your draft over it.',
    },
    {
      id: 'schema',
      title: 'Saved theme versions',
      description:
        'Load an older unversioned theme or a version 0 theme. Both migrate to version 1. An unsupported future version is rejected.',
    },
  ],
} as const;
export type WorkflowKit = keyof typeof workflows;
