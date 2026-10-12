/* ==========================================================================
   Perspecta — team-data.js
   Dynamic team/bio schema. Each entry maps one person to an optional
   headshot. If `photo` is omitted, or the file fails to load, the Team
   grid (see script.js -> renderTeam) automatically falls back to an
   initials avatar in brand colors — no missing-image icons.

   To add, remove, or edit a team member, just edit this array. No other
   file needs to change: the Team section on the About page (index.html,
   #team) renders this list dynamically.

   NOTE: names, roles, and bios below are placeholders tied to real,
   uploaded headshots pending confirmation of each person's preferred
   name, title, and bio text. Replace the placeholder fields before
   treating this page as final/public.
   ========================================================================== */

window.PERSPECTA_TEAM = [
  {
    id: 'dominguez',
    name: 'Aleco Dominguez',
    role: 'Founder — role & title pending confirmation',
    bio: 'Bio coming soon.',
    photo: 'assets/team/dominguez.jpg'
  },
  {
    id: 'jaiyeola',
    name: 'Jaiyeola — full name pending',
    role: 'Founding team — role pending confirmation',
    bio: 'Bio coming soon.',
    photo: 'assets/team/jaiyeola.jpg'
  },
  {
    id: 'metz',
    name: 'Metz — full name pending',
    role: 'Founding team — role pending confirmation',
    bio: 'Bio coming soon.',
    photo: 'assets/team/metz.jpg'
  },
  {
    id: 'mickelson',
    name: 'Mickelson — full name pending',
    role: 'Founding team — role pending confirmation',
    bio: 'Bio coming soon.',
    photo: 'assets/team/mickelson.jpg'
  }

  /* Example of a team member with no headshot yet — renders an
     initials-avatar fallback automatically. Just omit `photo`,
     or leave it pointing at a file that doesn't exist:

  {
    id: 'example',
    name: 'New Board Member',
    role: 'Board Member',
    bio: 'Short bio goes here.'
  }
  */
];
