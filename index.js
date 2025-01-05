const env = require('dotenv').config()
const Person = require('./models/person')



// const Person = mongoose.model('Person', personSchema)
const express = require('express')
var morgan = require('morgan')
const app = express()
const d = new Date()

// let persons = [
//     { 
//       "id": "1",
//       "name": "Arto Hellas", 
//       "number": "040-123456"
//     },
//     { 
//       "id": "2",
//       "name": "Ada Lovelace", 
//       "number": "39-44-5323523"
//     },
//     { 
//       "id": "3",
//       "name": "Dan Abramov", 
//       "number": "12-43-234345"
//     },
//     { 
//       "id": "4",
//       "name": "Mary Poppendieck", 
//       "number": "39-23-6423122"
//     }
// ]
const cors = require('cors')
const person = require('./models/person')

app.use(cors())
app.use(express.static('dist'))
morgan.token('data', function (req, res) { return JSON.stringify(req.body) })
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :data'))

app.get('/api/persons', (request,response)=>{
   
    Person.find({}).then(persons => {
      response.json(persons)
            
           
          })
   

})
app.use(express.json())



app.get('/info', (request,response)=>{
    Person.countDocuments({}).then((x)=>{
      response.send(`<p>Phonebook has info for ${x} people</p><p>${d}</p>`)
    })
    

})

app.get('/api/persons/:id', (request, response,next) => {
  Person.findById(request.params.id).then(person => {
    if (person) {
      response.json(person)
    } else {
      response.status(404).end()
    }
  })
  .catch(error => next(error))
})
app.post('/api/persons', (request, response,next) => {
  const person1 = request.body


  const person = new Person({
    name: person1.name,
    number:person1.number,
  })

  person.save().then(savedPerson => {
    response.json(savedPerson)
  })
  .catch(error => next(error))
})

app.put('/api/persons/:id', (request, response, next) => {
  const {name,number} = request.body

  
  Person.findByIdAndUpdate(request.params.id,{name,number}, { new: true ,runValidators: true, context: 'query'})
    .then(updatedPerson => {
      if(updatedPerson==null){
        throw new Error("Null");
        
      }else{
        console.log(updatedPerson)
        response.json(updatedPerson)

      }

    
    })
    .catch(error => {console.log("hi")
      next(error)})
})

const errorHandler = (error, request, response, next) => {
 

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  }else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }else if(error.name==="Error"){
    return response.status(400).send({ error: 'updation on a deleted node' })
  }

  next(error)
}

// this has to be the last loaded middleware, also all the routes should be registered before this!
app.use(errorHandler)

  app.delete('/api/persons/:id', (request, response) => {
    Person.findByIdAndDelete(request.params.id)
    .then(result => {
      response.status(204).end()
    })
    .catch(error => next(error))
  })




  const PORT = process.env.PORT
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })
