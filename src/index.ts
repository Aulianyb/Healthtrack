import express from 'express'
import { Response, waterIntake, dailyLogs, logs} from './models/models';
import { v4 as uuid } from 'uuid';

const app = express()
app.use(express.json())

const port = 3000;

var data : {[day: string] : dailyLogs} = {
}

// POST /water-logs
app.post('/water-logs', (req, res) =>{
    const {amount, note} = req.body
    var apiResponse : Response<waterIntake>
    try {
        if (!amount){
            throw new Error("Water amount is not provided!")
        }
        const id : string = uuid(); 
        const currentTimestamp = new Date()
        const month   = currentTimestamp.getUTCMonth() + 1;
        const day     = currentTimestamp.getUTCDate();
        const year    = currentTimestamp.getUTCFullYear();
        const currentDate = `${day}/${month}/${year}`

        const newWaterIntake : waterIntake = {
            amount : amount,
            timestamp : currentTimestamp,
            note : note 
        }

        if (!data[currentDate]){
            data[currentDate] = {
                dailyGoal : 2000,
                totalAmount : 0,
                progressPercentage : 0,
                logs : {}
            }
        }
        data[currentDate].logs[id] = newWaterIntake;
        data[currentDate].totalAmount += amount;
        data[currentDate].progressPercentage = (data[currentDate].totalAmount / data[currentDate].dailyGoal) * 100
        console.log(data); 
        apiResponse = {
            status : "success",
            message : "water intake succesfully logged!",
            id : id,
            data : newWaterIntake
        }
        res.status(200)
    } catch (error){
        var errorMessage : string; 
        if (error instanceof Error){
            errorMessage = error.message
        } else {
            errorMessage = "An unknown error has occured"
        }
        apiResponse = {
            status : "error",
            message : errorMessage,
            id : null,
            data : null
        }
        res.status(400)
    }
    res.send(apiResponse)
})

// GET /water-logs/today
app.get('/water-logs/today', async(req, res) => {
    var apiResponse : Response<dailyLogs>
    try {
        const currentTimestamp = new Date()
        const month   = currentTimestamp.getUTCMonth() + 1;
        const day     = currentTimestamp.getUTCDate();
        const year    = currentTimestamp.getUTCFullYear();
        const currentDate = `${day}/${month}/${year}`
        const summary : dailyLogs = data[currentDate]
        if (!summary){
            throw new Error("No water intake log today")
        }
        apiResponse = {
            status : "success",
            message : "succesfully returned summary",
            id : currentDate,
            data : summary
        }
        res.status(200)

    } catch (error){
        var errorMessage : string; 
        if (error instanceof Error){
            errorMessage = error.message
        } else {
            errorMessage = "An unknown error has occured"
        }
        apiResponse = {
            status : "error",
            message : errorMessage,
            id : null,
            data : null
        }
        res.status(400)
    }
    res.send(apiResponse)
})

// GET /water-logs?date=YYYY-MM-DD
app.get('/water-logs', async(req, res) => {
    var apiResponse : Response<logs>
    try {
        const { date } = req.query; 
        const selectedDate = date as string
        const year = selectedDate.slice(0, 4);
        var month : string; 
        if (selectedDate[5] == "0") {
            month = selectedDate.slice(6, 7);
        } else{
            month = selectedDate.slice(5, 7);
        }
        var day : string; 
        if (selectedDate[8] == "0") {
            day = selectedDate.slice(9, 10);
        } else{
            day = selectedDate.slice(8, 10);
        }

        const currentDate = `${day}/${month}/${year}`
        if (!data[currentDate]){
            throw new Error("No water intake on " + currentDate)
        }
        const selectedLogs : logs = data[currentDate].logs
        apiResponse = {
            status : "success",
            message : "succesfully returned summary",
            id : currentDate,
            data : selectedLogs
        }
        res.status(200)
    } catch (error){
        var errorMessage : string; 
        if (error instanceof Error){
            errorMessage = error.message
        } else {
            errorMessage = "An unknown error has occured"
        }
        apiResponse = {
            status : "error",
            message : errorMessage,
            id : null,
            data : null
        }
        res.status(400)
    }
    res.send(apiResponse)
})

// POST /daily-goal
app.post('/daily-goal', (req, res) =>{
    const {newDailyGoal} = req.body
    var apiResponse : Response<dailyLogs>
    try {
        if (!newDailyGoal){
            throw new Error("New daily goal is not provided!")
        }

        const currentTimestamp = new Date()
        const month   = currentTimestamp.getUTCMonth() + 1;
        const day     = currentTimestamp.getUTCDate();
        const year    = currentTimestamp.getUTCFullYear();
        const currentDate = `${day}/${month}/${year}`

        if (!data[currentDate]){
            data[currentDate] = {
                dailyGoal : 2000,
                totalAmount : 0,
                progressPercentage : 0,
                logs : {}
            }
        }
       data[currentDate].dailyGoal = newDailyGoal
        apiResponse = {
            status : "success",
            message : "changed daily goal",
            id : currentDate,
            data : data[currentDate]
        }
        res.status(200)
    } catch (error){
        var errorMessage : string; 
        if (error instanceof Error){
            errorMessage = error.message
        } else {
            errorMessage = "An unknown error has occured"
        }
        apiResponse = {
            status : "error",
            message : errorMessage,
            id : null,
            data : null
        }
        res.status(400)
    }
    res.send(apiResponse)
})

// GET /daily-goal
app.get('/daily-goal', (req, res) =>{
    var apiResponse : Response<number>
    try {
        const currentTimestamp = new Date()
        const month   = currentTimestamp.getUTCMonth() + 1;
        const day     = currentTimestamp.getUTCDate();
        const year    = currentTimestamp.getUTCFullYear();
        const currentDate = `${day}/${month}/${year}`

        if (!data[currentDate]){
            data[currentDate] = {
                dailyGoal : 2000,
                totalAmount : 0,
                progressPercentage : 0,
                logs : {}
            }
        }
        const dailyGoal = data[currentDate].dailyGoal
        apiResponse = {
            status : "success",
            message : "returned daily goal",
            id : currentDate,
            data : dailyGoal
        }
        res.status(200)
    } catch (error){
        var errorMessage : string; 
        if (error instanceof Error){
            errorMessage = error.message
        } else {
            errorMessage = "An unknown error has occured"
        }
        apiResponse = {
            status : "error",
            message : errorMessage,
            id : null,
            data : null
        }
        res.status(400)
    }
    res.send(apiResponse)
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})