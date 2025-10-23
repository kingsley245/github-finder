import UserSearch from './component/UserSearch';
import { Toaster } from 'sonner';

const App = () => {
  return (
    <div className="container">
      <h1>Github Finder</h1>
      <UserSearch />
      <Toaster />
    </div>
  );
};

export default App;
