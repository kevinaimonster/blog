// This switch can only affect the local Astro development server, never a build.
export const draftPreview =
  import.meta.env.DEV && import.meta.env.SHOW_DRAFTS === 'true';
