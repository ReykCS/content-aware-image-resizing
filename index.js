var express = require('express');
var fs = require('fs');

var app = express();

app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(express.static('public'));

app.get('/', function(req, res) {
    fs.readFile(__dirname + "/views/index.html", function(err, data)    {
        if (err) {
            console.log(err);
          res.writeHead(500);
          return res.end('Error loading page');
        }
        res.writeHead(200,{ 'Content-Type': "text/html" });
        // if ( ext == '.json' ) {
        //   res.end("data = [" + data + "]");
        //   return;
        // }
        res.end(data);
    });
    //res.end("Hello World");
});


app.listen(8080, function() {    
    console.log("Listening on port 8080");
})