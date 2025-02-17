import Link from "next/link";

const NoOrders = () => {
    
    return (
      <div className="text-center py-12 px-4">
        <div className="mb-4">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M20 12H4m8-8v16m7-8l-4 4m0-8l4 4m-11-4l-4 4m0-8l4 4"
            />
          </svg>
        </div>
        <h3 className="mt-2 text-sm font-medium text-gray-900">No orders found</h3>
        <p className="mt-1 text-sm text-gray-500">
          Get started by making your first purchase.
        </p>
        <div className="mt-6">
          <Link href="/"
            type="button"
            className="inline-flex cursor-pointer items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Start Shopping
          </Link>
        </div>
      </div>
    );
  };

  export default NoOrders;