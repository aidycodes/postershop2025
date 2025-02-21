import { Loader2, X } from 'lucide-react';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { client } from "@/lib/client";
import SearchItem from './search-item';
import { useRef } from 'react';
import { SearchItemSkeleton } from './search-item';
import { useDebounce } from '@/lib/hooks/use-debounce';
interface SearchAreaProps {
  isLoading?: boolean;
  onClose?: () => void;
  isOpen?: boolean;
}

const SearchArea = ({ onClose, isOpen }: SearchAreaProps) => {

    const [searchQuery, setSearchQuery] = useState('')
    
    const clickedInside = useRef(false);
    const wrapperRef = useRef<HTMLDivElement>(null);

    const debouncedSearchQuery = useDebounce(searchQuery, 500)

    const { data: searchResults, isLoading, error } = useQuery({
      queryKey: ["search", debouncedSearchQuery],
      queryFn: async() => {
          const res = await client.products.searchProducts.$get({query:debouncedSearchQuery, limit:10})     
          if(res.status === 200){
            return await res.json()
          }
          throw new Error('Failed to fetch search results')
        },
        enabled: !!debouncedSearchQuery
    })
    
    const handleMouseDown = () => {
      clickedInside.current = true;
    };
  
    const handleBlur = () => {
      if (clickedInside.current) {
        clickedInside.current = false; // Reset flag
        return;
      }
     onClose?.()
    };
    if(!isOpen) return null
  return (
    <div >
      {/* Mobile full screen */}
      <div className="fixed inset-0 bg-white z-50 md:hidden">
        <div className="flex flex-col h-full">
          {/* Search header */}
          <div className="flex items-center p-4 border-b">
       
            <input
              autoFocus
              className="flex-1 text-lg outline-none"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button onClick={onClose} className="p-2">
              <X className="w-6 h-6 text-gray-400 hover:text-blue-400 cursor-pointer" />
            </button>
          </div>

          {/* Results area */}
          <div className="flex-1 overflow-auto p-4 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:bg-gray-300 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-gray-100">
          {error && <div className="text-red-500 text-sm text-center mt-4">An error occurred fetching search results, please try again.</div>}
              <div className="space-y-4">
                <div className="px-4 pb-4">
          {isLoading ? (
            <div className="flex flex-col justify-center py-8 ">
              <SearchItemSkeleton />
              <SearchItemSkeleton />
              <SearchItemSkeleton />
              <SearchItemSkeleton />
              <SearchItemSkeleton />
              <SearchItemSkeleton />
            </div>
          ) : (     
                <div className="space-y-2">
                      
                    {searchResults?.length === 0 && searchQuery ? (
                        <div className="flex justify-center py-8">
                            <p className="text-gray-500">No results found</p>
                        </div>
                    ) : (
                        searchResults?.map((product) => (
                            <SearchItem onClose={() => onClose?.()} key={product.id} productName={product.productname} price={product.price} stock={product.stock || '100'} image={product.image || ''} />
                        ))
                    )}
                </div>
            )}
        </div>


              </div>
            
          </div>
        </div>
      </div>

      {/* Desktop dropdown */}
      <div ref={wrapperRef} onMouseDown={handleMouseDown} onBlurCapture={(e) => handleBlur()} className="hidden md:block absolute top-full right-0 w-96 mt-2 bg-white rounded-lg shadow-lg border border-gray-100 max-h-[80vh] overflow-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:bg-gray-300 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-gray-100">
        <div className="p-4">
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            autoFocus
            className="w-full p-2 border border-gray-200 rounded-lg outline-none"
            placeholder="Search products..."
          />
        </div>

        <div className="px-4 pb-4">
          {error && <div className="text-red-500 text-sm text-center mt-4">An error occurred fetching search results, please try again.</div>}
          {isLoading ? (
            <div className="flex flex-col justify-center py-8 ">
              <SearchItemSkeleton />
              <SearchItemSkeleton />
              <SearchItemSkeleton />
            </div>
          ) : (     
                <div className="space-y-2">
                    {searchResults?.length === 0 && searchQuery ? (
                        <div className="flex justify-center py-8">
                            <p className="text-gray-500">No results found</p>
                        </div>
                    ) : (
                        searchResults?.map((product) => (
                            <SearchItem onClose={() => onClose?.()} key={product.id} productName={product.productname} price={product.price} stock={product.stock || '100'} image={product.image || ''} />
                        ))
                    )}
                </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default SearchArea;
