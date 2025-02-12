import Link from 'next/link'

const CategoryItem = ({name, image, }: {name: string, image: string, }) => (
    <div key={name} className="relative h-48 rounded-lg overflow-hidden group">
        <Link href={`/categories/${name}`}>
            <img 
            src={image} 
            alt={name}
            className="w-full h-full object-cover scale-100 group-hover:scale-125 transition-all duration-700"
            />
            <div className="absolute inset-0 bg-transparent bg-opacity-40 flex items-center justify-center">
            <span className="text-2xl font-bold text-white [text-shadow:_2px_2px_0_rgb(0_0_0_/_40%),_-2px_-2px_0_rgb(0_0_0_/_40%),_4px_4px_0_rgb(0_0_0_/_40%)]">
                {name}
            </span>
            </div>
        </Link>
    </div>
)

export default CategoryItem

