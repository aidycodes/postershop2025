import Link from "next/link";
import { useRouter } from "next/navigation";
import ProductStock from "../products/product-stock";
interface SearchItemProps {
  productName: string;
  price: string;
  stock: string;
  image: string;
  onClose?: () => void;
}

const SearchItem = ({ productName, price, stock, image, onClose }: SearchItemProps) => {
    const router = useRouter()
    const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
        e.preventDefault()
        if(onClose) {
       router.push(`/products/${productName}`)
        onClose()
        }
    }

  return (
    <div onClick={(e) => handleClick(e)} className="flex items-center gap-4 p-2 hover:bg-gray-100 rounded-lg cursor-pointer">
      <div  className="h-12 w-12 relative">
        <img
          src={image}
          alt={productName}
          className="object-cover rounded-md"
          width={48}
          height={48}
        />
      </div>
      <div className="flex flex-col justify-center">
        <h3 className="font-medium text-sm">{productName}</h3>
        <div className="flex items-center items-center gap-2 text-sm text-gray-600">
          <span>${price}</span>
          <span>•</span>
          <div className=""><ProductStock stock={stock} classNames="h-2 p-2 mt-2" /></div>
        </div>
      </div>
    </div>
  );
};

export default SearchItem;


export const SearchItemSkeleton = () => {
    return (
      <div className="flex items-center gap-4 p-2 hover:bg-gray-100 rounded-lg">
        <div className="h-12 w-12 relative animate-pulse bg-gray-200 rounded-md" >
          <div className="animate-pulse bg-gray-200 rounded-md " />
        </div>
        <div className="flex flex-col h-full w-full">
          <div className="flex items-center gap-2 animate-pulse h-12 w-full bg-gray-200 rounded-md"/>

          </div>
        </div>

    );
  };