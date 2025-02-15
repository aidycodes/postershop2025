import ProductDisplay from "@/components/products/product-display"
import { Poster } from "@/components/products/product-item"

const BestSellers = async () => {
    const data = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products/getBestSellers`)
        const products: {data:Poster[]} = await data.json()

    return (
        <div>
            <ProductDisplay products={products.data} title="Best Sellers" />
        </div>
    )
}

export default BestSellers
