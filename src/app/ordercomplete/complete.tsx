"use client"
import { useSearchParams } from "next/navigation";
import { client} from '@/lib/client'
import { useQuery } from "@tanstack/react-query";
import { CircleCheck } from "lucide-react";
import OrderLoading from "./orderloading";
import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";


const Complete = () => {
    const queryClient = useQueryClient()
    const searchParams = useSearchParams();
    const stripeOrderId = searchParams.get('success');
    const { data: order, isLoading } = useQuery({
        queryKey: ["orderDetails", stripeOrderId],
        queryFn: async() => {
            const res = await client.payment.getSuccessfulOrder.$get({
                stripeId: stripeOrderId as string
            })
            return res.json()
        },
        enabled: !!stripeOrderId, 
        refetchInterval: (data) => {
            return Array.isArray(data?.state?.data) && data.state.data.length > 0 ? false : 3000
        }, 
        refetchOnWindowFocus: false,
        
      });

      useEffect(() => {
        queryClient.invalidateQueries({queryKey: ['cart']})
        queryClient.invalidateQueries({queryKey: ['orders']})
        },[order])

    if(isLoading) return <OrderLoading />
    return (
        
            <div className="flex items-center justify-center bg-gray-100">
             <div className="bg-white p-8 rounded shadow-md w-96">
              <div className="flex justify-center items-center mb-4">
               <CircleCheck className="w-16 h-16 text-green-500" />
              </div>
              <h2 className="text-2xl font-semibold text-center text-gray-800 mb-2">
               Order Complete!
              </h2>
              <p className="text-gray-600 text-center mb-4">
               Thank you for your order. It has been successfully processed.
              </p>
              <div className="border-t border-gray-200 pt-4">
               <p className="text-sm text-gray-500 text-center">
                You will receive an email with the order details and tracking
                information shortly.
               </p>
              </div>
              <div className="mt-6 flex justify-center">
              
              </div>
             </div>
            </div>
           );
          };
    


export default Complete;