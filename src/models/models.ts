export type Response<T> = {
    status: "success" | "error";
    message: string;
    data: T | null;
}

export type waterIntake = {
    amount : number,
    timestamp : Date,
    note : string | null
}