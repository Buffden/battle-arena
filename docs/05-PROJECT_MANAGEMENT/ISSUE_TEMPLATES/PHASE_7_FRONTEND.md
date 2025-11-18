# Phase 7: Frontend (Angular + TailwindCSS + Phaser 3)

**⚠️ NOTE: This is REFERENCE DOCUMENTATION for Frontend technical details.**

**For implementation planning, see:**

- EPIC-3: Core Gameplay Loop (uses Frontend game arena components)
- EPIC-4: Matchmaking & Pre-Game (uses Frontend matchmaking UI components)
- EPIC-5: Progression & Competition (uses Frontend profile/leaderboard components)
- EPIC-6: Polish & Additional Features (uses Frontend dashboard/components)

**This phase file contains:**

- Frontend architecture (Angular, TailwindCSS, Phaser 3)
- Component structure and design patterns
- Service specifications
- Route definitions
- Technical implementation details
- Stories and tasks for Frontend

**Epics will reference this file for technical specs, but implementation follows epic-based feature development (game studio approach).**

---

**Copy and paste these templates directly into GitHub Issues.**

---

## PHASE-7: Frontend Development - Technical Reference

### Issue Template:

```
Title: PHASE-7: Frontend Development

Description:
## Overview
Implement the Angular frontend for Battle Arena, including authentication flows, dashboards, hero/arena/weapon selection, matchmaking UI, game arena rendering with Phaser 3, profile and leaderboard screens. This phase document provides technical reference for the frontend that follows clean architecture and component-based design.

## Goals
- Angular 17+ app with modular feature structure
- Authentication UI (login, register, logout)
- Dashboard with navigation to all flows
- Hero, arena, and weapon selection UIs integrated with backend services
- Matchmaking queue UI with real-time status
- Game arena implemented in Phaser 3
- Profile and leaderboard pages with stats/rank display

## Success Criteria
- [ ] User can register, login, and logout
- [ ] User can select heroes, arenas, weapons
- [ ] User can join matchmaking and see queue status
- [ ] User can play matches in Phaser 3 game arena
- [ ] User can view profile and leaderboard data
- [ ] Core flows match the UX and architecture design

## Technical Architecture

### Frontend Details
Based on [Component Design](https://github.com/Buffden/battle-arena/blob/main/docs/02-ARCHITECTURE/HIGH_LEVEL_DESIGN/03-COMPONENT_DESIGN.md) and [Frontend Components LLD](https://github.com/Buffden/battle-arena/blob/main/docs/02-ARCHITECTURE/LOW_LEVEL_DESIGN/FRONTEND/FRONTEND_COMPONENTS.md):
- **Framework:** Angular 17+
- **Styling:** TailwindCSS
- **Game Rendering:** Phaser 3
- **Routing:** Angular Router
- **State:** Angular services, RxJS, and local state

## Related Documentation
- [Frontend Components LLD](https://github.com/Buffden/battle-arena/blob/main/docs/02-ARCHITECTURE/LOW_LEVEL_DESIGN/FRONTEND/FRONTEND_COMPONENTS.md)
- [Component Design](https://github.com/Buffden/battle-arena/blob/main/docs/02-ARCHITECTURE/HIGH_LEVEL_DESIGN/03-COMPONENT_DESIGN.md)

## Labels
phase:frontend, frontend, priority:high

## Milestone
Phase 7: Frontend
```

---

### STORY-7-1: Angular Project Setup

#### Issue Template:

```
Title: STORY-7-1: Angular Project Setup

Description:
## Epic
Related to #X (PHASE-7 issue number)

## User Story
As a developer, I want a properly configured Angular 17+ project with TailwindCSS and Phaser 3 so that I can build the frontend application efficiently.

## Description
Initialize comprehensive Angular 17+ project with TailwindCSS for styling, Phaser 3 for game rendering, modular feature structure, routing configuration, and base layout components. The project must follow clean architecture principles, component-based design, and include all necessary dependencies, configuration files, and base modules for authentication, dashboard, hero selection, matchmaking, arena selection, weapon selection, game arena, profile, and leaderboard features. This establishes the foundation for all frontend development.

## Acceptance Criteria
- [ ] Angular 17+ project created in `frontend-service/` directory
- [ ] TailwindCSS configured with custom theme and working correctly
- [ ] Phaser 3 installed and integrated with basic scene rendering
- [ ] Routing configured for all main feature modules (auth, dashboard, hero-selection, matchmaking, arena-selection, weapon-selection, arena, profile, leaderboard)
- [ ] Base layout component created with navigation structure
- [ ] Shared module created for reusable components
- [ ] Core services directory structure created
- [ ] Guards directory structure created
- [ ] Interceptors directory structure created
- [ ] Models/interfaces directory structure created
- [ ] Environment configuration files created (development, production)
- [ ] HTTP client configured with base URL
- [ ] Socket.io client configured
- [ ] Project structure follows clean architecture principles
- [ ] TypeScript strict mode enabled
- [ ] ESLint/Prettier configured
- [ ] Unit test setup configured (Jasmine/Karma)
- [ ] E2E test setup configured (Protractor/Cypress)

## Technical Details

### Angular Project Structure
Based on [Component Design](https://github.com/Buffden/battle-arena/blob/main/docs/02-ARCHITECTURE/HIGH_LEVEL_DESIGN/03-COMPONENT_DESIGN.md) section 1.1 and [Frontend Components LLD](https://github.com/Buffden/battle-arena/blob/main/docs/02-ARCHITECTURE/LOW_LEVEL_DESIGN/FRONTEND/FRONTEND_COMPONENTS.md) section 1:

**File Structure:**
```

frontend-service/
├── src/
│ ├── app/
│ │ ├── auth/ # Authentication module
│ │ ├── dashboard/ # Dashboard module
│ │ ├── hero-selection/ # Hero selection module
│ │ ├── matchmaking/ # Matchmaking module
│ │ ├── arena-selection/ # Arena selection module
│ │ ├── weapon-selection/ # Weapon selection module
│ │ ├── pages/
│ │ │ └── arena/ # Game arena module
│ │ ├── profile/ # Profile module
│ │ ├── leaderboard/ # Leaderboard module
│ │ ├── shared/ # Shared components, directives, pipes
│ │ ├── services/ # Angular services
│ │ ├── guards/ # Route guards
│ │ ├── interceptors/ # HTTP interceptors
│ │ ├── models/ # TypeScript interfaces and models
│ │ ├── core/ # Core module (singleton services)
│ │ └── app.component.ts # Root component
│ ├── assets/ # Static assets (images, fonts, etc.)
│ ├── environments/ # Environment configuration
│ │ ├── environment.ts # Development
│ │ └── environment.prod.ts # Production
│ ├── styles/ # Global styles
│ │ └── styles.scss # Main stylesheet
│ └── index.html # HTML entry point
├── angular.json # Angular CLI configuration
├── package.json # NPM dependencies
├── tsconfig.json # TypeScript configuration
├── tailwind.config.js # TailwindCSS configuration
├── .eslintrc.json # ESLint configuration
├── .prettierrc # Prettier configuration
└── README.md # Frontend documentation

```

### Design Patterns Applied
Based on [Frontend Components LLD](https://github.com/Buffden/battle-arena/blob/main/docs/02-ARCHITECTURE/LOW_LEVEL_DESIGN/FRONTEND/FRONTEND_COMPONENTS.md) section 1.3:

- **Singleton Pattern**: Angular services (providedIn: 'root')
- **Observer Pattern**: RxJS Observables for state management
- **Strategy Pattern**: Different routing strategies
- **State Pattern**: Component state management
- **Factory Pattern**: Component factory for dynamic components
- **Adapter Pattern**: HTTP client adapter, WebSocket adapter
- **Clean Architecture**: Separation of concerns with clear layer boundaries

### Package Dependencies
**Core Dependencies:**
- `@angular/core`: ^17.0.0
- `@angular/common`: ^17.0.0
- `@angular/router`: ^17.0.0
- `@angular/forms`: ^17.0.0
- `@angular/http`: ^17.0.0 (or HttpClient)
- `rxjs`: ^7.8.0
- `socket.io-client`: ^4.5.0
- `phaser`: ^3.70.0

**Development Dependencies:**
- `@angular-devkit/build-angular`: ^17.0.0
- `@angular/cli`: ^17.0.0
- `typescript`: ^5.2.0
- `tailwindcss`: ^3.3.0
- `@tailwindcss/forms`: ^0.5.0
- `eslint`: ^8.50.0
- `prettier`: ^3.0.0

## Related Documentation
- [Frontend Components LLD](https://github.com/Buffden/battle-arena/blob/main/docs/02-ARCHITECTURE/LOW_LEVEL_DESIGN/FRONTEND/FRONTEND_COMPONENTS.md) – Frontend architecture and design patterns (sections 1-5)
- [Component Design](https://github.com/Buffden/battle-arena/blob/main/docs/02-ARCHITECTURE/HIGH_LEVEL_DESIGN/03-COMPONENT_DESIGN.md) – Angular application structure (section 1.1)
- [System Architecture](https://github.com/Buffden/battle-arena/blob/main/docs/02-ARCHITECTURE/HIGH_LEVEL_DESIGN/02-SYSTEM_ARCHITECTURE.md) – Frontend responsibilities (section 2.6)
- **Frontend Components Class Diagram:** `https://github.com/Buffden/battle-arena/blob/main/docs/03-DIAGRAMS/class-diagrams/frontend-components.puml`

## Labels
phase:frontend, frontend, feature, priority:high

## Milestone
Phase 7: Frontend
```

#### Subtask: TASK-7-1-1: Create Angular project

````
Title: TASK-7-1-1: Create Angular project

Description:
## Story
Related to #X (STORY-7-1 issue number)

## Epic
Related to #X (PHASE-7 issue number)

## Description
Create Angular 17+ project using Angular CLI with proper configuration, TypeScript strict mode, and base project structure. The project must include all necessary configuration files, environment files, and follow Angular best practices for project organization.

## Acceptance Criteria
- [ ] Angular CLI installed globally or via npx
- [ ] Angular 17+ project created with `ng new frontend-service`
- [ ] TypeScript strict mode enabled in `tsconfig.json`
- [ ] Routing enabled during project creation
- [ ] SCSS selected as stylesheet format
- [ ] Base project structure created correctly
- [ ] `package.json` includes all core Angular dependencies
- [ ] `angular.json` configured with proper build options
- [ ] Environment files created (`environment.ts`, `environment.prod.ts`)
- [ ] `.gitignore` configured for Angular/Node.js patterns
- [ ] README.md created with project information

## Technical Details

### Angular CLI Command
```bash
ng new frontend-service --routing --style=scss --strict
````

### TypeScript Configuration

**File:** `tsconfig.json`

```json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "strictFunctionTypes": true,
    "strictBindCallApply": true,
    "strictPropertyInitialization": true,
    "noImplicitThis": true,
    "alwaysStrict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true
  }
}
```

### Environment Configuration

**File:** `src/environments/environment.ts`

```typescript
export const environment = {
  production: false,
  apiUrl: "http://localhost:8080",
  authServiceUrl: "http://localhost:8081",
  profileServiceUrl: "http://localhost:8082",
  leaderboardServiceUrl: "http://localhost:8083",
  matchmakingServiceUrl: "http://localhost:8084",
  gameEngineServiceUrl: "http://localhost:8085",
  socketIoUrl: "http://localhost:8084",
};
```

## Related Documentation

- [Frontend Components LLD](https://github.com/Buffden/battle-arena/blob/main/docs/02-ARCHITECTURE/LOW_LEVEL_DESIGN/FRONTEND/FRONTEND_COMPONENTS.md) – Frontend overview (section 1)
- [Component Design](https://github.com/Buffden/battle-arena/blob/main/docs/02-ARCHITECTURE/HIGH_LEVEL_DESIGN/03-COMPONENT_DESIGN.md) – Angular application structure (section 1.1)

## Labels

phase:frontend, frontend, task, priority:high

## Milestone

Phase 7: Frontend

```

#### Subtask: TASK-7-1-2: Configure TailwindCSS
```

Title: TASK-7-1-2: Configure TailwindCSS

Description:

## Story

Related to #X (STORY-7-1 issue number)

## Epic

Related to #X (PHASE-7 issue number)

## Description

Install and configure TailwindCSS for styling with custom theme configuration, PostCSS setup, and integration with Angular build process. The configuration must include custom colors, fonts, and utility classes for the Battle Arena design system.

## Acceptance Criteria

- [ ] TailwindCSS installed via npm
- [ ] `tailwind.config.js` created with custom theme
- [ ] PostCSS configured with TailwindCSS plugins
- [ ] TailwindCSS directives added to main stylesheet
- [ ] Custom colors configured (primary, secondary, accent)
- [ ] Custom fonts configured
- [ ] TailwindCSS working in components
- [ ] Build process includes TailwindCSS compilation

## Technical Details

### TailwindCSS Installation

```bash
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init
```

### TailwindCSS Configuration

**File:** `tailwind.config.js`

```javascript
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,ts}"],
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#f0f9ff",
          500: "#3b82f6",
          900: "#1e3a8a",
        },
        secondary: {
          50: "#fdf4ff",
          500: "#a855f7",
          900: "#581c87",
        },
        accent: {
          50: "#fff7ed",
          500: "#f97316",
          900: "#7c2d12",
        },
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
        display: ["Poppins", "sans-serif"],
      },
    },
  },
  plugins: [require("@tailwindcss/forms")],
};
```

### PostCSS Configuration

**File:** `postcss.config.js`

```javascript
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};
```

### Main Stylesheet

**File:** `src/styles/styles.scss`

```scss
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  body {
    @apply bg-gray-900 text-white;
  }
}
```

## Related Documentation

- [Component Design](https://github.com/Buffden/battle-arena/blob/main/docs/02-ARCHITECTURE/HIGH_LEVEL_DESIGN/03-COMPONENT_DESIGN.md) – Styling approach

## Labels

phase:frontend, frontend, task, priority:high

## Milestone

Phase 7: Frontend

```

#### Subtask: TASK-7-1-3: Install and integrate Phaser 3
```

Title: TASK-7-1-3: Install and integrate Phaser 3

Description:

## Story

Related to #X (STORY-7-1 issue number)

## Epic

Related to #X (PHASE-7 issue number)

## Description

Install Phaser 3 game framework and create a basic game scene service that can be used for the game arena. The integration must include Phaser configuration, scene management, and a basic test scene to verify the setup works correctly.

## Acceptance Criteria

- [ ] Phaser 3 installed via npm
- [ ] Phaser types installed (@types/phaser or phaser types included)
- [ ] Game service created for Phaser initialization
- [ ] Basic game scene created and rendering
- [ ] Canvas element integrated in Angular component
- [ ] Phaser configuration set up correctly
- [ ] Scene switching mechanism implemented
- [ ] Basic test scene renders successfully

## Technical Details

### Phaser Installation

```bash
npm install phaser
npm install -D @types/phaser
```

### Game Service Structure

**File:** `src/app/services/game.service.ts`

```typescript
import { Injectable } from "@angular/core";
import * as Phaser from "phaser";

@Injectable({
  providedIn: "root",
})
export class GameService {
  private game: Phaser.Game | null = null;

  createGame(config: Phaser.Types.Core.GameConfig): Phaser.Game {
    this.game = new Phaser.Game(config);
    return this.game;
  }

  getGame(): Phaser.Game | null {
    return this.game;
  }

  destroyGame(): void {
    if (this.game) {
      this.game.destroy(true);
      this.game = null;
    }
  }
}
```

### Basic Game Scene

**File:** `src/app/pages/arena/scenes/test-scene.ts`

```typescript
import { Scene } from "phaser";

export class TestScene extends Scene {
  constructor() {
    super({ key: "TestScene" });
  }

  create(): void {
    this.add
      .text(400, 300, "Phaser 3 is working!", {
        fontSize: "32px",
        color: "#ffffff",
      })
      .setOrigin(0.5);
  }
}
```

### Phaser Configuration

**File:** `src/app/pages/arena/arena.component.ts`

```typescript
import { Component, OnInit, OnDestroy } from "@angular/core";
import { GameService } from "../../services/game.service";
import { TestScene } from "./scenes/test-scene";

@Component({
  selector: "app-arena",
  templateUrl: "./arena.component.html",
  styleUrls: ["./arena.component.scss"],
})
export class ArenaComponent implements OnInit, OnDestroy {
  constructor(private gameService: GameService) {}

  ngOnInit(): void {
    const config: Phaser.Types.Core.GameConfig = {
      type: Phaser.AUTO,
      width: 800,
      height: 600,
      parent: "game-container",
      scene: [TestScene],
      physics: {
        default: "arcade",
        arcade: {
          gravity: { y: 300 },
          debug: false,
        },
      },
    };

    this.gameService.createGame(config);
  }

  ngOnDestroy(): void {
    this.gameService.destroyGame();
  }
}
```

## Related Documentation

- [Frontend Components LLD](https://github.com/Buffden/battle-arena/blob/main/docs/02-ARCHITECTURE/LOW_LEVEL_DESIGN/FRONTEND/FRONTEND_COMPONENTS.md) – GameService (section 3.2)
- [Component Design](https://github.com/Buffden/battle-arena/blob/main/docs/02-ARCHITECTURE/HIGH_LEVEL_DESIGN/03-COMPONENT_DESIGN.md) – Game rendering (section 1.1)

## Labels

phase:frontend, frontend, task, priority:high

## Milestone

Phase 7: Frontend

```

#### Subtask: TASK-7-1-4: Set up base modules, routing, and layout
```

Title: TASK-7-1-4: Set up base modules, routing, and layout

Description:

## Story

Related to #X (STORY-7-1 issue number)

## Epic

Related to #X (PHASE-7 issue number)

## Description

Create base module structure, configure Angular routing for all feature modules, and create base layout component with navigation. The routing must include lazy loading for feature modules, route guards placeholder, and proper navigation structure.

## Acceptance Criteria

- [ ] Feature modules created (auth, dashboard, hero-selection, matchmaking, arena-selection, weapon-selection, arena, profile, leaderboard)
- [ ] Shared module created for reusable components
- [ ] Core module created for singleton services
- [ ] Routing configured with lazy loading for all modules
- [ ] Base layout component created
- [ ] Navigation component created
- [ ] Route guards directory structure created
- [ ] Interceptors directory structure created
- [ ] Models directory structure created
- [ ] Routes configured in `app-routing.module.ts`
- [ ] Navigation links wired up correctly

## Technical Details

### Routing Configuration

**File:** `src/app/app-routing.module.ts`

```typescript
import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

const routes: Routes = [
  {
    path: "",
    redirectTo: "/dashboard",
    pathMatch: "full",
  },
  {
    path: "auth",
    loadChildren: () => import("./auth/auth.module").then((m) => m.AuthModule),
  },
  {
    path: "dashboard",
    loadChildren: () => import("./dashboard/dashboard.module").then((m) => m.DashboardModule),
  },
  {
    path: "hero-selection",
    loadChildren: () => import("./hero-selection/hero-selection.module").then((m) => m.HeroSelectionModule),
  },
  {
    path: "matchmaking",
    loadChildren: () => import("./matchmaking/matchmaking.module").then((m) => m.MatchmakingModule),
  },
  {
    path: "arena-selection",
    loadChildren: () => import("./arena-selection/arena-selection.module").then((m) => m.ArenaSelectionModule),
  },
  {
    path: "weapon-selection",
    loadChildren: () => import("./weapon-selection/weapon-selection.module").then((m) => m.WeaponSelectionModule),
  },
  {
    path: "arena",
    loadChildren: () => import("./pages/arena/arena.module").then((m) => m.ArenaModule),
  },
  {
    path: "profile",
    loadChildren: () => import("./profile/profile.module").then((m) => m.ProfileModule),
  },
  {
    path: "leaderboard",
    loadChildren: () => import("./leaderboard/leaderboard.module").then((m) => m.LeaderboardModule),
  },
  {
    path: "**",
    redirectTo: "/dashboard",
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
```

### Base Layout Component

**File:** `src/app/shared/components/layout/layout.component.ts`

```typescript
import { Component } from "@angular/core";

@Component({
  selector: "app-layout",
  templateUrl: "./layout.component.html",
  styleUrls: ["./layout.component.scss"],
})
export class LayoutComponent {
  // Layout component with navigation
}
```

## Related Documentation

- [Frontend Components LLD](https://github.com/Buffden/battle-arena/blob/main/docs/02-ARCHITECTURE/LOW_LEVEL_DESIGN/FRONTEND/FRONTEND_COMPONENTS.md) – Component structure (section 4)
- [Component Design](https://github.com/Buffden/battle-arena/blob/main/docs/02-ARCHITECTURE/HIGH_LEVEL_DESIGN/03-COMPONENT_DESIGN.md) – Angular application structure (section 1.1)

## Labels

phase:frontend, frontend, task, priority:high

## Milestone

Phase 7: Frontend

```

---

### STORY-7-2: Authentication UI (US-001, US-002, US-003)

#### Issue Template:

```

Title: STORY-7-2: Create authentication UI (login, register, logout)

Description:

## Epic

Related to #X (PHASE-7 issue number)

## User Story

As a user, I want to register, login, and logout so that I can access the Battle Arena application securely.

## Description

Implement comprehensive authentication UI with registration, login, and logout functionality integrated with Auth Service. The implementation must include reactive forms with validation, error handling, JWT token management, route guards for protected routes, and secure token storage. The authentication flow must support standard username/password authentication and Google OAuth integration, with proper state management and user session handling.

## Acceptance Criteria

- [ ] Registration page with reactive form and validation
- [ ] Login page with reactive form and error handling
- [ ] Google OAuth login button and flow
- [ ] Logout functionality clears JWT and user state
- [ ] Auth guard protects authenticated routes
- [ ] JWT stored securely (localStorage or HttpOnly cookie per architecture)
- [ ] AuthService implements all authentication methods
- [ ] HTTP interceptor adds JWT to requests
- [ ] User state managed via RxJS BehaviorSubject
- [ ] Form validation for email, password, username
- [ ] Error messages displayed for failed authentication
- [ ] Loading states during authentication requests
- [ ] Redirect to dashboard after successful login
- [ ] Redirect to login after logout
- [ ] Unit tests for AuthService with 80%+ coverage
- [ ] Unit tests for AuthGuard

## Technical Details

### AuthService Structure

Based on [Frontend Components LLD](https://github.com/Buffden/battle-arena/blob/main/docs/02-ARCHITECTURE/LOW_LEVEL_DESIGN/FRONTEND/FRONTEND_COMPONENTS.md) section 3.1:

**File:** `src/app/services/auth.service.ts`

```typescript
export class AuthService {
  // Login user
  login(username: string, password: string): Observable<AuthResponse>;

  // Register user
  register(userData: RegisterRequest): Observable<AuthResponse>;

  // Login with Google OAuth
  loginWithGoogle(authorizationCode: string): Observable<AuthResponse>;

  // Logout user
  logout(): void;

  // Get JWT token
  getToken(): string | null;

  // Check if user is authenticated
  isAuthenticated(): boolean;

  // Get current user
  getUser(): Observable<User | null>;
}
```

### Design Patterns Applied

Based on [Frontend Components LLD](https://github.com/Buffden/battle-arena/blob/main/docs/02-ARCHITECTURE/LOW_LEVEL_DESIGN/FRONTEND/FRONTEND_COMPONENTS.md) section 1.3:

- **Singleton Pattern**: AuthService provided in root
- **Observer Pattern**: RxJS BehaviorSubject for user state
- **Guard Pattern**: AuthGuard for route protection
- **Interceptor Pattern**: HTTP interceptor for JWT injection

### Authentication Flow

1. User submits login/register form
2. AuthService calls Auth Service API
3. JWT token received and stored
4. User state updated via BehaviorSubject
5. Redirect to dashboard
6. AuthGuard checks authentication on protected routes

## Related Documentation

- [Frontend Components LLD](https://github.com/Buffden/battle-arena/blob/main/docs/02-ARCHITECTURE/LOW_LEVEL_DESIGN/FRONTEND/FRONTEND_COMPONENTS.md) – AuthService (section 3.1)
- [Auth Service LLD](https://github.com/Buffden/battle-arena/blob/main/docs/02-ARCHITECTURE/LOW_LEVEL_DESIGN/SERVICES/AUTH_SERVICE.md) – Authentication API
- [System Architecture](https://github.com/Buffden/battle-arena/blob/main/docs/02-ARCHITECTURE/HIGH_LEVEL_DESIGN/02-SYSTEM_ARCHITECTURE.md) – Authentication flow
- **Frontend Components Class Diagram:** `https://github.com/Buffden/battle-arena/blob/main/docs/03-DIAGRAMS/class-diagrams/frontend-components.puml`

## Labels

phase:frontend, frontend, feature, priority:high

## Milestone

Phase 7: Frontend

```

#### Subtask: TASK-7-2-1: Create registration component and form
```

Title: TASK-7-2-1: Create registration component and form

Description:

## Story

Related to #X (STORY-7-2 issue number)

## Epic

Related to #X (PHASE-7 issue number)

## Description

Create registration component with reactive form, validation rules, error handling, and integration with AuthService. The form must validate email format, password strength, username requirements, and display appropriate error messages.

## Acceptance Criteria

- [ ] Registration component created
- [ ] Reactive form with FormBuilder
- [ ] Email validation (format, required)
- [ ] Password validation (min length, required)
- [ ] Username validation (min length, required, alphanumeric)
- [ ] Form submission handler
- [ ] Error message display
- [ ] Loading state during submission
- [ ] Success redirect to login or dashboard
- [ ] Unit tests for component

## Technical Details

### Registration Component

**File:** `src/app/auth/components/register/register.component.ts`

```typescript
import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { AuthService } from "../../../services/auth.service";

@Component({
  selector: "app-register",
  templateUrl: "./register.component.html",
  styleUrls: ["./register.component.scss"],
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;
  errorMessage: string | null = null;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
  ) {
    this.registerForm = this.fb.group({
      username: ["", [Validators.required, Validators.minLength(3), Validators.pattern(/^[a-zA-Z0-9]+$/)]],
      email: ["", [Validators.required, Validators.email]],
      password: ["", [Validators.required, Validators.minLength(8)]],
    });
  }

  ngOnInit(): void {}

  onSubmit(): void {
    if (this.registerForm.valid) {
      this.loading = true;
      this.errorMessage = null;

      this.authService.register(this.registerForm.value).subscribe({
        next: (response) => {
          this.loading = false;
          this.router.navigate(["/auth/login"]);
        },
        error: (error) => {
          this.loading = false;
          this.errorMessage = error.error?.message || "Registration failed";
        },
      });
    }
  }
}
```

## Related Documentation

- [Frontend Components LLD](https://github.com/Buffden/battle-arena/blob/main/docs/02-ARCHITECTURE/LOW_LEVEL_DESIGN/FRONTEND/FRONTEND_COMPONENTS.md) – AuthService (section 3.1)

## Labels

phase:frontend, frontend, task, priority:high

## Milestone

Phase 7: Frontend

```

#### Subtask: TASK-7-2-2: Create login component and form
```

Title: TASK-7-2-2: Create login component and form

Description:

## Story

Related to #X (STORY-7-2 issue number)

## Epic

Related to #X (PHASE-7 issue number)

## Description

Create login component with reactive form, validation, error handling, Google OAuth integration, and integration with AuthService. The form must handle both standard login and Google OAuth flows.

## Acceptance Criteria

- [ ] Login component created
- [ ] Reactive form with username/email and password
- [ ] Form validation (required fields)
- [ ] Google OAuth button and flow
- [ ] Form submission handler
- [ ] Error message display
- [ ] Loading state during submission
- [ ] Success redirect to dashboard
- [ ] Unit tests for component

## Technical Details

### Login Component

**File:** `src/app/auth/components/login/login.component.ts`

```typescript
import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { AuthService } from "../../../services/auth.service";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"],
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  errorMessage: string | null = null;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
  ) {
    this.loginForm = this.fb.group({
      username: ["", [Validators.required]],
      password: ["", [Validators.required]],
    });
  }

  ngOnInit(): void {}

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.loading = true;
      this.errorMessage = null;

      this.authService.login(this.loginForm.value.username, this.loginForm.value.password).subscribe({
        next: (response) => {
          this.loading = false;
          this.router.navigate(["/dashboard"]);
        },
        error: (error) => {
          this.loading = false;
          this.errorMessage = error.error?.message || "Login failed";
        },
      });
    }
  }

  loginWithGoogle(): void {
    this.loading = true;
    // Google OAuth flow
    window.location.href = "/api/auth/google";
  }
}
```

## Related Documentation

- [Frontend Components LLD](https://github.com/Buffden/battle-arena/blob/main/docs/02-ARCHITECTURE/LOW_LEVEL_DESIGN/FRONTEND/FRONTEND_COMPONENTS.md) – AuthService (section 3.1)

## Labels

phase:frontend, frontend, task, priority:high

## Milestone

Phase 7: Frontend

```

#### Subtask: TASK-7-2-3: Implement AuthService with HTTP calls to Auth Service
```

Title: TASK-7-2-3: Implement AuthService with HTTP calls to Auth Service

Description:

## Story

Related to #X (STORY-7-2 issue number)

## Epic

Related to #X (PHASE-7 issue number)

## Description

Implement AuthService with HTTP calls to Auth Service API, JWT token management, user state management via RxJS BehaviorSubject, and error handling. The service must handle login, registration, Google OAuth, logout, and provide authentication state to components.

## Acceptance Criteria

- [ ] AuthService created with all required methods
- [ ] HTTP calls to Auth Service API implemented
- [ ] JWT token stored in localStorage (or HttpOnly cookie)
- [ ] User state managed via BehaviorSubject
- [ ] Login method implemented
- [ ] Register method implemented
- [ ] Google OAuth method implemented
- [ ] Logout method implemented
- [ ] getToken() method implemented
- [ ] isAuthenticated() method implemented
- [ ] getUser() Observable implemented
- [ ] Error handling for API calls
- [ ] Unit tests for AuthService

## Technical Details

### AuthService Implementation

**File:** `src/app/services/auth.service.ts`

```typescript
import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { BehaviorSubject, Observable, tap } from "rxjs";
import { environment } from "../../../environments/environment";
import { User, AuthResponse, RegisterRequest } from "../../models/auth.models";

@Injectable({
  providedIn: "root",
})
export class AuthService {
  private apiUrl = `${environment.authServiceUrl}/api/auth`;
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) {
    // Load user from token on service initialization
    const token = this.getToken();
    if (token) {
      // Decode token and set user (or fetch user from API)
      this.loadUserFromToken(token);
    }
  }

  login(username: string, password: string): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(`${this.apiUrl}/login`, {
        username,
        password,
      })
      .pipe(
        tap((response) => {
          this.setToken(response.token);
          this.setUser(response.user);
        }),
      );
  }

  register(userData: RegisterRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/register`, userData);
  }

  loginWithGoogle(authorizationCode: string): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(`${this.apiUrl}/google`, {
        authorizationCode,
      })
      .pipe(
        tap((response) => {
          this.setToken(response.token);
          this.setUser(response.user);
        }),
      );
  }

  logout(): void {
    localStorage.removeItem("token");
    this.currentUserSubject.next(null);
  }

  getToken(): string | null {
    return localStorage.getItem("token");
  }

  isAuthenticated(): boolean {
    const token = this.getToken();
    if (!token) return false;
    // Check token expiration
    return !this.isTokenExpired(token);
  }

  getUser(): Observable<User | null> {
    return this.currentUser$;
  }

  private setToken(token: string): void {
    localStorage.setItem("token", token);
  }

  private setUser(user: User): void {
    this.currentUserSubject.next(user);
  }

  private loadUserFromToken(token: string): void {
    // Decode JWT or fetch user from API
    // Implementation depends on token structure
  }

  private isTokenExpired(token: string): boolean {
    // Decode JWT and check expiration
    // Implementation depends on JWT structure
    return false;
  }
}
```

## Related Documentation

- [Frontend Components LLD](https://github.com/Buffden/battle-arena/blob/main/docs/02-ARCHITECTURE/LOW_LEVEL_DESIGN/FRONTEND/FRONTEND_COMPONENTS.md) – AuthService (section 3.1)
- [Auth Service LLD](https://github.com/Buffden/battle-arena/blob/main/docs/02-ARCHITECTURE/LOW_LEVEL_DESIGN/SERVICES/AUTH_SERVICE.md) – Authentication API endpoints

## Labels

phase:frontend, frontend, task, priority:high

## Milestone

Phase 7: Frontend

```

#### Subtask: TASK-7-2-4: Implement JWT storage and AuthGuard
```

Title: TASK-7-2-4: Implement JWT storage and AuthGuard

Description:

## Story

Related to #X (STORY-7-2 issue number)

## Epic

Related to #X (PHASE-7 issue number)

## Description

Implement HTTP interceptor for JWT injection, AuthGuard for route protection, and secure JWT storage mechanism. The interceptor must add JWT to all HTTP requests, the guard must protect authenticated routes, and token storage must follow security best practices.

## Acceptance Criteria

- [ ] HTTP interceptor created for JWT injection
- [ ] Interceptor adds Authorization header to requests
- [ ] Interceptor handles 401 errors and redirects to login
- [ ] AuthGuard created for route protection
- [ ] Guard checks authentication state
- [ ] Guard redirects unauthenticated users to login
- [ ] JWT storage mechanism implemented securely
- [ ] Token expiration handling
- [ ] Unit tests for interceptor
- [ ] Unit tests for guard

## Technical Details

### HTTP Interceptor

**File:** `src/app/interceptors/auth.interceptor.ts`

```typescript
import { Injectable } from "@angular/core";
import { HttpInterceptor, HttpRequest, HttpHandler, HttpErrorResponse } from "@angular/common/http";
import { Observable, throwError } from "rxjs";
import { catchError } from "rxjs/operators";
import { Router } from "@angular/router";
import { AuthService } from "../services/auth.service";

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(
    private authService: AuthService,
    private router: Router,
  ) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<any> {
    const token = this.authService.getToken();

    if (token) {
      req = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`,
        },
      });
    }

    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          this.authService.logout();
          this.router.navigate(["/auth/login"]);
        }
        return throwError(() => error);
      }),
    );
  }
}
```

### AuthGuard

**File:** `src/app/guards/auth.guard.ts`

```typescript
import { Injectable } from "@angular/core";
import { CanActivate, Router } from "@angular/router";
import { AuthService } from "../services/auth.service";

@Injectable({
  providedIn: "root",
})
export class AuthGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router,
  ) {}

  canActivate(): boolean {
    if (this.authService.isAuthenticated()) {
      return true;
    } else {
      this.router.navigate(["/auth/login"]);
      return false;
    }
  }
}
```

## Related Documentation

- [Frontend Components LLD](https://github.com/Buffden/battle-arena/blob/main/docs/02-ARCHITECTURE/LOW_LEVEL_DESIGN/FRONTEND/FRONTEND_COMPONENTS.md) – Guards and Interceptors (sections 1.2, 5.5)

## Labels

phase:frontend, frontend, task, priority:high

## Milestone

Phase 7: Frontend

```

---

### STORY-7-3: Dashboard UI

#### Issue Template:

```

Title: STORY-7-3: Create main dashboard

Description:

## Epic

Related to #X (PHASE-7 issue number)

## User Story

As a user, I want a dashboard with navigation to all features and my profile summary so that I can easily access all game features.

## Description

Create comprehensive dashboard page with navigation tiles/cards to all major flows (hero selection, matchmaking, arena selection, weapon selection, game arena, profile, leaderboard), user summary card displaying rank, score, and statistics, and responsive layout. The dashboard must integrate with ProfileService to fetch user data, provide quick access to all features, and display user statistics prominently.

## Acceptance Criteria

- [ ] Dashboard component created with responsive layout
- [ ] Navigation tiles/cards for all feature pages (hero-selection, matchmaking, arena-selection, weapon-selection, arena, profile, leaderboard)
- [ ] User summary card displayed with rank, score, wins, losses
- [ ] ProfileService integration to fetch user data
- [ ] Loading state while fetching user data
- [ ] Error handling for failed data fetch
- [ ] Responsive design for mobile and desktop
- [ ] Navigation cards styled with TailwindCSS
- [ ] User avatar displayed in summary card
- [ ] Quick stats displayed (matches played, win rate)
- [ ] Unit tests for dashboard component

## Technical Details

### Dashboard Component Structure

Based on [Component Design](https://github.com/Buffden/battle-arena/blob/main/docs/02-ARCHITECTURE/HIGH_LEVEL_DESIGN/03-COMPONENT_DESIGN.md) section 1.1:

**File:** `src/app/dashboard/components/dashboard/dashboard.component.ts`

```typescript
import { Component, OnInit } from "@angular/core";
import { ProfileService } from "../../../services/profile.service";
import { AuthService } from "../../../services/auth.service";
import { Observable } from "rxjs";
import { User, Profile } from "../../../models/profile.models";

@Component({
  selector: "app-dashboard",
  templateUrl: "./dashboard.component.html",
  styleUrls: ["./dashboard.component.scss"],
})
export class DashboardComponent implements OnInit {
  user$: Observable<User | null>;
  profile$: Observable<Profile | null>;
  loading = false;
  error: string | null = null;

  constructor(
    private profileService: ProfileService,
    private authService: AuthService,
  ) {
    this.user$ = this.authService.getUser();
    this.profile$ = this.profileService.getProfile();
  }

  ngOnInit(): void {
    this.loading = true;
    this.profileService.getProfile().subscribe({
      next: () => {
        this.loading = false;
      },
      error: (error) => {
        this.loading = false;
        this.error = "Failed to load profile";
      },
    });
  }
}
```

### Design Patterns Applied

- **Component Pattern**: Dashboard component for UI
- **Observer Pattern**: RxJS Observables for profile data
- **Service Pattern**: ProfileService for data fetching

## Related Documentation

- [Frontend Components LLD](https://github.com/Buffden/battle-arena/blob/main/docs/02-ARCHITECTURE/LOW_LEVEL_DESIGN/FRONTEND/FRONTEND_COMPONENTS.md) – Component structure (section 4)
- [Component Design](https://github.com/Buffden/battle-arena/blob/main/docs/02-ARCHITECTURE/HIGH_LEVEL_DESIGN/03-COMPONENT_DESIGN.md) – Dashboard structure
- [Profile Service LLD](https://github.com/Buffden/battle-arena/blob/main/docs/02-ARCHITECTURE/LOW_LEVEL_DESIGN/SERVICES/PROFILE_SERVICE.md) – Profile API

## Labels

phase:frontend, frontend, feature, priority:medium

## Milestone

Phase 7: Frontend

```

#### Subtask: TASK-7-3-1: Create dashboard and navigation components
```

Title: TASK-7-3-1: Create dashboard and navigation components

Description:

## Story

Related to #X (STORY-7-3 issue number)

## Epic

Related to #X (PHASE-7 issue number)

## Description

Create dashboard component with navigation tiles/cards, user summary card, and responsive layout using TailwindCSS. The component must display navigation to all features and user statistics.

## Acceptance Criteria

- [ ] Dashboard component created
- [ ] Navigation tiles/cards created for all features
- [ ] User summary card component created
- [ ] Responsive layout implemented
- [ ] TailwindCSS styling applied
- [ ] Navigation cards link to correct routes
- [ ] User summary displays rank, score, statistics
- [ ] Loading state displayed
- [ ] Error state handled

## Technical Details

### Dashboard Template

**File:** `src/app/dashboard/components/dashboard/dashboard.component.html`

```html
<div class="container mx-auto px-4 py-8">
  <!-- User Summary Card -->
  <div class="bg-gray-800 rounded-lg p-6 mb-8" *ngIf="profile$ | async as profile">
    <div class="flex items-center space-x-4">
      <img [src]="profile.avatar" alt="Avatar" class="w-16 h-16 rounded-full" />
      <div>
        <h2 class="text-2xl font-bold">{{ profile.displayName }}</h2>
        <p class="text-gray-400">Rank: {{ profile.rankTier }}</p>
        <p class="text-gray-400">Score: {{ profile.globalScore }}</p>
      </div>
    </div>
  </div>

  <!-- Navigation Cards -->
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    <a routerLink="/hero-selection" class="bg-primary-500 rounded-lg p-6 hover:bg-primary-600 transition">
      <h3 class="text-xl font-bold mb-2">Hero Selection</h3>
      <p class="text-gray-200">Select your heroes</p>
    </a>
    <!-- More navigation cards... -->
  </div>
</div>
```

## Related Documentation

- [Component Design](https://github.com/Buffden/battle-arena/blob/main/docs/02-ARCHITECTURE/HIGH_LEVEL_DESIGN/03-COMPONENT_DESIGN.md) – Dashboard structure

## Labels

phase:frontend, frontend, task, priority:medium

## Milestone

Phase 7: Frontend

```

#### Subtask: TASK-7-3-2: Wire up routes and links to feature modules
```

Title: TASK-7-3-2: Wire up routes and links to feature modules

Description:

## Story

Related to #X (STORY-7-3 issue number)

## Epic

Related to #X (PHASE-7 issue number)

## Description

Wire up navigation links in dashboard to all feature modules, ensure routes are correctly configured, and add navigation guards where necessary.

## Acceptance Criteria

- [ ] Navigation links wired to all feature routes
- [ ] Routes verified and working
- [ ] Navigation guards applied where needed
- [ ] Links styled consistently
- [ ] Navigation tested for all routes

## Technical Details

### Navigation Links

All navigation cards should link to:

- `/hero-selection` - Hero Selection
- `/matchmaking` - Matchmaking Queue
- `/arena-selection` - Arena Selection
- `/weapon-selection` - Weapon Selection
- `/arena` - Game Arena
- `/profile` - Profile
- `/leaderboard` - Leaderboard

## Related Documentation

- [Component Design](https://github.com/Buffden/battle-arena/blob/main/docs/02-ARCHITECTURE/HIGH_LEVEL_DESIGN/03-COMPONENT_DESIGN.md) – Routing structure

## Labels

phase:frontend, frontend, task, priority:medium

## Milestone

Phase 7: Frontend

```

---

### STORY-7-4: Hero Selection UI (US-009, US-010)

#### Issue Template:

```

Title: STORY-7-4: Create hero selection UI with multiple selection

Description:

## User Story

As a user, I want to select multiple heroes before matchmaking so that I can increase my match chances.

## Acceptance Criteria

- [ ] Hero selection page
- [ ] Multiple hero selection with visual feedback
- [ ] Confirmation and submission to Matchmaking Service

## Labels

phase:frontend, frontend, feature, priority:medium

## Milestone

Phase 7: Frontend

```

#### Subtask: TASK-7-4-1: Create hero selection and hero card components
#### Subtask: TASK-7-4-2: Integrate with Matchmaking Service via Socket.io

---

### STORY-7-5: Matchmaking Queue UI (US-012, US-013, US-016)

#### Issue Template:

```

Title: STORY-7-5: Create matchmaking queue UI with status display

Description:

## User Story

As a user, I want to join and leave the queue and see my position and ETA.

## Acceptance Criteria

- [ ] Join/leave queue buttons
- [ ] Real-time queue position and wait time display
- [ ] Loading and error states handled

## Labels

phase:frontend, frontend, feature, priority:high

## Milestone

Phase 7: Frontend

```

#### Subtask: TASK-7-5-1: Create matchmaking component
#### Subtask: TASK-7-5-2: Integrate Socket.io events for join/leave/status

---

### STORY-7-6: Game Arena UI with Phaser 3

#### Issue Template:

```

Title: STORY-7-6: Create game arena with Phaser 3 (turn-based gameplay, movement, projectiles)

Description:

## User Story

As a player, I want a visual game arena to play turn-based battles.

## Acceptance Criteria

- [ ] Game arena component
- [ ] Phaser scene with hero sprites, projectiles, and terrain
- [ ] Turn indicators, timers, and HP bars
- [ ] Real-time updates from Game Engine Service

## Labels

phase:frontend, frontend, feature, priority:high

## Milestone

Phase 7: Frontend

```

#### Subtask: TASK-7-6-1: Set up Phaser game scene and canvas
#### Subtask: TASK-7-6-2: Integrate with Game Engine Service via Socket.io
#### Subtask: TASK-7-6-3: Render hero movement, projectiles, HP, and turn timers

---

### STORY-7-7: Profile UI

#### Issue Template:

```

Title: STORY-7-7: Create profile page with statistics and rank display

Description:

## User Story

As a user, I want to view my profile statistics and rank.

## Acceptance Criteria

- [ ] Profile page and service created
- [ ] Profile data retrieved from Profile Service
- [ ] Statistics and rank tier displayed
- [ ] Profile update (display name/avatar) integrated

## Labels

phase:frontend, frontend, feature, priority:medium

## Milestone

Phase 7: Frontend

```

#### Subtask: TASK-7-7-1: Create profile component and service
#### Subtask: TASK-7-7-2: Integrate Profile Service API

---

### STORY-7-8: Leaderboard UI

#### Issue Template:

```

Title: STORY-7-8: Create leaderboard page with filtering

Description:

## User Story

As a user, I want to view and filter leaderboards by rank and stats.

## Acceptance Criteria

- [ ] Leaderboard page created
- [ ] Data loaded from Leaderboard Service
- [ ] Filtering controls (region, hero, win%, weapons)
- [ ] Rank tier and stats displayed

## Labels

phase:frontend, frontend, feature, priority:medium

## Milestone

Phase 7: Frontend

```

#### Subtask: TASK-7-8-1: Create leaderboard component and service
#### Subtask: TASK-7-8-2: Implement filtering UI and integration with backend


```
