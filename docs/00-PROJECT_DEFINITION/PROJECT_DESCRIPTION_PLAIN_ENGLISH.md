# 📋 Project Description - Plain English
## Battle Arena - Multiplayer Artillery Battle Game

**Document Version:** 1.0  
**Last Updated:** 2024  
**Status:** Draft

---

## What is Battle Arena?

Battle Arena is an online multiplayer 2D artillery battle game inspired by the classic retro game "Pocket Tank". Players choose from different hero types (tanks, archers, catapults, witches) and battle each other using various artillery weapons in turn-based combat.

Think of it like a modern, web-based version of classic artillery games, but with multiple hero types, weapon selection, and the ability to play against other people from anywhere in the world. Players take turns aiming and firing weapons at each other, adjusting angles, power, and weapon types to destroy their opponents.

The game combines strategy, skill, and a bit of luck as players must account for terrain, gravity (which varies by arena), and choose the right weapon for each situation. The goal is to score more points than your opponent by the end of the match - either when the timer runs out (4-5 minutes) or when all 10 turns are completed, whichever comes first.

---

## Why Are We Building This?

### The Problem We're Solving

Many online games are either too complex for casual players or don't provide fair matches. Battle Arena aims to solve these problems by:

- **Fair Matching:** Players are matched with opponents of similar skill levels and hero types, so every match is competitive and fun
- **Quick Games:** Matches last 4-5 minutes or 10 turns, perfect for players who want to play a quick game during breaks
- **Simple to Learn:** The game is easy to understand - choose a hero, select weapons, aim, and fire
- **Strategic Depth:** Multiple hero types, different weapons, and arena selection create endless strategic possibilities
- **Always Available:** Players can join a match anytime, day or night, and find an opponent quickly
- **Nostalgic Appeal:** Brings back the classic Pocket Tank gameplay with modern multiplayer features

### What Makes It Special

Battle Arena stands out because it focuses on:
- **Multiple Hero Types:** Players can choose from tanks, archers, catapults, witches, and more (with more heroes coming in the future)
- **Flexible Hero Selection:** Players can select multiple heroes before matchmaking to increase their chances of finding a match
- **Weapon-Based Turns:** Each match has 10 weapons, which means 10 turns per player (20 total turns)
- **Arena Selection:** Different arenas based on hero types, with players choosing between available arenas after matchmaking
- **Movement:** Players can move their heroes within the arena (like in Pocket Tank)
- **Classic Gameplay:** Inspired by the beloved Pocket Tank game, bringing nostalgia with modern features
- **Fair Play:** Everyone gets matched with players of similar skill, so new players don't face experts
- **Fast Paced:** Quick matchmaking and short games mean players spend more time playing and less time waiting
- **Competitive:** Players can see their rank and compete to climb the leaderboard, with filtering options by hero type and weapons
- **Progression:** Players earn experience points and level up globally, giving them a sense of achievement

---

## Who Is This For?

### Primary Players

**Competitive Gamers:** Players who love climbing leaderboards and proving they're the best. They enjoy the challenge of improving their rank, mastering different heroes and weapons, and competing against skilled opponents.

**Casual Gamers:** Players who want to have fun without investing hours into learning complex game mechanics. They can jump in, choose their favorite hero, play a quick match, and have a good time.

**Strategy Enthusiasts:** Players who enjoy thinking through each shot, choosing the right weapon for each situation, and outsmarting their opponents through careful planning and execution.

**Nostalgic Gamers:** Players who remember and loved classic artillery games like Pocket Tank and want to experience that gameplay with modern features and multiplayer capabilities.

### What Players Will Enjoy

- **Quick Matches:** Games are fast-paced (4-5 minutes or 10 turns) and don't require long time commitments
- **Fair Competition:** Matchmaking ensures players face opponents of similar skill and hero types
- **Hero Variety:** Multiple hero types to choose from, each with their own weapons and characteristics
- **Weapon Selection:** 10 weapons per match, each with different properties (damage, range, trajectory, animations)
- **Arena Variety:** Different arenas based on hero types, with players choosing between available options
- **Movement:** Players can move their heroes within the arena, adding tactical depth
- **Strategic Gameplay:** Every shot requires thinking about angle, power, weapon type, terrain, and gravity
- **Sense of Progression:** Players level up globally and earn rewards as they play
- **Competitive Spirit:** Leaderboards let players see how they rank against others, with filtering by hero type and weapons
- **Easy to Start:** Simple controls and clear objectives make it accessible to everyone
- **No Restrictions:** All heroes and weapons are available from the start - no unlocking required

---

## How Does the Game Work?

### The Basics

Imagine you're playing a classic 2D artillery battle game like Pocket Tank, but instead of playing against the computer, you're playing against another real person online. Here's how it works:

1. **Create an Account:** Players sign up with a username and email address
2. **Choose Your Heroes:** Players select one or more hero types (tank, archer, catapult, witch, etc.) before matchmaking to increase match chances
3. **Join the Queue:** Players click a button to find a match
4. **Get Matched:** The system finds another player with similar skill level and compatible hero selection
5. **Accept the Match:** Both players confirm they're ready to play
6. **Select Arena:** Players choose between available arenas based on their selected hero types
7. **Battle Begins:** Players take turns aiming and firing at each other
8. **Take Your Turn:** On your turn, you can:
   - Move your hero within the arena (like in Pocket Tank)
   - Adjust the angle of your shot (left/right, up/down)
   - Adjust the power of your shot (how hard you fire)
   - Select which weapon to use from your 10 available weapons
9. **Win or Lose:** The match ends when either:
   - The 4-5 minute timer runs out, OR
   - All 10 turns are completed (20 total shots)
   - The winner is the player with more points (based on damage dealt, hits landed, or remaining HP)
10. **Earn Rewards:** Winners earn experience points and move up the global leaderboard

### Gameplay Details

**Hero Selection:**
- Players can choose from different hero types: tanks, archers, catapults, witches
- Players can select multiple heroes before matchmaking to increase their chances of finding a match
- Selecting multiple heroes broadens the matchmaking pool (players with similar XP range)
- Each hero type has different weapons, animations, damage, and trajectories
- All heroes are available from the start - no unlocking required
- More hero types will be added in future updates

**Weapon Selection:**
- Each match has 10 weapons per player (10 turns per player, 20 total turns)
- Weapons are selected before the match begins, one by one, alternating between players (like Pocket Tank)
- Players can see each other's weapon selections in real-time on the same screen (both players' weapon carts are visible, with weapons kept in the middle)
- Maximum 30 seconds total to choose weapons (approximately 3 seconds per weapon on average)
- If time runs out, a random weapon is automatically selected from available options
- Once a weapon is picked, it cannot be changed
- Different weapons have different properties:
  - Damage (how much health they remove)
  - Range (how far they can travel)
  - Trajectory (how they arc through the air)
  - Weight (affects physics and trajectory)
  - Animations (visual effects when fired)
  - Physics (how they behave in the air)
- Weapon selection is strategic - players must choose wisely based on the arena and situation
- Weapon synergies exist (e.g., gasoline + torch: if a player uses gasoline, then uses torch on a later turn, the torch burns the gasoline for increased damage and special effects)
- Weapon synergies are dynamic and will be designed during implementation
- System supports 2-10 weapons per hero (configurable via configuration file, not hardcoded)
- MVP targets 10 weapons per hero, but can be adjusted based on asset preparation time

**Turn-Based Combat:**
- Players take turns, so there's time to think and plan each shot
- Each turn has a 15-second time limit to initiate or fire the weapon (included in the 4-5 minute match timer)
- Players can see a countdown timer for their turn
- Turn order alternates (like chess pieces - players alternate selecting weapons, then alternate turns)
- On each turn, players can:
  - Move their hero within the arena (left/right only, using click-to-move button)
  - Adjust the angle of their shot (left/right, up/down)
  - Adjust the power of their shot (how hard they fire)
  - Select which weapon to use from their 10 available weapons
  - Move AND fire in the same turn
  - Move after firing to make defensive positioning more interesting
- Players have 4 moves total per game (can use multiple moves in one turn, but this consumes their total move allowance)
- Movement is limited to left/right only within arena boundaries
- This makes the game strategic rather than just about quick reflexes

**Arena Selection:**
- Different arenas are available based on the hero types players have chosen
- After matchmaking, players choose arenas using a voting/elimination system (like CS2 premium matchmaking)
- Players vote and eliminate arenas one by one until an arena is selected
- Arena previews are shown as thumbnail images during selection
- Players can see which arenas their opponent is eliminating in real-time
- The elimination process continues until one arena remains (automatically selected)
- Each arena has different terrain and gravity
- Gravity varies by arena (some arenas have stronger gravity, some have weaker)
- Arenas are NOT destructible - only UI damage effects are shown (visual residuals of previous weapons, explosions, etc.) that don't hinder movement or gameplay
- Players can move their heroes within the arena
- Terrain affects where projectiles can hit and where players can move
- Number and structure of arenas will increase over time as development progresses

**Physics-Based:**
- Projectiles follow realistic physics based on the weapon type and arena
- Gravity varies by arena (no wind in any arena)
- Different weapons have different physics (some arc more, some travel straighter)
- Players need to account for gravity, terrain, and weapon properties when aiming
- This adds skill and strategy to the game - players must learn how each weapon behaves in different arenas

**Real-Time Updates:**
- While it's turn-based, everything happens in real-time
- Players see their opponent's actions immediately
- The game state updates instantly
- Visual feedback shows hits, misses, damage, and explosions
- Players can see their opponent's movement and weapon selection

**Match Duration:**
- Matches last 4-5 minutes OR until all 10 turns are completed (whichever comes first)
- Each player gets 10 turns (20 total turns in a match)
- Each turn has a 15-second time limit to initiate or fire the weapon (included in the 4-5 minute match timer)
- Players can see a countdown timer for their turn
- If the timer runs out before all turns are completed, the match ends
- If all turns are completed before the timer runs out, the match ends
- The winner is determined by:
  - **HP = 0 = Instant Loss:** If a player's HP reaches zero, they lose immediately (regardless of score)
  - **At Match End:** Player with more remaining HP wins
  - **Score Determines Rank Changes:** Score determines how much global score/rank increases or decreases
  - **Draw Condition:** If HP is the same, scores determine winner; if scores are also the same, it's a draw

**Health System:**
- Different hero types have different starting HP (e.g., tanks have more HP than archers, witches have more HP than archers)
- When players are matched with the same hero type, they start with the same HP (balanced for that hero type)
- Health is reduced when hit by weapons
- Different weapons deal different amounts of damage
- Accuracy matters - hitting closer to the center of the target (hit area) results in more damage
- Players can win by reducing opponent's health to zero before the match ends (instant win)

**Scoring System:**
- Points (score) are earned during the match based on:
  - Hitting the enemy with good accuracy (accuracy measured by hit area - closer to center = better accuracy = more score)
  - Back-to-back hits give additional score (multiplier or bonus - formula to be determined during implementation)
  - Repositioning that saves from hits gives score (if player moves and enemy weapon lands where player was standing, player gets score for the save)
  - No score is given just for repositioning - only when repositioning actually saves from a hit
- Match winner is determined by:
  - **HP = 0 = Instant Loss:** If a player's HP reaches zero, they lose immediately (regardless of score)
  - **At Match End (Timer/Turns):** Player with more remaining HP wins
  - **Score Determines Global Rank Changes:** Score determines how much global score/rank increases or decreases:
    - If player loses but has good score, their rank decreases by a lesser amount
    - If player wins but has low score, their rank increases by a lesser margin
    - Formula for rank changes will be determined during implementation
- If HP is the same at match end, scores from that match are used to determine the winner
- If HP and scores are both the same, the match is a draw:
  - Both players get equal winning points (base score of 100 points)
  - No win bonus is given (win bonus normally depends on score in match, with base score point of 100)
- Score from matches (even losses) contributes to leaderboard ranking

**Fair Matchmaking:**
- The system matches players based on their global score/rank and skill level
- Players with closer ratings/global rank/global score get matched sooner
- Players can select multiple heroes before matchmaking (using checkboxes) to increase match chances
- Heroes must be the same to match (if Player A selects [Tank, Archer, Catapult, Witch] and Player B selects [Archer, Catapult], they can match on Archer or Catapult)
- When multiple heroes match, a random hero is chosen from the matched heroes (equal probability/chance for each matched hero)
- Hero selection order determines priority (order in which player chooses heroes determines which hero is selected for the game in arena)
- Players can see which hero was selected before the match starts (e.g., on loading screen)
- Single queue system that matches based on selected heroes (most reliable method considering effort and AWS costs)
- After 5 minutes of search time, the system widens the XP/score/rank range for matchmaking
- Players can cancel matchmaking and try again
- If no match is found after timeout, players are prompted with a meaningful message and asked to try again later
- Estimated wait time is calculated based on number of players online searching for matchmaking
- Different heroes have different matchmaking queues (but players with multiple heroes are in a single queue that matches based on any of their selected heroes)
- This ensures every match is competitive and enjoyable
- New players don't face experts, and experts don't face beginners

---

## What Features Are Included?

### Core Features (What Players Get)

**User Accounts:**
- Create an account with username and email
- Secure login that keeps accounts safe
- Profile page showing statistics and achievements
- Track your progress and see your ranking
- Global player progression (not per-hero)

**Hero Selection:**
- Choose from multiple hero types: tanks, archers, catapults, witches
- Select multiple heroes before matchmaking to increase match chances
- All heroes available from the start - no unlocking required
- Each hero type has different weapons, animations, damage, and trajectories
- More hero types coming in future updates
- Change hero selection before each matchmaking session

**Weapon Selection:**
- 10 weapons per match (10 turns per player)
- Select weapons before the match begins
- Different weapons with different properties (damage, range, trajectory, animations, physics)
- Strategic weapon selection based on arena and opponent
- First player to select weapon gets second turn (alternating like chess)

**Arena Selection:**
- Different arenas based on hero types
- Players choose between available arenas after matchmaking
- Each arena has different terrain and gravity
- Gravity varies by arena (no wind)
- Players can move their heroes within the arena
- Terrain affects projectile hits and player movement

**Movement:**
- Players can move their heroes within the arena (like in Pocket Tank)
- Movement is left/right only (will be more clear during implementation)
- Players have 4 moves total per game
- Players can move only on their turn (using click-to-move button on screen)
- Players can move multiple times in a single turn, but this consumes their total move allowance for the game
- Players can move AND fire in the same turn
- Players can move after firing to make defensive positioning more interesting
- Movement is limited to arena boundaries (size of arena only)
- Movement adds tactical depth to gameplay
- Players must position themselves strategically to avoid enemy fire and get better angles
- If a player moves and the enemy's next shot misses because of the move (lands where player was standing), the player gets score for the save
- Players cannot move after an enemy shot is fired and completed (movement is only allowed on their own turn)

**Matchmaking:**
- Quick matchmaking that finds opponents in seconds
- Fair matching based on skill level and hero type compatibility
- Multiple hero selection increases matchmaking chances
- Ability to accept or decline matches
- Real-time queue status updates

**Gameplay:**
- Real-time 2D artillery battles against other players
- Turn-based gameplay that's easy to understand
- Adjust angle, power, and weapon selection on each turn
- Move heroes within the arena
- Physics-based projectiles that require skill to master
- Different gravity per arena (no wind)
- Visual feedback showing hits, misses, damage, and explosions
- Match duration: 4-5 minutes OR 10 turns per player (whichever comes first)
- Win by scoring more points or having more remaining HP

**Progression:**
- Global progression system (not per-hero)
- Score can be as high as infinite (no level cap)
- Rank tiers are in ranges of score numbers (like Valorant game)
- Track wins, losses, and overall statistics
- See your rank on the global leaderboard
- Filter leaderboard by region, hero type, winning percentage, and weapons
- All heroes and weapons available from start (no unlocking system for MVP)
- Future: Heroes can be unlocked based on score ranks players climb (to be implemented later)
- Win bonus depends on score in match, with base score point of 100

**Leaderboard:**
- Global leaderboard based on total score across all games (end results, not in-game scores)
- Score leads to rank tiers based on score ranges (like Valorant game)
- Rank tiers (e.g., Bronze, Silver, Gold) are determined by score ranges
- Players with similar ranks can be in top 5, then their global score determines leaderboard rankings
- Global leaderboard rankings are the order in which scores are sorted based on filters
- See your own rank and position
- Compare your stats with other players
- Track your progress over time
- Filter leaderboard by:
  - Region
  - Hero type
  - Winning percentage
  - Weapon usage
- Filters make leaderboards interesting and allow players to see rankings in different categories

### What's Not Included (For Now)

To keep the first version focused and deliverable quickly, we're not including:
- Hero unlocking system (all heroes available to all players for MVP)
- Per-hero progression (progression is global)
- Tournament systems (coming in future updates)
- Team battles (coming in future updates)
- Chat features (coming in future updates)
- Friend systems (coming in future updates)
- Mobile apps (web version works on mobile browsers)
- Advanced social features (coming in future updates)
- Wind mechanics (gravity only, no wind)
- Comprehensive visual/audio feedback list (will be designed on the go)
- Exact scoring formulas (will be determined during implementation with trial and error)
- Exact rank tier ranges (will be determined during implementation)
- Exact disconnection penalties (will be determined via configuration file with trial and error)
- Hero unlocking based on ranks (coming in future updates)

---

## How Does the Technology Work?

### Behind the Scenes

While players don't need to understand the technical details, here's a simple explanation of how everything works:

**Multiple Services:** The game is built using multiple independent services that work together. Think of it like a restaurant where different chefs handle different parts of the meal - one handles authentication, one handles matchmaking, one handles the actual game, etc.

**Real-Time Communication:** When players play, their actions are sent to the server instantly, and the server sends updates back to both players immediately. This creates a smooth, real-time gaming experience.

**Smart Matchmaking:** The system keeps track of each player's skill level and matches them with players of similar skill and compatible hero types. Players with multiple hero selections have a broader matchmaking pool, increasing their chances of finding a match.

**Arena Management:** The system manages different arenas based on hero types, ensuring players get appropriate arena options after matchmaking.

**Physics Simulation:** The system calculates projectile trajectories, damage, and terrain interactions based on weapon properties, arena gravity, and player actions.

**Secure and Safe:** Player accounts are protected with industry-standard security measures. Passwords are encrypted, and all communication is secure.

**Scalable:** The system can handle thousands of players at the same time. As more people play, the system can grow to accommodate them.

---

## What Makes This Game Fun?

### The Experience

**Quick and Exciting:** Matches are fast-paced (4-5 minutes or 10 turns) and exciting. Players can jump in, play a quick game, and feel the thrill of competition.

**Strategic:** While the controls are simple, the game requires strategy. Players need to think about:
- Which hero to choose (and whether to select multiple for better matchmaking)
- Which weapons to select before the match
- Which arena to choose after matchmaking
- How to position their hero in the arena
- What angle and power to use
- Which weapon to fire on each turn
- How to account for terrain, gravity, and weapon physics

**Variety:** Multiple hero types, weapons, and arenas create endless strategic possibilities. No two matches play out exactly the same way.

**Movement:** Players can move their heroes within the arena, adding tactical depth and making each match dynamic.

**Competitive:** The leaderboard system creates a competitive environment where players strive to improve their rank. Filtering by hero type and weapons adds additional competitive dimensions.

**Rewarding:** Players earn experience points and level up globally, providing a sense of progression and achievement.

**Fair:** The matchmaking system ensures players face opponents of similar skill, so every match is competitive and fun.

**Nostalgic:** For players who remember classic artillery games like Pocket Tank, this brings back that nostalgic feeling with modern features.

**Accessible:** All heroes and weapons are available from the start, so players can jump in and start playing immediately without grinding or unlocking.

---

## What Are the Goals?

### Primary Goals

**Deliver a Fun Game:** The main goal is to create a game that players enjoy and want to come back to.

**Fair Competition:** Ensure that every match is fair and competitive by matching players of similar skill levels and hero types.

**Smooth Experience:** Provide a smooth, responsive gaming experience with minimal delays and technical issues.

**Easy to Use:** Make the game easy to understand and play, so new players can jump in and have fun immediately.

**Strategic Depth:** Provide enough strategic options (hero selection, weapon selection, arena selection, movement, aiming) to keep players engaged and thinking.

**Scalable Platform:** Build a platform that can grow as more players join, without sacrificing performance or user experience.

**Nostalgic Appeal:** Bring back the classic Pocket Tank gameplay with modern multiplayer features and enhancements.

### Success Indicators

We'll know the project is successful when:
- Players can easily create accounts and start playing
- Players can select multiple heroes to improve matchmaking chances
- Players can choose weapons before matches
- Players can select arenas after matchmaking
- Players can move their heroes within arenas
- Matchmaking finds opponents quickly and fairly
- Games run smoothly without technical issues
- Matches complete within 4-5 minutes or 10 turns
- Scoring system works correctly
- Players enjoy the strategic gameplay
- Players return to play multiple matches
- The leaderboard system works correctly with filtering options
- Players enjoy the competitive experience
- All heroes and weapons are accessible from the start

---

## Who Will Benefit?

### Players

**New Players:** Easy to learn, fair matchmaking, and quick matches make it perfect for new players who want to start playing immediately. All heroes and weapons are available from the start, so there's no grinding or unlocking required.

**Casual Players:** Short matches (4-5 minutes or 10 turns) and simple controls make it perfect for players who want to play during breaks or in their free time.

**Competitive Players:** Leaderboards, rankings, and fair matchmaking create a competitive environment that appeals to players who want to prove their skills. Filtering by hero type and weapons adds additional competitive dimensions.

**Strategy Enthusiasts:** Multiple hero types, weapon selection, arena selection, movement, and physics-based gameplay provide plenty of strategic depth for players who enjoy thinking through each move.

**Nostalgic Gamers:** Players who remember and loved classic artillery games will appreciate the modern take on a beloved game style, with the ability to move heroes and choose from multiple heroes and weapons.

### Developers

**Learning Opportunity:** The project demonstrates modern software development practices, including microservices architecture, real-time communication, physics simulation, and scalable systems.

**Portfolio Project:** A complete, production-ready game that showcases technical skills and best practices.

**Industry Standards:** Follows industry best practices for code quality, security, and architecture.

---

## What Are the Challenges?

### Technical Challenges

**Real-Time Synchronization:** Keeping the game state synchronized between two players in real-time requires careful engineering to ensure both players see the same thing at the same time.

**Fair Matchmaking:** Finding players of similar skill levels and compatible hero types quickly requires smart algorithms and efficient data structures. Supporting multiple hero selections adds complexity to matchmaking.

**Physics Calculations:** Calculating projectile trajectories, damage, and terrain interactions requires accurate physics simulation. Different weapons and arenas with varying gravity add complexity.

**Weapon Variety:** Different weapons with different properties (damage, range, trajectory, animations, physics) need to be balanced and work correctly with the physics system.

**Arena Management:** Managing different arenas based on hero types and allowing players to choose between available options requires careful design and implementation.

**Movement System:** Implementing hero movement within arenas (like Pocket Tank) requires collision detection, terrain interaction, and synchronization between players.

**Scoring System:** Implementing a fair scoring system based on damage dealt, hits landed, and remaining HP requires careful design and testing.

**Timer Management:** Managing match timers (4-5 minutes) and turn completion (10 turns per player) requires careful coordination and state management.

**Scalability:** As more players join, the system needs to handle the increased load without slowing down or crashing.

**Security:** Protecting player accounts and preventing cheating requires robust security measures.

### How We're Addressing These Challenges

**Modern Technology:** Using modern technologies and best practices that are designed to handle these challenges.

**Careful Design:** Designing the system from the ground up to be scalable, secure, and performant.

**Testing:** Thorough testing to ensure the system works correctly under various conditions, including different heroes, weapons, arenas, and match scenarios.

**Monitoring:** Continuous monitoring to identify and fix issues quickly.

**Balance Testing:** Extensive testing to ensure all heroes, weapons, and arenas are balanced and fun to play.

**Physics Engine:** Using a proven physics engine to handle projectile trajectories, collisions, and terrain interactions accurately.

---

## What's the Timeline?

### Development Phases

**Phase 1: Planning and Design (Days 1-3)**
- Define the project requirements
- Design the system architecture
- Plan the implementation approach
- Create detailed design documents
- Design hero types and weapon systems
- Design arena system and gravity mechanics
- Design movement system
- Design matchmaking and gameplay mechanics
- Design scoring system

**Phase 2: Core Development (Days 4-7)**
- Build the backend services
- Create the user interface
- Implement hero selection system (with multiple hero support)
- Implement weapon selection system (10 weapons per match)
- Implement arena selection system
- Implement movement system
- Implement the game mechanics
- Implement physics system (with arena-specific gravity)
- Implement scoring system
- Implement timer system (4-5 minutes or 10 turns)
- Set up the database and infrastructure

**Phase 3: Testing and Polish (Days 8-9)**
- Test all features thoroughly
- Test hero and weapon balance
- Test arena mechanics and gravity
- Test movement system
- Test matchmaking with multiple hero selections
- Test scoring system
- Test timer system
- Fix any bugs or issues
- Optimize performance
- Ensure security measures are in place
- Test matchmaking and gameplay

**Phase 4: Deployment (Day 10)**
- Deploy the game to production
- Set up monitoring and logging
- Perform final testing
- Launch the game

### Realistic Expectations

The goal is to deliver a working, playable game within 7-10 days. This is an aggressive timeline that focuses on delivering core features first, including:
- Multiple hero types (tanks, archers, catapults, witches)
- Multiple hero selection for matchmaking
- Weapon selection system (10 weapons per match)
- Arena selection system (based on hero types)
- Movement system (hero movement within arenas)
- Turn-based gameplay with angle and power adjustment
- Physics-based projectiles (with arena-specific gravity)
- Matchmaking and leaderboards (with filtering by hero type and weapons)
- Scoring system (based on damage, hits, and remaining HP)
- Timer system (4-5 minutes or 10 turns per player)
- Additional features coming in future updates

---

## What Happens Next?

### Immediate Next Steps

1. **Review and Finalize:** Review the project description and scope with all stakeholders
2. **Gather Feedback:** Collect feedback and make any necessary adjustments
3. **Clarify Details:** Answer any remaining questions about hero types, weapons, arenas, movement, and gameplay
4. **Approval:** Get approval to proceed with design and development
5. **Design Phase:** Create detailed design documents
6. **Development Phase:** Start building the game

### Future Enhancements

Once the core game is working, we can add:
- More hero types with unique abilities
- Weapon unlocking and progression systems (optional)
- Per-hero progression (optional)
- Tournament systems for organized competitions
- Team battles for multiplayer matches
- Chat features for player communication
- Friend systems for playing with friends
- Achievement systems for additional rewards
- Replay systems for watching past matches
- Mobile apps for iOS and Android
- Hero-specific progression and customization
- Turn time limits (per-turn timers)
- Wind mechanics (optional)

---

## Why This Matters

### For Players

Battle Arena provides a fun, competitive gaming experience that's accessible to everyone. Whether you're a casual player looking for quick matches, a competitive player striving to climb the leaderboard, or a strategy enthusiast who enjoys thinking through each shot, the game offers something for everyone.

The multiple hero types, weapon selection, arena selection, and movement add variety and strategic depth, while the fair matchmaking ensures every match is competitive and enjoyable. The classic artillery game mechanics bring nostalgia, while modern features like leaderboards, filtering, and progression keep players engaged.

All heroes and weapons are available from the start, so players can jump in and start playing immediately without grinding or unlocking. The global progression system and filtered leaderboards provide additional competitive dimensions.

### For Developers

This project demonstrates modern software development practices and creates a portfolio piece that showcases technical skills. It's a complete, production-ready application that follows industry best practices, including microservices architecture, real-time communication, physics simulation, and scalable systems.

### For the Industry

Battle Arena serves as an example of how to build scalable, secure, and maintainable multiplayer games using modern technologies and best practices. It demonstrates that it's possible to create high-quality games quickly when following the right approach, and shows how classic game mechanics can be brought into the modern era with multiplayer capabilities, movement systems, and strategic depth.

---

## Summary

Battle Arena is an online multiplayer 2D artillery battle game inspired by the classic retro game "Pocket Tank". Players choose from different hero types (tanks, archers, catapults, witches) and battle each other using various artillery weapons in turn-based combat.

Before each match, players select one or more hero types (to increase matchmaking chances) and choose 10 weapons from their arsenal. After matchmaking, players choose between available arenas based on their hero types. During the match, players take turns moving their heroes, adjusting the angle and power of their shots, and selecting which weapon to fire. The game features physics-based projectiles with arena-specific gravity, terrain-based gameplay, and strategic depth through hero selection, weapon selection, arena selection, and movement.

Matches last 4-5 minutes OR until all 10 turns are completed (whichever comes first). The winner is determined by points (based on damage dealt, hits landed, or remaining HP). Players create accounts, join matchmaking queues, get paired with opponents of similar skill, and engage in exciting artillery battles.

The game tracks global progression (not per-hero), maintains leaderboards with filtering by hero type and weapons, and provides a competitive environment for players to test their skills. All heroes and weapons are available from the start - no unlocking required.

The project is built using modern technologies and best practices, ensuring it's scalable, secure, and maintainable. The goal is to deliver a working, playable game within 7-10 days, with core features first and additional features in future updates.

Whether you're a casual player looking for quick matches, a competitive player striving to climb the leaderboard, or a strategy enthusiast who enjoys thinking through each shot, Battle Arena offers an enjoyable gaming experience that's easy to learn but challenging to master.

---

## Questions and Answers

### Frequently Asked Questions

**Q: How many hero types are available?**
A: Initially, four hero types are available: tanks, archers, catapults, and witches. More hero types will be added in future updates.

**Q: Can I select multiple heroes before matchmaking?**
A: Yes! Selecting multiple heroes increases your chances of finding a match by broadening the matchmaking pool. Players with similar XP ranges and compatible hero selections can be matched together.

**Q: How many weapons do I get per match?**
A: Each match has 10 weapons per player, which means 10 turns per player (20 total turns in a match).

**Q: How do I select weapons?**
A: Before each match begins, you'll select 10 weapons from your available arsenal. You choose weapons one by one before the match starts.

**Q: How does turn order work?**
A: The first player to select a weapon gets the second turn when the battle starts. Turns then alternate like chess pieces (black and white). This ensures fairness in turn order.

**Q: Can I change my hero during a match?**
A: No, you select your hero (or multiple heroes) before matchmaking. However, you can change your hero selection before each new matchmaking session.

**Q: How do arenas work?**
A: Different arenas are available based on the hero types players have chosen. After matchmaking, players choose between available arenas. Each arena has different terrain and gravity (gravity varies by arena, no wind).

**Q: Can I move my hero in the arena?**
A: Yes! Players can move their heroes within the arena (like in Pocket Tank). Movement adds tactical depth and allows players to position themselves strategically.

**Q: How long does a match take?**
A: Matches last 4-5 minutes OR until all 10 turns are completed (whichever comes first). Each player gets 10 turns, so there are 20 total turns in a match.

**Q: How is the winner determined?**
A: The winner is determined by:
- Player with more points (based on damage dealt, hits landed)
- OR player with more remaining HP if the timer is still running
- OR player who reduces opponent's health to zero (instant win)

**Q: Do I need to download anything?**
A: No, the game runs in your web browser. Just visit the website and start playing.

**Q: Is it free to play?**
A: The core game is free to play. Future updates may include optional paid features like cosmetic items or additional hero types.

**Q: Can I play with friends?**
A: The current version focuses on matchmaking with random opponents. Friend systems are planned for future updates.

**Q: How does matchmaking work?**
A: The system matches players based on their experience points and skill level, and considers hero type compatibility. Players with multiple hero selections have a broader matchmaking pool, increasing their chances of finding a match.

**Q: What happens if I disconnect during a match?**
A: The match will be paused and the connected player will be prompted with an understanding message. The disconnected player gets an option to rejoin the game where they left off (1 minute maximum). After 1 minute, if the player doesn't rejoin, the match/lobby gets terminated and both players move to the home screen. The disconnected player will lose some score if they had not scored in that match. If they disconnected mid-match, half of their score will be deducted and half will be counted towards their profile. The connected player gets all the score they earned up to that point. Disconnection penalties will be configurable via a configuration file (trial and error approach). Players can leave the game anytime but get 30-45 seconds to rejoin, or else the game will be terminated.

**Q: Can I see my match history?**
A: Yes, players can view their match history, statistics, and progression on their profile page.

**Q: How do I improve my rank?**
A: Win matches to earn experience points. As you gain experience, you'll level up globally and improve your rank on the leaderboard.

**Q: Are all weapons available to all players?**
A: Yes, in the initial version, all weapons are available to all players. The system supports 2-10 weapons per hero (configurable via configuration file, not hardcoded). MVP targets 10 weapons per hero, but this can be adjusted based on asset preparation time.

**Q: Are all heroes available to all players?**
A: Yes, all heroes are available from the start in MVP. There's no unlocking system - players can jump in and start playing immediately. In the future, heroes may be unlocked based on score ranks players climb.

**Q: Do different hero types have different abilities?**
A: Yes, each hero type has different characteristics:
- Different size (hitboxes)
- Different weapons (each hero has their own weapon set)
- Different HP (e.g., tanks have more HP than archers, witches have more HP than archers)
- Different speed (movement speed)
- Visually different (appearance)
- Functionally different (unique characteristics)
- Different animations (getting hit, drawing weapons, shooting weapons)
- When players are matched with the same hero type, they start with the same HP (balanced for that hero type)

**Q: How do I adjust my shot?**
A: On your turn, you can:
- Move your hero within the arena (left/right only, using click-to-move button)
- Adjust the angle (left/right, up/down) of your shot
- Adjust the power (how hard you fire) of your shot
- Select which weapon to use from your 10 available weapons
- Move AND fire in the same turn
- Move after firing to make defensive positioning more interesting
- You have 4 moves total per game (can use multiple moves in one turn, but this consumes your total move allowance)
- Each turn has a 15-second time limit to initiate or fire the weapon

**Q: Is the terrain the same in every match?**
A: No, terrain varies between arenas. Different arenas have different terrain and gravity. Players choose between available arenas after matchmaking using a voting/elimination system (like CS2 premium matchmaking). Arenas are NOT destructible - only UI damage effects are shown (visual residuals that don't hinder movement or gameplay).

**Q: Is there wind in the game?**
A: No, there's no wind in any arena. However, gravity varies by arena, and different weapons have different physics (trajectories, arcs, weight, etc.).

**Q: How does weapon selection work?**
A: Weapons are selected before the match begins, one by one, alternating between players (like Pocket Tank). Players can see each other's weapon selections in real-time on the same screen. Maximum 30 seconds total to choose weapons (approximately 3 seconds per weapon on average). If time runs out, a random weapon is automatically selected. Once a weapon is picked, it cannot be changed.

**Q: What are weapon synergies?**
A: Weapon synergies are combinations where using one weapon, then another weapon on a later turn, creates special effects. For example, if a player uses gasoline, then uses torch on a later turn, the torch burns the gasoline for increased damage and special effects. Weapon synergies are dynamic and will be designed during implementation.

**Q: How does the leaderboard ranking work?**
A: The leaderboard is based on total score across all games (end results, not in-game scores). Score leads to rank tiers based on score ranges (like Valorant game). Players with similar ranks can be in top 5, then their global score determines leaderboard rankings. You can filter the leaderboard by region, hero type, winning percentage, and weapons.

**Q: What happens in a draw?**
A: If HP is the same at match end, scores from that match are used to determine the winner. If HP and scores are both the same, it's a draw. Both players get equal winning points (base score of 100 points) with no win bonus (win bonus normally depends on score in match, with base score point of 100).

**Q: How does matchmaking work with multiple heroes?**
A: Players can select multiple heroes before matchmaking (using checkboxes) to increase match chances. Heroes must be the same to match. When multiple heroes match, a random hero is chosen from the matched heroes (equal probability). Hero selection order determines priority. Players with closer ratings/global rank/global score get matched sooner. After 5 minutes of search time, the system widens the XP/score/rank range for matchmaking. Players can cancel matchmaking and try again.

**Q: What visual and audio feedback do I get?**
A: The game includes:
- Explosion animations when weapons hit (visual - medium priority)
- Sound effects for different weapons (audio - nice to have)
- Damage numbers when they hit (visual - medium priority)
- Visual indicator for remaining HP (visual - medium priority)
- Visual indicators for turn order and remaining turns (visual - medium priority)
- Comprehensive visual/audio feedback list will be designed on the go

---

## Conclusion

Battle Arena is an exciting multiplayer 2D artillery battle game that brings together players for competitive matches. With multiple hero types, weapon selection, arena selection, movement, fair matchmaking, quick matches, and an enjoyable gaming experience, it's designed to be accessible to everyone while providing enough challenge to keep players engaged.

The game combines the nostalgic appeal of classic artillery games like Pocket Tank with modern features like multiplayer matchmaking, leaderboards with filtering, global progression, and strategic depth. Players can choose their favorite hero type (or multiple heroes for better matchmaking), select weapons strategically, choose arenas, move their heroes, and engage in turn-based battles that require skill, strategy, and a bit of luck.

The project focuses on delivering core features first, with a clear path for future enhancements. By following modern development practices and industry best practices, we're building a scalable, secure, and maintainable game that can grow with its player base.

All heroes and weapons are available from the start, so players can jump in and start playing immediately. The global progression system and filtered leaderboards provide additional competitive dimensions, while the fair matchmaking ensures every match is competitive and enjoyable.

Whether you're a casual player looking for quick matches, a competitive player striving to climb the leaderboard, or a strategy enthusiast who enjoys thinking through each shot, Battle Arena offers something for everyone. Join the battle, choose your heroes, select your weapons, pick your arena, move strategically, and prove your skills in the arena!

---

**Document Control:**
- **Author:** Documentation Team
- **Reviewer:** Technical Lead
- **Approval:** CTO
- **Status:** Draft
- **Next Review Date:** After stakeholder review
