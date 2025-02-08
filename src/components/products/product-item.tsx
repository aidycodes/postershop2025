'use client'
import Link from "next/link";

interface Poster {
    id: number;
    title: string;
    price: string;
    imageUrl: string;
}

const ProductItem = ({poster}: {poster: Poster}) => {

    const addToCart = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        console.log("Adding to cart");
    }

    return (
        <div key={poster.id} className="group flex flex-col">
            {/* Title and price - above image on small screens, below on lg */}
            <div className="order-1 lg:order-2 lg:mt-4 flex lg:block items-center justify-between mr-2 lg:mr-0">

                <h4 className="text-lg font-medium lg:mb-1">{poster.title}</h4>
                <p className="text-gray-600 lg:mb-2">{poster.price}</p>
            </div>
            {/* Image container */}
            <Link href={`/products/${poster.id}`} className="relative overflow-hidden rounded-lg order-2 lg:order-1">
                <img 
                    src={poster.imageUrl} 
                    alt={poster.title}
                    className="w-full h-full object-cover transform transition-transform group-hover:scale-105"
                />
                {/* Desktop overlay button */}
                <div className="absolute inset-0 hidden lg:flex items-end p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-t from-black/50 to-transparent">
                    <button onClick={(e) => addToCart(e)} className="w-full bg-white text-gray-900 py-2 rounded-md hover:bg-gray-100 transition-colors">
                        Add to Cart
                    </button>
                </div>

            </Link>
            {/* Mobile button - hidden on lg screens */}
             <div className="order-3 lg:hidden">
                <button onClick={(e) => addToCart(e)} className="w-full py-2 mt-2 bg-white text-gray-900 rounded-md border border-gray-200 hover:bg-gray-50 transition-colors">
                    Add to Cart
                </button>
            </div>

        </div>
    )
}   


export default ProductItem;
