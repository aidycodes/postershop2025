import { useState } from "react";

type Size = [string, string | number][]
import { extractASize } from "@/lib/utils";

const SizeCircle = ({label, size, onClick, selected}: {
    label: string, 
    size: [string, string | number] | undefined, 
    onClick: (e: React.MouseEvent<HTMLDivElement, MouseEvent>, size: [string, string | number]) => void,
    selected: boolean
}) => {

    const [isVisible, setIsVisible] = useState(false);

    return (
        <>
        {
            selected ? (
                <>
                <div onMouseEnter={() => setIsVisible(true)} onMouseLeave={() => setIsVisible(false)} 
                 onClick={(e) => size && onClick(e, size)} 
                 className="w-8 h-8 rounded-full flex items-center justify-center bg-blue-300 relative cursor-pointer">
                    <span className="text-sm font-medium ">{label} </span>
                </div>
                {isVisible && (
          <div className=" absolute hidden lg:block bottom-24 left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg whitespace-nowrap">
            {size?.[0]?.split("(")[1]} 
            <div className="absolute  top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-900" />
          </div>
        )}
                </>
            ) : (
                <>
                <div onMouseEnter={() => setIsVisible(true)} 
                onMouseLeave={() => setIsVisible(false)} 
                onClick={(e) => size && onClick(e, size)} 
                className="w-8 h-8 cursor-pointer   rounded-full bg-gray-200 flex items-center justify-center">
                    <span className="text-sm font-medium">{label} </span>
                </div>
                {isVisible && (

          <div className="absolute hidden cursor-pointer lg:block bottom-24 left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg whitespace-nowrap">
          {size?.[0]?.split("(")[1]}  
            <div className="absolute hidden cursor-pointer lg:block top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-900" />
          </div>
        )}
                </>
            )               
        }
        </>
    )
}


const SizeSelector = ({selectedSize, setSelectedSize, sizes}:
     {selectedSize: string, 
      setSelectedSize: (e: React.MouseEvent<HTMLDivElement, MouseEvent>, size: [string, string | number]) => void, 
      sizes: Size }) => {

        const sortedSizes = sizes.sort((a, b) => {
            const sizeA = extractASize(a[0]);
            const sizeB = extractASize(b[0]);
            return sizeB - sizeA;
        });
  
    return (
        <div className="flex items-center gap-2">
            <SizeCircle label='S' size={sizes?.[0]} onClick={setSelectedSize} selected={selectedSize === sizes?.[0]?.[0]} />
            <SizeCircle label='M' size={sizes?.[1]} onClick={setSelectedSize} selected={selectedSize === sizes?.[1]?.[0]} />
            <SizeCircle label='L' size={sizes?.[2]} onClick={setSelectedSize} selected={selectedSize === sizes?.[2]?.[0]} />
            <SizeCircle label='XL' size={sizes?.[3]} onClick={setSelectedSize} selected={selectedSize === sizes?.[3]?.[0]} />
        </div>
    )
}

export default SizeSelector
