import { Fragment, useEffect, useState } from "react";

import Tesseract from "tesseract.js";
// import image from '../../../images/Walmart-receipt.png';
import classes from './ScanReceipt.module.css';
import {getUploadedReceiptData} from '../../../lib/receiptData';

const ScanReceipt = (props) => {

    const [data, setData] = useState(null);
    const [contentArr, setContentArr] = useState([]);
    const [extractedReceiptData, setExtractedReceiptData] = useState({
        store: '',
        address: '',
        items: [],
        subTotal: 0.00,
        total: 0.00
    });
    const items = [...extractedReceiptData.items];
    // const [address, setAddress] = useState(undefined);

    useEffect(() => {
        const {store, address, items, subTotal, total } =  getUploadedReceiptData(contentArr);
        // setStore(store);
        // setAddress(address);
        setExtractedReceiptData({
            store: store,
            address: address,
            items: [...items],
            subTotal: subTotal,
            total: total
        });
    }, [contentArr]);

    const uploadImage = (e) => {
        console.log({file1: e.target.files[0], fileName: e.target.files[0].name});
        Tesseract.recognize(
            e.target.files[0],
            'eng'
          ).then((data) => {
            setData(data);
            const tempArr = [];
            data.data.lines.forEach(line => {
                const tempLine = { words: []};
                line.words.forEach(word => {
                    tempLine.words.push(word.text);
                });
                tempArr.push({...tempLine});
            });
            setContentArr([...tempArr]);
            console.log(data.data.lines);
          }).catch(err => console.log(err.message));
    }

    console.log('Extracted receipt data is ', extractedReceiptData);
    
    console.log({contentArr});

    return (
        <Fragment>
            <div className={classes['scan-body']}>
                <div className={classes['scan-header']}>
                    <h1>Scan Your Item</h1>
                </div>
                <div className={classes['file-input']}>
                    <input name="uploadedImage" type="file" className={classes.file} id="file" onChange={uploadImage}/>
                    <label htmlFor="file">Upload Receipt</label>
                </div>
                {/* {data && data.data.lines.map(line => {
                    return <p key={line.confidence}>{line.text}</p>
                })} */}
                <p>Total: {extractedReceiptData.total}</p>
                <p>SubTotal: {extractedReceiptData.subTotal}</p>
                <p>Store Number: {extractedReceiptData.store}</p>
                <p>Address: {extractedReceiptData.address}</p>
                <ul> 
                {items.map(item => {
                    return (<li key={item.code}>
                        Name: {item.name}, Price: {item.price}
                    </li>)
                })}
                </ul>
            </div>
        </Fragment>
    );
}

export default ScanReceipt;