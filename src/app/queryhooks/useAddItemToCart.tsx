import { useMutation, useQueryClient } from "@tanstack/react-query"
import { client } from "@/lib/client"
import { Poster, sizesObject } from "@/components/products/product-item"

const useAddItemToCart = ({poster, selectedSize, withFrame, quantity = 1, totalPrice}: {poster: Poster, selectedSize: string, withFrame: boolean, quantity: number, totalPrice: number}) => {
    const queryClient = useQueryClient()

    const {mutate, isPending} = useMutation({
        mutationFn: async () => {

            queryClient.setQueryData(['cart'], (old: any) => {
                return {cart: old.cart, items: [...old.items, {
                    id: 'pending',
                    cartid: old.cart.id,
                    productname: poster.productname,
                    productid: poster.id,
                    productimage: poster.image as string,
                    price: poster.price,
                    quantity: quantity,
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
                options: {
                    size: selectedSize,
                    frame: withFrame ? 'With Frame' : false
                }
              
            })
        },
        onSuccess: () => {      
            queryClient.invalidateQueries({ queryKey: ['cart'] })
        }
    })

    return {mutate, isPending}
}

export default useAddItemToCart;
