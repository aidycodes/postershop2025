'use client'
import { Search } from "lucide-react"
import { useState } from "react"
import { SearchPopup } from "@/components/search/search-popup"
import SearchArea from "@/components/navigation/search-area"
import { useRef } from "react"

const NavSearch = () => {
    const [isOpen, setIsOpen] = useState(false)

    const handleClose = () => {
        setIsOpen(false)
    }

    return (
        <div className="relative">
            <button 
                className="hover:text-gray-900 cursor-pointer group" 
                onMouseDown={(e) => {
                    e.preventDefault()
                }}
                onClick={() => setIsOpen(!isOpen)}
            >
                <Search className="h-6 w-6 text-gray-400 group-hover:text-gray-900" />
            </button>
            <SearchArea isOpen={isOpen} onClose={handleClose}/>
        </div>
    )
}

export default NavSearch

