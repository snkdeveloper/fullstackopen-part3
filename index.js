const express = require('express')
var morgan = require('morgan')
const app = express()
const d = new Date()

let persons = [
    { 
      "id": "1",
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": "2",
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": "3",
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": "4",
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]
const cors = require('cors')

app.use(cors())
app.use(express.static('dist'))
morgan.token('data', function (req, res) { return JSON.stringify(req.body) })
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :data'))

app.get('/api/persons', (request,response)=>{
   
    response.json(persons)
   

})
app.use(express.json())



app.get('/info', (request,response)=>{
    response.send(`<p>Phonebook has info for ${persons.length} people</p><p>${d}</p>`)

})

app.get('/api/persons/:id', (request, response) => {
    const id = request.params.id
    const person = persons.find(person => person.id === id)
    response.json(person)
  })

  app.delete('/api/persons/:id', (request, response) => {
    const id = request.params.id
    persons = persons.filter(person => person.id !== id)
  
    response.status(204).end()
  })

  app.post('/api/persons', (request, response) => {
    const randId = Math.floor(Math.random()*10000)
    console.log(request.body)
    
    const person = request.body={
      "id":`${randId}`,
      "name":`${request.body.name}`,
      "number":`${request.body.number}`

  }
    if(!person.name || !person.number){
        return response.status(400).json({ 
            error: 'content missing' 
          })
    }
    if(persons.some(person2=>person2.name===person.name)){
        return response.status(400).json({ 
            error: 'name must be unique'  
          })
    }
    console.log(person)
    persons = persons.concat(person)

    response.json(person)
  })



  const PORT = process.env.PORT || 3001
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })
