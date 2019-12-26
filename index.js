const express = require('express')
const { mongoose } = require('./config/database')

const { revappliancesRouter } = require('./app/controllers/RevAppController')

const app = express() 
const port = 3000 

app.use(express.json())
app.use('/revappliances', revappliancesRouter)

app.listen(port, function(){
    console.log('listening on port', port)
})