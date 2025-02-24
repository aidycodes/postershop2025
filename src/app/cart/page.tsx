import Cart from './cart';
import { Metadata } from 'next';
import { headers } from 'next/headers';
import { CartData } from '@/components/navigation/buttons/nav-cart';

export const metadata: Metadata = {
    title: "Poster Hub - Shopping Cart",
    description: "Poster Hub is a platform for buying posters",
    icons: [{ rel: "icon", url: "/favicon.webp" }],
}

const Page = async() => {    
    const originalHeaders = await headers();
    const headersList = new Headers(originalHeaders);

    const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}api/v1/events/cart`, {
        headers: headersList,
        credentials: 'include'
      })

    const cartData: CartData = await res.json()

    return (
        <div className='min-h-[calc(100vh-280px)]'>
        <Cart cart={cartData} />
        </div>
    )

}

export default Page;