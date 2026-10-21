export type Status = 'live' | 'beta' | 'prototype';

export interface Project {
  slug: string;
  name: string;
  kind: 'game' | 'software';
  status: Status;
  statusLabel: string;
  platform: string;
  tagline: string;
  summary: string;
}

// Order here is the order on the front page and in the previous/next links.
export const projects: Project[] = [
  {
    slug: 'spotrep',
    name: 'Spotrep',
    kind: 'game',
    status: 'live',
    statusLabel: 'Play now',
    platform: 'Browser · phone',
    tagline: 'One photo. One clock. Name the vehicle.',
    summary:
      'A daily recognition game for military equipment. A new challenge every day, practice modes, a field guide and leaderboards across more than 300 vehicles, aircraft and weapons.',
  },
  {
    slug: 'dust-and-deputies',
    name: 'Dust & Deputies',
    kind: 'game',
    status: 'prototype',
    statusLabel: 'Prototype',
    platform: 'PC · single-player',
    tagline: 'Hold the town till sunrise.',
    summary:
      'Top-down western action with tower defense and extraction. Build sentries and barricades by day, hold them against bandits by night, and get out with the loot.',
  },
  {
    slug: 'pathfinder',
    name: 'Pathfinder',
    kind: 'software',
    status: 'live',
    statusLabel: 'v1.6',
    platform: 'Windows · English / Dansk',
    tagline: 'Your Downloads folder, sorted.',
    summary:
      "Turns the mess in Downloads into an inbox. Every file gets a suggested name and folder based on what's inside it, and you approve with one key.",
  },
];

export function neighbours(slug: string) {
  const i = projects.findIndex((p) => p.slug === slug);
  const n = projects.length;
  return { prev: projects[(i - 1 + n) % n], next: projects[(i + 1) % n] };
}
