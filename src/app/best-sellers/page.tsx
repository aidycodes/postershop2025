import ProductDisplay from "@/components/products/product-display"
import { Poster } from "@/components/products/product-item"

const BestSellers = async () => {
    try{
    const data = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products/getBestSellers`)
    const products: {data:Poster[]} = await data.json()

    }catch(error){
        console.log(error, 'error')
    }
    const products = {data:[]}

    return (
        <div>
            <ProductDisplay products={products?.data} title="Best Sellers" />
        </div>
    )
}

export default BestSellers
