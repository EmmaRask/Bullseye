# Bullseye 🎯

Bullseye is a western-themed target shooting game built for the Loopland/Tivoli ecosystem. Players aim and shoot moving targets to collect points, win payouts, and earn collectible stamps.

The project was developed as part of a school group assignment focused on fullstack game integration, API communication, transactions, and interactive frontend design.

---

# Features

## Gameplay

* Moving crosshair aiming system
* Multiple target sizes with different point values
* Score-based win condition
* Mobile and keyboard controls
* Replay system with discounted replay cost

## Reward System

* Win cash payouts by reaching the score limit
* Earn collectible stamps
* High score leaderboard
* Replay window system for cheaper retries during an active session

## Session Handling

* Game session persistence with sessionStorage
* Resume unfinished sessions
* Protected replay window
* Transaction tracking
* Safe payout handling

## UX Improvements

* Custom western-themed UI
* Styled game preview card
* Clear result messaging
* Replay cooldown protection
* Improved win/loss feedback

---

# Tech Stack

## Frontend

* Next.js 16
* React
* TypeScript
* CSS Modules

## Backend/API Integration

* Loopland Centralbank API
* Tivoli transaction flow
* Supabase leaderboard integration

---

# Game Rules

## Costs & Rewards

* Entry Cost: 2€
* Replay Cost: 1€
* Payout Amount: 4€

## Scoring

| Target | Points |
| ------ | ------ |
| XL     | 10     |
| L      | 20     |
| M      | 30     |
| S      | 40     |
| XS     | 50     |

Players must reach the configured win limit to receive a payout.

---

# Controls

## Mobile

Tap the screen to shoot targets through the moving crosshair.

## Desktop

Use the spacebar or click to shoot while aiming with the moving crosshair.

---

# Replay System

Bullseye includes a replay system that allows players to replay the game for a reduced price during a limited replay window.

### Replay Protection

To prevent abuse:

* Replay is only available for a limited time after starting a session
* Replay access expires automatically
* Replay state resets when quitting the game properly

---

# Installation

## Clone repository

```bash
git clone <repository-url>
```

## Install dependencies

```bash
npm install
```

## Run development server

```bash
npm run dev
```

## Build project

```bash
npm run build
```

---

# Environment Variables

Create a `.env.local` file containing the required API credentials.

Example:

```env
NEXT_PUBLIC_API_URL=
SUPABASE_URL=
SUPABASE_ANON_KEY=
```

---

# Contributors

Developed as a collaborative student project.

Special focus areas included:

* Game logic
* API integration
* Transaction handling
* Replay flow
* UI/UX polish
* Session management

---

# Notes

This project was created for educational purposes as part of a school assignment.

Bullseye integrates with the Loopland/Tivoli ecosystem and follows the provided API requirements for transactions, payouts, and stamps.entation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
