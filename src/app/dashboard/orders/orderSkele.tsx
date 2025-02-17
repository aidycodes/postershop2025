const OrderRowSkeleton = () => {
  return (
    <tr className="animate-pulse border-b border-gray-200">
      <td className="p-3">
        <div className="h-4 w-20 bg-gray-200 rounded"></div>
      </td>
      <td className="p-3">
        <div className="h-4 w-20 bg-gray-200 rounded"></div>
      </td>
      <td className="p-3">
        <div className="h-4 w-20 bg-gray-200 rounded"></div>
      </td>
      <td className="p-3">
        <div className="h-4 w-16 bg-gray-200 rounded"></div>
      </td>
      <td className="p-3">
        <div className="h-6 w-16 bg-gray-200 rounded-full"></div>
      </td>
      <td className="p-3">
        <div className="h-5 w-5 bg-gray-200 rounded"></div>
      </td>
    </tr>
  );
};

export default OrderRowSkeleton;