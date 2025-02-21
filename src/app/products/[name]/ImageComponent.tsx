import { useState } from "react";
import { ZoomIn } from "lucide-react";
import Image from "next/image";

const ImageComponent = ({image}: {image: string}) => {

        const [isZoomed, setIsZoomed] = useState(false);
        const [panPosition, setPanPosition] = useState({ x: 0, y: 0 });
        const [isDragging, setIsDragging] = useState(false);
       
        const handleMouseDown = (e: React.MouseEvent) => {
            if (isZoomed) {
              setIsDragging(true);
            }
          };
        
    
      const handleMouseMove = (e: React.MouseEvent) => {
        if (isDragging && isZoomed) {
          setPanPosition(prev => ({
            x: prev.x + (e.movementX * 0.7),
            y: prev.y + (e.movementY * 0.7)
          }));
        }
      };
    
      const handleMouseUp = () => {
        setIsDragging(false);
      };
    
      const handleZoomClick = () => {
        if (isZoomed) {
          setPanPosition({ x: 0, y: 0 });
        }
        setIsZoomed(!isZoomed);
      };

    return (
        <div className={`relative rounded-xl overflow-hidden sm:shadow-2xl md:shadow-lg lg:shadow-2xl ${isZoomed ? 'cursor-move' : 'cursor-zoom-in'}`}
        onClick={!isZoomed ? handleZoomClick : undefined}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={() => {
          handleMouseUp();
          if (isZoomed) handleZoomClick();
        }}>
     <div className={`aspect-[3/4] will-change-transform ${
       isZoomed ? 'scale-150' : 'scale-100'
     }`}
          style={{
            transform: `scale(${isZoomed ? 1.5 : 1}) translate(${panPosition.x}px, ${panPosition.y}px)`,
            transition: isZoomed ? 'none' : 'all 0.3s ease-out',
          }}>
       <Image 
         src={image} 
         alt="poster" 
         className="object-cover w-full h-full select-none"
         draggable="false"
         width={600}
         height={400}
         priority
       />
     </div>
     {!isZoomed ? (
       <div className="absolute bottom-4 right-4 bg-black/70 text-white px-3 py-2 rounded-full text-sm font-medium flex items-center gap-2">
         <ZoomIn className="w-4 h-4" /> Click to zoom
       </div>
     ) : (
       <div className="absolute bottom-4 right-4 bg-black/70 text-white px-3 py-2 rounded-full text-sm font-medium flex items-center gap-2 text-white">
         <img src="/svgs/arrowfourway.svg" alt="" className="w-4 h-4 fill-white fill-current bg-white text-white rounded-full" /> Click and Drag to Move
       </div>
     )}
   </div>
    )
}

export default ImageComponent