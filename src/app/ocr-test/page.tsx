'use client'

import OCRPlayerExtractor from '@/components/OCRPlayerExtractor'

export default function OCRTestPage() {
  const handlePlayersExtracted = (players: string[]) => {
    console.log('Extracted players:', players)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">
        OCR Player Name Extractor
      </h1>
      
      <div className="max-w-2xl mx-auto">
        <OCRPlayerExtractor 
          onPlayersExtracted={handlePlayersExtracted}
          className="mb-8"
        />
        
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h2 className="text-lg font-semibold mb-2 text-blue-800">
            How to Use:
          </h2>
          <ul className="space-y-1 text-blue-700">
            <li>1. Upload a Dream11 screenshot showing player names</li>
            <li>2. Choose between Frontend (Tesseract.js) or Backend (FastAPI) processing</li>
            <li>3. Click "Extract Player Names" to process the image</li>
            <li>4. View the extracted player names below</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
