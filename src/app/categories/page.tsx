import Categories from "@/components/categorys/categorys";
import { client } from "@/lib/client";

const CategoriesPage = async() => {
    const data = await client.products.getCategorys.$get()
    const categories = await data.json()
    return (
        <>
        <div className="min-h-screen flex items-center justify-center">
        <div className="w-full md:-mt-64">
            <Categories categories={categories.data} />
        </div>
    </div>
    </>
    )
}

export default CategoriesPage;