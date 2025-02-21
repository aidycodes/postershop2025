import Cart from './cart';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: "Poster Hub - Shopping Cart",
    description: "Poster Hub is a platform for buying posters",
    icons: [{ rel: "icon", url: "/favicon.webp" }],
}

const Page = async () => {    
    return (
        <div className='min-h-[calc(100vh-280px)]'>
        <Cart />
        </div>
    )

}

export default Page;