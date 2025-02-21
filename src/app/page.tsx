import React from 'react';
import Newsletter from '@/components/newsletter/newletter';
import Categorys from '@/components/categorys/categorys';
import Hero from '@/components/Hero/hero';
import Services from '@/components/services/services';
import Reviews from '@/components/reviews/reviews';
import ProductDisplay from '@/components/products/product-display';
import type { Category } from '@/components/categorys/categorys';
import { Poster } from '@/components/products/product-item';
import { client } from '@/lib/client';

const PosterShopHomepage = async () => {

  const categories = await client.products.getCategorys.$get()
  const categoriesData: {data: Category[]} = await categories.json()
  const featuredProducts = await client.products.getFeaturedProducts.$get()
  const featuredProductsData = await featuredProducts.json()

  return (
    <div className="min-h-screen bg-white">
      <Hero title="Transform Your Space" href="/new-arrivals" description="Discover our collection of unique posters" buttonText="Shop Now" />
      {/* Featured Products */}
      <ProductDisplay products={featuredProductsData.data as Poster[]} title="Featured Products" />
          <Categorys categories={categoriesData.data} />
          <Newsletter bannerImage={"/categorys/Anime.jpg"}
          bannerTitle={undefined} bannerSubtitle={"20%!"} />
          <Reviews />
          <Services />
    
    </div>
  );
};

export default PosterShopHomepage;