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
                {loadedReceipts.expenses.map((item, index) => {
                    let initialValue = 0;
                    console.log({item});
                    return (
                        <Card key={index}> 
                            <header className={classes['card-header']}>
                                <h1>{item.store.toUpperCase()}</h1>
                                <div className={classes.break}></div>
                                <h5>{item.location}</h5>
                            </header>
                            <main className={classes['card-body']}>
                                <p className={classes['card-item']}>Date Purchased: {new Date(item.datePurchased).toDateString()}</p>
                                <div className={classes.break}></div>
                                <p className={classes['card-item']}>Number of Products: {item.products.length}</p>
                                <div className={classes.break}></div>
                                <p className={classes['card-item']}>Total Price: {item.products.reduce((prevVal, currentVal) => prevVal + currentVal.price, initialValue)}</p>
                            </main>
                        </Card>);
                })}
            </div>
        </Fragment>
    );
}

export default AllReceipts;