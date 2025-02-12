import ProductDisplay from "@/components/products/product-display";
import { client } from "@/lib/client";

const CategoryPage = async({params}: {params: {category: string}}) => {
    const {category} = await params;
    const data = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products/productsByCategory?category=${category}`)
    const products: any = await data.json()
    return (
        <div className="min-h-screen flex items-center justify-center">
            <ProductDisplay products={products.data} title={category} />
        </div>
    )
}

export default CategoryPage;