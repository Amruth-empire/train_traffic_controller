# 🚂 Real Train Data Integration with IRCTC API

## Overview
This application now integrates with the **Realtime Train Tracker API** from RapidAPI to provide live train status data from the Indian Railway Catering and Tourism Corporation (IRCTC).

## Setup Instructions

### 1. Get RapidAPI Key
1. Go to [RapidAPI IRCTC Train Tracker](https://rapidapi.com/IRCTCAPI/api/irctc1/)
2. Subscribe to the **FREE** plan (20 requests/month)
3. Copy your RapidAPI key from the dashboard

### 2. Configure Environment
Update your `.env.local` file with your RapidAPI credentials:

```bash
# RapidAPI - IRCTC Real Train Tracker (Free: 20 requests/month)
RAPIDAPI_KEY=your-actual-rapidapi-key-here
RAPIDAPI_HOST=irctc1.p.rapidapi.com
```

## Features

### 🔄 Smart Caching System
- **30-minute cache** for API responses
- Automatic cache cleanup for expired entries
- Reduces API calls to stay within free limits

### 📊 API Usage Monitoring
- Real-time tracking of API calls used/remaining
- Visual indicator in dashboard header
- Automatic fallback when limit is reached

### 🎛️ Toggle Controls
- **Live Data Button**: Switch between real IRCTC data and demo data
- **API Usage Badge**: Shows remaining calls (turns red when < 5 remaining)
- **User Preference**: Remembers your choice in localStorage

## How It Works

### 1. API Integration
```typescript
// Fetch live train status
const trainStatus = await irctcService.getTrainStatus("12301"); // Rajdhani Express
```

### 2. Data Conversion
Real IRCTC data is automatically converted to our internal train format:
- Train numbers, names, and routes
- Current station and delay information  
- Real-time status updates

### 3. Fallback System
When API limits are reached or calls fail:
- Seamlessly switches to generated fallback data
- Maintains app functionality
- User is notified via console logs

## API Endpoints

### `/api/trains/real`
- **GET**: Fetch real train data from IRCTC
- **Query Params**: 
  - `limit`: Number of trains (default: 5)
  - `cache`: Use cache (default: true)

### `/api/trains?real=true`  
- **GET**: Enhanced existing endpoint with real data
- Merges real IRCTC data with mock data structure

## Popular Train Numbers (Pre-configured)
- `12301` - Rajdhani Express
- `12002` - Shatabdi Express
- `12951` - Mumbai Rajdhani  
- `12423` - Dibrugarh Rajdhani
- `22691` - Rajdhani Express
- `12009` - Shatabdi Express
- `12049` - Gatimaan Express

## Usage Guidelines

### 🎯 Best Practices
1. **Use Toggle Wisely**: Only enable real data when needed
2. **Cache First**: Always check cache before making API calls
3. **Monitor Usage**: Keep an eye on the API usage badge
4. **Test Mode**: Use demo data for development/testing

### ⚠️ Free Tier Limitations
- **20 requests/month** maximum
- No real-time streaming (polling only)
- Rate limiting: 1 request per second recommended

### 🔄 Cache Strategy
- **Duration**: 30 minutes per train
- **Scope**: Per train number
- **Cleanup**: Automatic expired cache removal
- **Storage**: In-memory (resets on server restart)

## User Interface

### Dashboard Header Controls
```tsx
<Button variant={useRealData ? "default" : "outline"}>
  {useRealData ? "Live Data" : "Demo Data"}
</Button>
<Badge variant={apiUsage.remaining < 5 ? "destructive" : "secondary"}>
  {apiUsage.remaining}/20 API calls left  
</Badge>
```

### Data Source Indicators
- **Green "Live Data"**: Using real IRCTC API
- **Gray "Demo Data"**: Using mock/generated data  
- **Red Badge**: Less than 5 API calls remaining

## Troubleshooting

### Common Issues

1. **Invalid API Key**
   ```
   Error: API request failed: 401 Unauthorized
   ```
   - Check your RAPIDAPI_KEY in .env.local
   - Verify subscription to the IRCTC API

2. **Rate Limit Exceeded**
   ```
   Warning: Monthly API limit reached (20 requests)
   ```
   - Wait for next month or upgrade plan
   - Use demo data mode

3. **Network/API Errors**
   ```
   Failed to fetch train data, using fallback
   ```
   - App automatically uses fallback data
   - Check internet connection
   - Verify API service status

### Debug Console Logs
- `🚂 Fetching live data for train XXXXX`
- `✅ Successfully fetched live data`  
- `📋 Using cached data for train XXXXX`
- `⚠️ Monthly API limit reached`
- `🔄 Using fallback data for train XXXXX`

## Future Enhancements
- Redis cache for production deployments
- Webhook support for real-time updates
- Additional Indian railway APIs
- Train prediction algorithms
- Historical data analytics

---

**Note**: This integration is designed to be cost-effective and respectful of API limits while providing real train data when needed. Always monitor your usage to avoid exceeding the free tier limits.