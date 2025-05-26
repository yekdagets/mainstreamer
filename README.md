# Mainstreamer

A modern, responsive video streaming platform built with Next.js 14, TypeScript, and Tailwind CSS. Features YouTube-like functionality with custom UI components, smooth animations, and a discovery shorts experience similar to Tiktok, Shorts, Reels.

## Installation

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```
Open http://localhost:3000 with your browser to see the result.

# 🚀 Features

## Home Page
- Video Grid Layout: Responsive grid displaying popular and recent videos
- Category Filtering: Dynamic category tabs (All, Automotive, Movies, Technology) with video counts
- Hover effect on VideoCard component to see preview of video
- Smooth Animations: Page transitions and component animations using Framer Motion
- Loading States: Simulated loading with branded loading component
- Responsive Design: Optimized for desktop, tablet, and mobile devices

##  Video Player (/watch/[id])
- Full-Featured Player: Custom video player built with ReactPlayer
- Advanced Controls
- Play/Pause with spacebar
- Volume control with up/down arrows
- Seek forward/backward (10s) with arrow keys
- Fullscreen toggle with 'F' key, Mute/unmute with 'M' key
- Like/Unlike videos with 'L' key (stored in localStorage) & Save/Unsave videos with 'S' key (stored in localStorage)
- Custom seek bar with gradient styling
- Video duration and current time display
- Video Information: Title, creator, views, upload date
- Related Videos: "More like this" section with related content, Tags for related video to categorize them
- Responsive Layout: 2/3 video player, 1/3 related videos on desktop

## ✨ Discover Shorts
- Desktop Panel: Side panel (1/3 screen width) that slides in from right
- Mobile Page: Full-screen experience at /watch/discover
- Navigation:
- Desktop: Mouse wheel scrolling (one video per scroll)
- Mobile: Touch gestures (swipe up/down)
- Auto-advance: Videos auto-advance after 10 seconds or completion
- Video Management:
- Only first 10 seconds of each video plays
- Proper audio isolation (no bleeding between videos)
- Smooth spring animations between videos
- Interactive Elements:
- Working seek bar with gradient styling
- Click video title to go to full watch page
- Video counter (e.g., "5 / 20")
- Responsive Behavior:
- Desktop: Opens panel alongside main content
- Mobile: Redirects to dedicated page
- Proper scroll isolation (doesn't interfere with main page)

## Search Functionality
- Global Search: Search bar in navigation
- Multi-field Search: Searches by title, creator, and tags
- Real-time Results: Instant search results as you type, simulated loading state for mock service, list in popover component
- Search Highlighting: Matched terms highlighted in results

## My Watch List (localStorage)
- Persistent Storage: All user preferences stored in browser localStorage
- Like System: Heart icon to like/unlike videos
- Save System: Bookmark icon to save/unsave videos

```json
{
    "myLikes": ["video-id-1", "video-id-2"],
    "mySaves": ["video-id-3", "video-id-4"]
  }
```

- Cross-page Sync: Like/save states sync across all pages
- Keyboard Shortcuts: 'L' to like, 'S' to save in video player

##  🎨 Custom UI Components
- Button Component (/components/ui/button.tsx)
* Variants: primary, secondary, tertiary, outline, ghost, link, player
* Sizes: sm, md, lg, icon, player
* Styling: Consistent design system with hover effects

- Card Component (/components/ui/card.tsx)
* Hoverable: Optional hover effects
* Sections: CardContent, CardFooter for structured layouts
* Responsive: Adapts to different screen sizes

- Tabs Component (/components/ui/tabs.tsx)
* Dynamic Content: Category-based tab switching
* Scaled horizontal scroll for many tabs, left right arrows with scroll detection custom hook
* Active States: Visual feedback for selected tabs
* Counts: Optional video counts per category

- Loading Component (/components/ui/loading.tsx)
* Variants: brand, dots, spinner
* Customizable: Size and text options
* Branded: Company-specific loading messages


# 🏗️ Architecture
## Services Layer (/services/)
- Mock API Design: Structured like real API services
- Modular: Separated by functionality

- Type Safety: Full TypeScript support
- Scalable: Easy to replace with real API calls
```src/
├── app/                    # Next.js 14 app directory
│   ├── page.tsx           # Home page
│   └── watch/
│       ├── [id]/page.tsx  # Video player page
│       └── discover/page.tsx # Mobile discover page
├── components/
│   ├── ui/                # Reusable UI components
│   ├── custom/            # App-specific components
│   ├── layout/            # Layout components
│   └── player/            # Video player components
├── services/              # Mock API services
├── types/                 # TypeScript type definitions
└── hooks/                 # Custom hooks for layout operations
└── lib/                   # Utility functions
```

# Deployment Link
https://mainstreamer.vercel.app/

