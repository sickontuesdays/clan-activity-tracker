# S!ck on Tuesdays! - Destiny 2 Clan Activity Tracker

A comprehensive activity tracker for the Destiny 2 clan "S!ck on Tuesdays!" that displays recent clan member activities with detailed statistics.

## File Structure

```
/
├── index.html                 # Main application page
├── activity-details.html      # Detailed activity view page  
├── api/
│   └── bungie.js             # Serverless API handler for Bungie API
├── vercel.json               # Vercel deployment configuration
├── .env.example              # Environment variables template
└── README.md                 # This file
```

## Features

- **24-Hour Activity Tracking**: Shows all clan member activities from the last 24 hours
- **Paginated Loading**: Displays 10 activities initially with "Load More" functionality
- **Comprehensive Statistics**: Detailed player stats, weapons used, medals earned
- **Mixed Fireteams Supported**: Shows activities where clan members played with non-clan members
- **Responsive Design**: Works on desktop and mobile devices
- **No User Authentication**: Uses public Bungie API endpoints only
- **Real-time Data**: Fetches live data from Bungie's servers

## Setup Instructions

### 1. Get Bungie API Key

1. Go to [Bungie Developer Portal](https://www.bungie.net/en/Application)
2. Create a new application with these settings:
   - **Application Name**: "Sick on Tuesdays Clan Tracker"
   - **Website**: `your-domain.vercel.app`
   - **Redirect URL**: `your-domain.vercel.app`
   - **OAuth Client Type**: "Not Applicable"
3. Copy the generated API Key

### 2. Deploy to Vercel

1. Fork/clone this repository
2. Connect to Vercel
3. Add environment variable:
   - **Name**: `BUNGIE_API_KEY`
   - **Value**: Your Bungie API key from step 1
4. Deploy

### 3. Verify Setup

1. Visit your deployed URL
2. The app should load clan activities automatically
3. Click on any activity to view detailed statistics

## Technical Details

### API Usage
- Uses Bungie's public API endpoints
- No OAuth authentication required for clan data
- API key secured as environment variable
- Serverless function handles CORS and API requests

### Performance Optimizations
- Fetches activities from up to 20 clan members (to avoid rate limits)
- Loads maximum 3 characters per clan member
- Caches activity definitions
- Implements pagination for better UX

### Data Collection
- Searches all clan members' recent activities
- Includes activities with mixed fireteams (clan + non-clan members)
- Filters to last 24 hours automatically
- Removes duplicate activities (same instance ID)
- Sorts by most recent first

## Troubleshooting

### Common Issues

**"Failed to find clan"**
- Verify clan name spelling: "S!ck on Tuesdays!"
- Check if clan is set to public visibility

**"API key not configured"**
- Ensure `BUNGIE_API_KEY` environment variable is set in Vercel
- Redeploy after adding environment variable

**"No recent activities found"**
- Clan members may not have played in the last 24 hours
- Check if clan members' profiles are set to public

### Rate Limiting
- Bungie API has rate limits (100 requests per 10 seconds)
- App automatically limits concurrent requests
- If rate limited, wait a few minutes and refresh

## Development

### Local Development
1. Install dependencies: `npm install`
2. Create `.env.local` with your API key
3. Run: `vercel dev`

### API Endpoints Used
- `/GroupV2/Name/{clanName}/{groupType}/` - Find clan by name
- `/GroupV2/{groupId}/Members/` - Get clan members
- `/Destiny2/{membershipType}/Profile/{membershipId}/` - Get player characters
- `/Destiny2/{membershipType}/Account/{membershipId}/Character/{characterId}/Stats/Activities/` - Get activity history
- `/Destiny2/Stats/PostGameCarnageReport/{instanceId}/` - Get detailed activity stats
- `/Destiny2/Manifest/DestinyActivityDefinition/{hash}/` - Get activity definitions

## Contributing

Feel free to submit issues or pull requests to improve the tracker functionality.