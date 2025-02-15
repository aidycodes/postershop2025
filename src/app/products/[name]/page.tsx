import Product, { ProductProps } from "./product";



const Page = async ({ params }: { params: { name: string } }) => {
    const { name } = await params;
    console.log(name, 'name')
    const product = await fetch(`http://localhost:3000/api/products/productByName?name=${name}`);
    const productData: ProductProps[] = await product.json();
    console.log(productData, 'productData')
    if (!productData[0]) return <div>Product not found</div>;
    
    return (
        <div>
            <Product {...productData[0]} />
        </div>
    );
};

export default Page