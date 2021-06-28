const express = require('express');
const router = express.Router();
const request = require('request');
const auth = require('../middlewares/auth.js');


/* GET btc/uah rate. */
router.get('/',auth.authenticate, function (req, res, next) {
    let url = 'https://api.cryptonator.com/api/full/btc-uah';

    request.get({
        url: url,
        json: true,
        headers: {'User-Agent': 'request'}
    }, (apiErr, apiRes, apiData) => {
        if (apiErr) {
            res.status(apiErr.statusCode || 500).json({message: apiErr.message});
        } else if (apiRes.statusCode !== 200) {
            res.status(apiRes.statusCode).json({message: "Ooops, something went wrong!"});
        } else {
            res.status(200).json({ticker: {base: "BTC", target: "UAH" ,price:apiData.ticker.price}});
        }
    });
});

module.exports = router;
