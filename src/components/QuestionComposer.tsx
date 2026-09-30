import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { canPerformQuestionAction } from '@/lib/questionAuthorization';
import {
  createQuestion,
  type CreateQuestionInput,
} from '@/lib/questionService';
import { supabase } from '@/lib/supabase';

type Category = {
  id: string;
  name: string;
};

type Subcategory = {
  id: string;
  category_id: string;
  name: string;
};

export default function QuestionComposer() {
  const navigate = useNavigate();

  const [authorized, setAuthorized] = useState(false);
  const [checkingAuthorization, setCheckingAuthorization] = useState(true);

  const [categories, setCategories] = useState<Category[]>([]);
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);

  const [categoryId, setCategoryId] = useState('');
  const [subcategoryId, setSubcategoryId] = useState('');
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [languageCode, setLanguageCode] = useState('en');

  const [loadingTaxonomy, setLoadingTaxonomy] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function initialise() {
      const allowed = await canPerformQuestionAction('create');

      if (cancelled) return;

      setAuthorized(allowed);
      setCheckingAuthorization(false);

      if (!allowed) return;

      const [categoryResult, subcategoryResult] = await Promise.all([
        supabase
          .from('categories')
          .select('id, name')
          .eq('is_active', true)
          .order('sort_order', { ascending: true }),

        supabase
          .from('subcategories')
          .select('id, category_id, name')
          .eq('is_active', true)
          .order('sort_order', { ascending: true }),
      ]);

      if (cancelled) return;

      if (categoryResult.error) {
        setError(categoryResult.error.message);
      } else {
        setCategories((categoryResult.data ?? []) as Category[]);
      }

      if (subcategoryResult.error) {
        setError(subcategoryResult.error.message);
      } else {
        setSubcategories(
          (subcategoryResult.data ?? []) as Subcategory[]
        );
      }

      setLoadingTaxonomy(false);
    }

    void initialise();

    return () => {
      cancelled = true;
    };
  }, []);

  const availableSubcategories = subcategories.filter(
    (item) => item.category_id === categoryId
  );

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();

    setError(null);

    if (!authorized) {
      setError('You are not authorized to create questions.');
      return;
    }

    if (!categoryId) {
      setError('Please select a category.');
      return;
    }

    if (!title.trim()) {
      setError('Question title is required.');
      return;
    }

    setSubmitting(true);

    const input: CreateQuestionInput = {
      category_id: categoryId,
      subcategory_id: subcategoryId || null,
      title,
      body,
      language_code: languageCode,
    };

    const result = await createQuestion(input);

    setSubmitting(false);

    if (result.error || !result.data) {
      setError(result.error ?? 'Question creation failed.');
      return;
    }

    navigate(`/real-questions/${result.data.id}`);
  }

  if (checkingAuthorization) {
    return (
      <div className="detail-description">
        <p>Checking question authoring permission...</p>
      </div>
    );
  }

  if (!authorized) {
    return null;
  }

  if (loadingTaxonomy) {
    return (
      <div className="detail-description">
        <p>Loading question categories...</p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="detail-description"
      style={{
        display: 'grid',
        gap: 16,
        marginBottom: 32,
      }}
    >
      <div>
        <label htmlFor="question-title">
          Question title
        </label>
        <input
          id="question-title"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          placeholder="What would you like the community to discuss?"
          maxLength={300}
          required
          style={{ width: '100%', marginTop: 6 }}
        />
      </div>

      <div>
        <label htmlFor="question-body">
          Details
        </label>
        <textarea
          id="question-body"
          value={body}
          onChange={(event) => setBody(event.target.value)}
          placeholder="Add context, background or specific details..."
          rows={6}
          style={{ width: '100%', marginTop: 6 }}
        />
      </div>

      <div>
        <label htmlFor="question-category">
          Category
        </label>
        <select
          id="question-category"
          value={categoryId}
          onChange={(event) => {
            setCategoryId(event.target.value);
            setSubcategoryId('');
          }}
          required
          style={{ width: '100%', marginTop: 6 }}
        >
          <option value="">Select category</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="question-subcategory">
          Subcategory
        </label>
        <select
          id="question-subcategory"
          value={subcategoryId}
          onChange={(event) => setSubcategoryId(event.target.value)}
          disabled={!categoryId}
          style={{ width: '100%', marginTop: 6 }}
        >
          <option value="">No subcategory</option>
          {availableSubcategories.map((subcategory) => (
            <option key={subcategory.id} value={subcategory.id}>
              {subcategory.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="question-language">
          Language
        </label>
        <select
          id="question-language"
          value={languageCode}
          onChange={(event) => setLanguageCode(event.target.value)}
          style={{ width: '100%', marginTop: 6 }}
        >
          <option value="en">English</option>
          <option value="hi">Hindi</option>
        </select>
      </div>

      {error && (
        <p role="alert" style={{ margin: 0 }}>
          {error}
        </p>
      )}

      <button type="submit" disabled={submitting}>
        {submitting ? 'Publishing...' : 'Create Question'}
      </button>
    </form>
  );
}
