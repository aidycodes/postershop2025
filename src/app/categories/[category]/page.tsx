import ProductDisplay from "@/components/products/product-display";
import { client } from "@/lib/client";
import { Poster } from "@/components/products/product-item";
type tParams = Promise<{category: string}>

const CategoryPage = async(params: {params: tParams}) => {
    const {category} = await params.params;
    const data = await client.products.productsByCategory.$get({category: category})
    const products = await data.json()
    return (
        <div className="min-h-screen flex items-center justify-center">
            <ProductDisplay products={products.data as Poster[]} title={category} />
        </div>
    )
}

export default CategoryPage;