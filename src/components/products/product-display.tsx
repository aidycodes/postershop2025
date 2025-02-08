import ProductItem from "./product-item";

export const FEATURED_POSTERS = [
    { id: 1, title: "Mountain Sunset", price: "$24.99", imageUrl: "/categorys/Anime.jpg" },
    { id: 2, title: "Urban Abstract", price: "$29.99", imageUrl: "/categorys/Gaming.webp" },

    { id: 3, title: "Vintage Movie", price: "$19.99", imageUrl: "/categorys/scifi.webp" },
    { id: 4, title: "Nature Series", price: "$22.99", imageUrl: "/categorys/kids.jpg" }
  ];

const ProductDisplay = () => {
    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h3 className="text-2xl font-semibold mb-8">Featured Posters</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {FEATURED_POSTERS.map((poster) => (
            <ProductItem key={poster.id} poster={poster} />
          ))}
        </div>
      </div>
    )
}   

export default ProductDisplay;

