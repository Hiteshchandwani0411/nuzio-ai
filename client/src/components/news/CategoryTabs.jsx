import './CategoryTabs.css'

function CategoryTabs({ categories = [], activeCategory, onChange }) {
  return (
    <nav className="category-tabs" aria-label="Story categories">
      {categories.map((category) => {
        const active = category === activeCategory
        return (
          <button
            key={category}
            type="button"
            className={['category-tab', active && 'is-active'].filter(Boolean).join(' ')}
            aria-pressed={active}
            onClick={() => onChange?.(category)}
          >
            {category}
          </button>
        )
      })}
    </nav>
  )
}

export default CategoryTabs