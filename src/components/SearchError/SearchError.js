import { ExclamationCircleOutlined } from '@ant-design/icons';
import './SearchError.css';

const SearchError = () => {
  return (
    <div className="search-error">
      <ExclamationCircleOutlined />
      <p>No movies found!</p>
    </div>
  );
};

export default SearchError;
