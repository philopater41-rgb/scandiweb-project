import { Link } from 'react-router-dom';
import { useDataContext } from '../DataContext';

interface NavigationMenuProps {
  categories: string[];
  handleCategoryChange: (category: string) => void;
}

function NavigationMenu({ categories, handleCategoryChange }: NavigationMenuProps) {
  const { selectedCategory } = useDataContext();

  return (
    <nav className="z-10">
      <ul className="flex gap-6 uppercase">
        {categories.map((category) => {
          const isSelected = category === selectedCategory;

          return (
            <li key={category}>
              <Link
                // to={`/?category=${category}`}
                to={`/${category}`}
                className={`block pb-4 border-b-2 ${
                  isSelected
                    ? 'nav-active'
                    : 'border-transparent hover:text-primary'
                }`}
                data-testid={
                  isSelected ? 'active-category-link' : 'category-link'
                }
                onClick={() => handleCategoryChange(category)}
              >
                {category}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

export default NavigationMenu;