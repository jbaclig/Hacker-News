import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { SortWithSortIcon } from '../Sort';
import Button from '../Button';
import { SORTS } from '../Constants';
import './index.css';

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

export default Table;