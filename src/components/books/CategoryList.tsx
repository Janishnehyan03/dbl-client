import { ICategory } from "../../utils/types"

interface CategoryListProps {
  categories: ICategory[]
}

const CategoryList = ({ categories }: CategoryListProps) => {
  if (categories.length === 0) return <p>No categories listed</p>

  return (
    <div className="flex flex-wrap gap-2">
      {categories.map((category) => (
        <span
          key={category._id}
          className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
        >
          {category.name}
        </span>
      ))}
    </div>
  )
}

export default CategoryList