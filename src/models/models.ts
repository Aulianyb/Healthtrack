export type Response<T> = {
    status: "success" | "error";
    message: string;
    id : string | null;
    data: T | null;
}

export type waterIntake = {
    amount : number,
    timestamp : Date,
    note : string | null
}

export type logs = {
    [id : string] : waterIntake
}

export type dailyLogs = {
    dailyGoal : number,
    logs : logs
}