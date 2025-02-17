"use client"

import { useQuery } from "@tanstack/react-query"
import { client } from "@/lib/client"
const OrdersTable = () => {
    const { data, isLoading } = useQuery({
        queryKey: ['orders'],
        queryFn: async() => {
            const res = await client.users.myOrders.$get({
            limit: 10,
            offset: 0
        })
        return res.json()
    }
    })
    console.log(data, 'djddjj')
    return (
        <div>
            OrdersTable
        </div>
    )
}

export default OrdersTable;
