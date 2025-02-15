import ProductDisplay from "@/components/products/product-display"
import { client } from "@/lib/client"


const BestSellers = async () => {
    const data = await client.products.getBestSellers.$get()
    const products = await data.json()
    
    // Transform null values to undefined to match Poster type
    const transformedData = {
        data: products.data.map((p: any) => ({
            ...p,
            stock: p.stock ?? undefined,
            image: p.image ?? undefined
        }))
    }

    return (
        <div>
            <ProductDisplay products={transformedData.data} title="Best Sellers" />
        </div>
    )
}

export default BestSellers
