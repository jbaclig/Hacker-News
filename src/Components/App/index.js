import React, { Component } from 'react';
import {
          DEFAULT_QUERY, DEFAULT_PAGE, DEFAULT_HPP, PATH_BASE, PATH_SEARCH,
          PARAM_HPP, PARAM_PAGE, PARAM_SEARCH
        } from '../Constants';
import Search from '../Search';
import Table from '../Table';
import { ButtonWithLoading } from '../Button';
import './index.css';

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

export default App;