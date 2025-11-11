import express from 'express'
import { Response, waterIntake, dailyLogs} from './models/models';
import { v4 as uuid } from 'uuid';

const app = express()
app.use(express.json())

const port = 3000;

var data : {[day: string] : dailyLogs} = {
}



app.post('/water-logs', (req, res) =>{
    const {amount, note} = req.body
    var apiResponse : Response<waterIntake>
    try {
        if (amount == null){
            throw new Error("Water amount is not provided!")
        }
        const id : string = uuid(); 
        const currentTimestamp = new Date()
        const month   = currentTimestamp.getUTCMonth() + 1;
        const day     = currentTimestamp.getUTCDate();
        const year    = currentTimestamp.getUTCFullYear();
        const currentDate = `${year}/${month}/${day}`

        const newWaterIntake : waterIntake = {
            amount : amount,
            timestamp : currentTimestamp,
            note : note 
        }

        if (!data[currentDate]){
            data[currentDate] = {
                dailyGoal : 2000,
                logs : {}
            }
        }
        data[currentDate].logs[id] = newWaterIntake;
        console.log(data); 
        apiResponse = {
            status : "success",
            message : "water intake succesfully logged!",
            id : id,
            data : newWaterIntake
        }
    } catch (error){
        apiResponse = {
            status : "error",
            message : "error message here",
            id : null,
            data : null
        }
        res.status(400)
    }
    res.send(apiResponse)
})

app.get('/water-logs/today')

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})