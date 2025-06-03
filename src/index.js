import dotenv from "dotenv"
import{app} from "./app.js"
import conectDB from "./db/index.js"; 
dotenv.config({
    path:"./.env"
})

const PORT= process.env.PORT||4000;

conectDB().then(()=>{
    app.listen(PORT,()=>{
     console.log(`server is running on port ${PORT}`)
    })
}).catch((error)=>{
    console.log(`mongodb connection error`,error)
})








// app.listen(PORT,()=>{
//     console.log(`server is running on port ${PORT}`)
// })