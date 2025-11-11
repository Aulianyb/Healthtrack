import express from 'express'
import { Response, waterIntake } from './models/models';

const app = express()
app.use(express.json())

const port = 3000;

app.post('/water-logs', (req, res) =>{
    const {amount, note} = req.body
    var apiResponse : Response<waterIntake>
    try {
        if (amount == null){
            throw new Error("Water amount is not provided!")
        }
    } catch (error){
        apiResponse = {
            status : "error",
            message : "error message here",
            data : null
        }
        res.status(400)
    }
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})