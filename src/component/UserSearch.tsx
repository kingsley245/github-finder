import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import UserCard from './userCard';
import { fetchGithubUser, SearchGithubUser } from '../api/github';
// import { FaClock, FaUser } from 'react-icons/fa6';
import RecentSearches from './recentSearches';
import SuggestionDropdown from './suggestionDropdn';
import type { GithubUser } from '../Types';
import { useDebounce } from 'use-debounce';

const UserSearch = () => {
  const [username, setUsername] = useState('');
  const [submittedUsername, setSubmittedUsername] = useState('');
  const [recentUsers, setRecentUsers] = useState<string[]>(() => {
    const stored = localStorage.getItem('recentUsers');
    return stored ? JSON.parse(stored) : [];
  });

  const [debounceUsername] = useDebounce(username, 300);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // search specific user
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['users', submittedUsername],
    queryFn: () => fetchGithubUser(submittedUsername),
    enabled: !!submittedUsername, // turn this into a boolean
  });

  const { data: suggestion } = useQuery({
    queryKey: ['github-user-suggestions', debounceUsername],
    queryFn: () => SearchGithubUser(debounceUsername),
    enabled: debounceUsername.length > 1, // will run when debounce username length is greater than 1
  });
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const trimmed = username.trim();
    if (!trimmed) return;

    setSubmittedUsername(trimmed);
    setUsername('');
    setRecentUsers((prev) => {
      const updated = [trimmed, ...prev.filter((u) => u !== trimmed)];
      return updated.slice(0, 5);
    });
  };

  useEffect(() => {
    localStorage.setItem('recentUsers', JSON.stringify(recentUsers));
  }, [recentUsers]);
  return (
    <>
      <form onSubmit={handleSubmit} className="form">
        <div className="dropdown-wrapper">
          <input
            type="text"
            placeholder="Enter Github Username...."
            value={username}
            onChange={(e) => {
              const val = e.target.value;
              setUsername(val);
              setShowSuggestions(val.trim().length > 1);
            }}
          />
          {showSuggestions && suggestion?.length && (
            <SuggestionDropdown
              suggestions={suggestion}
              show={showSuggestions}
              onSelect={(selected) => {
                setUsername(selected);
                setShowSuggestions(false);

                if (submittedUsername !== selected) {
                  setSubmittedUsername(selected);
                } else {
                  refetch();
                }

                setRecentUsers((prev) => {
                  const updated = [
                    selected,
                    ...prev.filter((u) => u !== selected),
                  ];
                  return updated.slice(0, 5);
                });
              }}
            />
          )}
        </div>

        <button type="submit">Search</button>
      </form>
      {isLoading && <p className="status">Loading</p>}
      {isError && <p className="status error">{error.message}</p>}

      {data && <UserCard user={data} />}

      {recentUsers.length > 0 && (
        <RecentSearches
          users={recentUsers}
          onSelect={(username: string) => {
            setUsername(username);
            setSubmittedUsername(username);
          }}
        />
      )}
    </>
  );
};

export default UserSearch;
