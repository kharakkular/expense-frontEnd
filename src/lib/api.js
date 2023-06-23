// const url = 'http://10.0.0.227:8080/api/expense';
const localURL = 'http://localhost:8080/api';

export async function getAllReceipts() {
    console.log('From api.js');
    const response = await fetch(`${localURL}/expense`);
    const data = await response.json();
    console.log('Response from API.json is ', {response, data});

    if(!response.ok) {
        throw new Error(data.message || "could not fetch data");
    }

    return data;
}

export async function sendReceiptData(data) {

    const response = await fetch(`${localURL}/expense`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    });
    return response.json();
}