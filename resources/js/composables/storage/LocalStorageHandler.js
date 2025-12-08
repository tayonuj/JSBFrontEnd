import notificationHandling from "../application/notificationHandling";

/**
 * Utility function to check if a specific key exists in local storage.
 * @param {string} key - The key to check in the local storage.
 * @returns {boolean} - Returns true if the key exists, false otherwise.
 */
const keyExists = (key) => {
    return localStorage.getItem(key) !== null;
};

/**
 * Finds and returns the parsed data from local storage for the given key.
 * @param {string} key - The local storage key to find data for.
 * @returns {any} - The parsed data from local storage.
 */
const findLocalStorage = (key) => {
    try {
        const storage = localStorage.getItem(key);
        return JSON.parse(storage);
    } catch (error) {
        notificationHandling('error',`Error parsing data for key ${key}:`)
        console.error(`Error parsing data for key ${key}:`, error);
        return null;
    }
};

/**
 * Saves or updates data in local storage under the given key.
 * @param {string} key - The key under which to store the data.
 * @param {any} dataset - The data to be stored.
 */
const saveData = (key, dataset) => {
    try {
        localStorage.setItem(key, JSON.stringify(dataset));
    } catch (error) {
        notificationHandling('error',`Error saving data for key ${key}:`)
        console.error(`Error saving data for key ${key}:`, error);
    }
};

/**
 * Appends data to an existing key or creates a new key with the data if it does not exist.
 * @param {string} storageKey - The key under which the data is stored.
 * @param {string} dataKey - The property name under which to store the dataset.
 * @param {any} dataset - The data to be appended.
 */
const appendData = (storageKey, dataKey, dataset) => {
    try {
        let storage = findLocalStorage(storageKey) || {};
        storage[dataKey] = dataset;
        console.log("new dataset "+storageKey,storage)
        localStorage.setItem(storageKey, JSON.stringify(storage));
    } catch (error) {
        notificationHandling('error',`Error appending data for key ${storageKey}:`)
        console.error(`Error appending data for key ${storageKey}:`, error);
    }
};


/**
 * Searches for and returns a specific item or value from parsed data in local storage.
 * If the data is an object, and a string attribute is provided, returns the value of that attribute.
 * If the data is an array, and a predicate function is provided, searches using the predicate.
 *
 * @param {string} key - The key for the data in local storage.
 * @param {string|Function} searchCriteria - A string representing an attribute name or
 *                                           a predicate function for searching.
 * @returns {any|null} - The found item or value, or null if not found or on error.
 */
const findItemInData = (key, searchCriteria) => {
    try {
        const data = findLocalStorage(key);
        console.log("Available localstorage data",data)
        // Handle object data with string attribute searchCriteria
        if (typeof data === 'object' && !Array.isArray(data) && typeof searchCriteria === 'string') {
            return data.hasOwnProperty(searchCriteria) ? data[searchCriteria] : null;
        }

        // Handle array data with predicate function searchCriteria
        if (Array.isArray(data) && typeof searchCriteria === 'function') {
            return data.find(searchCriteria) || null;
        }

        return null;
    } catch (error) {
        console.error(`Error accessing or parsing data for key ${key}:`, error);
        return null;
    }
};



/**
 * Removes data from local storage. If the key is 'All', clears all data from local storage.
 * @param {string} key - The key to remove, or 'All' to clear all local storage.
 */
const removeData = (key) => {
    try {
        if (key === 'All') {
            localStorage.clear();
        } else {
            localStorage.removeItem(key);
        }
    } catch (error) {
        console.error(`Error removing data for key ${key}:`, error);
    }
};

export { keyExists, removeData, saveData, appendData, findLocalStorage,findItemInData };
