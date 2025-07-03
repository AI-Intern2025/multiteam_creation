# OCR Player Name Extractor

This feature allows you to extract player names from Dream11 screenshots using OCR (Optical Character Recognition) technology.

## Features

- **Frontend OCR**: Uses Tesseract.js to process images directly in the browser
- **Backend OCR**: Uses FastAPI with support for multiple OCR engines (Tesseract, Google Vision API)
- **Smart Player Detection**: Filters out non-player text and focuses on cricket player names
- **Formation View Support**: Specifically handles Dream11 team formation screenshots
- **Duplicate Removal**: Automatically removes duplicate player names
- **Real-time Progress**: Shows processing progress for frontend OCR

## How to Use

### 1. Access the OCR Test Page
Navigate to: `http://localhost:3000/ocr-test`

### 2. Upload Image
- Click "Upload Dream11 Screenshot"
- Select an image file (PNG, JPG, etc.)
- The image will be previewed

### 3. Choose Processing Method
- **Frontend (Tesseract.js)**: Processes the image in your browser
- **Backend (FastAPI)**: Sends the image to the server for processing

### 4. Extract Player Names
- Click "Extract Player Names"
- Wait for processing to complete
- View the extracted player names

## API Endpoints

### POST /extract-names/
Basic OCR endpoint that returns hardcoded player names (for testing)

```bash
curl -X POST "http://localhost:8000/extract-names/" \
  -F "file=@your-image.jpg"
```

### POST /extract-names-google-vision/
Google Vision API endpoint (requires setup)

### POST /extract-names-tesseract/
Tesseract OCR endpoint (requires pytesseract installation)

## Configuration

### For Google Vision API:
1. Set up Google Cloud project
2. Enable Vision API
3. Create service account and download credentials
4. Set environment variable:
   ```bash
   export GOOGLE_APPLICATION_CREDENTIALS="path/to/credentials.json"
   ```
5. Uncomment the Google Vision code in `backend/main.py`

### For Tesseract Backend:
1. Install Tesseract OCR on your system
2. Install pytesseract:
   ```bash
   pip install pytesseract
   ```
3. Uncomment the Tesseract code in `backend/main.py`

## Known Players Database

The system includes a database of known cricket players to improve accuracy:

- **WI Players**: S Hope, K Brathwaite, K Carty, J Greaves, J Warrican, A Joseph
- **AUS Players**: J Inglis, U Khawaja, B Webster, P Cummins, M Starc, J Hazlewood
- **Other Players**: Kohli, Rohit, Dhoni, Pant, Bumrah, Babar, Root, Stokes, etc.

## Player Name Patterns

The system recognizes these cricket name patterns:
- `S Hope` (Initial + Last name)
- `K Brathwaite` (Initial + Full last name)
- `Virat Kohli` (Full first + Last name)
- `MS Dhoni` (Initials + Last name)
- `AB de Villiers` (Multiple initials + Last name)

## Filtering Logic

The system filters out non-player text:
- Cricket terminology (wicket, keeper, batter, bowler, etc.)
- App UI elements (create, team, upload, credits, etc.)
- Numbers and percentages
- Timestamps
- Special characters

## Usage Examples

### Frontend Component
```tsx
import OCRPlayerExtractor from '@/components/OCRPlayerExtractor'

function MyComponent() {
  const handlePlayersExtracted = (players: string[]) => {
    console.log('Extracted players:', players)
  }

  return (
    <OCRPlayerExtractor 
      onPlayersExtracted={handlePlayersExtracted}
    />
  )
}
```

### Utility Functions
```tsx
import { extractPlayerNamesOnly, extractPlayersFromFormationView } from '@/utils/player-name-extractor'

// Extract from any OCR text
const players = extractPlayerNamesOnly(ocrText)

// Extract from formation view specifically
const formationPlayers = extractPlayersFromFormationView(ocrText)
```

## Troubleshooting

### No Players Found
- Ensure the image is clear and high resolution
- Check that the image contains visible player names
- Try with different lighting or contrast

### Backend Connection Failed
- Ensure the FastAPI server is running on port 8000
- Check CORS settings if accessing from different domain

### Poor OCR Accuracy
- Use higher resolution images
- Ensure good lighting and contrast
- Consider using Google Vision API for better accuracy

## Technical Details

### Frontend OCR (Tesseract.js)
- Runs entirely in the browser
- No server required
- Works offline
- Progress tracking available

### Backend OCR Options
1. **Tesseract**: Open-source OCR engine
2. **Google Vision API**: Cloud-based OCR with high accuracy
3. **Custom OCR**: Placeholder for other OCR services

### Files Structure
```
src/
├── components/
│   └── OCRPlayerExtractor.tsx    # Main OCR component
├── utils/
│   └── player-name-extractor.ts  # Extraction logic
└── app/
    └── ocr-test/
        └── page.tsx              # Test page

backend/
└── main.py                       # FastAPI endpoints
```

## Next Steps

1. **Install Tesseract** for backend OCR
2. **Set up Google Vision API** for better accuracy
3. **Add more cricket players** to the known players database
4. **Implement caching** for repeated OCR requests
5. **Add image preprocessing** for better OCR results

## Testing

To test the OCR feature:
1. Visit `http://localhost:3000/ocr-test`
2. Upload the provided Dream11 screenshot
3. Try both frontend and backend processing
4. Verify the extracted player names match the image

The system should extract names like:
- S Hope
- J Inglis  
- K Brathwaite
- U Khawaja
- K Carty
- B Webster
- J Greaves
- P Cummins
- M Starc
- A Joseph
- J Warrican
