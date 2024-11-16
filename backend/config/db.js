import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();


const mongoose_uri = process.env.DB_URI || "PORT ERROR";

const mongoConnection = async () => {
    try{
            await mongoose.connect(mongoose_uri, {
                // This tls & tlsInSecure both are only development purpose, to bypass the
                // mongoDB network security, once the development process would be done, check the
                // mongoose version and node.js version and provide the below folowings
                // useNewUrlParser: true,
                //  useUnifiedTopology: true
                tls: true,
                tlsInSecure: true
            });
            console.log("DB Connected");
            
    }catch(err){
        console.error("Connection failed while connecting db", err);
        
    }
}

export default mongoConnection;