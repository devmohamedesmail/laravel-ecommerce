import { AlertCircle } from 'lucide-react';
import React from 'react'

export default function ErrorMessage({message}: {message?: string}) {
    if (!message) return null;
  return (
    <div className="text-xs text-red-500 mt-1 flex items-center gap-1">
        <AlertCircle size={11} className="shrink-0" /> 
        {message}
    </div>
  )
}
