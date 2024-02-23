import fs from 'fs';
import fetchBrand from './brand.js';
import fetchName from './name.js';
import fetchPrice from './price.js';
import fetchProductNumber from './productNumber.js';
import fetchImage from './image.js';
import { readCache, writeCache } from './util.js';
import { logError } from '../logger.js';

async function getProductDetails(sku) {
    const cache = readCache();
    if (cache[sku]) {
        console.log('Returning cached details for SKU:', sku);
        return cache[sku];
    }

    const productDetails = { store: "Fortinos", brand: null, name: null, price: null, product_number: null, image_url: null };

    try {
        const url = `https://grocerytracker.ca/search/0067/${sku}`;

        productDetails.brand = await fetchBrand(url);
        productDetails.name = await fetchName(url);
        productDetails.price = await fetchPrice(url);
        productDetails.product_number = await fetchProductNumber(url);
        productDetails.image_url = await fetchImage(url);

        cache[sku] = productDetails;
        writeCache(cache);

    } catch (error) {
        logError(`Error fetching product details for SKU ${sku}: ${error}`);
    }

    return productDetails;
}

if (process.argv[1] && import.meta.url === `file://${process.argv[1]}`) {
    const inputItem = "06038318640"; // Example SKU

    getProductDetails(inputItem)
        .then(productDetails => console.log(productDetails))
        .catch(error => logError(error));
}

export default getProductDetails;