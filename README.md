# Anime Finder

A modern web-based anime discovery application that lets you explore trending anime and search for your favorite shows using the Jikan API.

## 🔧 How It Works

1. **Loading Airing Anime**: When you first open the app, it displays the top 12 currently airing anime from the Jikan API
2. **Search Functionality**: Enter an anime title in the search box to find specific shows
3. **Display Cards**: Each anime is displayed as a card showing the cover image, title, rating, episode count, and synopsis
4. **Theme Toggle**: Switch between dark and light modes for comfortable viewing
5. **API Integration**: The app connects to the free Jikan API (no authentication required) to fetch real-time anime data

## Features

- **Browse Airing Anime**: View top 12 currently airing anime on startup with automatic loading
- **Search Functionality**: Search for any anime by title with real-time API queries
- **Detailed Anime Information**:
  - Anime title and cover artwork
  - Star rating (⭐) for user scores
  - Episode count and status information
  - Full synopsis/description for each show
- **Anime Cover Images**: Beautiful, high-quality cover art for visual browsing
- **Dark/Light Mode**: Toggle between dark and light themes for comfortable viewing in any lighting
- **Responsive Design**:
  - Desktop-friendly layout
  - Mobile-optimized interface
  - Works seamlessly across all device sizes
- **No Authentication Required**: Uses free Jikan API with no sign-up needed
- **Real-time Data**: Fetches current anime information and trending shows
- **Fast Loading**: Efficient API integration for quick results
- **Clean UI**: Modern, intuitive interface for easy navigation

## How to Run

### Quick Start

1. **Open the Application**:
   - Open the `index.html` file in any modern web browser
   - No installation or server setup required
   - An internet connection is required to fetch anime data from the Jikan API

### Using the Anime Finder

1. **View Trending Anime**:

   - The app automatically loads the top 12 currently airing anime when you open it
   - Browse through the anime cards to see titles, cover images, ratings, and episode information
   - Scroll down to see more cards and discover new shows

2. **Search for Anime**:

   - Click the search input box at the top of the page
   - Type the name of an anime you want to find (e.g., "Naruto", "One Piece", "Attack on Titan")
   - Press Enter or click the search button to submit your query
   - Results will display matching anime with their complete information
   - Search is case-insensitive and finds partial matches

3. **View Anime Details**:

   - Each anime card displays:
     - Cover image (click for full view if available)
     - Anime title
     - Star rating (⭐) - user score out of 10
     - Episode count and airing status
     - Full synopsis describing the plot and storyline

4. **Toggle Theme**:

   - Click the theme toggle button (☀️/🌙) in the top right corner
   - Switches between dark mode and light mode
   - Your preference is applied immediately across all cards
   - Light mode better for daytime viewing, dark mode for nighttime

5. **Browse More Results**:
   - Search results will display all matching anime
   - Scroll through the cards to explore different shows
   - Each search overwrites the previous results (no history saved)

### Supported Browsers

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

### Troubleshooting

- **No results appearing**: Check your internet connection
- **API errors**: The Jikan API server may be temporarily down, try again later
- **Images not loading**: This is usually a temporary API issue, refresh the page
- **Search not working**: Ensure JavaScript is enabled in your browser
  - Hover over anime cards to see additional details
  - Each card displays:
    - Anime title
    - Rating (⭐ score out of 10)
    - Number of episodes
    - Short synopsis (first 100 characters)

## Files

- `index.html` — Main HTML file with app structure and layout
- `script.js` — JavaScript file containing API calls and functionality
- `style.css` — CSS file for styling and animations

## Requirements

- Internet connection (required to fetch anime data from Jikan API)
- Modern web browser (Chrome, Firefox, Safari, Edge)

## API Used

- **Jikan API v4**: Free anime database API
- No authentication required
- Provides data on anime titles, ratings, episodes, and cover images

## Customization

You can customize the app by:

- Changing the initial anime filter (airing, upcoming, popular, etc.) in `script.js`
- Adjusting the number of anime displayed on startup (currently 12)
- Modifying the card layout and styling in `style.css`
- Changing the color scheme by editing CSS variables

## Troubleshooting

- **No Results on Startup**: Check your internet connection
- **Search Returns "No anime found"**: The anime title may not exist in the database - try alternative spellings
- **Images Not Loading**: This might be a temporary API issue - refresh the page
- **Theme Not Switching**: Clear browser cache and refresh the page

## License

This project is for educational purposes. Anime data is provided by the Jikan API.
