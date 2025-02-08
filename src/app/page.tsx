import React from 'react';
import Newsletter from '@/components/newsletter/newletter';
import Categorys from '@/components/categorys/categorys';
import Hero from '@/components/Hero/hero';
import Services from '@/components/services/services';
import Reviews from '@/components/reviews/reviews';
import ProductDisplay from '@/components/products/product-display';
const PosterShopHomepage = () => {



  return (
    <div className="min-h-screen bg-white">
      <Hero title="Transform Your Space" href="/shop" description="Discover our collection of unique posters" buttonText="Shop Now" />
      {/* Featured Products */}
      <ProductDisplay />
          <Categorys />
          <Newsletter bannerImage={"/api/placeholder/600/400"}
          bannerTitle={undefined} bannerSubtitle={"20%!"} />
          <Reviews />
          <Services />
    
    </div>
  );
};

export default PosterShopHomepage;