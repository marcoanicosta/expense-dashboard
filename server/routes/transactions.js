const router = require('express').Router();


router.get('/', (req, res) => {
    res.send('Hello from transactions route');
});


module.exports = router;