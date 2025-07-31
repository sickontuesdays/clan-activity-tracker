# S!ck on Tuesdays! - Destiny 2 Clan Activity Tracker

A comprehensive hybrid activity tracker for the Destiny 2 clan "S!ck on Tuesdays!" that displays clan member activities with detailed statistics, weapon usage, boss damage tracking, and individual encounter breakdowns.

## File Structure

```
/
├── index.html                    # Main hybrid application page
├── activity-details.html         # Detailed activity view page  
├── encounter-details.html        # Individual encounter tracking
├── login.html                    # OAuth login page
├── oauth-callback.html           # OAuth callback handler
├── api/
│   ├── bungie.js                 # Public API handler
│   ├── bungie-auth.js            # Authenticated API handler
│   ├── oauth-config.js           # OAuth configuration
│   ├── oauth-token.js            # Token exchange
│   ├── user-info.js              # User information retrieval
│   ├── create-session.js         # Session creation
│   ├── check-session.js          # Session verification
│   ├── opted-in-members.js       # Opt-in member management
│   └── logout.js                 # User logout
├── package.json                  # Node.js dependencies
├── vercel.json                   # Deployment configuration
├── .env.example                  # Environment variables template
└── README.md                     # This file
```

## Features

### 🔓 Public Access (No Login Required)
- **24-Hour Activity Tracking**: Shows all clan member activities from the last 24 hours
- **Paginated Loading**: Displays 10 activities initially with "Load More" functionality
- **Mixed Fireteams**: Shows activities where clan members played with non-clan members
- **Basic Statistics**: Public profile data and activity information
- **Activity Names**: Proper activity names (Raid, Patrol, Nightfall) instead of generic mode strings

### 🔒 Enhanced Access (Login + Opt-in Required)
- **Detailed Player Statistics**: Comprehensive stats from opted-in clan members
- **Weapon Usage Tracking**: Full weapon names, usage statistics, and damage numbers
- **Ability Tracking**: Ability kills, grenade kills, melee kills, super kills
- **Boss Damage Statistics**: Damage dealt to bosses in raids and dungeons
- **Damage Taken Tracking**: How much damage players received during activities
- **Individual Encounter Data**: Phase-by-phase breakdowns for raids and dungeons
- **Enhanced Analytics**: Team performance metrics and detailed breakdowns

### ⚖️ Fair Exchange System
- **Opt-in Required**: Users must share their own data to see enhanced data from others
- **Privacy Respected**: Only opted-in members' private data is accessible
- **Granular Control**: Users can opt-out at any time
- **Clear Indicators**: Shows which members have opted in vs public profiles

### 🎯 Advanced Features
- **Encounter Tracking**: Individual encounter statistics for raids and dungeons
- **Weapon Definitions**: Shows actual weapon names instead of just hash IDs
- **Boss Damage Breakdown**: Specific damage numbers for raid and dungeon bosses
- **Performance Analytics**: K/D ratios, efficiency ratings, and combat metrics
- **Medal Tracking**: Medals earned during activities
- **Responsive Design**: Works on desktop and mobile devices

## Setup Instructions

### 1. Get Bungie API Credentials

1. Go to [Bungie Developer Portal](https://www.bungie.net/en/Application)
2. Create a new application with these settings:
   - **Application Name**: "Sick on Tuesdays Clan Tracker"
   - **Website**: `https://your-domain.vercel.app`
   - **Application Status**: Public
   - **OAuth Client Type**: Confidential
   - **Redirect URL**: `https://your-domain.vercel.app/oauth-callback.html`
   - **Scope**: `ReadUserData,ReadDestinyInventoryAndVault`
3. Save and copy the generated credentials:
   - **API Key** (for BUNGIE_API_KEY)
   - **Client ID** (for BUNGIE_CLIENT_ID)
   - **Client Secret** (for BUNGIE_CLIENT_SECRET)

### 2. Deploy to Vercel

1. Fork/clone this repository
2. Connect to Vercel
3. Add environment variables in Vercel project settings:
   ```
   BUNGIE_API_KEY=your_bungie_api_key_here
   BUNGIE_CLIENT_ID=your_bungie_app_client_id
   BUNGIE_CLIENT_SECRET=your_bungie_app_client_secret
   JWT_SECRET=your_random_jwt_secret_key_here
   ```
4. Deploy

### 3. Generate JWT Secret

Generate a secure random string for JWT_SECRET:
- Online generator: https://www.uuidgenerator.net/
- Command line: `openssl rand -hex 32`
- Or create a long random string: `mySecretKey123456789abcdefghijklmnop`

### 4. Verify Setup

1. Visit your deployed URL
2. The app should load clan activities automatically (public access)
3. Click "Enhanced Access" to test the OAuth login flow
4. After login, you should see enhanced features and opted-in member data

## How It Works

### Data Collection System

**Public Data Collection:**
- Scans all clan members' public profiles
- Collects activity history from last 24 hours
- Shows basic statistics and fireteam information
- Respects privacy settings (skips private profiles)

**Enhanced Data Collection (Logged-in Users):**
- Uses OAuth authentication for private profile access
- Collects detailed statistics from opted-in members only
- Provides comprehensive weapon usage, boss damage, and encounter data
- Maintains user privacy through opt-in system

### Privacy Protection

**Fair Exchange Model:**
- Users must opt-in to share their private data to see others' enhanced data
- Public users only see basic information from public profiles
- Private data is only shared among consenting opted-in members
- Users can opt-out at any time

### Technical Architecture

**Hybrid API System:**
- `/api/bungie` - Public API calls using API key only
- `/api/bungie-auth` - Authenticated API calls using user OAuth tokens
- Automatic selection based on user login status and member opt-in status

**Session Management:**
- JWT-based sessions with secure httpOnly cookies
- Automatic token expiration handling
- Session verification for authenticated requests

## API Endpoints Used

- `/GroupV2/Name/{clanName}/{groupType}/` - Find clan by name
- `/GroupV2/{groupId}/Members/` - Get clan members
- `/Destiny2/{membershipType}/Profile/{membershipId}/` - Get player profiles
- `/Destiny2/{membershipType}/Account/{membershipId}/Character/{characterId}/Stats/Activities/` - Get activity history
- `/Destiny2/Stats/PostGameCarnageReport/{instanceId}/` - Get detailed activity stats
- `/Destiny2/Manifest/DestinyActivityDefinition/{hash}/` - Get activity definitions
- `/Destiny2/Manifest/DestinyInventoryItemDefinition/{hash}/` - Get weapon definitions
- `/User/GetMembershipsForCurrentUser/` - Get current user's platform memberships

## Performance Optimizations

- **Activity Definition Caching**: Prevents repeated API calls for activity names
- **Weapon Definition Caching**: Stores weapon names to avoid redundant lookups
- **Batch Processing**: Fetches multiple definitions in parallel
- **Rate Limit Management**: Intelligent request throttling to avoid API limits
- **Pagination**: Loads activities in batches for better performance

## Troubleshooting

### Common Issues

**"Failed to find clan"**
- Verify clan name spelling: "S!ck on Tuesdays!"
- Check if clan is set to public visibility

**"OAuth authorization failed"**
- Verify BUNGIE_CLIENT_ID and BUNGIE_CLIENT_SECRET are correctly set
- Check redirect URL matches exactly in Bungie app settings
- Ensure OAuth Client Type is set to "Confidential"

**"No recent activities found"**
- Clan members may not have played in the last 24 hours
- Check if clan members' profiles are set to public
- Some members may have private profiles (expected behavior)

**"Session expired" errors**
- User needs to log in again
- Check JWT_SECRET is properly configured
- Verify cookies are being set correctly

### Enhanced Features Not Working

**Weapon names showing as "Unknown Weapon"**
- Check if Destiny manifest API is accessible
- Verify weapon definition caching is working
- Some weapons may not have definitions available

**Boss damage not showing**
- Boss damage is only available for certain activity types (raids, dungeons)
- Data depends on Bungie's PGCR including boss damage fields
- Not all activities track boss damage

**Encounter data not available**
- Individual encounters are primarily available for raids and some dungeons
- Older activities may not have encounter breakdowns
- API limitations may prevent access to some encounter data

### Rate Limiting
- Bungie API has rate limits (100 requests per 10 seconds)
- App automatically limits concurrent requests
- If rate limited, wait a few minutes and refresh

## Development

### Local Development
1. Install dependencies: `npm install`
2. Create `.env.local` with your API credentials
3. Run: `vercel dev`

### Environment Variables
```bash
BUNGIE_API_KEY=your_bungie_api_key
BUNGIE_CLIENT_ID=your_bungie_client_id  
BUNGIE_CLIENT_SECRET=your_bungie_client_secret
JWT_SECRET=your_random_jwt_secret
```

## Contributing

Feel free to submit issues or pull requests to improve the tracker functionality. When contributing:

1. Test both public and authenticated access modes
2. Verify privacy settings are respected
3. Ensure responsive design works on mobile
4. Test with different activity types (PvP, PvE, raids, dungeons)
5. Validate error handling for private profiles and API failures

## Privacy & Data Handling

This application:
- Only accesses data from users who explicitly opt-in
- Stores minimal session data (display names, membership IDs)
- Does not persistently store activity or performance data
- Respects Bungie's privacy settings and API terms of service
- Allows users to opt-out and remove their data at any time

## License

MIT License - Feel free to use and modify for your own clan tracking needs.