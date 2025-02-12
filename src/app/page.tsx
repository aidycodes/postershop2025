import React from 'react';
import Newsletter from '@/components/newsletter/newletter';
import Categorys from '@/components/categorys/categorys';
import Hero from '@/components/Hero/hero';
import Services from '@/components/services/services';
import Reviews from '@/components/reviews/reviews';
import ProductDisplay from '@/components/products/product-display';
import type { Category } from '@/components/categorys/categorys';
import { Poster } from '@/components/products/product-item';

const PosterShopHomepage = async () => {

  // const featuredProducts = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products/featured`)
  // const featuredProductsData = await featuredProducts.json()
  const categories = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products/getCategorys`)
  const categoriesData: {data: Category[]} = await categories.json()
  const featuredProducts = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products/getFeaturedProducts`)
  const featuredProductsData: {data: Poster[]} = await featuredProducts.json()
console.log(featuredProductsData)

  return (
    <div className="min-h-screen bg-white">
      <Hero title="Transform Your Space" href="/shop" description="Discover our collection of unique posters" buttonText="Shop Now" />
      {/* Featured Products */}
      <ProductDisplay products={featuredProductsData.data} title="Featured Products" />
          <Categorys categories={categoriesData.data} />
          <Newsletter bannerImage={"/categorys/Anime.jpg"}
          bannerTitle={undefined} bannerSubtitle={"20%!"} />
          <Reviews />
          <Services />
    
    </div>
  );
};

export default PosterShopHomepage;