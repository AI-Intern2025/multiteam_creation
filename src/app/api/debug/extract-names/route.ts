import { NextRequest, NextResponse } from 'next/server'
import { extractPlayerNamesOnly } from '@/utils/metadata-parser'

export async function POST(request: NextRequest) {
  try {
    const { ocrText } = await request.json()
    
    if (!ocrText) {
      return NextResponse.json(
        { error: 'OCR text is required' },
        { status: 400 }
      )
    }
    
    const extractedNames = extractPlayerNamesOnly(ocrText)
    
    // Split OCR text into lines for better debugging
    const ocrLines = ocrText.split('\n').filter((line: string) => line.trim().length > 0)
    
    return NextResponse.json({ 
      extractedNames,
      count: extractedNames.length,
      ocrPreview: ocrText.substring(0, 500) + '...',
      fullOcrText: ocrText,
      ocrLines: ocrLines,
      debug: {
        totalLines: ocrLines.length,
        processedNames: extractedNames.length,
        cleanedText: ocrText
          .replace(/cricbuzz11/gi, '')
          .replace(/[^\w\s\n.-]/g, ' ')
          .replace(/\s+/g, ' ')
          .substring(0, 300) + '...'
      }
    })
    
  } catch (error) {
    console.error('Error extracting names:', error)
    return NextResponse.json(
      { error: 'Failed to extract names' },
      { status: 500 }
    )
  }
}
