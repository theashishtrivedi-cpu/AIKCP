import { Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

type Props = {
  placeholder?: string;
  large?: boolean;
  initialValue?: string;
};

export default function SearchBar({ placeholder = 'Search questions, articles, news or topics...', large = false, initialValue = '' }: Props) {
  const [query, setQuery] = useState(initialValue);
  const navigate = useNavigate();

  const handleSearch = () => {
    if (query.trim()) navigate(`/search?q=${encodeURIComponent(query.trim())}`);
  };

  return (
    <div className={large ? 'search-wrap search-wrap-large' : 'search-wrap'}>
      <Search size={large ? 20 : 18} />
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
        placeholder={placeholder}
        aria-label={placeholder}
      />
      <button onClick={handleSearch}>Search</button>
    </div>
  );
}
