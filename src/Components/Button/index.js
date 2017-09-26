import React from 'react';
import PropTypes from 'prop-types';
import withLoading from '../Loading';
import './index.css';

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

const ButtonWithLoading = withLoading(Button);

export default Button;

export { ButtonWithLoading };

