import React from 'react'
import { Zap } from 'lucide-react'
export default function Logo() {
    return (
        <a href="/" className=" flex items-center gap-2">
            <div className="flex items-center justify-center w-9 h-9 bg-[#c96] rounded-lg">
                <Zap size={20} className="text-white" fill="white" />
            </div>
            <span className="text-2xl font-extrabold tracking-tight text-gray-900">
                Shop<span className="text-[#c96]">ella</span>
            </span>
        </a>

    )
}