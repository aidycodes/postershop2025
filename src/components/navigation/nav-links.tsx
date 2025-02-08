import Link from "next/link"

export const LINKS = [{
    label:"New Arrivals",
    href:"/new-arrivals"
},
{
    label:"Categories",
    href:"/categories"
},
{
    label:"Best Sellers",
    href:"/best-sellers"
},
{
    label:"About",
    href:"/about"
},
]

const NavLinks = () => {
    return (
        <div className="hidden md:flex items-center space-x-8">
            {LINKS.map(link => (
                <Link key={link.href} href={link.href}>
                    <div className="flex items-center space-x-1 text-gray-600 hover:text-gray-900 cursor-pointer">
                        {link.label}
                    </div>
                </Link>
            ))}
        </div>
    )
}

export default NavLinks
