# D&D 5E Character Sheet App

## Development Commands

```bash
npm run dev       # Vite dev server with HMR
npm run build     # TypeScript check + Vite production build
npm run lint      # ESLint
npm run preview   # Preview production build locally
```

## Architecture

- **React 19** + **TypeScript 5.9** + **Vite 7** — SPA, no SSR
- **Zustand 5** — state management (single store at `src/store/characterStore.ts`)
- **Tailwind CSS 3** — utility-first styling with custom parchment theme
- **lucide-react** — icons
- **localStorage** — persistence (keys: `dnd5e_characters`, `dnd5e_active_character`)

## Project Structure

```
src/
├── types/character.ts          # Character interface (56+ fields) + createDefaultCharacter()
├── store/characterStore.ts     # Zustand store: characters[], activeCharacterId, CRUD actions
├── utils/
│   ├── calculations.ts         # D&D mechanics + Spanish label maps
│   ├── storage.ts              # localStorage read/write
│   └── importExport.ts         # JSON file import/export
├── hooks/useAutoSave.ts        # 2s debounced auto-save hook
├── components/
│   ├── layout/                 # Navbar (sidebar+tabs), PageContainer, SaveIndicator
│   ├── pages/                  # 6 tab pages (see below)
│   ├── character/              # Domain components (AbilityScores, SkillsList, CombatBlock, etc.)
│   └── common/                 # Reusable: EditableField, StatBlock, ProficiencyToggle, etc.
```

## Key Patterns

### Tab Navigation
6 pages managed via `activeTab` state in App.tsx:
1. **Core Stats** — abilities, saving throws, skills, combat, attacks
2. **Personality** — traits, ideals, bonds, flaws, features
3. **Equipment** — currency (5 coin types), items, treasure
4. **Character Details** — physical traits, backstory, allies
5. **Spellcasting** — spell slots (levels 1–9), cantrips, spell mechanics
6. **Spell Notes** — spell descriptions, campaign notes

### Auto-Save
- Store updates are immediate (optimistic UI)
- localStorage write debounced at 2 seconds
- SaveIndicator shows saved/saving/unsaved status

### Spanish UI
All labels, placeholders, and buttons are in Spanish. Internal data keys remain in English.
Spanish label maps exported from `src/utils/calculations.ts` (`ABILITY_LABELS`, `SKILL_LABELS`, etc.).

### Character Data Model (`src/types/character.ts`)
- Ability scores (6), saving throws, 18 skills with proficiency toggles
- Combat: AC, initiative, speed, HP (current/max/temp), hit dice, death saves (3 success/fail)
- Attacks array, equipment array, currency object, spell levels 1–9
- Portrait stored as base64 (5MB limit)
- `createDefaultCharacter()` factory: level 1, all abilities 10, no proficiencies

### D&D Calculations (`src/utils/calculations.ts`)
- `getAbilityModifier(score)` — `Math.floor((score - 10) / 2)`
- `getProficiencyBonus(level)` — `Math.ceil(level / 4) + 1`
- `getSkillModifier(skill, char)` — ability mod + proficiency if proficient
- `getPassivePerception(char)` — 10 + perception modifier
- `getSpellSaveDC(char)` — 8 + proficiency + spellcasting ability mod
- Override fields (`initiativeOverride`, `spellSaveDCOverride`, etc.) take precedence when set

## Styling Conventions

Parchment/medieval theme using custom Tailwind palette in `tailwind.config.js`:
- **parchment-50..900** — warm paper-like background/border colors
- **dnd-red/darkred** — primary accent (#8b0000)
- **dnd-gold/darkgold** — secondary accent (#d4af37)
- **ink/ink-light/ink-muted** — dark brown text colors

CSS component classes in `src/index.css`: `.parchment-card`, `.parchment-input`, `.stat-box`, `.btn-primary`, `.btn-gold`, `.prof-circle`, `.section-header`

Fonts: Palatino Linotype/Georgia (serif) for headings, Segoe UI/system-ui (sans) for body.

Responsive: sidebar on desktop (md+), bottom tab bar on mobile.

## Git Workflow — Automatic Save to GitHub

**Every time you modify, create, or delete any file, you MUST immediately commit and push to GitHub.** This is not optional — treat every file change as a trigger to save progress to the remote repository.

### Process (run after EVERY file change):

1. **Run `npm run build`** to verify no TypeScript or build errors. Fix any issues first.
2. **Stage the changed files by name** (`git add path/to/file`). Avoid `git add .` or `git add -A`.
3. **Commit with a concise message** describing the change (e.g., "Add death save toggles to combat block").
4. **Push immediately** (`git push`).

### Rules:

- **No batching** — commit and push after each individual file modification, not at the end of a task.
- **If multiple files change together as part of one logical edit** (e.g., updating a type and its usage), they can share a single commit, but push right away.
- **If the build fails**, fix the issue first, then commit the fix and push.
- **If working on a feature branch**, use `git push -u origin branch-name` on the first push.
- **Never leave uncommitted or unpushed changes.** The GitHub repo must always reflect the latest state of the project.
