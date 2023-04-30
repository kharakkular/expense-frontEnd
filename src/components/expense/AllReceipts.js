import { Fragment, useEffect } from "react";

// import classes from './AllReceipt.module.css';
import useHttp from '../../hooks/use-http.js';
import { getAllReceipts } from '../../lib/api';

const AllReceipts = (props) => {

    const {sendRequest, data: loadedReceipts, error, status } = useHttp(getAllReceipts, true);

    console.log('Value of receipts from Allreceips ', {loadedReceipts, status, error});
    useEffect(() => {
        sendRequest();
    }, [sendRequest]);

    if(status === 'pending') {
        // return <LoadingSpinner />
        return (<h2 style={{marginTop: '200px'}}>Loading</h2>);
    }

    if(error) {
        return (<h2>error</h2>);
    }

    if(status === 'completed' && loadedReceipts.length === 0) {
        return (<h2>No records found</h2>);
    }

    return (
        <Fragment>
            <div style={{marginTop: '100px', color: 'white'}}></div>
            {loadedReceipts.expenses.map((item, index) => {
                return (<p key={index}> {item.barcode}</p>);
            })}
        </Fragment>
    );
}

export default AllReceipts;