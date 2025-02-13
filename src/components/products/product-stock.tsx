import { Check, X, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

const ProductStock = ({stock, classNames}: {stock: number | string, classNames?: string}) => (
    <div className="flex items-center gap-3 mb-2">        
                { +stock > 10 && 
                <>
                 <span className={cn("inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-700", classNames)} >
                <Check className="w-4 h-4" />In Stock
                </span>
                </> }
                 {stock == 0 &&    
                 <>
                <span className={cn("inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-700", classNames)} >
                 <X className="w-4 h-4" />Out of Stock
                 </span>
                 </>} 
                 { +stock < 10 && +stock > 0 && 
                 <>
                 <span className={cn("inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-700", classNames)} >
                 <AlertCircle className="w-5 h-5" />Hurry only {stock} left in stock!
                 </span>
                 </>
                 }         
            </div>
)

export default ProductStock;
