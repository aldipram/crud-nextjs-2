import mongoose from "mongoose";

const MONGODB_URL = process.env.MONGODB_URL;

const connectToDB = async () => {
    const connectionState = mongoose.connection.readyState;

    if (connectionState === 1) {
        console.log("Already connected");
        return;
    }

    if (connectionState === 2) {
        console.log("Connecting...");
        return;
    }

    try {
        mongoose.connect(MONGODB_URL!, {
            dbName: "restapinext14-2",
            bufferCommands: true
        });
        console.log("Connected");
    } catch (error) {
        console.log("Connecting Error", error);
        throw new Error("Error connecting to database");
    }
}

export default connectToDB;