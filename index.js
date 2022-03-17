const express = require('express');

//Import a body parser module to be able to access the request body as json
const bodyParser = require('body-parser');

const cors = require('cors');

const app = express();
const apiPath = '/api/';
const version = 'v1';
const genPath = '/genres'
//Port environment variable already set up to run on Heroku
let port = process.env.PORT || 3000;

//Tell express to use the body parser module
app.use(bodyParser.json());

//Tell express to use cors -- enables CORS for this backend
app.use(cors());  

var nextId = 4;
//Set Cors-related headers to prevent blocking of local requests
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });

//The following is an example of an array of two tunes.  Compared to assignment 2, I have shortened the content to make it readable
var tunes = [
    { id: '0', name: "Für Elise", genreId: '1', content: [{note: "E5", duration: "8n", timing: 0},{ note: "D#5", duration: "8n", timing: 0.25},{ note: "E5", duration: "8n", timing: 0.5},{ note: "D#5", duration: "8n", timing: 0.75},
    { note: "E5", duration: "8n", timing: 1}, { note: "B4", duration: "8n", timing: 1.25}, { note: "D5", duration: "8n", timing: 1.5}, { note: "C5", duration: "8n", timing: 1.75},
    { note: "A4", duration: "4n", timing: 2}] },

    { id: '3', name: "Seven Nation Army", genreId: '0', 
    content: [{note: "E5", duration: "4n", timing: 0}, {note: "E5", duration: "8n", timing: 0.5}, {note: "G5", duration: "4n", timing: 0.75}, {note: "E5", duration: "8n", timing: 1.25}, {note: "E5", duration: "8n", timing: 1.75}, {note: "G5", duration: "4n", timing: 1.75}, {note: "F#5", duration: "4n", timing: 2.25}] }
];

let genres = [
    { id: '0', genreName: "Rock"},
    { id: '1', genreName: "Classic"}
];

var nextId = 4;
var nextgenId = 2;
//Your endpoints go here
app.get(apiPath + version + genPath + '/:genreId/tunes/:tunesId', (req, res) =>{
    console.log(tunes.length, "length")
    console.log(req.params.tunesId)
    console.log(tunes)
    for (let i = 0; i< tunes.length;i++){
        console.log(tunes[i].id, "ID")
        if (tunes[i].id === req.params.tunesId) {
            console.log('if')
            res.status(200).json(tunes[i]); 
            return;
        }
    }
    res.status(404).json({ 'message': "Tune with id " + req.params.tunesId + " does not exist." })
});

//tjekka hvort það sé í filter og þá gera þetta:
//lúppa í gegnum genres og tjekka hvort genres name og skila þá ID 
//lúppa svo í gegnum tunes og tjekka hvort þetta id sé genresId
app.get(apiPath + version +'/tunes', (req, res) => {
    console.log(req.query)
    let tunesArray = []
    if (Object.keys(req.query).length !== 0){
        console.log('blablabla')
        var genre_filter = req.query.filter
        for (let i = 0; i < genres.length; i++){
            //console.log(genres[i].genreName)
            if (genre_filter == genres[i].genreName){
                var genid = genres[i].id
                //console.log(genid)       
            }
        }
        for (let i = 0; i < tunes.length; i++){
            if (genid == tunes[i].genreId){
                // console.log(tunes[i].genreId)
                tunesArray.push({id: tunes[i].id, name: tunes[i].name, genreId: tunes[i].genreId})
            }
        }
    }else{
        console.log('were in')
        for (let i = 0; i < tunes.length; i++){
            tunesArray.push({id: tunes[i].id, name: tunes[i].name, genreId: tunes[i].genreId})
    }}
    res.status(200).json(tunesArray);
})

app.post(apiPath + version + genPath +'/:genreId' + '/tunes', (req, res) =>{
    for (let i = 0; i < genres.length; i++) {
        if (req.body.genreId === genres.id) {
            let temp = nextId.toString();
            let newTune = {
                id: temp, 
                name: req.body.name,
                genreId: req.params.genreId,
                content: req.body.content
            };
            tunes.push(newTune);
            nextId++; 
            //return res.status(201).json(newTune);
            return res.status(201).json(tunes);
        }
    } 
    return res.status(404).json({ 'message': 'Genre ID not found' });
});

app.patch(apiPath + version + genPath + '/:genreId/tunes/:tuneId', (req, res) => {
    for (let i = 0; i < tunes.length; i++) {
        if (tunes[i].id == req.params.tuneId) {
            if (req.body.name !== undefined) {
                tunes[i].name = req.body.name
            }
            console.log("test ", req.body.genre)
            if (req.body.genreId !== undefined) {
                tunes[i].genreId = req.body.genreId
            }
            if (req.body.content !== undefined) {
                tunes[i].content = req.body.content
            }
            let returnTune = {id: tunes[i].id, name: tunes[i].name, genreId: tunes[i].genreId, content: tunes[i].content};
            return res.status(200).json(returnTune);
        }
    }
    res.status(404).json({ 'message': "Tune not found" });
});

app.get(apiPath + version +'/genres', (req, res) => {
    let tunesArray = []
    for (let i = 0; i < genres.length; i++){
        tunesArray.push({id: genres[i].id, genreName: genres[i].genreName})
    }
    res.status(200).json(tunesArray);
})

app.post(apiPath + version + '/genres', (req, res) =>{
    console.log(req.body.genreName)
    for (let i = 0; i < genres.length; i++) {
        console.log(genres[i].genreName, req.body.genreName)
        if (genres[i].genreName === req.body.genreName) {
            return res.status(400).json({ 'message': 'Cannot have the same name' })
        }
    }
    let newGenre = {
        id: nextgenId, 
        genreName: req.body.genreName,
    };
    genres.push(newGenre);
    nextgenId++;
    console.log('pushed')
    return res.status(201).json(newGenre)
});

function tuneNotInGen(tunes, genid) {
    for (var i = 0; i < tunes.length; i++) {
        if (tunes[i].genreId === genid) {
            return false
        }
    }
    return true
}

app.delete(apiPath + version + genPath +'/:genreId', (req, res) => {
    for (let i = 0; i < genres.length; i++) {
        if (genres[i].id == req.params.genreId){
            if (tuneNotInGen(tunes, req.params.genreId)) {
           	    console.log('tuneNotInGen')
                let oldgen = genres[i];
            	genres.splice(i, 1)
            	return res.status(200).json(oldgen)
            }
            else {
                return res.status(405).json({ 'message': 'Tune with that genre' })
            }
        }
    }
    return res.status(404).json({ 'message': 'genre not found ' })
});


//Start the server
app.listen(port, () => {
    console.log('Tune app listening on port + ' + port);
});

app.use('*', (req, res) => {
    res.status(405).send('Operation not supported.');
});
//note, timing, duration attributes [id:auto]
//request fails if genere_id does not exist, array != null
//if request is successful, return a new resource (  all attributes, [id] , array)

