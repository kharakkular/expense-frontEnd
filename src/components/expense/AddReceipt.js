import React, { Fragment, useState } from "react"

import classes from './addReceipt.module.css';

const AddReceipt = (props) => {

    const [receipt, setReceipt] = useState({
        barcode: '',
        location: '',
        date: '',
        products: [{
            productName: '',
            productCode: '',
            productPrice: ''
        }]
    });
 
    console.log({receipt});

    const receiptInfoChangeHandler = (index, e) => {
        e.preventDefault();
        console.log({event: e.target.name});
        setReceipt((prev) => {
            console.log({...prev});
            const temp = {...prev};
            if(e.target.name === 'productName' || e.target.name === 'productCode' || e.target.name === 'productPrice') {
                temp.products[index][e.target.name] = e.target.value;
            } else {
                temp[e.target.name] = e.target.value;
            }
            return temp;
        } );
    }

    const addProductButtonClickHandler = (e) => {
        e.preventDefault();
        let newProduct = {
            productName: '',
            productCode: '',
            productPrice: 0.00
        };
        const tempProducts = [...receipt.products, newProduct];
        setReceipt({ ...receipt, products: [...tempProducts]});
    }

    const submitReceiptButtonHandler = async (e) => {
        e.preventDefault();
        for (const key in receipt) {
            console.log(`Value of Receipt's ${key} is ${receipt[key]}`);
            if(receipt[key] === '') return;
        }
        try {
            const postData = await fetch('http://localhost:8080/api/expense', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(receipt)
            });
            const response = await postData.json();
            console.log(`Response is ${response}`);
            setReceipt({
                barcode: '',
                location: '',
                date: '',
                products: [{
                    productName: '',
                    productCode: '',
                    productPrice: ''
                }]
            });
        } catch (error) {
            console.error(`Error while sending post request is: `, {error});
        }
    }

    return <Fragment>
        <div className={classes["main-container"]}>
            <header className={classes.header}>
                <h2>Add Receipt Info</h2>
            </header>
            <div className={classes["section-top"]}>
                <input type="text" name="barcode" onChange={(e) => receiptInfoChangeHandler(null, e)} placeholder="Receipt No" className={classes["input-field"]} value={receipt.barcode}/>
                <input type="text" name="location" onChange={(e) => receiptInfoChangeHandler(null, e)} placeholder="Location" className={classes["input-field"]} value={receipt.location}/>
                <input type="date" name="date" onChange={(e) => receiptInfoChangeHandler(null, e)} placeholder="Date" className={classes["input-field"]} value={receipt.date}/>
            </div>
            <div className={classes.partition}></div>
            <div className={classes["section-products"]}>
                {receipt.products.map((val, index) => {
                    return (
                        <div key={index} className={classes.products}>
                            <input type="text" name="productName" onChange={(event) => receiptInfoChangeHandler(index, event)} placeholder="Name" className={classes["input-field"]} value={val.productName}/>
                            <input type="text" name="productPrice" onChange={(event) => receiptInfoChangeHandler(index, event)} placeholder="Price" className={classes["input-field"]} value={val.productPrice}/>
                            <input type="text" name="productCode" onChange={(event) => receiptInfoChangeHandler(index, event)} placeholder="Code" className={classes["input-field"]} value={val.productCode}/>
                        </div>
                    );
                })}
                <div className={classes["add-products"]} >
                    <span className={classes["add-symbol"]} onClick={addProductButtonClickHandler}>
                        <span className={`material-symbols-outlined ${classes.add}`}>
                            add
                        </span>
                        <h3>Products</h3>
                    </span>
                    <span className={classes["submit"]} onClick={submitReceiptButtonHandler}>
                        <h3>Submit Receipt</h3>
                    </span>
                </div>
                
            </div>
        </div>
    </Fragment>
};

export default AddReceipt;