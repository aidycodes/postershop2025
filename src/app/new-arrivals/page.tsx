import ProductDisplay from "@/components/products/product-display"
import { Poster } from "@/components/products/product-item"

const NewArrivals = async () => {
    const data = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products/getNewArrivals`)
        const products: {data:Poster[]} = await data.json()

    return (
        <div>
            <ProductDisplay products={products.data} title="New Arrivals" />
        </div>
    )
}

export default NewArrivals
