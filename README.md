# Vibe App Store

A Next.js application that generates AI-powered app ideas with custom thumbnails and interactive demos, styled with an iOS 6-inspired interface.

## Features

- **AI App Generation**: Generates 15 unique app concepts using Google's Gemini 2.5 Flash via OpenRouter
- **Dynamic Thumbnails**: Creates custom app icons using Replicate's Flux-Schnell image generation model
- **Interactive Demos**: Generates working app prototypes using Vercel's V0 SDK
- **Local Caching**: Stores generated apps and demos in browser localStorage for fast reloading
- **iOS 6 UI**: Retro-inspired skeuomorphic design with glossy effects and gradients

## How It Works

### 1. App Idea Generation (`/api/generate-app-idea`)
- Uses OpenRouter's API with Gemini 2.5 Flash to generate app concepts
- Requests 15 unique app ideas with names, descriptions, and image prompts
- Returns structured JSON data for each app concept

### 2. Thumbnail Creation (`/api/generate-thumbnail`)
- Leverages Replicate's Flux-Schnell model for fast image generation
- Creates iOS 6-style skeuomorphic app icons
- Generates images asynchronously as placeholders load
- Caches results in localStorage

### 3. Interactive Demo Generation (`/api/generate-v0-app`)
- Uses Vercel's V0 SDK to create functional app prototypes
- Polls the V0 API for up to 3 minutes to retrieve the demo URL
- Falls back to web URL if generation times out
- Caches successful demo URLs for instant loading

### 4. User Interface
- **Home Page**: Grid of 15 generated apps with thumbnail icons
- **App Detail Page**: Full-screen iframe displaying the generated V0 demo
- **Refresh Button**: Clears cache and generates a new set of apps
- **iOS 6 Styling**: Gradient backgrounds, glossy overlays, and retro UI elements

## Setup

### Prerequisites
- Node.js 20+
- API keys for:
  - [Replicate](https://replicate.com/) (for image generation)
  - [OpenRouter](https://openrouter.ai/) (for LLM access)
  - [Vercel V0](https://v0.dev/) (for app demos)

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd vibe-store
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env.local` file with your API keys:
```bash
REPLICATE_API_TOKEN=your_replicate_token
OPENROUTER_API_KEY=your_openrouter_key
V0_API_KEY=your_v0_api_key
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

```
vibe-store/
├── app/
│   ├── api/
│   │   ├── generate-app-idea/route.ts    # LLM-powered app concept generation
│   │   ├── generate-thumbnail/route.ts   # Image generation for app icons
│   │   ├── generate-v0-app/route.ts      # V0 demo creation
│   │   ├── get-v0-chat/route.ts          # Retrieve V0 chat data
│   │   └── get-v0-messages/route.ts      # Fetch V0 messages
│   ├── app/[id]/page.tsx                 # Individual app detail page
│   ├── layout.tsx                        # Root layout
│   └── page.tsx                          # Home page with app grid
├── public/                               # Static assets
├── .env.example                          # Example environment variables
└── package.json                          # Dependencies
```

## Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/) (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **AI/ML Services**:
  - OpenRouter (Gemini 2.5 Flash)
  - Replicate (Flux-Schnell)
  - Vercel V0 SDK
- **State Management**: React Hooks + localStorage

## Development

```bash
# Development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linter
npm run lint
```

## Deployment

The easiest way to deploy is using [Vercel](https://vercel.com):

1. Push your code to GitHub
2. Import the repository in Vercel
3. Add your environment variables in Vercel's project settings
4. Deploy!

## License

MIT

## Credits

Built with Next.js, powered by AI from OpenRouter, Replicate, and Vercel V0.
