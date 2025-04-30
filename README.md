# Location Insights with GraphQL and AI

A modern web application that provides detailed insights about locations using Google Maps, GraphQL, and AI-powered analysis.

![LocationInsights](https://github.com/user-attachments/assets/10b96535-59e9-49f1-8381-cb0039800060)

## Features

- 🔍 Location search with Google Places Autocomplete
- 🗺️ Interactive Google Maps integration
- 🤖 AI-powered location insights using Google's Generative AI
- 🎨 Modern UI with Material-UI and dark mode support
- ⚡ Real-time data fetching with GraphQL
- ⌨️ Keyboard navigation support

## Tech Stack

- **Frontend:**
  - React with TypeScript
  - Material-UI for UI components
  - Apollo Client for GraphQL
  - Google Maps JavaScript API
  - Vite for development and building

- **Backend:**
  - Node.js with TypeScript
  - Apollo Server for GraphQL
  - Google Generative AI API
  - Express for HTTP server

## Project Structure

```
graphql-genai-api/
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── graphql/        # GraphQL queries and mutations
│   │   ├── types/          # TypeScript type definitions
│   │   ├── utils/          # Utility functions
│   │   ├── App.tsx         # Main application component
│   │   ├── main.tsx        # Application entry point
│   │   └── theme.ts        # Material-UI theme configuration
│   └── package.json
│
├── server/                 # Backend GraphQL server
│   ├── src/
│   │   ├── resolvers.ts    # GraphQL resolvers
│   │   ├── schema.ts       # GraphQL schema
│   │   └── index.ts        # Server entry point
│   └── package.json
│
└── README.md
```

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Google Maps API key
- Google Generative AI API key

### Environment Setup

1. Create a `.env` file in the server directory:
```env
GOOGLE_MAPS_API_KEY=your_maps_api_key
GOOGLE_AI_API_KEY=your_ai_api_key
```

2. Create a `.env` file in the client directory:
```env
VITE_GOOGLE_MAPS_API_KEY=your_maps_api_key
```

### Installation

1. Install server dependencies:
```bash
cd server
npm install
```

2. Install client dependencies:
```bash
cd client
npm install
```

### Running the Application

1. Start the GraphQL server:
```bash
cd server
npm run dev
```

2. Start the React development server:
```bash
cd client
npm run dev
```

The application will be available at `http://localhost:5173`

## Usage

1. Enter a location in the search bar
2. Select a location from the suggestions
3. View the location on the map
4. Read AI-generated insights about the location

## Features in Detail

### Location Search
- Real-time autocomplete suggestions
- Keyboard navigation support
- Place details fetching
- Smooth map integration

### AI Insights
- Detailed location descriptions
- Historical information
- Interesting facts
- Error handling and fallbacks

### UI/UX
- Responsive design
- Dark mode support
- Material-UI components
- Smooth animations and transitions

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details. 
