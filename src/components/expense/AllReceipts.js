import { Fragment, useEffect } from "react";

import classes from './AllReceipt.module.css';
import useHttp from '../../hooks/use-http.js';
import { getAllReceipts } from '../../lib/api';
import Card from "../ui/Card";

const AllReceipts = (props) => {

    const {sendRequest, data: loadedReceipts, error, status } = useHttp(getAllReceipts, true);

    console.log('Value of receipts from Allreceips ', {loadedReceipts, status, error});
    useEffect(() => {
        sendRequest();
    }, [sendRequest]);

    if(status === 'pending') {
        // return <LoadingSpinner />
        return (<h2>Loading</h2>);
    }

    if(error) {
        return (<h2>{error}</h2>);
    }

    if(status === 'completed' && loadedReceipts.length === 0) {
        return (<h2>No records found</h2>);
    }

    return (
        <Fragment>
            <div className={classes.container}>
                <header className={classes['all-receipts-header']}>
                    <div className={classes.heading}>
                        <span>Receipts</span>
                    </div>
                </header>
                {loadedReceipts.expenses.map((item, index) => {
                    let initialValue = 0;
                    console.log({item});
                    return (
                        <Card key={index}> 
                            <header className={classes['card-header']}>
                                <h1>{item.store.toUpperCase()}</h1>
                                <div className={classes.break}></div>
                                <p>{item.location}</p>
                            </header>
                            <div className={classes.divider}></div>
                            <main className={classes['card-body']}>
                                <div className={classes['items']}>
                                    <span className={classes['']}>Date#</span>
                                    <span className={classes['item-value']}>{new Date(item.datePurchased).toDateString()}</span>
                                </div>
                                <div className={classes['items']}>
                                    <span className={classes['']}>Count#</span>
                                    <span className={classes['item-value']}>{item.products.length}</span>
                                </div>
                                <div className={classes['items']}>
                                    <span className={classes['']}>Total $</span>
                                    <span className={classes['item-value']}>
                                        {item.products.reduce((prevVal, currentVal) => prevVal + currentVal.price, initialValue)}
                                    </span>
                                </div>
                            </main>
                            <div className={classes['card-footer']}>
                                <button>See Details</button>
                            </div>
                        </Card>
                    );
                })}
            </div>
        </Fragment>
    );
}

export default AllReceipts;