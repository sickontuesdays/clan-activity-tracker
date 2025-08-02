# S!ck on Tuesdays! - Destiny 2 Clan Activity Tracker

A comprehensive activity tracker for the Destiny 2 clan "S!ck on Tuesdays!" that displays clan member activities with detailed statistics, weapon usage, and performance tracking.

## File Structure

```
/
├── index.html                    # Main application page with caching and rankings
├── activity-details.html         # Detailed activity view with 3-column player layout
├── api/
│   └── bungie.js                 # Public API handler
├── package.json                  # Node.js dependencies (simplified)
├── vercel.json                   # Deployment configuration
└── README.md                     # This file
```

## Features

### 🎯 Core Features
- **Manual Data Loading**: Click "Load Last 24 Hours" to fetch recent clan activities
- **Smart Caching**: Activities are cached locally to reduce API calls and improve performance
- **Activity Filtering**: Automatically excludes strikes, patrols, and story missions
- **Search by Member**: Dropdown search to filter activities by specific clan members
- **3-Column Player Layout**: Activity details show up to 3 players per row for better visibility

### 📊 Rankings & Statistics
- **Time Played Rankings**: Left sidebar shows clan members ranked by most time played (24h)
- **Kills Rankings**: Right sidebar shows clan members ranked by most kills (24h)
- **Team Performance**: Comprehensive team statistics and individual player breakdowns
- **Activity Statistics**: Kills, deaths, assists, precision kills, ability kills

### 🔧 Technical Features
- **Intelligent Caching**: 
  - Stores activity data locally to reduce API calls
  - Automatically refreshes with newer data when available
  - Removes activities older than 24 hours
- **No Login Required**: All data is pulled from public Bungie profiles
- **Responsive Design**: Works on desktop and mobile devices
- **Performance Optimized**: Batch API calls and caching for faster loading

### 🚫 Filtered Content
The tracker automatically excludes:
- Story missions
- Strikes  
- Patrol activities
- Other low-value activities

Focus is on meaningful endgame content like raids, dungeons, PvP, and special events.

## Setup Instructions

### 1. Get Bungie API Key

1. Go to [Bungie Developer Portal](https://www.bungie.net/en/Application)
2. Create a new application with these settings:
   - **Application Name**: "Sick on Tuesdays Clan Tracker"
   - **Website**: `https://your-domain.vercel.app`
   - **Application Status**: Public
   - **OAuth Client Type**: Not Applicable (we don't use OAuth)
3. Save and copy the **API Key** for BUNGIE_API_KEY

### 2. Deploy to Vercel

1. Fork/clone this repository
2. Connect to Vercel
3. Add environment variable in Vercel project settings:
   ```
   BUNGIE_API_KEY=your_bungie_api_key_here
   ```
4. Deploy

### 3. Verify Setup

1. Visit your deployed URL
2. Click "Load Last 24 Hours" to fetch clan activities
3. The app should show recent activities and populate rankings
4. Test the search functionality with clan member names

## How It Works

### Data Collection System

**Public Data Only:**
- Scans all clan members' public profiles using Bungie API
- Collects activity history from last 24 hours
- Shows comprehensive statistics for public profiles
- Automatically skips private profiles (respects privacy settings)
- Focuses on meaningful endgame activities only

### Caching System

**Smart Caching Logic:**
- Activities are cached in browser localStorage
- Cache is automatically updated with newer activities
- Old activities (>24h) are removed from cache
- Significantly reduces API calls and improves performance
- Data persists between browser sessions

### Activity Filtering

**Quality Control:**
- Automatically filters out strikes, patrols, and story missions
- Focuses on raids, dungeons, PvP, trials, nightfalls, and special events
- Provides more meaningful activity tracking for clan performance

### Technical Architecture

**Simplified API System:**
- Single `/api/bungie` endpoint for all Bungie API calls
- No authentication required - uses public API access only
- Efficient batch processing for activity definitions
- Smart rate limiting to avoid API restrictions

## API Endpoints Used

- `/GroupV2/Name/{clanName}/{groupType}/` - Find clan by name
- `/GroupV2/{groupId}/Members/` - Get clan members
- `/Destiny2/{membershipType}/Profile/{membershipId}/` - Get player profiles
- `/Destiny2/{membershipType}/Account/{membershipId}/Character/{characterId}/Stats/Activities/` - Get activity history
- `/Destiny2/Stats/PostGameCarnageReport/{instanceId}/` - Get detailed activity stats
- `/Destiny2/Manifest/DestinyActivityDefinition/{hash}/` - Get activity definitions
- `/Destiny2/Manifest/DestinyInventoryItemDefinition/{hash}/` - Get weapon definitions

## Performance Optimizations

- **Local Caching**: Reduces repeated API calls by storing data locally
- **Activity Definition Caching**: Prevents repeated lookups for activity names
- **Weapon Definition Caching**: Stores weapon names to avoid redundant requests
- **Batch Processing**: Fetches multiple definitions in parallel
- **Smart Filtering**: Excludes low-value activities at collection time
- **Pagination**: Loads activities in batches for better performance

## User Interface

### Main Page Layout
- **Header**: Clan name and description
- **Controls**: Load data button and member search dropdown  
- **Left Sidebar**: Time played rankings (most active players)
- **Center**: Activity list with statistics and details
- **Right Sidebar**: Kills rankings (highest performers)

### Activity Details Page
- **Wide Layout**: Accommodates 3-column player display
- **Player Cards**: Green highlighted names with comprehensive stats
- **Contained Sections**: Additional stats scroll within designated areas
- **Team Performance**: Aggregated statistics across all players
- **Weapon Usage**: Individual weapon statistics without damage numbers

## Troubleshooting

### Common Issues

**"Failed to find clan"**
- Verify clan name spelling: "S!ck on Tuesdays!"
- Check if clan is set to public visibility in Destiny 2

**"No recent activities found"**
- Clan members may not have played in the last 24 hours
- Check if clan members' profiles are set to public
- Some members may have private profiles (expected behavior)

**Caching Issues**
- Clear browser localStorage if data seems stale
- Use "Refresh Data" button to force new API calls
- Check browser console for any caching errors

### Data Limitations

**Private Profiles**
- Members with private profiles won't show activity data
- This is by design and respects user privacy choices
- No workaround available - privacy settings are enforced by Bungie

**Activity Types**
- Only shows meaningful endgame activities
- Excludes routine activities like strikes and patrols
- Focus on raids, dungeons, PvP, and special events

**24-Hour Window**
- Data is limited to last 24 hours for performance
- Older activities are automatically removed from cache
- Designed for tracking recent clan activity trends

## Development

### Local Development
1. Install dependencies: `npm install`
2. Create `.env.local` with your API key: `BUNGIE_API_KEY=your_key`
3. Run: `vercel dev`

### Environment Variables
```bash
BUNGIE_API_KEY=your_bungie_api_key
```

## Contributing

Feel free to submit issues or pull requests to improve the tracker functionality. When contributing:

1. Test with both public and private profile scenarios
2. Verify caching functionality works correctly
3. Ensure responsive design works on mobile
4. Test with different activity types
5. Validate error handling for private profiles and API failures

## Privacy & Data Handling

This application:
- Only accesses publicly available Bungie profile data
- Respects all Bungie privacy settings automatically
- Stores minimal cached data in browser localStorage only
- Does not collect or transmit personal information
- Follows Bungie's API terms of service and rate limits

## License

MIT License - Feel free to use and modify for your own clan tracking needs.