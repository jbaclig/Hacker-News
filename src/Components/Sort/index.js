import React from 'react';
import Button from '../Button';
import classNames from 'classnames';


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

export { SortWithSortIcon };