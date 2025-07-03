'use client'

import { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { Upload, Camera, Loader2, CheckCircle, AlertCircle, Edit } from 'lucide-react'
import { createWorker } from 'tesseract.js'
import { Player, OCRResult } from '@/types'
import { parsePlayerData, parseManualPlayerData } from '@/utils/metadata-parser'

interface OCRProcessorProps {
  onPlayersExtracted: (players: Player[]) => void
}

export default function OCRProcessor({ onPlayersExtracted }: OCRProcessorProps) {
  const [isProcessing, setIsProcessing] = useState(false)
  const [result, setResult] = useState<OCRResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [progress, setProgress] = useState(0)
  const [manualText, setManualText] = useState('')

  const processImage = async (file: File) => {
    setIsProcessing(true)
    setError(null)
    setProgress(0)

    try {
      const worker = await createWorker('eng', 1, {
        logger: (m) => {
          if (m.status === 'recognizing text') {
            setProgress(Math.round(m.progress * 100))
          }
        }
      })

      const { data: { text, confidence } } = await worker.recognize(file)
      await worker.terminate()

      // Parse the OCR text to extract player data
      const ocrResult = parsePlayerData(text, confidence)
      setResult(ocrResult)
      
      if (ocrResult.players.length > 0) {
        onPlayersExtracted(ocrResult.players)
      } else {
        // Provide more detailed error information
        const debugInfo = `OCR Text Preview: ${text.substring(0, 200)}...`
        console.log('Full OCR Text:', text)
        console.log('OCR Confidence:', confidence)
        setError(`No player data found in the image. ${ocrResult.players.length === 0 ? 'Try uploading a clearer Dream11 player selection screenshot.' : ''}`)
      }
    } catch (err) {
      setError('Failed to process image. Please try again with a clearer image.')
      console.error('OCR Error:', err)
    } finally {
      setIsProcessing(false)
      setProgress(0)
    }
  }

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0]
    if (file) {
      processImage(file)
    }
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.webp']
    },
    maxFiles: 1
  })

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Upload Dream11 Screenshot
        </h2>
        <p className="text-lg text-gray-600">
          Take a screenshot of the Dream11 player selection screen and upload it here.
          We'll automatically extract player names, credits, and roles.
        </p>
      </div>

      {/* Upload Area */}
      <div
        {...getRootProps()}
        className={`
          relative border-2 border-dashed rounded-lg p-8 transition-colors cursor-pointer
          ${isDragActive 
            ? 'border-dream11-primary bg-blue-50' 
            : 'border-gray-300 hover:border-gray-400'
          }
          ${isProcessing ? 'pointer-events-none opacity-50' : ''}
        `}
      >
        <input {...getInputProps()} />
        
        <div className="text-center">
          {isProcessing ? (
            <div className="space-y-4">
              <Loader2 className="w-12 h-12 text-dream11-primary mx-auto animate-spin" />
              <div>
                <p className="text-lg font-medium text-gray-900">Processing Image...</p>
                <p className="text-sm text-gray-500">This may take a moment</p>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-4">
                  <div 
                    className="bg-dream11-primary h-2 rounded-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <p className="text-xs text-gray-500 mt-2">{progress}% complete</p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex justify-center space-x-4">
                <Upload className="w-12 h-12 text-gray-400" />
                <Camera className="w-12 h-12 text-gray-400" />
              </div>
              <div>
                <p className="text-lg font-medium text-gray-900">
                  {isDragActive ? 'Drop the image here' : 'Upload or drag an image'}
                </p>
                <p className="text-sm text-gray-500">
                  PNG, JPG, JPEG or WEBP up to 10MB
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start space-x-3">
          <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="text-red-800 font-medium">Processing Failed</h4>
            <p className="text-red-700 text-sm mt-1">{error}</p>
          </div>
        </div>
      )}

      {/* Success Result */}
      {result && result.players.length > 0 && (
        <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center space-x-3 mb-4">
            <CheckCircle className="w-5 h-5 text-green-500" />
            <h4 className="text-green-800 font-medium">Successfully Extracted Player Data</h4>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-green-700">
                <span className="font-medium">Players Found:</span> {result.players.length}
              </p>
              <p className="text-green-700">
                <span className="font-medium">Confidence:</span> {Math.round(result.confidence * 100)}%
              </p>
            </div>
            <div>
              <p className="text-green-700">
                <span className="font-medium">Teams:</span> {result.matchInfo.team1} vs {result.matchInfo.team2}
              </p>
              <p className="text-green-700">
                <span className="font-medium">Format:</span> {result.matchInfo.format}
              </p>
            </div>
          </div>

          {/* Preview of extracted players */}
          <div className="mt-4">
            <h5 className="font-medium text-green-800 mb-2">Player Preview:</h5>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
              {result.players.slice(0, 8).map((player) => (
                <div key={player.id} className="bg-white p-2 rounded border">
                  <p className="font-medium truncate">{player.name}</p>
                  <p className="text-gray-600">{player.role} • {player.credits}cr</p>
                </div>
              ))}
              {result.players.length > 8 && (
                <div className="bg-white p-2 rounded border flex items-center justify-center">
                  <p className="text-gray-500">+{result.players.length - 8} more</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Tips */}
      <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h4 className="font-medium text-blue-900 mb-3">📸 Tips for better results:</h4>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Ensure the screenshot shows the complete player list with credits visible</li>
          <li>• Use high resolution and good lighting</li>
          <li>• Avoid blurry or tilted images</li>
          <li>• Make sure player names and credits are clearly readable</li>
        </ul>
      </div>

      {/* Manual Entry Alternative */}
      <div className="mt-8 pt-8 border-t border-gray-200">
        <div className="text-center">
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Alternative: Manual Entry
          </h3>
          <p className="text-gray-600 mb-4">
            Can't upload a screenshot? Enter player data manually in CSV format
          </p>
          <div className="mb-4 flex items-center justify-center space-x-4">
            <a 
              href="/sample-players.csv" 
              download="sample-players.csv"
              className="text-blue-600 hover:text-blue-800 underline text-sm"
            >
              📄 Download sample CSV format
            </a>
            <button
              onClick={async () => {
                try {
                  // Load sample data with correct player names
                  const samplePlayers = [
                    { name: 'K Brathwaite', team: 'team1', role: 'BAT', credits: 8.5 },
                    { name: 'T Campbell', team: 'team1', role: 'WK', credits: 8.0 },
                    { name: 'K Carty', team: 'team1', role: 'BAT', credits: 8.5 },
                    { name: 'B King', team: 'team1', role: 'BAT', credits: 9.0 },
                    { name: 'J Warrican', team: 'team1', role: 'BOWL', credits: 7.5 },
                    { name: 'R Chase', team: 'team1', role: 'AR', credits: 9.5 },
                    { name: 'S Hope', team: 'team1', role: 'BAT', credits: 10.0 },
                    { name: 'J Greaves', team: 'team1', role: 'AR', credits: 8.0 },
                    { name: 'A Joseph', team: 'team1', role: 'BOWL', credits: 8.5 },
                    { name: 'J Seales', team: 'team1', role: 'BOWL', credits: 8.0 },
                    { name: 'S Konstas', team: 'team2', role: 'BAT', credits: 8.0 },
                    { name: 'U Khawaja', team: 'team2', role: 'BAT', credits: 9.5 },
                    { name: 'C Green', team: 'team2', role: 'AR', credits: 9.0 },
                    { name: 'J Inglis', team: 'team2', role: 'WK', credits: 8.5 },
                    { name: 'T Head', team: 'team2', role: 'BAT', credits: 10.5 },
                    { name: 'B Webster', team: 'team2', role: 'AR', credits: 8.5 },
                    { name: 'A Carey', team: 'team2', role: 'WK', credits: 9.0 },
                    { name: 'P Cummins', team: 'team2', role: 'BOWL', credits: 11.0 },
                    { name: 'M Starc', team: 'team2', role: 'BOWL', credits: 10.5 },
                    { name: 'N Lyon', team: 'team2', role: 'BOWL', credits: 9.0 },
                    { name: 'J Hazlewood', team: 'team2', role: 'BOWL', credits: 9.5 }
                  ] as const
                  
                  const players: Player[] = samplePlayers.map(p => ({
                    id: p.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') + '-' + Date.now() + Math.random(),
                    name: p.name,
                    team: p.team as 'team1' | 'team2',
                    role: p.role as 'WK' | 'BAT' | 'AR' | 'BOWL',
                    credits: p.credits,
                    isLocked: false,
                    isExcluded: false
                  }))
                  
                  onPlayersExtracted(players)
                } catch (error) {
                  console.error('Failed to load sample data:', error)
                  setError('Failed to load sample data')
                }
              }}
              className="text-green-600 hover:text-green-800 underline text-sm"
            >
              🔄 Load sample data
            </button>
          </div>
          <textarea
            value={manualText}
            onChange={(e) => setManualText(e.target.value)}
            className="w-full h-32 p-3 border border-gray-300 rounded-lg font-mono text-sm"
            placeholder="Enter player data in format: Name, Team, Role, Credits
Example:
Virat Kohli, Team1, BAT, 11.5
MS Dhoni, Team1, WK, 10.0
Rohit Sharma, Team1, BAT, 12.0"
          />
          <button
            onClick={() => {
              if (manualText.trim()) {
                try {
                  const players = parseManualPlayerData(manualText)
                  if (players.length >= 8) {
                    onPlayersExtracted(players)
                  } else {
                    setError('Please enter at least 8 players')
                  }
                } catch (error) {
                  setError('Failed to parse manual data. Please check the format.')
                  console.error('Manual parsing error:', error)
                }
              }
            }}
            disabled={!manualText.trim()}
            className="mt-3 px-4 py-2 bg-dream11-primary text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center space-x-2"
          >
            <Edit className="w-4 h-4" />
            <span>Parse Manual Data</span>
          </button>
        </div>
      </div>
    </div>
  )
}
