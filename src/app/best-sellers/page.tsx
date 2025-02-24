import ProductDisplay from "@/components/products/product-display"
import { Poster } from "@/components/products/product-item"
import { client } from "@/lib/client"


const BestSellers = async () => {
        const data = await client.products.getBestSellers.$get()

    const products = await data.json()
    return (
        <div>
            <ProductDisplay products={products?.data as Poster[]} title="Best Sellers" />
        </div>
    )
}

export default BestSellers
