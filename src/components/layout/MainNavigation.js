import { Fragment, useRef } from "react";
import { Link } from 'react-router-dom';

import classes from './MainNavigation.module.css';

const navItems = [
    {
        id: 1,
        name: "Add Receipts",
        route: "new-receipt"
    }, 
    {
        id: 2,
        name: "Receipts",
        route: "receipts"
    },
    {
        id: 3,
        name: "Scan Receipt",
        route: "scan-receipt"
    }
];

const MainNavigation = (props) => {
    const mainNavigation = useRef();

    const handleSideNavigation = (e) => {
        if(e.target.id === "menu") {
            mainNavigation.current.style.width = '250px';
        } else {
            mainNavigation.current.style.width = '0';
        }
    }

    return (
        <Fragment>
            {/* <header className={classes['main-header']}>
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
            </header> */}
            <span id="menu" className={`material-symbols-outlined ${classes['main-menu']}`} onClick={handleSideNavigation}>
                    menu
            </span>
            <div ref={mainNavigation} className={classes['side-nav']}>
                
                <span id="close" className={`material-symbols-outlined ${classes['closeIcon']}`} onClick={handleSideNavigation}>
                    close
                </span>
                <nav className={classes.nav}>
                    <ul className={classes['nav-items']}>
                        {navItems.map((item, index) => {
                            return (
                                <li key={item.id} className={classes['nav-item']}>
                                    <Link to={item.route} className={classes['nav-item__link']}>{item.name}</Link>
                                </li>
                            );
                        })}
                    </ul>
                </nav>
            </div>
        </Fragment>
    );
}

export default MainNavigation;