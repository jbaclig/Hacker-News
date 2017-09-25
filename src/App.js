import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { sortBy } from 'lodash';
import classNames from 'classnames';
import './App.css';

const DEFAULT_QUERY = 'redux';
const DEFAULT_PAGE = 0;
const DEFAULT_HPP = '100';

const PATH_BASE = 'https://hn.algolia.com/api/v1';
const PATH_SEARCH = '/search';
const PARAM_SEARCH = 'query=';
const PARAM_PAGE = 'page=';
const PARAM_HPP = 'hitsPerPage=';

const isSearched = (searchTerm) => (item) => 
  !searchTerm || item.title.toLowerCase().includes(searchTerm.toLowerCase());

const SORTS = {
  NONE: list => list,
  TITLE: list => sortBy(list, 'title'),
  AUTHOR: list => sortBy(list, 'author'),
  COMMENTS: list => sortBy(list, 'num_comments').reverse(),
  POINTS: list => sortBy(list, 'points').reverse(),
};

const updateSearchTopstoreisState = (hits, page) => (prevState) => {
  const {
    searchKey,
    results
  } = prevState;

  const oldHits = results && results[searchKey]
    ? results[searchKey].hits
    : []

  const updatedHits = [
    ...oldHits,
    ...hits
  ];

  return {
    results: {
      ...results,
      [searchKey]: { hits: updatedHits, page }
    },
    isLoading: false
  };
};

const dismissStory = (id) => (prevState) => {
  const {
    searchKey,
    results
  } = prevState;

  const {
    hits,
    page
  } = results[searchKey];

  const isNotId = item => item.objectID !== id;
  const updatedHits = hits.filter(isNotId);

  return {
    results: {
      ...results, 
      [searchKey] : {hits: updatedHits, page }  
    }
  };
};

const updateSearchTerm = () => (prevState) => {
  const { searchTerm } = prevState;
  return { searchKey: searchTerm };
}

class App extends Component {

  constructor(props) {
    super(props);

    this.state = {
      results: null,
      searchKey: '',
      searchTerm: DEFAULT_QUERY,
      isLoading: false,
    };

    this.needsToSearchTopstories = this.needsToSearchTopstories.bind(this);
    this.setSearchTopstories = this.setSearchTopstories.bind(this);
    this.fetchSearchTopstories = this.fetchSearchTopstories.bind(this);
    this.onSearchSubmit = this.onSearchSubmit.bind(this);
    this.onDismiss = this.onDismiss.bind(this);
    this.onSearchChange = this.onSearchChange.bind(this);
  }

  needsToSearchTopstories(searchTerm) {
    return !this.state.results[searchTerm];
  }

  setSearchTopstories(result) {
    const {
      hits,
      page
    } = result;

    this.setState(updateSearchTopstoreisState(hits,page));
  }

  fetchSearchTopstories(searchTerm, page) {
    this.setState({ isLoading: true });

    fetch(`${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${searchTerm}&${PARAM_PAGE}${page}&${PARAM_HPP}${DEFAULT_HPP}`)
      .then(response => response.json())
      .then(result => this.setSearchTopstories(result))
      .catch(e => e);
  }

  onSearchSubmit(event) {
    this.setState(updateSearchTerm());
    const { searchTerm } = this.state;
    if(this.needsToSearchTopstories(searchTerm)) {
      this.fetchSearchTopstories(searchTerm, DEFAULT_PAGE);      
    }
    event.preventDefault();
  }

  componentDidMount() {
    this.setState(updateSearchTerm());
    const { searchTerm } = this.state;
    this.fetchSearchTopstories(searchTerm, DEFAULT_PAGE);
  }

  /*componentDidMount() {
    const { searchTerm } = this.state;
    this.setState({ searchKey: searchTerm });
    this.fetchSearchTopstories(searchTerm, DEFAULT_PAGE);
  }*/

  onDismiss(id) {
    this.setState(dismissStory(id));
  }

  onSearchChange(event) {
    this.setState({searchTerm: event.target.value});
  }

  render() {  
    const {
      searchTerm,
      results,
      searchKey,
      isLoading,
    } = this.state;

    const page = (
      results && 
      results[searchKey] &&
      results[searchKey].page
    ) || 0;

    const list = (
      results &&
      results[searchKey] &&
      results[searchKey].hits
    ) || [];

    return(
      <div className="page">
        <div className="interactions">
          <Search 
            value={searchTerm}
            onChange={this.onSearchChange}
            onSubmit={this.onSearchSubmit}
          >
            Search
          </Search>
        </div>
        { results &&
          <Table 
            list={list}
            onDismiss={this.onDismiss}
          />
        } 
        <div className="interactions">
          <ButtonWithLoading
            isLoading={isLoading}
            onClick={() => this.fetchSearchTopstories(searchKey, page + 1)}
          >
            More
          </ButtonWithLoading>
        </div>
      </div>
    );
  }
}

 
const Search = ({ 
  value, 
  onChange,
  onSubmit, 
  children 
}) => 
  <form onSubmit={onSubmit}>
    <input 
      type="text" 
      value={value}
      onChange={onChange} 
    />
    <button type="submit">
      {children}
    </button>
  </form> 

/************ 
class Search extends Component {

  componentDidMount() {
    this.input.focus();
  }

  render() {
    const {
      value,
      onChange,
      onSubmit,
      children
    } = this.props;

    return (
      <form onSubmit={onSubmit}>
        <input 
          type="text" 
          value={value}
          onChange={onChange} 
          ref={(node) => { this.input = node; }}
        />
        <button type="submit">
          {children}
        </button>
      </form>
    );
  }
}
************/

Search.PropTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  children: PropTypes.node,
}

const largeColumn = {
  width: '40%'
};

const medColumn = {
  width: '30%'
};

const smallColumn = {
  width: '10%'
};

class Table extends Component {

  constructor(props) {
    super(props);

    this.state = {
      sortKey: 'NONE',
      isSortReverse: false,
    };

    this.onSort = this.onSort.bind(this);
  }

  onSort(sortKey) {
    const isSortReverse = this.state.sortKey === sortKey 
      && !this.state.isSortReverse;
    this.setState({ sortKey, isSortReverse });
  }

  render() {
    const { 
      list, 
      onDismiss,
    } = this.props;

    const {
      sortKey,
      isSortReverse
    } = this.state;

    const sortedList = SORTS[sortKey](list);
    const reverseSortedList = isSortReverse
      ? sortedList.reverse()
      : sortedList;
    
    return(
      <div className="table">
        <div className="table-header">
          <span style={{ width: '40%' }}>
            <SortWithSortIcon
              sortKey={'TITLE'}
              onSort={this.onSort}
              activeSortKey={sortKey}
              isSortReverse={isSortReverse}
            >
              Title
            </SortWithSortIcon>  
          </span>
          <span style={{ width: '30%' }}>
            <SortWithSortIcon
              sortKey={'AUTHOR'}
              onSort={this.onSort}
              activeSortKey={sortKey}
              isSortReverse={isSortReverse}
            >
              Author
            </SortWithSortIcon>
          </span>  
          <span style={{ width: '10%' }}>
            <SortWithSortIcon
              sortKey={'COMMENTS'}
              onSort={this.onSort}
              activeSortKey={sortKey}
              isSortReverse={isSortReverse}
            >
              Comments
            </SortWithSortIcon>  
          </span>
          <span style={{ width: '10%' }}>
            <SortWithSortIcon
              sortKey={'POINTS'}
              onSort={this.onSort}
              activeSortKey={sortKey}
              isSortReverse={isSortReverse}
            >
              Points
            </SortWithSortIcon>  
          </span>  
          <span style={{ width: '10%' }}>
            Archive  
          </span>
        </div>
        { reverseSortedList.map(item => 
          <div key={item.objectID} className="table-row">
            <span style={largeColumn}>
              <a href={item.url}>{item.title} </a>
            </span>
            <span style={medColumn}>{item.author} </span>
            <span style={smallColumn}>{item.num_comments} </span>
            <span style={smallColumn}>{item.points} </span>
            <span style={smallColumn}>
              <Button
                onClick={() => onDismiss(item.objectID)}
                className="button-inline"
              >
                Dismiss
              </Button>
            </span>
          </div>
        )}
      </div>
    );
  }
} 

Table.PropTypes = {
  list: PropTypes.arrayOf(
    PropTypes.shape({
      objectID: PropTypes.string.isRequired,
      author: PropTypes.string,
      url: PropTypes.string,
      num_comments: PropTypes.number,
      points: PropTypes.number,
    })
  ).isRequired,
  onDismiss: PropTypes.func.isRequired,
};

const Sort = ({ 
  sortKey,
  activeSortKey,
  isSortReverse,
  onSort, 
  children }) => {
    const sortClass = classNames(
      'button-inline',
      { 'button-active': sortKey === activeSortKey }
    );

    return(
      <Button 
        onClick={() => onSort(sortKey)}
        className={sortClass}
      >
        {children}
      </Button> 
    );
  }
  

const Button = ({ onClick, className, children }) =>
  <button
    onClick={onClick}
    className={className}
    type="button"
  >
    {children}
  </button> 

Button.defaultProps = {
  className: '',
}

Button.PropTypes = {
  onClick: PropTypes.func.isRequired,
  className: PropTypes.string,
  children: PropTypes.node.isRequired,
};

export default App;

export {
  Button,
  Search,
  Table,
};

const Loading = () =>
  <div>
    <i className="fa fa-spinner" aria-hidden="true"></i>  
  </div>

const withLoading = (Component) => ({ isLoading, ...rest }) =>
  isLoading ? <Loading /> : <Component { ...rest } />

const ButtonWithLoading = withLoading(Button);

const SortIcon = ({ isSortReverse }) =>
  isSortReverse 
    ? <i className="fa fa-arrow-circle-o-up" aria-hidden="true"></i>
    : <i className="fa fa-arrow-circle-o-down" aria-hidden="true"></i>

const withSortIcon = (Component) => ({ activeSortKey, isSortReverse, sortKey, ...rest }) =>
  activeSortKey === sortKey
    ? <div>
        <Component 
          activeSortKey={activeSortKey} 
          isSortReverse={isSortReverse} 
          sortKey={sortKey}
          { ...rest} 
        /> 
        <SortIcon isSortReverse={isSortReverse} />
      </div>
      : <Component 
          activeSortKey={activeSortKey} 
          isSortReverse={isSortReverse} 
          sortKey={sortKey}
          { ...rest} 
        />

const SortWithSortIcon = withSortIcon(Sort);
