import { Input } from 'antd';
import { Component } from 'react';
import _debounce from 'lodash.debounce';

export default class MovieSearch extends Component {
  constructor(props) {
    super(props);
    this.state = {
      input: null,
    };
    this.debouncedOnMovieSearch = _debounce(this.onMovieSearch, 500);
  }

  onInputChange = (e) => {
    const {
      target: { value },
    } = e;

    this.setState({
      input: value,
    });

    this.debouncedOnMovieSearch(value, 1);
  };

  onMovieSearch = (input, page) => {
    const { onMovieSearch } = this.props;
    onMovieSearch(input, page);
  };

  render() {
    const { input } = this.state;

    return (
      <Input
        addonAfter={false}
        placeholder="Type to search..."
        onChange={this.onInputChange}
        value={input}
        style={{
          height: 40,
          fontSize: 16,
        }}
      />
    );
  }
}
