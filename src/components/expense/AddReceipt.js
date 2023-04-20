import React, { Fragment, useState } from "react"

import classes from './addReceipt.module.css';

const AddReceipt = (props) => {

    const [receipt, setReceipt] = useState({
        barcode: '',
        location: '',
        date: '',
        products: []
    });

    // const [productCount, setProductCount] = useState(0);
    const [products, setProducts] = useState([{
        productName: '',
        productCode: '',
        productPrice: 0.00
    }]);

    console.log({products, receipt});

    const productChangeHandler = (index, event) => {
        console.log({index, name: event.target.name});
        const prevProducts = [...products];
        prevProducts[index][event.target.name] = event.target.value;
        setProducts([...prevProducts]);
    }

    const receiptInfoChangeHandler = (e) => {
        e.preventDefault();
        console.log({event: e.target.name});
        setReceipt((prev) => {
            console.log({...prev});
            const temp = {...prev};
            temp[e.target.name] = e.target.value;
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
        setProducts([...products, newProduct]);
    }

    const submitReceiptButtonHandler = (e) => {
        e.preventDefault();
        for (const key in receipt) {
            console.log(`Value of Receipt's ${key} is ${receipt[key]}`);
            if(receipt[key] === '') return;
        }
        setReceipt({ ...receipt, products: [...products]});
    }

    return <Fragment>
        <div className={classes["main-container"]}>
            <header className={classes.header}>
                Add receipt
            </header>
            <div className={classes["section-top"]}>
                <input type="text" name="barcode" onChange={receiptInfoChangeHandler} placeholder="Receipt No" className={classes["input-field"]}/>
                <input type="text" name="location" onChange={receiptInfoChangeHandler} placeholder="Location" className={classes["input-field"]}/>
                <input type="date" name="date" onChange={receiptInfoChangeHandler} placeholder="Date" className={classes["input-field"]}/>
            </div>
            <div className={classes.partition}></div>
            <div className={classes["section-products"]}>
                {products.map((val, index) => {
                    return (
                        <div key={index} className={classes.products}>
                            <input type="text" name="productName" onChange={(event) => productChangeHandler(index, event)} placeholder="Name" className={classes["input-field"]} value={val.productName}/>
                            <input type="text" name="productPrice" onChange={(event) => productChangeHandler(index, event)} placeholder="Price" className={classes["input-field"]} value={val.productPrice}/>
                            <input type="text" name="productCode" onChange={(event) => productChangeHandler(index, event)} placeholder="Code" className={classes["input-field"]} value={val.productCode}/>
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