import { useMutation, useQueryClient } from "@tanstack/react-query"
import { client } from "@/lib/client"
import { Poster } from "@/components/products/product-item"
import { useId } from "react"
type AddItemToCartProps = {
    poster: Poster,
    selectedSize: string,
    withFrame: boolean,
    quantity: number,
    totalPrice: number,

}

const useAddItemToCart = () => {
    const queryClient = useQueryClient()
   const id = useId()

    const {mutate, isPending} = useMutation({
        mutationFn: async ({poster, selectedSize, withFrame, quantity, totalPrice}: AddItemToCartProps) => {
                  const size = selectedSize.split(' ')[0] as string

            queryClient.setQueryData(['cart'], (old: any) => {
                return {cart: old.cart, items: [...old.items, {
                    id: id,
                    cartid: old.cart.id,
                    productname: poster.productname,
                    productid: poster.id,
                    productimage: poster.image as string,
                    price: poster.price,
                    quantity: quantity,
                    stripeid: poster.options?.stripeIds[size] as string,
                    total: totalPrice,
                    options: {
                        size: selectedSize,
                        frame: withFrame ? 'With Frame' : false
                    }

                }]}
            })

            const response = await client.guestCart.addToCart.$post({
                productname: poster.productname,
                product_id: poster.id,
                image: poster.image as string,
                price: Number(poster.price),
                quantity: quantity,
                total: totalPrice,
                stripeid: poster.options?.stripeIds[size] as string,
                options: {
                    size: selectedSize,
                    frame: withFrame ? 'With Frame' : false
                }
              
            })
        },
        onSuccess: () => {      
            queryClient.invalidateQueries({ queryKey: ['cart'] })
        },
        onError: (error) => {
            console.log(error, 'error')
        }
    })

    return {mutate, isPending}
}

export default useAddItemToCart;
