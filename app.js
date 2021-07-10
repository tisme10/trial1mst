let express = require( 'express' );
let app = express();
let server = require( 'http' ).Server( app );
let io = require( 'socket.io' )( server );
let stream = require( 'ws/stream' );
let path = require( 'path' );
let favicon = require( 'serve-favicon' );
const router = express.Router();


// var about = require('/')
// router.get('/about', function(req, res){
//     res.sendFile(path.join(__dirname, '/public', 'index.html'));
//   });

// var previewvideo = document.querySelector("#preview-video");
// if(navigator.mediaDevices && navigator.mediaDevices.getUserMedia){
//     navigator.mediaDevices.getUserMedia({video: true, audio: {echoCancellation: true}}).then((stream) => {
//     previewvideo.srcObject = stream;
//     previewvideo.play();
//     });
// }

app.use( favicon( path.join( __dirname, 'favicon.ico' ) ) );
app.use( '/assets', express.static( path.join( __dirname, 'assets' ) ) );

app.get( '/', ( req, res ) => {
    res.sendFile( __dirname + '/index.html' );
} );

app.get( '/about', ( req, res ) => {
  res.sendFile( __dirname + '/about.html' );
} );

app.use('/', router);

io.of( '/stream' ).on( 'connection', stream );


server.listen(process.env.PORT || 3000);
//server.listen( 3000 );
