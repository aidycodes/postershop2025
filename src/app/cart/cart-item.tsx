import { Minus, Plus, Trash2 } from 'lucide-react';
import { CartItemType } from '@/server/routers/guest-cart-router';
import useUpdateCart from './useUpdateCart';
import useDeleteCartItem from './useDeleteCartItem';
import Link from 'next/link';
type SelectedOptions = {
    size?: string;
    [key: string]: string | undefined;
}

interface CartItemProps {
    item: CartItemType
  }

  const CartItem = ({ 
    item, 
  }: CartItemProps) => {

   const {updateCartItem, isPending} = useUpdateCart(item)
   const {deleteCartItem, isPending: isDeleting} = useDeleteCartItem(item.id as string)

   const SelectedOptions = Object.entries(item.selected_options as SelectedOptions).map(([key, value]) => {
    if(value){
    return (
        <p key={key} className="text-gray-500 mt-1">{key}: {value}</p>
    )
}
   })

    return (
      <div className="flex items-start gap-6 py-6 border-b border-gray-100">
        <div className="relative">
          <img
            src={item.productimage}
            alt={item.productname}
            className="w-32 h-44 object-cover rounded-lg bg-gray-50"
          />
        </div>
        <div className="flex-1 flex flex-col h-44">
          <Link href={`/products/${item.productname}`}>
          <h3 className="font-medium text-lg text-gray-900 hover:underline">{item.productname}</h3>
          </Link>
          <p className="text-gray-500 mt-1">${item.price}</p>
          {SelectedOptions}
          <div className="mt-auto">
            <div className="flex items-center gap-3">
              <div className="flex items-center bg-gray-50 rounded-lg">

                <button
                  className="p-2 hover:text-blue-600 transition-colors disabled:opacity-50 cursor-pointer"
                  onClick={() => item.qty > 1 && updateCartItem({id:item.id as string, newQuantity:item.qty - 1}) } 
                  disabled={item.qty <= 1}
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="w-8 text-center font-medium">{item.qty}</span>
                <button
                  className="p-2 hover:text-blue-600 transition-colors cursor-pointer"
                  onClick={() => updateCartItem({id:item.id as string, newQuantity:item.qty + 1})}
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
              <button
                onClick={() => deleteCartItem()}
                className="p-2 text-gray-400 hover:text-red-500 transition-colors cursor-pointer"
              >
                <Trash2 className="h-6 w-6" />
              </button>
            </div>
          </div>
        </div>   
        <div className="flex flex-col h-44">
          <p className="font-semibold text-lg text-gray-900 mt-auto">
            ${(parseFloat(item.price) * item.qty).toFixed(2)}
          </p>
        </div>
      </div>
    );
  };

  export default CartItem;