import type { Category } from "@/components/categorys/categorys"
import { useState } from "react"
import Link from "next/link"

const EMJOIS = {
    Gaming: "🕹️",
    Anime: "🍥",
    SciFi: "🛸",
    Kids: "👶",
}

const LinkWithDropdown = ({categories, label, href}: {categories: Category[], label: string, href: string}) => {
    const [isOpen, setIsOpen] = useState(false)

    return (
        <div className="relative" onMouseEnter={() => setIsOpen(true)} onMouseLeave={() => setIsOpen(false)}>
            <Link href={href} className="py-2 hover:text-blue-500 text-gray-600 transition-colors">
                {label}
            </Link>
            {isOpen && (
                <div className="absolute top-full left-0 pt-2 z-50 shadow-md hidden md:block">
                    <div className="bg-white rounded-lg shadow-lg ring-1 ring-gray-200 ring-opacity-5 overflow-hidden">
                        <div className="flex flex-col w-56">
                            {categories.map((category) => (
                                <Link onClick={() => setIsOpen(false)}
                                    key={category.name} 
                                    href={`/categories/${category.name}`}
                                    className="px-4 py-3 hover:bg-gray-100 transition-colors flex items-center space-x-2"
                                >
                                    
                                    <span className="text-lg text-gray-700 font-medium">
                                       {EMJOIS[category.name as keyof typeof EMJOIS]} {category.name}
                                    </span>
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default LinkWithDropdown
