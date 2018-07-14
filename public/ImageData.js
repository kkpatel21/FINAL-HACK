if(window.location.search) {
  var imgId = window.location.search.substring(5)
  console.log('imgId', imgId)
  document.getElementById('upload').style.display='none'
  var arr;
  var img = new Image()
  img.crossOrigin="anonymous";
  img.src="http://localhost:3000/" + imgId
  img.onload =  function() {

    img.setAttribute('crossOrigin', '');
    var canvas = document.getElementById('myCanvas');
    var ctx = canvas.getContext('2d');
    //var img = document.getElementById("scream");
    ctx.drawImage(img, 0, 0, 150, 150);
    // ctx.fill();
    //console.log("hello")
    arr = (ctx.getImageData(0, 0, 150, 150));

    

    var width = arr.width;


    var pixelArray = []

    for(var i = 0; i<arr.data.length; i=i+4){
      pixelArray.push([arr.data[i], arr.data[i+1], arr.data[i+2], arr.data[i+3]]);
    }

    //console.log(pixelArray);

    makeBlockArray(pixelArray,width);
    //console.log(width)

  }

  //we define white as values greater than 230 in all three areas
    function makeBlockArray(pixelArray, width){

      var arrOfLayers = [];

      for(var i = 0; i<pixelArray.length; i=i+width){

        var oneLayer = [];

        for (var x = 0; x < width; x++) {
          oneLayer.push(pixelArray[i+x]);
        }

        arrOfLayers.push(oneLayer);

      }

      maxWidth(arrOfLayers)
    }

  function maxWidth(arrOfLayers){

  var maxWidth=0;
  var currentWidth = 0;
  var column=0;
  var first = true;

  //iterate over layers
    for(var i = 0; i < arrOfLayers.length; i++){

  //iterate over pixels
      for(var j = 0; j < arrOfLayers[i].length; j++){

        //over all three colors
        if(arrOfLayers[i][j][0] < 230 && arrOfLayers[i][j][1] <230 && arrOfLayers[i][j][2] < 230){
          currentWidth ++

          if(first){
            first = false;
            column=j ;

          }
        }
      }

      if(currentWidth >maxWidth){
        maxWidth=currentWidth;
      }

      currentWidth = 0;
    }

    column= column + maxWidth/2


    setDimensions(arrOfLayers, maxWidth, column);
  }

    function setDimensions(arrOfLayers, widthOfTower, column){




      var ratio = 32/8;
      var heightOfBlock = Math.floor(widthOfTower/ratio);


      var slice = [];

      for(var i = 0; i<arrOfLayers[0].length; i++){
        slice.push(arrOfLayers[i][column])
      }

    var blockArray = [];
    var count = 0;

      for(var i = 0; i < slice.length; i = i+ heightOfBlock){


        if(slice[i][0] < 230 || slice[i][1] <230 || slice[i][2] < 230){
          count++;
          blockArray.push(slice[i]);
        }
      }

    var hexArray = [];
    for(var i =0; i < blockArray.length ; i++){
      var hex = rgbToHex(blockArray[i][0], blockArray[i][1], blockArray[i][2]);

      hexArray.push(hex);
    }

    var returnArray = hexArray.reverse();
    fetch('/api/postData', {
      method: "POST",
      headers:{
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        returnArray:returnArray
      })
    })



    return hexArray;
    }

      const rgbToHex = (r, g, b) => '#' + [r, g, b].map(x => {
        const hex = x.toString(16)

        return hex.length === 1 ? '0' + hex : hex
      }).join('')

} else {
  document.getElementById('canvas').style.display='none'
}
