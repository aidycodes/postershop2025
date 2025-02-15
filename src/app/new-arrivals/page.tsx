import ProductDisplay from "@/components/products/product-display"
import { Poster } from "@/components/products/product-item"
import { client } from "@/lib/client"

const NewArrivals = async () => {
    const data = await client.products.getNewArrivals.$get()
    const products = await data.json()

    return (
        <div>
            <ProductDisplay products={products.data as Poster[]} title="New Arrivals" />
        </div>
    )
}

export default NewArrivals
