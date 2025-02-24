import { cn } from "@/lib/utils";
import ProductItem from "../products/product-item";
import { useQuery } from "@tanstack/react-query";
import { client } from "@/lib/client";
import { Poster } from "@/components/products/product-item";
import ProductSkeleton from "./suggestedItemSkel";

// Add this type


const Suggestions = ({title, meta, type, classNames }: {title: string, meta: string, type: "category" | "related", classNames?: string}) => {

  const { data: products, isLoading } = useQuery({
    queryKey: ["products", meta, type],
    queryFn: async() => {
      const res = await client.products.getMetaProducts.$get({
        meta,
        type
      })
      if(res.status === 200) {
        const products = res.json()
        return products
      }
    }
  })
console.log(products, 'products')
    return ( 
    <>
        <h2 className={cn("text-2xl font-bold mb-6", classNames)}>
          { products?.data?.length && products?.data?.length > 0 ? title : ''}</h2>
        <div className={cn(
          "grid gap-6",
          products?.data?.length && products?.data?.length < 4 ? 'justify-center' : '',
          `grid-cols-1 sm:grid-cols-${products?.data?.length && products?.data?.length >= 2 ? 2 : 1} 
          md:grid-cols-${products?.data?.length && products?.data?.length >= 3 ? 3 : products?.data?.length} 
          lg:grid-cols-${products?.data?.length}`
        )}>
          {isLoading ? ( 
             <>
             <ProductSkeleton />
             <ProductSkeleton />
             <ProductSkeleton />
             <ProductSkeleton />
             </>
          ) : (
            products?.data?.map((product, index) => (
              <div
                key={product?.id}
                className={cn(
               
                  index === 0 && "block",
                 
                  index === 1 && "hidden sm:block",
                
                  index === 2 && "hidden md:block",
                 
                  index === 3 && "hidden lg:block"
                )}
              >
                <ProductItem poster={product as Poster} />
              </div>
            ))
          )}
        </div>
    </>
    )
}

export default Suggestions;

