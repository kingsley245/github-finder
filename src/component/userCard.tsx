import { FaGitAlt, FaUserMinus, FaUserPlus } from 'react-icons/fa6';
import { useMutation, useQuery } from '@tanstack/react-query';
import {
  checkFollowingUser,
  followUser,
  unFollowGithubUser,
} from '../api/github';
import { toast } from 'sonner';
import type { GithubUser } from '../Types';

const UserCard = ({ user }: { user: GithubUser }) => {
  // query to check if user is following
  const { data: isFollowing, refetch } = useQuery({
    queryKey: ['follow-status', user.login],
    queryFn: () => checkFollowingUser(user.login),
    enabled: !!user.login,
  });

  // Mutation to follow the user

  const followMutation = useMutation({
    mutationFn: () => followUser(user.login),
    onSuccess: () => {
      toast.success(`you are now following ${user.login}`);
      refetch();
    },
    onError: (err) => {
      toast.error(err.message);
    },
  });

  const unfollowMutation = useMutation({
    mutationFn: () => unFollowGithubUser(user.login),
    onSuccess: () => {
      toast.success(`you are no longer following ${user.login}`);
      refetch();
    },
    onError: (err) => {
      toast.error(err.message);
    },
  });

  const handlefollow = () => {
    if (isFollowing) {
      unfollowMutation.mutate();
    } else {
      followMutation.mutate();
    }
  };
  return (
    <div className="user-card">
      <img src={user.avatar_url} alt={user.name} className="avatar" />
      <h2>{user.name || user.login}</h2>
      <p className="bio">{user.bio}</p>
      <div className="user-card-buttons">
        <button
          disabled={followMutation.isPending || unfollowMutation.isPending}
          onClick={handlefollow}
          className={`follow-btn ${isFollowing ? 'following' : ''}`}
        >
          {isFollowing ? (
            <>
              <FaUserMinus className="follow-icon" />
              following
            </>
          ) : (
            <>
              <FaUserPlus className="follow-icon" />
              follow User
            </>
          )}
        </button>
        <a
          href={user.html_url}
          className="profile-btn"
          target="_blank"
          rel="noopener noreferrer"
        >
          <FaGitAlt /> View github profile
        </a>
      </div>
    </div>
  );
};

export default UserCard;
