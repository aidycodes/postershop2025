import Product, { ProductProps } from "./product";
import { client } from "@/lib/client";
import { Metadata, ResolvingMetadata } from "next";

type tParams = Promise<{name: string}>

type Props = {
    params: tParams
}

export async function generateMetadata(
    { params }: Props,
    parent: ResolvingMetadata
  ): Promise<Metadata> {
  
    const { name } = await params;
    const decodedString = decodeURIComponent(name as string)
   
    return {
      title: `Poster Hub - ${decodedString}`,
      description: `Poster Hub is a platform for buying posters`,
      icons: [{ rel: "icon", url: "/favicon.webp" }],
    }
  }

const Page = async (params: { params: tParams }) => {
    const { name } = await params.params;
    const decodedString = decodeURIComponent(name)
    const product = await client.products.productByName.$get({name: decodedString})
    const productData: ProductProps[] = await product.json();
    if (!productData[0]) return <div>Product not found</div>;
    
    //const test = await client.cart.serverCart.$get()

    return (
        <div>
            <Product {...productData[0]} />
        </div>
    );
};

export default Page