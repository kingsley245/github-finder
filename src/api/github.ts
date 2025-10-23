export const fetchGithubUser = async (username: string) => {
  const res = await fetch(
    `${import.meta.env.VITE_GITHUB_API_URL}/users/${username}`
  );
  if (!res.ok) {
    throw new Error('User not found');
    console.log(Error);
  }

  const data = await res.json();

  return data;
};

export const SearchGithubUser = async (query: string) => {
  const res = await fetch(
    `${import.meta.env.VITE_GITHUB_API_URL}/search/users?q=${query}`
  );
  if (!res.ok) throw new Error('User not found');

  const data = await res.json();

  return data.items;
};

// check if following a user in github
export const checkFollowingUser = async (username: string) => {
  const res = await fetch(
    `${import.meta.env.VITE_GITHUB_API_URL}/user/following/${username}`,
    {
      headers: {
        Authorization: `Bearer ${import.meta.env.VITE_API_TOKEN}`,
        Accept: ` application/vnd.github+json`,
      },
    }
  );
  if (res.status === 204) {
    return true; // User is being followed
  } else if (res.status === 404) {
    console.error(`User ${username} not found or not followed.`);
    return false; // User is not followed
  } else if (res.status === 401 || res.status === 403) {
    throw new Error('Authentication error: Please check your API token.');
  } else {
    const errorData = await res.json().catch(() => null);
    throw new Error(errorData?.message || 'Failed to fetch followed status');
  }
};

//follow user on github

export const followUser = async (username: string) => {
  const res = await fetch(
    `${import.meta.env.VITE_GITHUB_API_URL}/user/following/${username}`,
    {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${import.meta.env.VITE_API_TOKEN}`,
        Accept: ` application/vnd.github+json`,
        'content-Type': 'application/json',
      },
    }
  );

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || 'failed to follow user');
  }
  return true;
};

export const unFollowGithubUser = async (username: string) => {
  const res = await fetch(
    `${import.meta.env.VITE_GITHUB_API_URL}/user/following/${username}`,
    {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${import.meta.env.VITE_API_TOKEN}`,
        Accept: ` application/vnd.github+json`,
        'content-Type': 'application/json',
      },
    }
  );

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || 'failed to unfollow  user');
  }
  return true;
};
