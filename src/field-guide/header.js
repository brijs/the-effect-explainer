'use strict';
/* ============================================================
   THE EFFECT: A FIELD GUIDE TO RESEARCH DESIGN
   One clock drives the drawings, sound, music and Vari's voice.
   The film stops at each "pause and think" until Continue.
   ============================================================ */
const NS = 'http://www.w3.org/2000/svg';
const W = 1600, H = 900;
const C = {
  desk: '#2B2633', paper: '#EEF5EC', grid: '#D2E3CF', ink: '#1E2A3A', X: '#2D5BFF', Y: '#D7263D', W: '#8E44AD', Wl: '#E7D3F1',
  Z: '#F2A900', hi: '#FFF176', ok: '#2E9E5B', grey: '#7D8796', card: '#FFFFFF', note: '#FFF9C4', vari: '#FF8C42', eye: '#9BFFE8', sky: '#BFD0FF'
};
const HEAD = "'Space Grotesk', 'Segoe UI', system-ui, sans-serif";
const HAND = "'Patrick Hand', 'Comic Neue', 'Comic Sans MS', cursive";
const REDUCED = !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
