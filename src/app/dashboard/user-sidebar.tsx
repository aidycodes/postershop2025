'use client'
import { useState } from "react";
import { ChevronLeft, ChevronRight, User, Package, Settings } from "lucide-react";
import { LayoutDashboard } from "lucide-react";
import { Nunito } from "next/font/google";
import { usePathname } from "next/navigation";
import { useRef, useEffect } from "react";

import Link from "next/link";

const nunito = Nunito({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-nunito',
});

const navItems = [
    { name: 'User Details', icon: User, href: '/dashboard/user' },
    { name: 'Orders', icon: Package, href: '/dashboard/orders' },
    { name: 'Settings', icon: Settings, href: '/dashboard/settings' }
  ];

const UserSidebar = () => {
    const [isCollapsed, setIsCollapsed] = useState(false);

    const pathname = usePathname() 


const boxRef = useRef<HTMLDivElement>(null);

useEffect(() => {
  if (boxRef.current) {
    const rect = boxRef.current.getBoundingClientRect();
    console.log('Element position:', rect.top, rect.left);
    console.log('Element size:', rect.width, rect.height);
  }
}, []);


    return (
       
      <div ref={boxRef} className={`absolute h-full top-0 left-0 z-10 bg-slate-200 outline outline-slate-300 shadow-lg transition-all duration-300 ${
        isCollapsed ? 'w-16' : 'w-16 md:w-64'
      }`}>
        {/* Sidebar Header */}
        <div className="flex items-center justify-between p-4 gap-1">
         {!isCollapsed && <LayoutDashboard className="hidden md:block ml-1" size={19}  />}
              <LayoutDashboard className="block md:hidden ml-1" size={19}  />
          {!isCollapsed && <h1 className={`hidden md:block text-xl text-slate-800 font-bold mr-auto ${nunito.className} tracking-wide`}> Dashboard</h1>}
          <button 
            onClick={() => setIsCollapsed(!isCollapsed)}  
            className="hidden md:block p-2 rounded-lg hover:bg-gray-100 cursor-pointer transition-color duration-100 hover:text-blue-600"
          >
           <ChevronRight size={20} className={`transition-transform duration-600  ${isCollapsed ? "rotate-180" : "rotate-0"}`} /> 
          </button>
          
        </div>
        <div className="w-full h-px bg-slate-300" />
        {/* Navigation Items */}
        <nav className="p-4">
          {navItems.map((item) => ( //gradient border for active link
            <div key={item.name} title={item.name} className={`: ""}`}>
            <Link
              key={item.name}
              href={item.href}  //gradient border for active link no color change
              className={`flex items-center gap-4 p-2 rounded-lg hover:bg-gray-100 mb-2 text-gray-700 hover:text-gray-900 group ${pathname === item.href ? " bg-blue-300 rounded-lg md:bg-transparent md:outline-2 md:outline-blue-300 "  : " "}`}
            >
              <item.icon size={20} />
              {!isCollapsed && <span className={`hidden md:block text-decoration-none group-hover:text-blue-600 group-hover:font-semibold ${nunito.className} ${pathname === item.href ? "text-blue-600 font-medium" : ""}`}>{item.name}</span>}
            </Link>
            </div>
          ))}
        </nav>
      </div>
    )
}

export default UserSidebar
