require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const MOVIEDEX = require('./moviedata/moviedex.json')
const cors = require('cors')
const helmet = require('helmet')

const morganSetting = process.env.NODE_ENV === 'production' ? 'tiny' : 'common'

const app = express()

app.use(morgan(morganSetting))
app.use(helmet())
app.use(cors())

app.use(function validateBearerToken(req, res, next){
    debugger
    const apiToken = process.env.API_TOKEN
    const authToken = req.get('Authorization')
    if(!authToken || authToken.split(' ')[1]!== apiToken) {
        return res.status(401).json({error: 'unAuthorized Request'})
    }
    //move to next middleware
    next()
})

app.use((error, req, res, next) => {
    let response 
    if(process.env.NODE_ENV === 'production'){
        response = { error: {message: 'server error' } }
    }else {
        response = { error }
    }
    res.status(500).json(response)
})

app.get('/movies', function handleGetMovies(req, res) {
    let response = MOVIEDEX

    if(req.query.genre) {
        response = response.filter(movie => movie.genre.toLowerCase().includes(req.query.genre.toLowerCase()))
    }

    if(req.query.country) {
        response = response.filter(movie => movie.country.toLowerCase().includes(req.query.country.toLowerCase()))
    }

    if(req.query.avg_vote) {
        response = response.filter(movie => Number(movie.avg_vote) >= Number(req.query.avg_vote))
    }

    return res.json(response)

})

PORT = process.env.PORT || 8000

app.listen(PORT, () => {
    console.log('Hello from express !')
})