'use client'

import { useState, useRef } from 'react'
import { useAuth } from '@/providers/AuthProvider'
import { useRouter } from 'next/navigation'
import { Upload, Image, X, Check, AlertCircle } from 'lucide-react'
import Navigation from '@/components/Navigation'
import ProtectedRoute from '@/components/ProtectedRoute'
import toast from 'react-hot-toast'

export default function UploadPage() {
  const { user, isAdmin } = useAuth()
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  const [extractedData, setExtractedData] = useState<any>(null)

  useState(() => {
    if (!user) {
      router.push('/')
      return
    }

    if (!isAdmin()) {
      router.push('/')
      return
    }
  })

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setSelectedFile(file)
      const url = URL.createObjectURL(file)
      setPreviewUrl(url)
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    const file = e.dataTransfer.files[0]
    if (file && file.type.startsWith('image/')) {
      setSelectedFile(file)
      const url = URL.createObjectURL(file)
      setPreviewUrl(url)
    }
  }

  const clearSelection = () => {
    setSelectedFile(null)
    setPreviewUrl(null)
    setExtractedData(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleUpload = async () => {
    if (!selectedFile) {
      toast.error('Please select a file first')
      return
    }

    setUploading(true)
    
    try {
      // Simulate OCR processing
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Mock extracted data
      const mockData = {
        matches: [
          {
            team1: 'WI',
            team2: 'AUS',
            format: 'T20',
            venue: 'Kensington Oval, Barbados',
            matchDate: '2025-07-10T19:30:00Z',
            isActive: true
          },
          {
            team1: 'IND',
            team2: 'PAK',
            format: 'ODI',
            venue: 'Eden Gardens, Kolkata',
            matchDate: '2025-07-11T14:00:00Z',
            isActive: true
          }
        ],
        confidence: 0.92
      }

      setExtractedData(mockData)
      toast.success('Screenshot processed successfully!')
      
    } catch (error) {
      toast.error('Failed to process screenshot')
    } finally {
      setUploading(false)
    }
  }

  const confirmAndSave = async () => {
    if (!extractedData) return

    try {
      // In a real app, this would save to database
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      toast.success('Matches added successfully!')
      clearSelection()
      
      // Redirect to admin dashboard
      router.push('/admin')
      
    } catch (error) {
      toast.error('Failed to save matches')
    }
  }

  return (
    <ProtectedRoute requireAdmin>
      <div className="min-h-screen bg-gray-50">
        <Navigation />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Upload Match Screenshot</h1>
          <p className="text-gray-600 mt-2">Upload a screenshot of upcoming matches to automatically extract match details</p>
        </div>

        {/* Upload Area */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              selectedFile 
                ? 'border-green-300 bg-green-50' 
                : 'border-gray-300 hover:border-dream11-primary hover:bg-blue-50'
            }`}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
          >
            {previewUrl ? (
              <div className="space-y-4">
                <div className="relative inline-block">
                  <img
                    src={previewUrl}
                    alt="Preview"
                    className="max-h-64 rounded-lg shadow-md"
                  />
                  <button
                    onClick={clearSelection}
                    className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <div className="flex items-center justify-center space-x-2 text-green-600">
                  <Check className="w-5 h-5" />
                  <span className="font-medium">{selectedFile?.name}</span>
                </div>
                <button
                  onClick={handleUpload}
                  disabled={uploading}
                  className="px-6 py-3 bg-dream11-primary text-white rounded-lg hover:bg-dream11-accent disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {uploading ? 'Processing...' : 'Process Screenshot'}
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex justify-center">
                  <Image className="w-12 h-12 text-gray-400" />
                </div>
                <div>
                  <p className="text-gray-600 mb-2">
                    Drag and drop a screenshot here, or click to select
                  </p>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center space-x-2 px-4 py-2 bg-dream11-primary text-white rounded-lg hover:bg-dream11-accent mx-auto"
                  >
                    <Upload className="w-4 h-4" />
                    <span>Choose File</span>
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                </div>
                <p className="text-sm text-gray-500">
                  Supported formats: JPG, PNG, GIF (Max 10MB)
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Extracted Data */}
        {extractedData && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center space-x-2 mb-4">
              <AlertCircle className="w-5 h-5 text-blue-500" />
              <h2 className="text-lg font-semibold text-gray-900">Extracted Match Data</h2>
              <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                {Math.round(extractedData.confidence * 100)}% Confidence
              </span>
            </div>
            
            <div className="space-y-4">
              {extractedData.matches.map((match: any, index: number) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Teams</label>
                      <input
                        type="text"
                        value={`${match.team1} vs ${match.team2}`}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-dream11-primary"
                        readOnly
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Format</label>
                      <select
                        value={match.format}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-dream11-primary"
                      >
                        <option value="T20">T20</option>
                        <option value="ODI">ODI</option>
                        <option value="TEST">TEST</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Venue</label>
                      <input
                        type="text"
                        value={match.venue}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-dream11-primary"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Date & Time</label>
                      <input
                        type="datetime-local"
                        value={match.matchDate.slice(0, 16)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-dream11-primary"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={clearSelection}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={confirmAndSave}
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                Save Matches
              </button>
            </div>
          </div>
        )}

        {/* Instructions */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-6">
          <h3 className="font-medium text-blue-900 mb-2">Tips for better results:</h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Ensure the screenshot is clear and well-lit</li>
            <li>• Include match details like team names, dates, and venues</li>
            <li>• Crop the image to focus on the match information</li>
            <li>• Use high-resolution images when possible</li>
          </ul>
        </div>
      </div>
    </div>
    </ProtectedRoute>
  )
}
