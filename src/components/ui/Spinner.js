import { Fragment } from "react"

import classes from './Spinner.module.css';

const Spinner = (props) => {

    return (
        <Fragment>
            <div className={classes.spin}></div>
        </Fragment>
    )
}

export default Spinner;