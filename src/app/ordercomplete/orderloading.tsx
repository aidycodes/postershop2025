import { Loader2 } from "lucide-react";

const OrderLoading = () => {
    return (
        <>
        <div className="flex items-center justify-center bg-gray-100 ">
        <div className="bg-white flex flex-col items-center justify-center p-8 rounded shadow-md min-h-96 w-96">
         <div className="flex justify-center items-center mb-4">
          <Loader2 className="w-16 h-16 text-green-500 animate-spin" />
         </div>
         <h2 className="text-2xl font-semibold text-center text-gray-800 mb-2">
          Processing Order...
         </h2>
         <p className="text-gray-600 text-center mb-4">
          Thank you for your order.
         </p>
         <div className="border-t border-gray-200 pt-4">
          <p className="text-sm text-gray-500 text-center">
           You Order Has Been Placed Successfully. Please Wait While We Process Your Order.
          </p>
         </div>
         <div className="mt-6 flex justify-center">
          
         </div>
        </div>
       </div>
       </>
      );
     };

     export default OrderLoading;
    

