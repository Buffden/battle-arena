# Game Development Planning Guide

**Simple guide for planning web game development using vertical slices and game studio milestones.**

---

## How Game Development Works

Game development is different from regular web apps. Instead of building all services first, we build **playable slices** that let players actually play the game. This way, we know the game is fun before building everything else.

We use **vertical slices** - which means building one complete player experience from start to finish, touching all the services needed. Then we add more features on top.

**Note:** The foundation of our application (Phase 1: Foundation & Infrastructure Setup) is already complete. This includes project structure, Docker setup, CI/CD pipelines, and development tooling. We can now focus on building vertical slices on top of this foundation.

---

## Development Milestones

Game studios use these milestones to track progress. Each milestone means the game is playable at that level.

### Vertical Slice

**What it means:** The first playable version. A player can do ONE complete thing end-to-end.

**Example:** Player can register → login → click Play → get matched → play one match → see result.

**Why it matters:** This proves the game works. If this doesn't work, nothing else will. It's your safety net.

**What to build:**

- Minimal everything, but it works
- Bot opponent (no real players yet)
- Simple physics (no fancy effects)
- Default hero/weapon (no selection yet)

**When you're done:** You can play a complete match, even if it's basic.

---

### Alpha

**What it means:** The game is playable with core features. Players can do the main thing the game is about and see their progression.

**Example:** Player can register → login → play match (with bot) → see match result → view profile → view leaderboard.

**Why it matters:** This is when you test if the game is actually fun. Players can play matches and track their progress.

**What to build:**

- Complete match flow (with bot opponents)
- Profile system (stats, progression)
- Leaderboard system
- Match results update profile and leaderboard

**When you're done:** Players can play matches and see their progression tracked.

---

### Beta

**What it means:** The game is feature-complete. Everything works, but might have bugs or need polish.

**Example:** All features work - hero selection, weapon selection, arena voting, real player matching, movement, full physics, leaderboards, profiles.

**Why it matters:** This is your "almost done" version. You're fixing bugs and balancing, not adding features.

**What to build:**

- Real player matching (no more bots)
- Hero selection
- Weapon selection
- Arena selection (voting/elimination)
- All planned features implemented
- Bug fixes
- Performance optimization
- Balance tuning (weapon damage, scoring, etc.)

**When you're done:** Game has all features with real players, just needs polish and bug fixes.

---

### Content Complete

**What it means:** All content is in the game. No more features, no more content. Just fixing bugs.

**Example:** All heroes, weapons, arenas are in. All UI screens work. All systems are balanced.

**Why it matters:** This is your "feature freeze" - you're only fixing bugs now, not adding anything new.

**What to do:**

- Fix all critical bugs
- Polish UI/UX
- Final balance passes
- Performance optimization
- Security hardening

**When you're done:** Game is ready for final testing, just needs bug fixes.

---

### Gold Master

**What it means:** The game is done. Ready to launch. No known critical bugs.

**Example:** Game is deployed, tested, and ready for players. All systems work. Documentation complete.

**Why it matters:** This is your launch version. What players will see on day one.

**What to do:**

- All bugs fixed
- All tests passing
- Deployment ready
- Documentation complete
- Monitoring set up

**When you're done:** Game launches! 🚀

---

## How to Plan with Vertical Slices

**Starting Point:** Phase 1 (Foundation) is complete. All infrastructure, project structure, Docker setup, and CI/CD are ready. We can now build vertical slices.

### Step 1: Define Your Vertical Slices

Each vertical slice is one complete player experience:

- **VS-1:** Foundation & Infrastructure Setup (project structure, Docker, CI/CD)
- **VS-2:** Player Authentication (register, login, logout)
- **VS-3:** First Playable Match (play one match end-to-end with bot)
- **VS-4:** Profile & Progression (view stats, leaderboard)
- **VS-5:** Full Game Features (hero selection, weapons, arenas, real players)
- **VS-6:** Content Complete (deployment, testing, documentation, polish)
- **VS-7:** Gold Master (monitoring, logging, production-ready, launch)

### Step 2: Map Slices to Milestones

- **Vertical Slice** = VS-1 + VS-2 + VS-3 (can play one match with bot)
- **Alpha** = VS-1 + VS-2 + VS-3 + VS-4 (can play matches, see progression)
- **Beta** = VS-1 + VS-2 + VS-3 + VS-4 + VS-5 (all features with real players)
- **Content Complete** = Beta + VS-6 (all polish, deployment, testing)
- **Gold Master** = Content Complete + VS-7 (production-ready, launch)

### Step 3: Build One Slice at a Time

Don't build VS-1, then VS-2, then VS-3 all at once. Finish VS-1 completely, then move to VS-2.

**Why:** Each slice must be playable. If VS-1 isn't done, VS-2 can't work.

---

## Planning Your Epics

### Epic Structure

Each epic should be a vertical slice:

```
EPIC-VS-1: Foundation & Infrastructure Setup
├── Story 1: Project structure created
├── Story 2: Docker Compose configured
└── Story 3: CI/CD pipelines set up

EPIC-VS-2: Player Authentication
├── Story 1: Player can register
├── Story 2: Player can login
└── Story 3: Player can logout

EPIC-VS-3: First Playable Match
├── Story 1: Player can click "Play"
├── Story 2: Player gets matched (bot)
├── Story 3: Player sees arena
├── Story 4: Player can fire shots
└── Story 5: Player sees match result

EPIC-VS-4: Profile & Progression
├── Story 1: Player can view profile
├── Story 2: Player can view leaderboard
└── Story 3: Match results update profile

EPIC-VS-5: Full Game Features
├── Story 1: Player can select heroes
├── Story 2: Player can select weapons
├── Story 3: Player can vote on arenas
└── Story 4: Player can match with real players

EPIC-VS-6: Content Complete
├── Story 1: Application is containerized
├── Story 2: Application is comprehensively tested
└── Story 3: Application is fully documented

EPIC-VS-7: Gold Master
├── Story 1: Application is fully monitored
├── Story 2: Application has centralized logging
└── Story 3: Application is production-ready
```

### How to Create Epics

1. **Start with player experience:** "Player can do X"
2. **Break into stories:** Each story is one player action
3. **Pull tasks from Phase docs:** Use Phase documents for technical details
4. **Mark MVP tasks:** Mark minimal tasks as `[MVP]` for later refactoring

### Reference Phase Documents

Phase documents (Phase 1-9) are your **technical reference**. They tell you HOW to build things.

Epics tell you WHAT to build and IN WHAT ORDER.

**Example:**

- Phase 5 = Matchmaking Service technical specs
- EPIC-VS-3 = "Player gets matched" (uses Phase 5 specs)

---

## Key Principles

### Build Playable, Not Perfect

- Get it working first, then make it better
- Mark MVP tasks clearly
- Refactor later in VS-4 or Beta

### Test End-to-End

- Each vertical slice must be testable
- Can a real player do the complete flow?
- If not, the slice isn't done

### One Slice at a Time

- Finish VS-1 before starting VS-2
- Don't build multiple slices in parallel
- Each slice builds on the previous one

### Reference, Don't Rebuild

- Phase documents have all technical details
- Epics reference phases, don't duplicate them
- Pull tasks from phases, don't rewrite them

---

## Quick Checklist

**Before starting a new epic:**

- [ ] Previous epic is complete and playable
- [ ] End-to-end test passes
- [ ] All MVP tasks marked
- [ ] Technical debt documented

**When epic is done:**

- [ ] Player can complete the full flow
- [ ] All stories completed
- [ ] Integration tests passing
- [ ] Ready for next milestone

---

**Remember:** The goal is a playable game, not perfect services. Build slices, test them, then add more features.
