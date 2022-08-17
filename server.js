const express = require('express');
const connectDB = require('./config/db');
const bodyParser = require('body-parser');

const cors = require("cors");


const app = express();



// Connect Database
connectDB();

const corsOptions ={
  origin:'*', 
  credentials:true,            //access-control-allow-credentials:true
  optionSuccessStatus:200,
}



// Init Middleware
app.use(cors(corsOptions))
app.use(express.json());
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true }));
// Define Routes


app.use('/api/users', require('./routes/api/users'));
app.use('/api/spaces', require('./routes/api/spaces'));




// storage engine for multer

app.get('/', (req,res) => {

  let info = {
    title: "Sorabackend",
    Nischal_Poudel: "3ndless_____",
  };

  res.send(info)
})

app.get('/api/category', (req,res) => {

  let info = [{
    id: 1,
    category: "Gaming",
    color: "success",
    icon: "emojione-v1:video-game",
  },
  {
    id: 2,
    category: "Art",
    color: "info",
    icon: "emojione:artist-palette",
  },
  {
    id: 3,
    category: "Creator",
    color: "error",
    icon: "emojione:blond-haired-person-medium-light-skin-tone",
  },
  {
    id: 4,
    category: "Streamer",
    color: "warning",
    icon: "emojione:video-camera",
  },
  {
    id: 6,
    category: "Music",
    color: "info",
    icon: "emojione:musical-score",
  },
  {
    id: 7,
    category: "Entertainment",
    color: "success",
    icon: "emojione:television",
  },
  {
    id: 8,
    category: "Random",
    color: "warning",
    icon: "emojione:game-die",
  }

];

  res.send(info)
})



const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
