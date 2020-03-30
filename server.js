require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const helmet = require('helmet')
const cors = require('cors')
const MOVIE = require('./movie-data.json')
const app = express()

const morganSetting = process.env.NODE_ENV === "production" ? "tiny" : "dev";
app.use(morgan(morganSetting))
app.use(validateBearerToken);
app.use(cors())
app.use(helmet())
app.get('/movie', handleGetMovie);


function validateBearerToken(req, res, next) {
    const apiToken = process.env.API_TOKEN
    const authToken = req.get('Authorization')
  
    if (!authToken || authToken.split(' ')[1] !== apiToken) {
      return res.status(401).json({ error: 'Unauthorized request' })
    }
    // move to the next middleware
    next()
  }

function handleGetMovie(req, res) {
        let response = MOVIE;
//When searching by genre, users are searching for whether the Movie's genre includes a specified string. 
//The search should be case insensitive.
        if (req.query.genre) {
            response = response.filter(movie =>
              // case insensitive searching
              movie.genre.toLowerCase().includes(req.query.genre.toLowerCase())
            )
          }
        
  
          if (req.query.country) {
            response = response.filter(movie =>
                movie.country.toLowerCase().includes(req.query.country.toLowerCase())
            )
          }
          if (req.query.avg_vote) {
            response = response.filter(movie =>
              Number(movie.avg_vote) >= Number(req.query.avg_vote)
            )
          }

          res.json(response)
        }

app.use((error,req,res,next) => {
  let response
    if(process.env.NODE_ENV === 'production'){
        response = { error: { message: 'server error' }}
      } else {
        reponse = {error}
          }
          res.status(500).json(response); 
    })

const PORT = process.env.PORT || 8000
          
app.listen(PORT, () => {
    console.log(`Server listening at http://localhost:${PORT}`)
})