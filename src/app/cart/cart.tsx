'use client'
import { client } from "@/lib/client";
import { useMutation, useSuspenseQuery } from "@tanstack/react-query";
import React from "react";
import CartItem from "./cart-item";
import { useQuery } from "@tanstack/react-query";
import EmptyCart from './EmptyCart';
import LoadingCart from './LoadingCart';
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

type SelectedOptions = {
  frame?: boolean;
  [key: string]: any;
}

const Cart = () => {
  const { data, isLoading, isPending: isCartLoading, error: cartError } = useQuery({
    queryKey: ['cart'],
    queryFn: async() => {
      const res = await client.cart.getCart.$get()
      if(res.status === 200){
      return res.json()
      }
      throw new Error('Failed to fetch cart')
    }
  })

  const {mutate: createCheckoutSession, isPending, isError, error} = useMutation({
    mutationFn: async() => { 
      if (!data?.items) return;
      const cartItems = data.items.map(item => ({
        quantity: item.qty,
        name: item.productname,
        stripeid: item.stripeid,
        price: item.price,
        frame: (item.selected_options as SelectedOptions)?.frame ? true : false
      }));
      const res = await client.payment.create.$post({ cartItems, rawItems: data.items });
      return res.json();
    },
    onSuccess: (data) => {
      router.push(data?.url as string)
    },
    onError: (error) => {
      console.log(error)
    }
  })
  const router = useRouter()


  if (isLoading || isCartLoading) {
    return <LoadingCart />;
  }

  const items = [...(data?.items || [])].sort((a, b) => 
    new Date(b.created_at as Date).getTime() - new Date(a.created_at as Date).getTime()
  );
  const subtotal = items?.reduce((acc, item) => acc + (+item?.price * item?.qty), 0) || 0;
  const shipping = subtotal > 50 ? 0 : 5.99 
  const total = subtotal + shipping 


  
  return (
    <div className="max-w-5xl mx-auto px-4 py-12 ">
      <h1 className="text-3xl font-bold text-gray-900 mb-12">Shopping Cart</h1>
      
      <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
        <div className="lg:col-span-8">
          {cartError && <div className="text-red-500 text-sm text-center mt-4">An error occurred fetching cart, please try again.</div>}
          {items.length === 0 ? (
            <EmptyCart />
          ) : (
            <div className="space-y-1">
              {items.map(item => (
                <CartItem key={item.id} item={item} />
              ))}
            </div>
          )}
        </div>
        <div className="lg:col-span-4">
          <div className="bg-gray-50 rounded-lg p-6 lg:min-h-[340px]">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Order Summary</h2>         
            <div className="space-y-4">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span>£{subtotal?.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Shipping</span>
                <span>{shipping === 0  ? <div className="text-green-600 font-semibold">Free</div> : `£${shipping.toFixed(2)}`}</span>
              </div>
           
              <div className="border-t border-gray-200 pt-4 mt-4">
                <div className="flex justify-between font-semibold text-gray-900">
                  <span>Total</span>
                  <span>£{total.toFixed(2)}</span>
                </div>
              </div>
            </div>    
            <button 
            onClick={() => createCheckoutSession()}
              disabled={items.length === 0 || isPending}
              className={`w-full mt-8 py-2 text-lg text-white rounded-md transition-colors cursor-pointer  ${
                items.length === 0 || isPending
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-blue-500 hover:bg-blue-600'
              }`}
            >
              {isPending ? <div className="flex items-center justify-center gap-2"><Loader2 className="animate-spin"/> Processing...</div> : 'Checkout'}
            </button>      
            <p className="text-gray-500 text-sm text-center mt-4">
              {shipping !== 0 ? 'Free shipping on orders over £50' : ''}
              {isError && <div className="text-red-500 text-sm text-center mt-4">An error occurred, please try again.</div>}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;