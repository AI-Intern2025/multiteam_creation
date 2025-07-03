'use client'

import { useState, useCallback, useEffect } from 'react'
import { useDropzone } from 'react-dropzone'
import { Upload, Camera, Loader2, CheckCircle, AlertCircle, Edit, Database } from 'lucide-react'
import { createWorker } from 'tesseract.js'
import { Player, OCRResult } from '@/types'
import { parsePlayerData, parseManualPlayerData, extractPlayerNamesOnly } from '@/utils/metadata-parser'

interface OCRProcessorProps {
  onPlayersExtracted: (players: Player[]) => void
}

export default function OCRProcessor({ onPlayersExtracted }: OCRProcessorProps) {
  const [isProcessing, setIsProcessing] = useState(false)
  const [result, setResult] = useState<OCRResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [progress, setProgress] = useState(0)
  const [manualText, setManualText] = useState('')
  const [dbStatus, setDbStatus] = useState<'checking' | 'connected' | 'error'>('checking')
  const [debugInfo, setDebugInfo] = useState<any>(null)
  const [showDebug, setShowDebug] = useState(false)

  // Check database connection on component mount
  useEffect(() => {
    checkDatabaseConnection()
  }, [])

  const checkDatabaseConnection = async () => {
    try {
      const response = await fetch('/api/players?team=WI&limit=1')
      if (response.ok) {
        setDbStatus('connected')
      } else {
        setDbStatus('error')
      }
    } catch (error) {
      setDbStatus('error')
    }
  }

  const loadDemoPlayers = async () => {
    try {
      const response = await fetch('/api/players')
      if (!response.ok) throw new Error('Failed to load demo players')
      
      const { players } = await response.json()
      
      const convertedPlayers: Player[] = players.slice(0, 22).map((dbPlayer: any) => ({
        id: dbPlayer.id.toString(),
        name: dbPlayer.name,
        team: dbPlayer.matchTeam,
        role: dbPlayer.role,
        credits: dbPlayer.credits,
        isLocked: false,
        isExcluded: false
      }))
      
      onPlayersExtracted(convertedPlayers)
    } catch (error) {
      setError('Failed to load demo players from database')
    }
  }

  const processImage = async (file: File) => {
    setIsProcessing(true)
    setError(null)
    setProgress(0)

    try {
      const worker = await createWorker('eng', 1, {
        logger: (m) => {
          if (m.status === 'recognizing text') {
            setProgress(Math.round(m.progress * 70)) // OCR is 70% of the process
          }
        }
      })

      const { data: { text, confidence } } = await worker.recognize(file)
      await worker.terminate()

      console.log('📝 Raw OCR Text:', text)
      console.log('🎯 OCR Confidence:', confidence)

      // Store debug info
      setDebugInfo({
        rawText: text,
        confidence: confidence,
        lines: text.split('\n').filter(line => line.trim().length > 0)
      })

      setProgress(75)

      // Extract only player names from OCR
      const extractedNames = extractPlayerNamesOnly(text)
      console.log('🔍 Extracted names from OCR:', extractedNames)
      console.log('📊 Number of names extracted:', extractedNames.length)

      if (extractedNames.length === 0) {
        setError('No player names found in the image. Try uploading a clearer Dream11 player selection screenshot.')
        return
      }

      setProgress(80)

      // Lookup players in database
      const response = await fetch('/api/players', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ names: extractedNames })
      })

      if (!response.ok) {
        throw new Error('Failed to lookup players in database')
      }

      setProgress(90)

      const { players: foundPlayers, found, total } = await response.json()
      
      console.log(`✅ Found ${found}/${total} players in database`)
      console.log('Extracted names:', extractedNames)
      console.log('Found players:', foundPlayers.map((p: any) => p.name))

      // For WI vs AUS match, we should find at least some players since all are in DB
      if (foundPlayers.length === 0) {
        // Show debug information to help troubleshoot
        setError(`No matching players found in database for the ${extractedNames.length} names extracted: ${extractedNames.join(', ')}. 
        
This might be due to OCR quality. The database contains all 22 WI vs AUS players. Try:
1. A clearer screenshot with better lighting
2. Ensuring the player names are clearly visible
3. Using the "Load Demo Players" button to see all available players
4. Manual entry if the image quality is poor`)
        return
      }

      // Show partial matches info but don't fail - this is expected for WI vs AUS
      if (foundPlayers.length < extractedNames.length) {
        const missingNames = extractedNames.filter(name => 
          !foundPlayers.some((p: any) => 
            p.name.toLowerCase().includes(name.toLowerCase()) || 
            name.toLowerCase().includes(p.name.toLowerCase())
          )
        )
        console.warn(`⚠️ Only found ${foundPlayers.length}/${extractedNames.length} players. Missing: ${missingNames.join(', ')}`)
        
        // For WI vs AUS, if we found less than 8 players, suggest improvement
        if (foundPlayers.length < 8) {
          setError(`Found only ${foundPlayers.length} players from the screenshot. For WI vs AUS match, all 22 players should be in the database.
          
Extracted names: ${extractedNames.join(', ')}
Matched players: ${foundPlayers.map((p: any) => p.name).join(', ')}

Try uploading a clearer screenshot or use "Load Demo Players" to see all available WI vs AUS players.`)
          return
        }
      }

      // Auto-detect match teams from found players
      const wiPlayers = foundPlayers.filter((p: any) => p.team === 'WI')
      const ausPlayers = foundPlayers.filter((p: any) => p.team === 'AUS')
      
      console.log(`🏏 Match detected: WI (${wiPlayers.length}) vs AUS (${ausPlayers.length})`)

      setProgress(100)

      // Convert database players to our Player type
      const convertedPlayers: Player[] = foundPlayers.map((dbPlayer: any) => ({
        id: dbPlayer.id.toString(),
        name: dbPlayer.name,
        team: dbPlayer.matchTeam, // team1 or team2
        role: dbPlayer.role,
        credits: dbPlayer.credits,
        isLocked: false,
        isExcluded: false,
        // Additional metadata from database
        fullName: dbPlayer.fullName,
        selectionPercentage: dbPlayer.selectionPercentage,
        points: dbPlayer.points,
        country: dbPlayer.country
      }))

      const ocrResult: OCRResult = {
        players: convertedPlayers,
        matchInfo: {
          team1: 'WI',
          team2: 'AUS', 
          format: 'T20'
        },
        confidence: confidence * (found / total) // Adjust confidence based on match rate
      }

      setResult(ocrResult)
      onPlayersExtracted(convertedPlayers)

    } catch (err) {
      setError('Failed to process image or lookup players. Please try again with a clearer image.')
      console.error('OCR Error:', err)
    } finally {
      setIsProcessing(false)
      setTimeout(() => setProgress(0), 1000)
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
          WI vs AUS - Upload Dream11 Screenshot
        </h2>
        <p className="text-lg text-gray-600 mb-4">
          Upload your WI vs AUS Dream11 player selection screenshot. Our database contains all 22 players 
          from this match with accurate stats, so we'll automatically extract and match the players for 100% accuracy.
        </p>
        
        {/* Database Status */}
        <div className="flex items-center justify-center space-x-4 mb-4">
          <div className={`flex items-center space-x-2 px-3 py-1 rounded-full text-sm ${
            dbStatus === 'connected' ? 'bg-green-100 text-green-800' :
            dbStatus === 'error' ? 'bg-red-100 text-red-800' :
            'bg-yellow-100 text-yellow-800'
          }`}>
            <Database className="w-4 h-4" />
            <span>
              {dbStatus === 'connected' ? 'Database Connected' :
               dbStatus === 'error' ? 'Database Error' :
               'Checking Database...'}
            </span>
          </div>
          
          {dbStatus === 'connected' && (
            <button
              onClick={loadDemoPlayers}
              className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm hover:bg-blue-200 transition-colors"
            >
              🏏 Load All WI vs AUS Players
            </button>
          )}
        </div>
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
          <div className="flex-1">
            <h4 className="text-red-800 font-medium">Processing Failed</h4>
            <p className="text-red-700 text-sm mt-1">{error}</p>
            
            {/* Debug Button */}
            {debugInfo && (
              <button
                onClick={() => setShowDebug(!showDebug)}
                className="mt-2 text-xs text-red-600 hover:text-red-800 underline"
              >
                {showDebug ? 'Hide' : 'Show'} OCR Debug Info
              </button>
            )}
          </div>
        </div>
      )}

      {/* Debug Information */}
      {showDebug && debugInfo && (
        <div className="mt-4 p-4 bg-gray-50 border border-gray-200 rounded-lg">
          <h5 className="font-medium text-gray-800 mb-2">🔍 OCR Debug Information</h5>
          <div className="text-xs space-y-2">
            <div>
              <span className="font-medium">OCR Confidence:</span> {Math.round(debugInfo.confidence * 100)}%
            </div>
            <div>
              <span className="font-medium">Lines Detected:</span> {debugInfo.lines.length}
            </div>
            <div>
              <span className="font-medium">Raw OCR Text:</span>
              <pre className="mt-1 p-2 bg-white border rounded text-xs overflow-x-auto">
                {debugInfo.rawText.substring(0, 1000)}{debugInfo.rawText.length > 1000 ? '...' : ''}
              </pre>
            </div>
            <div>
              <span className="font-medium">Lines (first 20):</span>
              <ul className="mt-1 p-2 bg-white border rounded text-xs max-h-40 overflow-y-auto">
                {debugInfo.lines.slice(0, 20).map((line: string, idx: number) => (
                  <li key={idx} className="border-b border-gray-100 py-1">
                    <span className="text-gray-500">{idx + 1}:</span> "{line}"
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Success Result */}
      {result && result.players.length > 0 && (
        <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center space-x-3 mb-4">
            <CheckCircle className="w-5 h-5 text-green-500" />
            <h4 className="text-green-800 font-medium">Successfully Loaded Player Data from Database</h4>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-green-700">
                <span className="font-medium">Players Found:</span> {result.players.length}
              </p>
              <p className="text-green-700">
                <span className="font-medium">OCR Confidence:</span> {Math.round(result.confidence * 100)}%
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
            <h5 className="font-medium text-green-800 mb-2">Player Preview (with database stats):</h5>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
              {result.players.slice(0, 8).map((player) => (
                <div key={player.id} className="bg-white p-2 rounded border">
                  <p className="font-medium truncate">{player.name}</p>
                  <p className="text-gray-600">{player.role} • {player.credits}cr</p>
                  {(player as any).selectionPercentage && (
                    <p className="text-blue-600 text-xs">{(player as any).selectionPercentage}% selected</p>
                  )}
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
                  const response = await fetch('/sample-players.csv')
                  const sampleData = await response.text()
                  setManualText(sampleData)
                } catch (error) {
                  console.error('Failed to load sample data:', error)
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
