import React, { Fragment, useState } from "react"

import classes from './addReceipt.module.css';

const emptyReceipt = {
    receiptBarcode: '',
    address: '',
    date: '',
    store: '',
    items: [{
        name: '',
        code: '',
        price: ''
    }],
    subTotal: 0.00,
    total: 0.00,
};

const receiptInfo = [
    {
        name: 'store',
        type: 'text',
        placeholder: 'Store Number',
        displayText: 'Store Number'
    },
    {
        name: 'receiptBarcode',
        type: 'text',
        placeholder: 'Receipt Barcode',
        displayText: 'Receipt Barcode'
    },
    {
        name: 'address',
        type: 'text',
        placeholder: 'Store Address',
        displayText: 'Store Address'
    },
    {
        name: 'date',
        type: 'date',
        placeholder: 'Receipt Date',
        displayText: 'Receipt Date'
    },
    {
        name: 'subtotal',
        type: 'number',
        placeholder: 'SubTotal',
        displayText: 'SubTotal'
    },
    {
        name: 'Total',
        type: 'number',
        placeholder: 'Total',
        displayText: 'Total'
    }
]

const AddReceipt = (props) => {

    const [receipt, setReceipt] = useState(emptyReceipt);
 
    console.log({receipt});

    const receiptInfoChangeHandler = (index, e) => {
        e.preventDefault();
        console.log({event: e.target.name});
        setReceipt((prev) => {
            console.log({...prev});
            const temp = {...prev};
            if(e.target.name === 'name' || e.target.name === 'code' || e.target.name === 'price') {
                temp.items[index][e.target.name] = e.target.value;
            } else {
                temp[e.target.name] = e.target.value;
            }
            return temp;
        } );
    }

    const addProductButtonClickHandler = (e) => {
        e.preventDefault();
        let newProduct = {
            name: '',
            code: '',
            price: ''
        };
        const tempItems = [...receipt.items, newProduct];
        setReceipt({ ...receipt, items: [...tempItems]});
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
            setReceipt(emptyReceipt);
        } catch (error) {
            console.error(`Error while sending post request is: `, {error});
        }
    }

    return (
    
    <Fragment>
        <div className={classes.header}>
            <header className={classes['']}>
                <h2>Add Receipt Info</h2>
            </header>
        </div>
        <div className={classes["main-container"]}>
            <div className={classes["section-top"]}>
                {receiptInfo.map(i => {
                    return (
                        <div className={classes['section-top__items']}>
                            <label htmlFor={i.name}>{i.displayText}</label>
                            <input type={i.type} name={i.name} onChange={(e) => receiptInfoChangeHandler(null, e)} placeholder={i.placeholder} className={classes["input-field"]} value={receipt[i.name]}/>
                        </div>
                    )
                })}
                {/* <div className={classes['section-top__items']}>
                    <label htmlFor="barcode">Receipt No</label>
                    <input type="text" name="barcode" onChange={(e) => receiptInfoChangeHandler(null, e)} placeholder="Receipt No" className={classes["input-field"]} value={receipt.barcode}/>
                </div>
                <div className={classes['section-top__items']}>
                    <label htmlFor="location">Location</label>
                    <input type="text" name="location" onChange={(e) => receiptInfoChangeHandler(null, e)} placeholder="Location" className={classes["input-field"]} value={receipt.location}/>
                </div>
                <div className={classes['section-top__items']}>
                    <label htmlFor="date">Date</label>
                    <input type="date" name="date" onChange={(e) => receiptInfoChangeHandler(null, e)} placeholder="Date" className={classes["input-field"]} value={receipt.date}/>
                </div> */}
            </div>
            <div className={classes.partition}></div>
            <div className={classes["section-products"]}>
                <div className={classes['products-items-header']}>
                    <span>Items Information</span>
                </div>
                {receipt.items.map((val, index) => {
                    return (
                        <div key={index} className={classes.products}>
                            <input type="text" name="name" onChange={(event) => receiptInfoChangeHandler(index, event)} placeholder="Name" className={`${classes["input-field"]} ${classes['products-item_name']}`} value={val.name}/>
                            <input type="text" name="code" onChange={(event) => receiptInfoChangeHandler(index, event)} placeholder="Code" className={`${classes["input-field"]} ${classes['products-item_code']}`} value={val.code}/>
                            <input type="number" name="price" onChange={(event) => receiptInfoChangeHandler(index, event)} placeholder="Price" className={`${classes["input-field"]} ${classes['products-item_price']}`} value={val.price}/>
                        </div>
                    );
                })}
                <div className={classes['add-symbol_container']} >
                    <div className={classes['add-symbol']} onClick={addProductButtonClickHandler}>
                        <span className={`material-symbols-outlined ${classes.add}`}>
                            add
                        </span>
                        <h3>Add Items</h3>
                    </div>
                </div>
            </div>
            {/* <div className={classes["bottom-section"]} >
                <span className={classes["submit"]} onClick={submitReceiptButtonHandler}>
                    <h3>Submit Receipt</h3>
                </span>
            </div> */}
        </div>
    </Fragment>)
};

export default AddReceipt;