import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const mongoose_uri = process.env.DB_URI || "PORT ERROR";

const mongoConnection = async () => {
    try{
            await mongoose.connect(mongoose_uri, {
                useNewUrlParser: true,
                useUnifiedTopology: true,
            });
            console.log("DB Connected");
            
    }catch(err){
        console.error("Connection failed while connecting db", err);
        
    }
}

export default mongoConnection;