import React, { useState, useEffect } from 'react';

const CategorySelection = ({ onSelectCategory, activeCategory }) => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    // Fetch categories when the component mounts
    fetch('http://localhost:4000/categories')
      .then(response => response.json())
      .then(data => setCategories(data))
      .catch(error => console.error(error));
  }, []);

  return (
    <div>
      <ul className='category-ul'>
        <li>
          <button onClick={() => onSelectCategory('')} className={activeCategory ? '' : 'active'}>
            All
          </button>
        </li>
        {categories.map(category => (
          <li key={category._id}>
            <button onClick={() => onSelectCategory(category._id)} className={activeCategory === category._id ? 'active' : ''}>
              {category.name}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CategorySelection;
