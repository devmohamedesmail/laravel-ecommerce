import { Link } from '@inertiajs/react'
import React from 'react'

export default function NavbarIcon({
    href,
    icon,
    count,
    label
}: any) {
    return (
        <Link href={href} className="relative p-2 flex flex-col items-center text-gray-700 hover:text-primary transition-colors group">
            {icon}
            {count > 0 && (
                <span className="absolute top-1 right-1 bg-primary text-white text-[9px] font-bold rounded-full w-4 h-4 flex items-center justify-center leading-none">
                    {count}
                </span>
            )}
            <span className="hidden lg:block text-[10px] text-gray-500 text-center mt-1">{label}</span>
        </Link>
    )
}
