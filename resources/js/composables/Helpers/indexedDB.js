// indexedDB.js
export const openDB = (dbName, storeName) => {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(dbName);

        request.onerror = (event) => {
            console.error('An error occurred with IndexedDB:', event);
            reject('IndexedDB error');
        };

        request.onupgradeneeded = (event) => {
            const db = event.target.result;
            db.createObjectStore(storeName, { keyPath: 'id' });
        };

        request.onsuccess = (event) => {
            const db = event.target.result;
            resolve(db);
        };
    });
};

export const getStore = (db, storeName, mode = 'readonly') => {
    const transaction = db.transaction(storeName, mode);
    return transaction.objectStore(storeName);
};

export const getAllData = (db, storeName) => {
    return new Promise((resolve, reject) => {
        const store = getStore(db, storeName);
        const request = store.getAll();

        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject('Failed to retrieve data');
    });
};

export const saveData = (db, storeName, data) => {
    return new Promise((resolve, reject) => {
        const store = getStore(db, storeName, 'readwrite');

        // Inspect and transform the data
        const cleanedData = JSON.parse(JSON.stringify(data));

        console.log("Saving data:", cleanedData);

        const request = store.put(cleanedData);

        request.onsuccess = () => resolve();
        request.onerror = () => reject('Failed to save data');
    });
};