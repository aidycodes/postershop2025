const relatedProducts = [
    { id: "1", productname: 'Naruto Poster', price: "24.99", image: '/api/placeholder/200/267', description: 'Naruto Poster' },
    { id: "2", productname: 'One Piece Poster', price: "24.99", image: '/api/placeholder/200/267', description: 'One Piece Poster' },
    { id: "3", productname: 'Attack on Titan Poster', price: "24.99", image: '/api/placeholder/200/267', description: 'Attack on Titan Poster' },
    { id: "4", productname: 'My Hero Academia Poster', price: "24.99", image: '/api/placeholder/200/267', description: 'My Hero Academia Poster' },
  ];

  import { cn } from "@/lib/utils";
  import ProductItem from "../products/product-item";

const Suggestions = ({title, classNames }: {title: string, classNames?: string}) => {

    return ( 
    <>
        <h2 className={cn("text-2xl font-bold mb-6", classNames)}>{title}</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {/* {relatedProducts.map((product) => (
             <ProductItem key={product.id} poster={product} />
          ))} */}
        </div>
    </>
    )
}

export default Suggestions;



// "use client"
// import { client } from "@/lib/client";
// import ProductItem from "./product-item";

// import { useQuery } from "@tanstack/react-query";



// export const FEATURED_POSTERS = [

//     { id: 1, title: "Mountain Sunset", price: "$24.99", imageUrl: "/categorys/Anime.jpg" },
//     { id: 2, title: "Urban Abstract", price: "$29.99", imageUrl: "/categorys/Gaming.webp" },

//     { id: 3, title: "Vintage Movie", price: "$19.99", imageUrl: "/categorys/scifi.webp" },
//     { id: 4, title: "Nature Series", price: "$22.99", imageUrl: "/categorys/kids.jpg" }
//   ];

// const ProductDisplay = () => {
//   const { data, error } = useQuery({
//     queryKey: ["products"],
//     queryFn: async() => {
  
//         const res = await client.products.allProducts.$get()
//         return await res.json()
//       }
    
//   })

//   const { data: categorys } = useQuery({
//     queryKey: ["categorys"],
//     queryFn: async() => {
//       const res = await client.products.getCategorys.$get()

//       return res.json()
//     }

//   })

//     return (
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">

//         <h3 className="text-2xl font-semibold mb-8">Featured Posters</h3>

//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
//           {data?.map((poster) => (
//             <ProductItem key={poster.id} poster={poster} />
//           ))}
//         </div>

//         {error && (
//           <div className="text-red-500">
//             Error loading products: {error.message}
//           </div>
//         )}
//       </div>
//     )
// }   

// export default ProductDisplay;

