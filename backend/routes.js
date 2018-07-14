const express = require('express');
const router = express.Router();
var multer = require('multer');
var upload = multer({ dest: 'uploads/'})
const mongoose = require('mongoose');

mongoose.connection.on('connected', function(){
  console.log("Successfully Connected");
})
mongoose.connect(process.env.MONGODB_URI);

const Tower = mongoose.model('Tower', {
  fileName: String,
  name: String,
  colors: Array
})

// YOUR API ROUTES HERE
var fileName = '';
var title='';

router.post('/imageUpload', upload.single("photo"), function (req, res, next) {

  title = req.body.text;
  fileName = req.file.filename;
  // new Tower({fileName: req.file.filename, colors: colorsArr, name: req.params.name}).save();
  res.redirect('/loadTowers.html?img='+req.file.filename);
})
router.post('/postData', (req, res) => {

  new Tower({fileName: fileName, colors: req.body.returnArray, name: title}).save();
  res.send('ok')
})
router.get('/data', (req, res) => {
    Tower.find({}, function(err, result){
      if(err){
        console.log("Error finding all towers");
      }else{
        res.json(result);
      }
  });
});


module.exports = router;
