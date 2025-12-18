'use client'
import { Copy, Check } from "lucide-react"
import { useState } from "react"

export default function CopyButton({ textToCopy, ariaLabel, onCopy, eventData = {} }) {
  const [copied, setCopied] = useState(false)
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(textToCopy)
      setCopied(true)
      
      // Call the onCopy callback if provided
      if (onCopy) {
        onCopy({
          success: true,
          text: textToCopy,
          ...eventData
        })
      }
      
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
      
      // Call the onCopy callback with error state if provided
      if (onCopy) {
        onCopy({
          success: false,
          error: err.message,
          text: textToCopy,
          ...eventData
        })
      }
    }
  }
  return (
    <button
      onClick={handleCopy}
      className="ml-2 text-gray-400 hover:text-[#bf2e2e] transition-colors"
      aria-label={ariaLabel}
    >
      {copied ? (
        <Check className="h-4 w-4 text-green-500" />
      ) : (
        <Copy className="h-4 w-4" />
      )}
    </button>
  )
}