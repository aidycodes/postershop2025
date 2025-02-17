import CategoryItem from './category-item'

const CATEGORIES = [
  {
    name: 'Fantasy',
    image: '/categorys/Fantasy.jpg',
  },

  {
    name: 'Gaming',
    image: '/categorys/Gaming.webp',
  },

  {
    name: 'Anime',
    image: '/categorys/Anime.jpg',

  },
  {
    name:"Sci-Fi",
    image: '/categorys/SciFi.webp',
  },
    
]
//['Art', 'Nature', 'Movies', 'Abstract']

export type Category = {
  name: string | null;
  image: string | null;
}


const Categorys = ({categories}: {categories: Category[]}) => {
    
  return (
    <div className="bg-gray-50 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h3 className="text-2xl font-semibold mb-8">Browse Categories</h3>
        <div className="flex flex-wrap justify-center gap-4">
          {categories?.map(({ name, image }) => (
            <div key={name} className="w-full sm:w-[calc(50%-8px)] md:w-[calc(25%-12px)]">
              <CategoryItem key={name} name={name || ''} image={image || ''}  />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Categorys    