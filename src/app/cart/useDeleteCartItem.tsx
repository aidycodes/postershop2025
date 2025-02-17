import { client } from "@/lib/client"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { CartItemType } from "@/server/routers/guest-cart-router"

const useDeleteCartItem = (id: string) => {
    const queryClient = useQueryClient()
    const { mutate: deleteCartItem, isPending } = useMutation({
        mutationFn: async () => {
            queryClient.cancelQueries({ queryKey: ['cart'] })
            queryClient.setQueryData(['cart'], (old: any) => {
                return {
                    ...old,
                    items: old.items.filter((item: CartItemType) => item.id !== id)
                }
            })
            const res = await client.cart.deleteCartItem.$post({ id })
            return res.json()
        },
        onSuccess: async() => {
            await queryClient.invalidateQueries({ queryKey: ['cart'] })
        }
    })
    return { deleteCartItem, isPending }
}

export default useDeleteCartItem
