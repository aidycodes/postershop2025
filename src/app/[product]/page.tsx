
type tParams = Promise<{product: string}>

const ProductPage = async(props: {params: tParams}) => {
    const { product } = await props.params
    console.log({product})
 const products = await fetch(`http://localhost:3000/api/products/productById/?id=${product}`)
  return <div>ProductPage</div>
}



export default ProductPage


