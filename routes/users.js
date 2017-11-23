const express = require('express'),
    router = express.Router();

router.get('/', function(req, res, next) {
    res.render('user');
});

router.post('/add', (req, res) => {
    res.send(req.body);
});

router.get('/:id', (req, res) => {
    console.log(req.params.id);
    res.render('user');
});

module.exports = router;
