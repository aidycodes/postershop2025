import { cn } from "@/lib/utils"
import Image from "next/image"
import Link from "next/link"

const ShopName = ({name, logo, direction = "forward"}: {name?: string, logo?: string, direction?: "forward" | "backward"}) => {
    return (
        <Link href="/">
        <div className={cn("flex items-center space-x-2 cursor-pointer", direction === "backward" ? "flex-row" : "flex-row-reverse")}>
           <div className={`${direction === "backward" ? 'pr-2' : 'pl-2'}`}>
            {logo && <Image src={logo} alt={name ?? "logo"} width={32} height={32} /> }
             </div>
             {name && <h1 className="text-2xl font-bold">{name}</h1>}       
        </div>
        </Link>
    )
}

export default ShopName
