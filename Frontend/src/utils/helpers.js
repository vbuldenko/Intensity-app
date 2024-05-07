import classNames from 'classnames';

export const getLinkClass = ({ isActive }) =>
    classNames({
        active: isActive,
    });
