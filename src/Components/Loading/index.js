import React from 'react';

const Loading = () =>
<div>
    <i className="fa fa-spinner" aria-hidden="true"></i>  
</div>

const withLoading = (Component) => ({ isLoading, ...rest }) =>
isLoading ? <Loading /> : <Component { ...rest } />


export default withLoading;