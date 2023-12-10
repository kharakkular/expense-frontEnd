import { Fragment, useEffect, useRef, useState } from "react";
import { useNavigate } from 'react-router-dom';
import Tesseract from "tesseract.js";
// import image from '../../../images/Walmart-receipt.png';
import classes from './ScanReceipt.module.css';
import {getUploadedReceiptData} from '../../../lib/receiptData';
import useHttp from "../../../hooks/use-http";
import { sendReceiptDataInMultipartFormData } from '../../../lib/api';
import Spinner from "../../ui/Spinner";

const ScanReceipt = (props) => {

    const [data, setData] = useState(null);
    const [contentArr, setContentArr] = useState([]);
    const [extractedReceiptData, setExtractedReceiptData] = useState({
        receiptBarcode: '',
        store: '',
        address: '',
        items: [],
        subTotal: 0.00,
        total: 0.00,
        date: ''
    });
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    
    const [imageFile, setImageFile] = useState(null);           // This is for storing the image for temporary viewing it
    const [imageFileURL, setImageFileURL] = useState(null);           
    // const [fileLabelName, setFileLabelName] = useState('Upload Receipt');      // This has been implemented using useRef
    const fileLabelName = useRef();
    const items = [...extractedReceiptData.items];
    // const [address, setAddress] = useState(undefined);
    const { sendRequest, error, status } = useHttp(sendReceiptDataInMultipartFormData);

    useEffect(() => {
        const { store, address, items, subTotal, total, receiptBarcode, date } =  getUploadedReceiptData(contentArr);
        // setStore(store);
        // setAddress(address);
        setExtractedReceiptData({
            store: store,
            address: address,
            items: [...items],
            subTotal: subTotal,
            total: total,
            receiptBarcode: receiptBarcode,
            date: date
        });
    }, [contentArr]);

    useEffect(() => {
        if(error){
            console.log({error});
        }
        if(error === null && status === "completed") {
            navigate("/receipts");
        }
    }, [error, status, navigate]);

    const onChangeExtractedReceiptDataHandler = (e, item) => {
        console.log('Value of input field changed is ', e.target.value);
        setExtractedReceiptData(prevVal => {
            console.log(`Value of item is ${e.target}`);
            if(e.target.name === 'name' || e.target.name === 'code' || e.target.name === 'price') {
                const prevItemIndex = items.findIndex(i => i.id === item.id);
                const prevItem = items[prevItemIndex];
                prevItem[e.target.name] = e.target.value;
                // console.log('************ prevItem is: ', {prevItem});
                return { ...prevVal, items: [...items]};
            }
            return { ...prevVal, [e.target.name]: e.target.value };
        });
    }

    const uploadImage = (e) => {
        // console.log({file1: e.target.files[0], fileName: e.target.files[0].name});
        // setFileLabelName(e.target.files[0].name);
        console.log('********** files[0] is ', {file: e.target.files[0]});
        fileLabelName.current.innerText = e.target.files[0].name;
        setImageFileURL(URL.createObjectURL(e.target.files[0]));
        setImageFile(e.target.files[0]);
        setLoading(true);
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
            // console.log(data.data.lines);
            setLoading(false);
          })
          .catch(err => console.log(err.message));
    }
    
    const closeFileHandler = (e) => {
        URL.revokeObjectURL(imageFile);
        setImageFile(null);
        setImageFileURL(null);
        fileLabelName.current.innerText = 'Select Receipt';
        setData(null);
        setContentArr(null);
    }

    const formSubmitHandler = (event) => {
        event.preventDefault();
        const formData = new FormData();
        console.log('Filelabelname is +++++++++++++++++ ' + fileLabelName.current.innerText);
        console.log({receiptData: extractedReceiptData});
        const file = {
            name: fileLabelName.current.innerText,
            description: 'Walmart'
        }
        formData.append('barcode', extractedReceiptData.receiptBarcode);
        formData.append('store', 'Walmart');
        formData.append('location', extractedReceiptData.address);
        formData.append('products', JSON.stringify(extractedReceiptData.items));
        formData.append('datePurchased', extractedReceiptData.date);
        formData.append('total', extractedReceiptData.total);
        formData.append('file', JSON.stringify(file));
        formData.append('imageFile', imageFile);
        // const obj = {
        //     barcode: extractedReceiptData.receiptBarcode,
        //     store: "Walmart",
        //     location: extractedReceiptData.address,
        //     products: [...extractedReceiptData.items],
        //     datePurchased: extractedReceiptData.date,
        //     total: extractedReceiptData.total,
        //     file: {
        //         name: fileLabelName,
        //         description: 'Walmart',
        //         content: imageFile
        //     }
        // };
        // console.log('Value of obj is ', {obj});
        // for (const iterator of formData.entries()) {
        //     console.log(`Value is ${iterator}`);
        // }
        sendRequest(formData);
        URL.revokeObjectURL(imageFile);
        setImageFile(null);
        setImageFileURL(null);
    }

    // console.log({contentArr, extractedReceiptData, loading, status});
    console.log("image file" + imageFile);
    return (
        <Fragment>
            <div className={classes['scan-body']}>
                {/* <div className={classes['scan-header']}>
                    <h1>Upload Receipt</h1>
                </div> */}
                
                <div className={classes['file-input']}>
                    <input name="uploadedImage" type="file" className={classes.file} id="file" onChange={uploadImage}/>
                    {/* <label htmlFor="file" >{fileLabelName}</label> */}
                    <label htmlFor="file" ref={fileLabelName} >Select Receipt</label>
                    {imageFile && <span className={`material-symbols-outlined ${classes['closeIcon']}`} onClick={closeFileHandler}>
                        close
                    </span>}
                </div>
                { !loading && imageFile && <div className={classes.previewImage}>
                    <img src={imageFileURL} alt="Uploaded receipt" />
                </div>}
                {!loading && extractedReceiptData.items.length > 0 &&
                 <div className={classes['input-field__container']}>
                    <div className={classes['store-information']}>
                        <div className={classes['input-field__block']}>
                            <label htmlFor="store">Store Number</label>
                            <input type="text" value={extractedReceiptData.store} name="store" onChange={(e)=> onChangeExtractedReceiptDataHandler(e, null)} className={classes['input-field']}/>
                        </div>
                        <div className={classes['input-field__block']}>
                            <label htmlFor="receiptBarcode">Receipt Barcode</label>
                            <input type="text" value={extractedReceiptData.receiptBarcode} name="receiptBarcode" onChange={(e)=> onChangeExtractedReceiptDataHandler(e, null)} className={classes['input-field']}/>
                        </div>
                        <div className={classes['input-field__block']}>
                            <label htmlFor="address">Store Address</label>
                            <input type="text" value={extractedReceiptData.address} name="address" onChange={(e) => onChangeExtractedReceiptDataHandler(e, null)} className={classes['input-field']}/>
                        </div>
                        <div className={classes['input-field__block']}>
                            <label htmlFor="date">Receipt Date</label>
                            <input type="text" value={extractedReceiptData.date} name="date" onChange={(e) => onChangeExtractedReceiptDataHandler(e, null)} className={classes['input-field']}/>
                        </div>
                        <div className={classes['input-field__block']}>
                            <label htmlFor="Subtotal">Subtotal</label>
                            <input type="number" value={extractedReceiptData.subTotal} name="subTotal" onChange={(e) => onChangeExtractedReceiptDataHandler(e,null)} className={classes['input-field']}/>
                        </div>
                        <div className={classes['input-field__block']}>
                            <label htmlFor="total">Total</label>
                            <input type="number" value={extractedReceiptData.total} name="total" onChange={(e) => onChangeExtractedReceiptDataHandler(e,null)} className={classes['input-field']}/>
                        </div>
                    </div>
                    <div className={classes['items-information']}>
                        <div className={classes['items_header']}>
                            <span>Items in Receipt</span>
                        </div>
                        { items.length !== 0 ? items.map(item => {
                            return (
                                <div key={item.id} className={classes.item}>
                                    <input type="text" name="name" value={item.name} className={`${classes['item-input-field']} ${classes['item-input-field_name']}`} placeholder="Name" onChange={(e) => onChangeExtractedReceiptDataHandler(e,item)}/>
                                    <input type="text" name="code" value={item.code} className={`${classes['item-input-field']} ${classes['item-input-field_code']}`} placeholder="Code" onChange={(e) => onChangeExtractedReceiptDataHandler(e,item)}/>
                                    <input type="number" name="price" value={item.price} className={`${classes['item-input-field']} ${classes['item-input-field_price']}`} placeholder="Price" onChange={(e) => onChangeExtractedReceiptDataHandler(e,item)}/>
                                </div>
                            );
                        }) : 
                        <div>
                            <h2>No Items to Display</h2>
                        </div>
                        }
                    </div>
                    
                </div>}
                {extractedReceiptData.receiptBarcode !== '' && extractedReceiptData.receiptBarcode.length === 23 && 
                    <div>
                        <form onSubmit={formSubmitHandler}>
                            <button type="submit" className={classes['submit-button']}>Upload Receipt</button>
                        </form>        
                    </div>
                }
                {
                    loading
                     && 
                    <div className={classes.spinner}>
                        <Spinner />
                    </div>
                
                }
            </div>
            {/** This content is added for testing imagefile data */}
            {/* <div>
                <img src={imageFile} alt="temp" />
            </div> */}
        </Fragment>
    );
}

export default ScanReceipt;