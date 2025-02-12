import React from 'react';

const EmptyCart: React.FC = () => {
    return (
        <div className="text-center py-12 lg:py-36 bg-gray-50 rounded-lg">
            <h2 className="text-gray-500 text-lg">Your cart is empty</h2>
            <p className="text-gray-400 mt-2">Add items to your cart to see them here.</p>
        </div>
    );
};

export default EmptyCart; 