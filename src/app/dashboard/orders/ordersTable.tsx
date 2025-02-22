"use client"
import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import dayjs from 'dayjs';
import { useQuery } from "@tanstack/react-query"
import { client } from "@/lib/client"
import { cn } from '@/lib/utils';
import OrderTableSkeleton from './orderSkele';
import NoOrders from './noOrders';
interface Order {
    id: string;
    created_at: Date | null;
    total: string | null;
    postage: string;
    status: string;
    deliveryAddress: string;
    postage_cost: number;
    orderItems: {
        id: string;
        productname: string;
        productimage: string;
        price: number;
        quantity: number;
        productid: string;
    }[];
}
const OrderTable = () => {
    const [expandedOrders, setExpandedOrders] = useState(new Set());
    const [page, setPage] = useState(1);
    const { data, isLoading, error } = useQuery({
        queryKey: ['orders', page],
        queryFn: async() => {
            const res = await client.users.myOrders.$get({
            limit: 10,
            offset: (page - 1) * 10
        })
        if(res.status === 200){
            return await res.json()
        }
        throw new Error('Failed to fetch orders')
    },
    })
 

    const handlePageChange = (newPage: number) => {
        const totalCount = data?.orderCount ?? 0;
        const totalPages = Math.ceil(totalCount / 10);
        
        if (newPage >= 1 && newPage <= totalPages) {
            setPage(newPage);
        }
    }

    const toggleOrder = (orderId: string) => {
        setExpandedOrders(prev => {
          const newSet = new Set(prev);
          if (newSet.has(orderId)) {
            newSet.delete(orderId);
          } else {
            newSet.add(orderId);
          }
          return newSet;
        });
    }

    return (
        
        <div className="w-full">
            {error && <div className="text-red-500 text-sm text-center mt-4">An error occurred fetching orders, please try again.</div>}
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-100">
                    <tr>
                        <th className="p-4 text-left font-semibold text-gray-600">Order ID</th>
                        <th className="p-4 text-left font-semibold text-gray-600">Date</th>
                        <th className="p-4 text-left font-semibold text-gray-600">Total</th>
                        <th className="p-4 text-left font-semibold text-gray-600">Postage</th>
                        <th className="p-4 text-left font-semibold text-gray-600">Status</th>
                        <th className="p-4 text-left font-semibold text-gray-600"></th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                    {isLoading && (
                        <>
                        <OrderTableSkeleton />
                        <OrderTableSkeleton />
                        <OrderTableSkeleton />
                        <OrderTableSkeleton />
                        <OrderTableSkeleton />
                        <OrderTableSkeleton />
                        <OrderTableSkeleton />
                        <OrderTableSkeleton />
                        <OrderTableSkeleton />
                        <OrderTableSkeleton />
                        <OrderTableSkeleton />
                        </>
                    )}
                  
                    {data?.ordersWithItems.map((order) => (
                        <React.Fragment key={order.id}>
                            <tr 
                                className="hover:bg-gray-50 cursor-pointer"
                                onClick={() => toggleOrder(order.id)}
                            >
                                <td className="p-4 text-sm text-gray-600">{order.id.slice(0, 8)}...</td>
                                <td className="p-4 text-sm text-gray-600">{dayjs(order.created_at).format('DD-MM-YYYY')}</td>
                                <td className="p-4 text-sm text-gray-600">£{order.total && (+order.total / 100).toFixed(2)}</td> 
                                <td className="p-4 text-sm text-gray-600">
                                    {order.postage}
                                </td>
                                <td className="p-4">
                                    <span className={`px-2 py-1 text-xs rounded-full ${
                                        order.status === 'paid' ? 'bg-green-100 text-green-800' :
                                        order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                        order.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                                        order.status === 'refunded' ? 'bg-gray-100 text-gray-800' :
                                        order.status === 'shipped' ? 'bg-blue-100 text-blue-800' :
                                        order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                                        'bg-gray-100 text-gray-800'
                                    }`}>
                                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                    </span>
                                </td>
                                <td className="p-4">
                                    {expandedOrders.has(order.id) ? (
                                        <ChevronUp className="w-5 h-5 text-gray-500" />
                                    ) : (
                                        <ChevronDown className="w-5 h-5 text-gray-500" />
                                    )}
                                </td>
                            </tr>
                            {expandedOrders.has(order.id) && (
                                <tr>
                                    <td colSpan={6} className="p-4 bg-gray-50">
                                        <div className="space-y-4">
                                            <div className="text-sm text-gray-600">
                                                <p className="font-semibold">Delivery Address:</p>
                                                <p className="whitespace-pre-line">{order.deliveryAddress}</p>
                                                <p className="font-semibold">Postage</p>
                                                <p className="whitespace-pre-line">£{order.postage_cost && (+order.postage_cost / 100).toFixed(2)}</p>
                                            </div>
                                            <div className="space-y-2">
                                                {order.orderItems.map((item) => (
                                                    <div key={item.id} className="flex flex-col md:flex-row items-center space-x-4 p-2 bg-white rounded-lg">
                                                        <img 
                                                            src={item.productimage ?? ''} 
                                                            alt={item.productname ?? ''}
                                                            className="w-16 h-16 object-cover rounded"
                                                        />
                                                        <div className="flex-1">
                                                            <p className="font-medium text-gray-900">{item.productname}</p>
                                                            <p className="text-sm text-gray-500">Product ID: {item.productid}</p>
                                                        </div>
                                                        <div className="text-right">
                                                            <p className="font-medium text-gray-900">£{item.price && (+item.price / 100).toFixed(2)}</p>
                                                            <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </React.Fragment>
                    ))}
                </tbody>
            </table>
            {data?.ordersWithItems.length === 0 && <NoOrders />}
            <div className="w-full border-t border-gray-200 mx-auto">
                {!isLoading &&
                <div className="flex justify-center items-center    pt-4">
                        <button 
                            className={cn(`px-3 mr-auto py-1 text-sm text-gray-600 hover:text-gray-900 cursor-pointer`, page === 1 ? 'opacity-50 cursor-default hover:text-gray-600' : '')} 
                            disabled={page === 1} 
                            onClick={() => handlePageChange(page - 1)}
                        >
                            Previous
                        </button>
                     <span className="text-sm text-gray-600 text-center md:mr-6">
                        Page {page} of {Math.ceil(data?.orderCount ? data?.orderCount / 10 :  0)}
                     </span>
                    
                        <button 
                            className={cn(`px-3 ml-auto py-1 text-sm text-gray-600 hover:text-gray-900 cursor-pointer`, 
                                page === Math.ceil(data?.orderCount ? data?.orderCount / 10 :  0) ? 'opacity-50 cursor-default hover:text-gray-600' : '')} 
                            disabled={page === Math.ceil(data?.orderCount ? data?.orderCount / 10 :  0)} 
                            onClick={() => handlePageChange(page + 1)}
                        >
                            Next
                        </button>
                    </div>
                }
            </div>
        </div>
    );
};

export default OrderTable;