import ProductDisplay from "@/components/products/product-display"
import { Poster } from "@/components/products/product-item"

const BestSellers = async () => {
    const data = await fetch("http://localhost:3000/api/products/getBestSellers")
        const products: {data:Poster[]} = await data.json()

    return (
        <div>
            <ProductDisplay products={products.data} title="Best Sellers" />
        </div>
    )
}

export default BestSellers
