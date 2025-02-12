import { CartItemType } from "@/server/routers/guest-cart-router"
import { client } from "@/lib/client"
import { useMutation, useQueryClient } from "@tanstack/react-query"

const useUpdateCart = (item: CartItemType) => {
    const queryClient = useQueryClient()
    const { mutate: updateCartItem, isPending } = useMutation({
        mutationFn: async ({ id, newQuantity }: { id: string; newQuantity: number }) => {

          queryClient.setQueryData(['cart'], (old: any) => {
            return {
              ...old,
              items: old.items.map((item: CartItemType) => item.id === id ? { ...item, qty: newQuantity } : item)
            }
          })
            const res = await client.guestCart.updateCartItem.$post({
                id: id,
                quantity: newQuantity,
                price: item.price,
                options: item.options

            })
            return res.json()
        },
        onSuccess: (data) => {
          queryClient.invalidateQueries({ queryKey: ['cart'] })
        }
    })

    return { updateCartItem, isPending }
}

export default useUpdateCart
