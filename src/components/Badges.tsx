import { Link } from 'react-router-dom';

type Props = {
  category: string;
  categoryId: string;
  subcategory?: string;
  subcategoryId?: string;
  variant?: 'category' | 'subcategory';
};

export function CategoryBadge({ category, categoryId }: { category: string; categoryId: string }) {
  return <Link to={`/categories/${categoryId}`} className="tag-row-link category-tag">{category}</Link>;
}

export function SubcategoryBadge({ category, categoryId, subcategory, subcategoryId }: Props) {
  return (
    <div className="tag-row">
      <Link to={`/categories/${categoryId}`} className="tag-row-link category-tag">{category}</Link>
      {subcategory && subcategoryId && (
        <Link to={`/categories/${categoryId}/${subcategoryId}`} className="tag-row-link subcategory-tag">{subcategory}</Link>
      )}
    </div>
  );
}
