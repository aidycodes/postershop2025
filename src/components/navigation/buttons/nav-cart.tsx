'use client'
import { ShoppingCart } from "lucide-react"
import { useQuery } from "@tanstack/react-query"
import Link from "next/link"
import { client } from "@/lib/client"


const NavCart = ({initialData, isSignedIn}: {initialData: {userCart: {id: number}[]}, isSignedIn: boolean}) => {

    const { data }  = useQuery({
        queryKey: ['cart'],
        initialData: {
            userCart: []
        },

        queryFn: async() => {
            const res = await client.users.cart.$get()
            if(res.status !== 200) {
                throw new Error("Failed to fetch cart")
            }
            return res.json()
        },        
    })

    return (
        <div className="relative">
        <Link className="hover:text-gray-900 group cursor-pointer group" href={`${isSignedIn ? "/users/cart" : "/guest/cart"}`} >
            <ShoppingCart className="h-6 w-6 text-gray-400 group-hover:text-gray-900" />
            {data?.userCart.length + 1 > 0 && (
                <span className="absolute top-1 right-0 inline-flex items-center justify-center px-[4px] py-[2px] text-xs font-bold leading-none text-red-100 transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">
                    {data?.userCart.length  }
                </span>
            )}

        </Link>
        </div>

    )


}


export default NavCart
