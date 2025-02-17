'use client'
import { ShoppingCart } from "lucide-react"
import { useQuery } from "@tanstack/react-query"
import Link from "next/link"
import { client } from "@/lib/client"

interface NavCartProps {
    isSignedIn: boolean;
}

const NavCart = ({ isSignedIn }: NavCartProps) => {
    const { data } = useQuery({
        queryKey: ['cart'],
        queryFn: async () => {
            const res = await client.cart.getCart.$get();

            if (res.status !== 200) {
                throw new Error("Failed to fetch cart");
            }

            
            return res.json();
        },
        initialData: {
            cart: {
                id: '',
                user_id: null,
                guest_token: null,
                created_at: null,
                updated_at: null
            },
            items: []
        }
       
    });
console.log(data, 'data')
    const cart = data?.cart;
    const items = data?.items;
    

    return (
        <div className="relative">
            <Link className="hover:text-gray-900 group cursor-pointer group" href={`${isSignedIn ? "/cart" : "/cart"}`}>
                <ShoppingCart className="h-6 w-6 text-gray-400 group-hover:text-gray-900" />
                {items?.length && items?.length > 0 ? (
                    <span className="absolute top-1 right-0 inline-flex items-center justify-center px-[4px] py-[2px] text-xs font-bold leading-none text-red-100 transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">
                        {items?.length}
                    </span>
                ) : null}
            </Link>
        </div>
    );
};

export default NavCart
