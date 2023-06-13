const parameters = {
    STORE: 'STORE',
    STORE_STARTS_WITH: 'ST#',
    SUBTOTAL: 'SUBTOTAL',
    TOTAL: 'TOTAL',
    GST: 'GST',
    HST: 'HST'
};

// getting indexex of parameters
function getIndexRelatedToParameters(receiptData) {
    let indexOfLocation = undefined;
    let indexOfStore = undefined;
    let indexOfSubtotal = undefined;
    let indexOfTotal = undefined;
    let indexOfFirstItem = undefined;
    let indexOfGst = undefined;
    let indexOfHst = undefined;

    if(receiptData !== null) {
        receiptData.forEach((line, index) => {
            if(line.words[0] === parameters.STORE){
                indexOfStore = index;
                indexOfLocation = index + 1;
            }
            if(line.words[0].startsWith(parameters.STORE_STARTS_WITH)){
                indexOfFirstItem = index + 1;
            }
            if(line.words[0] === parameters.SUBTOTAL){
                indexOfSubtotal = index;
            }
            if(line.words[0] === parameters.TOTAL) {
                indexOfTotal = index;
            }
            if(line.words[0] === parameters.GST) {
                indexOfGst = index;
            }
            if(line.words[0] === parameters.HST) {
                indexOfHst = index;
            }
        });
    }

    return { indexOfStore, indexOfLocation, indexOfFirstItem, indexOfSubtotal, indexOfTotal, indexOfGst, indexOfHst };
}

export function getUploadedReceiptData(receiptData) {

    const { indexOfStore, indexOfLocation, indexOfFirstItem, indexOfSubtotal, indexOfTotal, indexOfGst, indexOfHst } = getIndexRelatedToParameters(receiptData);

    console.log('Index values for the following propertiesa are:', {indexOfStore, indexOfLocation, indexOfFirstItem, indexOfSubtotal, indexOfTotal});
    let store = '';
    let address = '';
    const items = [];
    let total = 0.00;
    let subTotal = 0.00;
    let gstValue = 0.00;
    let hstValue = 0.00;

    if(receiptData !== null) {
        receiptData.forEach((line, index) => {
            // for finding the store value
            if(index === indexOfStore) {
                store = line.words[1];
            }
            // for finding Location and address value
            if(index > indexOfStore && index <= (indexOfLocation+2)) {
                address += line.words.join(' ') + ' ';
            }
            // for getting the receipt items
            if(index >= indexOfFirstItem && index < indexOfSubtotal) {
                // Declaring a item
                let item = {
                    id: Math.random() * 100,
                    name: '',
                    code: '',
                    price: 0.00,
                    complete: false
                }
                let i = 0;         // i is declared to get the complete name till the code of the item
                if(items.length > 0 && !items[items.length-1].complete) {
                    item = { ...items[items.length-1] };
                    if(line.words[line.words.length-1].length === 1) {
                        i = line.words.length - 2;
                    } else {
                        i = line.words.length - 1;
                    }
                }
                if( item.name === '') {
                    
                    let tempStr = '';         // item names are concatenated in the tempStr
                    while(line.words[i].length !== 12 && isNaN(line.words[i])){             // checks for words till code of the item
                        tempStr += line.words[i] + " ";
                        i++;
                    }
                    // if some numerics appear after name which is not code. So to avoid that by incrementing value of i and reach code for next step
                    while(line.words[i].length !== 12) {
                        i++;
                    }
                    item.name = tempStr;
                }
                if(item.code === '' && line.words[i].length === 12 && typeof parseFloat(line.words[i]) == 'number'){   // checks for code of the item
                    item.code = line.words[i];
                    i++;
                }
                if(item.price === 0.00 && line.words[i] !== undefined && line.words[i].substring(0,1) === '$'){     // checks for the word starting with $ sign
                    item.price = parseFloat(line.words[i].substring(1)); 
                    item.complete = true;      
                }
                if(items.length > 0 && items[items.length - 1].id === item.id) {
                    items[items.length-1] = { ...item };
                } else {
                    items.push(item);
                }
    
                // console.log('Value of items is ', {items});
            }
    
            // Get Subtotal value
            if(index === indexOfSubtotal) {
                subTotal = parseFloat(line.words[1].substring(1));
            }
    
            // Get GST value if present
            if(indexOfGst !== undefined && index === indexOfGst) {
                gstValue = parseFloat(line.words[line.words.length-1].substring(1));
            }
    
            // Get HST value if present
            if(indexOfHst !== undefined && index === indexOfHst) {
                hstValue = parseFloat(line.words[line.words.length-1].substring(1));
            }
    
            // Get total value of Receipt
            if(index === indexOfTotal) {
                total = parseFloat(line.words[1].substring(1));
            }
        });
    }

    return { store, address, items, total, subTotal, gstValue, hstValue };
}