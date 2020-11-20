const express = require('express');
const imageController = require('../Controller/imageController.js')
const router = express.Router()

router.post('/convert', imageController.convertWebp,  (req, res) => {
  // console.log("res.locals in api", res.locals)
  return res.status(200).json({invocation: res.locals.invocation});
})
module.exports = router;