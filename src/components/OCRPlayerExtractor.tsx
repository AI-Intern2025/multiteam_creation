'use client'

import React, { useState, useCallback } from 'react'
import { extractPlayerNamesOnly, extractPlayersFromFormationView, extractDream11Players } from '@/utils/player-name-extractor'

interface OCRPlayerExtractorProps {
  onPlayersExtracted?: (players: string[]) => void
  className?: string
}

const OCRPlayerExtractor: React.FC<OCRPlayerExtractorProps> = ({ onPlayersExtracted, className = '' }) => {
  const [image, setImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [playerNames, setPlayerNames] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const [ocrText, setOcrText] = useState<string>('')
  const [processingMethod, setProcessingMethod] = useState<'google-vision' | 'backend'>('google-vision')

  const handleImageUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setImage(file)
      setPlayerNames([])
      setError(null)
      setOcrText('')
      
      // Create image preview
      const reader = new FileReader()
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }, [])

  const extractPlayerNamesGoogleVision = useCallback(async () => {
    if (!image) return

    setLoading(true)
    setProgress(0)
    setError(null)

    try {
      const formData = new FormData()
      formData.append('file', image)

      const response = await fetch('http://localhost:8000/extract-names-vision/', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        throw new Error('Failed to extract names using Google Vision API')
      }

      const result = await response.json()
      
      if (result.success) {
        setPlayerNames(result.player_names)
        setOcrText(result.extracted_text || '')
        onPlayersExtracted?.(result.player_names)
        
        if (result.player_names.length === 0) {
          setError('No player names found in the image. Please try with a clearer image.')
        }
      } else {
        setError(result.message || 'Failed to extract player names')
      }
      
    } catch (err) {
      setError('Failed to connect to Google Vision API. Please ensure the API is running.')
      console.error('Google Vision API Error:', err)
    } finally {
      setLoading(false)
      setProgress(0)
    }
  }, [image, onPlayersExtracted])

  const extractPlayerNamesBackend = useCallback(async () => {
    if (!image) return

    setLoading(true)
    setError(null)

    try {
      const formData = new FormData()
      formData.append('file', image)

      const response = await fetch('http://localhost:8000/extract-names/', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        throw new Error('Failed to extract names from backend')
      }

      const result = await response.json()
      
      if (result.success) {
        setPlayerNames(result.player_names)
        onPlayersExtracted?.(result.player_names)
      } else {
        setError(result.message || 'Failed to extract player names')
      }
      
    } catch (err) {
      setError('Failed to connect to backend. Please ensure the API is running.')
      console.error('Backend Error:', err)
    } finally {
      setLoading(false)
    }
  }, [image, onPlayersExtracted])

  const extractPlayerNames = useCallback(async () => {
    if (processingMethod === 'google-vision') {
      await extractPlayerNamesGoogleVision()
    } else {
      await extractPlayerNamesBackend()
    }
  }, [processingMethod, extractPlayerNamesGoogleVision, extractPlayerNamesBackend])

  const clearImage = useCallback(() => {
    setImage(null)
    setImagePreview(null)
    setPlayerNames([])
    setError(null)
    setOcrText('')
    setProgress(0)
  }, [])

  return (
    <div className={`bg-white rounded-lg shadow-md p-6 ${className}`}>
      <h2 className="text-xl font-bold mb-4 text-gray-800">
        Extract Player Names from Screenshot
      </h2>
      
      {/* Processing Method Selection */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Processing Method
        </label>
        <div className="flex gap-4">
          <label className="flex items-center">
            <input
              type="radio"
              value="google-vision"
              checked={processingMethod === 'google-vision'}
              onChange={(e) => setProcessingMethod(e.target.value as 'google-vision')}
              className="mr-2"
            />
            Google Vision API
          </label>
          <label className="flex items-center">
            <input
              type="radio"
              value="backend"
              checked={processingMethod === 'backend'}
              onChange={(e) => setProcessingMethod(e.target.value as 'backend')}
              className="mr-2"
            />
            Backend (FastAPI)
          </label>
        </div>
      </div>
      
      {/* Image Upload */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Upload Dream11 Screenshot
        </label>
        <input
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
        />
      </div>

      {/* Image Preview */}
      {imagePreview && (
        <div className="mb-4">
          <img
            src={imagePreview}
            alt="Uploaded screenshot"
            className="max-w-full h-48 object-contain rounded-lg border border-gray-200"
          />
          <button
            onClick={clearImage}
            className="mt-2 text-sm text-red-600 hover:text-red-800"
          >
            Clear Image
          </button>
        </div>
      )}

      {/* Extract Button */}
      <button
        onClick={extractPlayerNames}
        disabled={!image || loading}
        className={`w-full py-2 px-4 rounded-lg font-medium transition-colors ${
          !image || loading
            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
            : 'bg-blue-600 text-white hover:bg-blue-700'
        }`}
      >
        {loading ? 
          'Processing with Google Vision API...' 
          : 'Extract Player Names'}
      </button>

      {/* Loading indicator */}
      {loading && (
        <div className="mt-4 text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="text-sm text-gray-600 mt-2">
            {processingMethod === 'google-vision' ? 'Processing with Google Vision API...' : 'Processing with backend...'}
          </p>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      {/* Extracted Player Names */}
      {playerNames.length > 0 && (
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-3 text-gray-800">
            Extracted Player Names ({playerNames.length})
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {playerNames.map((name, index) => (
              <div
                key={index}
                className="bg-green-50 border border-green-200 rounded-lg p-2 text-center"
              >
                <span className="text-green-800 font-medium">{name}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Debug: Show extracted text */}
      {ocrText && (
        <details className="mt-4">
          <summary className="cursor-pointer text-sm text-gray-600 hover:text-gray-800">
            View Raw Extracted Text (Debug)
          </summary>
          <pre className="mt-2 p-3 bg-gray-100 rounded text-xs text-gray-700 whitespace-pre-wrap max-h-32 overflow-y-auto">
            {ocrText}
          </pre>
          <div className="mt-2 text-xs text-gray-600">
            <p><strong>Lines found:</strong> {ocrText.split('\n').filter(line => line.trim().length > 0).length}</p>
            <p><strong>Processing method:</strong> {processingMethod === 'google-vision' ? 'Google Vision API' : 'Backend OCR'}</p>
          </div>
        </details>
      )}
    </div>
  )
}

export default OCRPlayerExtractor
