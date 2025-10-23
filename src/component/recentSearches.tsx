import { FaClock } from 'react-icons/fa6';
import { FaUser } from 'react-icons/fa6';
import { useQueryClient } from '@tanstack/react-query';
import { fetchGithubUser } from '../api/github';

type RecentSearchesProps = {
  users: string[];
  onSelect: (username: string) => void; // does not return anything so (void)
};

const RecentSearches = ({ users, onSelect }: RecentSearchesProps) => {
  const queryClient = useQueryClient();
  return (
    <div className="recent-searches">
      <div className="recent-header">
        <FaClock />
        <h3> Recent Searches</h3>
      </div>
      <ul>
        {users.map((user) => (
          <li key={user}>
            <button
              onClick={() => onSelect(user)}
              onMouseEnter={() => {
                queryClient.prefetchQuery({
                  queryKey: ['users', user],
                  queryFn: () => fetchGithubUser(user),
                });
              }}
            >
              <FaUser className="user-icon" />
              {user}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RecentSearches;
