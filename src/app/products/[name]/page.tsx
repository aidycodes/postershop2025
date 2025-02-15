import Product, { ProductProps } from "./product";
import { client } from "@/lib/client";

type tParams = Promise<{name: string}>

const Page = async (params: { params: tParams }) => {
    const { name } = await params.params;
    const product = await client.products.productByName.$get({name: name.replaceAll('%20', ' ')})
    const productData: ProductProps[] = await product.json();
    if (!productData[0]) return <div>Product not found</div>;
    
    return (
        <div>
            <Product {...productData[0]} />
        </div>
    );
};

export default Page