var express = require('express');
var router = express.Router();
router.get('/api/ajax', function(req, res, next) {
    res.send({ code: 0, message: 'success' })
});
router.get('/api/jsonp', function(req, res, next) {
    var callback = req.query.callback;
    if (callback) {
        var content = callback + "({'message':'jsonp is success'})";
        res.send(content);
    } else {
        var error = {
            code: 1,
            message: 'error'
        }
        res.send(error);
    }
});
module.exports = router;