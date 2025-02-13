'use client'
import { Search, X } from 'lucide-react'
import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import SearchArea  from '@/components/navigation/search-area'

interface SearchPopupProps {
  isOpen: boolean
  onClose: () => void
}

export function SearchPopup({ isOpen, onClose }: SearchPopupProps) {
  const [searchQuery, setSearchQuery] = useState('')

  const { data } = useQuery({
    queryKey: ["search", searchQuery],
    queryFn: async() => {
      const res = await fetch(`/api/products/search?q=${searchQuery}`)
      return res.json()
    },
    enabled: !!searchQuery
  })

  if (!isOpen) return null

  return (
    <div className="absolute right-0 top-full mt-2 z-50" onBlur={onClose}>
      {/* Search Window */}
      <div className="w-72 rounded-lg bg-white p-3 shadow-lg border border-gray-100">
        <div className="relative flex items-center">
          <Search className="absolute left-3 h-4 w-4 text-gray-400" />
          <input
            type="text"
            className="w-full rounded-md border border-gray-200 py-1.5 pl-9 pr-9 text-sm focus:outline-none"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            autoFocus
          />
          <button
            onClick={onClose}
            className="absolute right-3 text-gray-400 hover:text-gray-600"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
 
        
      </div>
    
    </div>
  )
} 