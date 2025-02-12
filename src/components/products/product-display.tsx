"use client"
import { client } from "@/lib/client";
import ProductItem from "./product-item";
import { Poster } from "./product-item";
import { useQuery } from "@tanstack/react-query";

export const FEATURED_POSTERS = [

    { id: 1, title: "Mountain Sunset", price: "$24.99", imageUrl: "/categorys/Anime.jpg" },
    { id: 2, title: "Urban Abstract", price: "$29.99", imageUrl: "/categorys/Gaming.webp" },

    { id: 3, title: "Vintage Movie", price: "$19.99", imageUrl: "/categorys/scifi.webp" },
    { id: 4, title: "Nature Series", price: "$22.99", imageUrl: "/categorys/kids.jpg" }
  ];

const ProductDisplay = ({products, title}: {products: Poster[], title: string}) => {
  const { data, error } = useQuery({
    queryKey: ["products"],
    queryFn: async() => {
        const res = await client.products.allProducts.$get()
        return await res.json()
      }
    
  })

  const { data: categorys } = useQuery({
    queryKey: ["categorys"],
    queryFn: async() => {
      const res = await client.products.getCategorys.$get()

      return res.json()
    }

  })

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">

        <h3 className="text-2xl font-semibold mb-8">{title}</h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {products?.map((poster) => (
            <ProductItem key={poster.id} poster={poster as Poster} />
          ))}
        </div>

        {error && (
          <div className="text-red-500">
            Error loading products: {error.message}
          </div>
        )}
      </div>
    )
}   

export default ProductDisplay;

