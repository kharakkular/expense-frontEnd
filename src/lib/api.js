const url = 'http://10.0.0.227:8081/api/expense';

export async function getAllReceipts() {
    console.log('From api.js');
    const response = await fetch(url);
    const data = await response.json();
    console.log('Response from API.json is ', {response, data});

    if(!response.ok) {
        throw new Error(data.message || "could not fetch data");
    }

    return data;
}