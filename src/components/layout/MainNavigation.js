import { Fragment } from "react";
import { Link } from 'react-router-dom';

import classes from './MainNavigation.module.css';

const navItems = [
    {
        name: "Add Receipts",
        route: "new-receipt"
    }, 
    {
        name: "Receipts",
        route: "receipts"
    }
];

const MainNavigation = (props) => {

    return (
        <Fragment>
            <header className={classes['main-header']}>
                <div className={classes.logo}>
                    <h3>Expense</h3>
                </div>
                <nav className={classes.nav}>
                    <ul className={classes['nav-items']}>
                        {navItems.map((item, index) => {
                            return (
                                <li key={index} className={classes['nav-item']}>
                                    <Link to={item.route} className={classes['nav-item__link']}>{item.name}</Link>
                                </li>
                            )
                        })}
                    </ul>
                </nav>
            </header>
        </Fragment>
    );
}

export default MainNavigation;