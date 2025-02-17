'use client'
import React, { useState } from 'react';
import { Plus, Minus, ShoppingCart, Check, X, AlertCircle } from 'lucide-react';
import ProductStock from '@/components/products/product-stock';
import ImageComponent from './ImageComponent';
import Suggestions from '@/components/Suggestions/suggestions';
import useAddItemToCart from '@/app/queryhooks/useAddItemToCart';
import { extractASize } from '@/lib/utils';

export interface ProductProps {
  id: string;
  productname: string;
  price: number;
  image: string;
  description: string;
  stock: number;
  sku?: string;
  options: {
    sizes: { [key: string]: string | number };
    stripeIds: { [key: string]: string };
    Stock: { Small: number 
        Medium: number
        Large: number
        XLarge: number
    };
  };
}

const ProductPage = ({ id, productname, image, description, stock, sku, options }: ProductProps) => {

const sizes = Object.entries(options?.sizes || {})

  const [selectedSize, setSelectedSize] = useState<[string, number]>(['Small (A3 - 11.7" × 16.5" / 297 × 420 mm)', 10]);
  const [withFrame, setWithFrame] = useState(false);
  const [quantity, setQuantity] = useState(1);

 
  const framePrice = 29.99;
  const totalPrice = (Number(selectedSize[1]) + (withFrame ? framePrice : 0)) * quantity;
  const handleQuantityChange = (delta: number) => {
    setQuantity(Math.max(1, quantity + delta));
  };

  const {mutate, isPending} = useAddItemToCart()

const addToCart = () => {
  if (!selectedSize[1]) return;
  
  mutate({
    poster: {
      id: id, 
      productname: productname, 
      price: selectedSize[1].toString(),
      image: image,
      description: description,
      options: options
    },
    selectedSize: selectedSize[0] as string, 
    withFrame: withFrame, 
    quantity: quantity,
    totalPrice: totalPrice
  });
}

const selectedSizeStock = options?.Stock?.[
    (selectedSize[0]?.split(' ')?.[0] ?? 'Small')
      .charAt(0).toUpperCase() + 
    (selectedSize[0]?.split(' ')?.[0] ?? 'Small')
      .slice(1) as keyof typeof options.Stock
  ]

  const handleOptionsOutOfStock = (sizeString: string) => {
   const sizeKey = options?.Stock?.[sizeString as keyof typeof options.Stock];
    return sizeKey === 0;
  }


  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="grid md:grid-cols-2 gap-8">

        {/* Left Column - Image and Mobile Controls */}
        <div className="space-y-6">
          {/* Product Image with Zoom */}
          <ImageComponent image={image ?? ''} />
         
          {/* Framing and Quantity on Medium Screens */}
          <div className="hidden md:block lg:hidden space-y-6">
            {/* Framing Option */}
            <div className="bg-white p-6 rounded-xl shadow-md">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-semibold">Add Professional Framing</h3>
                  <p className="text-gray-500">Black wooden frame with glass protection</p>
                </div>
                <button 
                  onClick={() => setWithFrame(!withFrame)}
                  className={`px-6 cursor-pointer w-auto py-3 rounded-lg transition-all duration-200 ${
                    withFrame 
                      ? 'bg-red-400 text-white' 
                      : 'bg-green-600 hover:bg-green-500 text-white'
                  }`}
                >
                  {withFrame ? 'Remove Frame' : `Add Frame +£${framePrice.toFixed(2)}`}
                </button>
              </div>
            </div>

            {/* Quantity Selector */}
            <div className="bg-white p-6 rounded-xl shadow-md">
              <h3 className="text-xl font-semibold mb-4">Quantity</h3>
              <div className="flex items-center space-x-4">
                <button 
                  onClick={() => handleQuantityChange(-1)}
                  className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors cursor-pointer"
                >
                  <Minus className="w-6 h-6" />
                </button>
                <span className="text-2xl font-bold w-12 text-center">{quantity}</span>
                <button 
                  onClick={() => handleQuantityChange(1)}
                  className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors cursor-pointer"
                >
                  <Plus className="w-6 h-6" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Product Details */}
        <div className="space-y-8">
          <div>
            <div className='flex items-center gap-3 mb-2'>
            <ProductStock 
              stock={ selectedSizeStock ?? 100} 
            />
            <span className="text-sm mb-2 text-gray-500">SKU: {sku ? sku : id ? id.toString().charAt(0).toUpperCase() + id.toString().slice(1,4) : ''} </span>
            </div>
            <h1 className="text-4xl font-bold mb-3 bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
             {productname}
            </h1>
            <p className="text-gray-600 text-lg leading-relaxed">
             {description}
              Our posters are printed on premium matte paper with archival-quality inks for vibrant, long-lasting colors.
            </p>
          </div>

          {/* Size Selection */}
          <div className="bg-white p-6 rounded-xl shadow-lg space-y-4">
            <h3 className="text-xl font-semibold mb-4">Choose Size</h3>
            {Object.entries(options?.sizes || {}).length > 0 ? (
              <div className="space-y-3">
                {Object.entries(options?.sizes || {}).sort((a, b) => extractASize(b[0]) - extractASize(a[0])).map(([key, value], i) => (
                  <div 
                    key={key}
                    onClick={() => setSelectedSize([key, value as number])}
                    className={`p-4 rounded-lg cursor-pointer transition-all duration-200 
                     
                      ${
                      selectedSize[0] === key 
                        ? 'bg-blue-500 hover:bg-blue-600 text-white' 
                        : 'bg-gray-50 hover:bg-gray-100 '
                    }`}
                  >
                    <div className={`flex items-center justify-between 
                        ${handleOptionsOutOfStock(key.match(/^\S+/)?.[0] as string) ? 'text-decoration-line: line-through text-gray-300' : ''}`}>
                      <span className="font-medium">{key}  </span>
                      <span className={`font-bold`}>${value}.00</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p>No sizes available</p>
            )}
          </div>

          {/* Framing and Quantity - Hidden on Medium Screens */}
          <div className="md:hidden lg:block">
            {/* Framing Option */}
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-semibold">Add Professional Framing</h3>
                  <p className="text-gray-500">Black wooden frame with glass protection</p>
                </div>
                <button 
                  onClick={() => setWithFrame(!withFrame)}
                  className={`px-6 cursor-pointer w-auto py-3 rounded-lg transition-all duration-200 ${
                    withFrame 
                      ? 'bg-red-400 text-white' 
                      : 'bg-green-600 hover:bg-green-500 text-white'
                  }`}
                >
                  {withFrame ? 'Remove Frame' : `Add Frame +£${framePrice.toFixed(2)}`}
                </button>
              </div>
            </div>

            {/* Quantity Selector */}
            <div className="bg-white p-6 rounded-xl shadow-lg mt-4">
              <h3 className="text-xl font-semibold mb-4">Quantity</h3>
              <div className="flex items-center space-x-4">
                <button 
                  onClick={() => handleQuantityChange(-1)}
                  className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors cursor-pointer"
                >
                  <Minus className="w-6 h-6" />
                </button>
                <span className="text-2xl font-bold w-12 text-center">{quantity}</span>
                <button 
                  onClick={() => handleQuantityChange(1)}
                  className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors cursor-pointer"
                >
                  <Plus className="w-6 h-6" />
                </button>
              </div>
            </div>
          </div>

          {/* Price and Add to Cart */}
          <div className="bg-white p-6 rounded-xl shadow-lg space-y-4">
            <div className="flex items-baseline justify-between">
              <span className="text-xl">Total Price:</span>
              <span className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                £{totalPrice.toFixed(2)}
              </span>
            </div>
            <button onClick={addToCart} disabled={selectedSizeStock === 0} 
            className={`w-full bg-blue-500 cursor-pointer text-white py-4 rounded-lg text-lg
             font-medium hover:bg-blue-600 transition-colors flex items-center justify-center space-x-2 group ${selectedSizeStock === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}>
              <ShoppingCart className="w-6 h-6 transform group-hover:scale-110 transition-transform" />
              <span>Add to Cart</span>
            </button>
          </div>
        </div>
      </div>

      {/* Customers Also Bought Section */}
      <div className="mt-16">
      <Suggestions title="Customers Also Bought" />
      </div>
    </div>
  );
};

export default ProductPage;