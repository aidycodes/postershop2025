'use client'
import Link from "next/link";
import { Ellipsis } from 'lucide-react';
import SizeSelector from "./productSize";
import { useState } from "react";
import useAddItemToCart from "@/app/queryhooks/useAddItemToCart";
import ProductStock from "./product-stock";
import Image from "next/image";

export interface Poster {
    id: string;
    productname: string;
    price: string;
    image: string | null;
    description: string;
    stock?: string;
    options?: {
        sizes: {
            [key: string]: string | number
        },
        stripeIds: {
            [key: string]: string
        },
        Stock: { Small: number 
            Medium: number
            Large: number
            XLarge: number
        };
    }

}

const ProductItem = ({poster}: {poster: Poster}) => {

    const sizes = Object.entries(poster.options?.sizes || {});

    const [selectedSize, setSelectedSize] = useState(sizes[1] || '');
    const { mutate, isPending} = useAddItemToCart()
    
    
    const addToCart = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        mutate({poster:{...poster, price:selectedSize[1]?.toString()},
        selectedSize:selectedSize[0],
        withFrame: false,
        quantity: 1,
        totalPrice:Number(selectedSize[1]) })
    }
    
    const handleSizeChange = 
    (e: React.MouseEvent<HTMLDivElement, MouseEvent>,
     size: [string, string | number]) => {
            e.preventDefault();
            setSelectedSize(size);
    }
  
    const handleOptionsOutOfStock = (sizeString: string) => {
        const size = sizeString?.split(' ')[0]
        return poster?.options?.Stock?.[size as keyof typeof poster.options.Stock] || 0
    }

    return (
        <div key={poster.id} className="group flex flex-col">
            {/* Title and price - above image on small screens, below on lg */}
            <div className="order-1 lg:order-2 lg:mt-4 flex lg:block items-center justify-between mr-2 lg:mr-0">
                <h4 className="text-lg font-medium lg:mb-1">{poster.productname}</h4> 
                <p className="text-gray-600 lg:mb-2 font-semibold">£{selectedSize[1]}</p>
            </div>
            {/* Image container */}

            <Link href={`/products/${poster.productname}`} className="relative overflow-hidden rounded-lg order-2 lg:order-1">
                <Image 
                    src={poster.image ?? "/categorys/Anime.jpg"} 
                    alt={poster.productname}
                    className="w-full h-full object-cover transform transition-transform group-hover:scale-105"
                    width={600}
                    height={400}
                    priority
                />
                 <div className="absolute top-0 left-0 w-auto h-auto flex items-start justify-start p-2 group-hover:opacity-100 opacity-0 transition-opacity duration-300">
                    <ProductStock stock={handleOptionsOutOfStock(selectedSize[0])} />
                </div>
                {/* Desktop overlay button */}
                <>
                <div className={`absolute inset-0 hidden lg:flex items-end p-4 opacity-0 group-hover:opacity-100
                     transition-opacity duration-300 bg-gradient-to-t from-black/50 to-transparent`}>
                   <div className="flex flex-col-reverse items-center gap-2 w-full">
                    <button disabled={isPending || poster.stock === '0'} onClick={(e) => addToCart(e)} 
                    className={`w-full cursor-pointer hover:bg-gray-200 bg-white text-gray-900 py-2 rounded-md hover:bg-gray-100 transition-colors ${poster.stock === '0' ? 'opacity-0 cursor-not-allowed' : ''}`}>
                        {isPending ? <div className="flex items-center justify-center"><Ellipsis className="animate-pulse" /></div> : "Add to Cart"}
                    </button>
                  {poster.stock !== '0' &&
                <SizeSelector selectedSize={selectedSize[0]} setSelectedSize={handleSizeChange} sizes={sizes} />
                }
                </div>
                </div>
                </>
            </Link>
            {/* Mobile button - hidden on lg screens */}
             <div className="order-3 lg:hidden">
                <div className="flex mt-2 justify-between items-center gap-2">
             <SizeSelector selectedSize={selectedSize[0]} setSelectedSize={handleSizeChange} sizes={sizes} />
             <div className="pt-2">
             <ProductStock stock={handleOptionsOutOfStock(selectedSize[0])} />
             </div>
             <div className="text-lg font-semibold">
                £{selectedSize[1]}
             </div>
             </div>
                <button onClick={(e) => addToCart(e)} className="w-full cursor-pointer py-2 mt-2 bg-white text-gray-900 rounded-md border border-gray-200 hover:bg-gray-50 transition-colors">
                    Add to Cart
                </button>
            </div>

        </div>
    )
}   


export default ProductItem;
