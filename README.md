# Biome Rules Voting Platform

A real-time voting platform for your team to decide which Biome linting rules to adopt. Built with React, TypeScript, Convex, and shadcn/ui.

## Features

- 🎭 **Netflix-style Profile Selection** - Choose from 5 team member profiles
- 🗳️ **Real-time Voting** - Vote thumbs up/down on each rule with live updates
- 🔍 **Advanced Filtering** - Search, filter by category, recommended status
- 📊 **Vote Tracking** - See who voted what with emoji avatars
- 🎨 **Modern UI** - Built with shadcn/ui and Tailwind CSS
- ⚡ **Fast Development** - Powered by Vite and Bun

## Team Members

- 👨‍💻 **Nishanth**
- 👨‍🔬 **Shreeyansh**
- 👨‍🎨 **Vikalp**
- 👨‍🚀 **Neeraj**
- 👨‍🏫 **Joshua**

## Setup Instructions

1. **Install Dependencies**

   ```bash
   bun install
   ```

2. **Set up Convex**

   ```bash
   # Start Convex development server
   bunx convex dev

   # This will:
   # - Create a new Convex project (if first time)
   # - Generate your deployment URL
   # - Start the development server
   ```

3. **Configure Environment**

   ```bash
   # Create .env.local and add your Convex URL
   echo "VITE_CONVEX_URL=https://your-deployment-url.convex.cloud" > .env.local
   ```

4. **Import Rules Data**
   Make sure your `biome-rules.json` data is imported into the Convex `rules` table.

5. **Start Development Server**
   ```bash
   bun dev
   ```

## Usage

1. **Select Profile**: Choose your team member profile from the Netflix-style selection screen
2. **Browse Rules**: Search and filter through Biome linting rules
3. **Vote**: Use thumbs up/down buttons to vote on each rule
4. **Track Progress**: See real-time vote counts and who voted what

## Technology Stack

- **Frontend**: React 19 + TypeScript + Vite
- **Backend**: Convex (real-time database & API)
- **UI Components**: shadcn/ui + Tailwind CSS
- **Icons**: Lucide React
- **Routing**: React Router DOM
- **Runtime**: Bun
- **Linting**: Biome

## Project Structure

```
src/
├── components/
│   ├── ui/           # shadcn/ui components
│   ├── ProfileSelection.tsx
│   ├── RulesPage.tsx
│   ├── Navbar.tsx
│   └── RuleCard.tsx
├── types/
│   └── user.ts       # User types and data
└── App.tsx

convex/
├── schema.ts         # Database schema
└── rules.ts          # Queries and mutations
```

## Database Schema

- **rules**: Biome rule data (name, description, category, etc.)
- **votes**: User votes (ruleId, userId, voteType)

## Available Scripts

- `bun dev` - Start development server
- `bun build` - Build for production
- `bun preview` - Preview production build
- `bunx convex dev` - Start Convex development server
- `bun biome` - Run Biome linter/formatter
