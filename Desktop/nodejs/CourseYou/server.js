import express from 'express'
import cors from 'cors'
import bodyParser  from 'body-parser'
import studentRoute  from './router/student.js'


const app = express();
app.use(express.json());
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))

app.use(cors())


const PORT = process.env.PORT  || 81

app.use("/api/student" , studentRoute)


app.get("/", (req,res) => {
    res.json("hello from api ")
})


app.listen(PORT , ()=>{
    console.log(`server on running port ${PORT}`)

})