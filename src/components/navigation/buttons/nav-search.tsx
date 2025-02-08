'use client'
import { Search } from "lucide-react"
import { useState } from "react"
import { SearchPopup } from "@/components/search/search-popup"

const NavSearch = () => {
    const [isOpen, setIsOpen] = useState(false)

    return (
        <div className="relative">
            <button 
                className="hover:text-gray-900 cursor-pointer group" 
                onClick={() => setIsOpen(true)}

            >
                <Search className="h-6 w-6 text-gray-400 group-hover:text-gray-900" />
            </button>
            <SearchPopup isOpen={isOpen} onClose={() => setIsOpen(false)} />
        </div>
    )
}

export default NavSearch

