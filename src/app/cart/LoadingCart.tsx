import React from 'react';

const LoadingCart: React.FC = () => {
    return (
        <div className="max-w-5xl mx-auto px-4 py-12">
            <h1 className="text-3xl font-bold text-gray-900 mb-12">Shopping Cart</h1>
            <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
                <div className="lg:col-span-8">
                    {[...Array(2)].map((_, index) => (
                        <div key={index} className="flex items-start gap-6 py-6 border-b border-gray-100 animate-pulse">
                            {/* Product Image */}
                            <div className="relative">
                                <div className="w-32 h-44 bg-gray-200 rounded-lg" />
                            </div>
                            
                            {/* Product Details */}
                            <div className="flex-1 flex flex-col h-44">
                                <div className="h-6 bg-gray-200 rounded w-3/4 mb-2" />
                                <div className="h-4 bg-gray-200 rounded w-1/4 mb-2" />
                                <div className="h-4 bg-gray-200 rounded w-1/3 mb-2" />
                                
                                {/* Quantity Controls */}
                                <div className="mt-auto">
                                    <div className="flex items-center gap-3">
                                        <div className="flex items-center bg-gray-100 rounded-lg p-1">
                                            <div className="w-8 h-8 bg-gray-200 rounded-lg" />
                                            <div className="w-8 h-8 bg-gray-200 mx-2" />
                                            <div className="w-8 h-8 bg-gray-200 rounded-lg" />
                                        </div>
                                        <div className="w-8 h-8 bg-gray-200 rounded-lg" />
                                    </div>
                                </div>
                            </div>
                            
                            {/* Price */}
                            <div className="flex flex-col h-44">
                                <div className="h-6 bg-gray-200 rounded w-20 mt-auto" />
                            </div>
                        </div>
                    ))}
                </div>
                
                {/* Order Summary */}
                <div className="lg:col-span-4">
                    <div className="bg-gray-50 rounded-lg p-6">
                        <div className="h-6 bg-gray-200 rounded w-1/2 mb-6" />
                        <div className="space-y-4">
                            {[...Array(3)].map((_, i) => (
                                <div key={i} className="flex justify-between">
                                    <div className="h-4 bg-gray-200 rounded w-20" />
                                    <div className="h-4 bg-gray-200 rounded w-16" />
                                </div>
                            ))}
                            <div className="border-t border-gray-200 pt-4 mt-4">
                                <div className="flex justify-between">
                                    <div className="h-5 bg-gray-200 rounded w-24" />
                                    <div className="h-5 bg-gray-200 rounded w-20" />
                                </div>
                            </div>
                        </div>
                        <div className="h-10 bg-gray-200 rounded-md w-full mt-8" />
                        <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto mt-4" />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoadingCart; 