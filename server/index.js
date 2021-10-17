import express from "express";
import axios from "axios";
import cors from "cors";
import mongoose from "mongoose";
import {HOD} from "./hod_model.js";
const app=express();
// app.use(function (req, res, next) {
//   res.setHeader("Access-Control-Allow-Origin", "*");
//   res.setHeader("Access-Control-Allow-Methods", "*");
//   res.setHeader("Access-Control-Allow-Headers", "*");
//   next();
// });
app.use(cors());
const connect = (
  url = "mongodb+srv://Tazim:qwertyuiop1234567890@cluster0.oxjfe.mongodb.net/hodinfo"
) => {
  return mongoose.connect(url, {
    useUnifiedTopology: true,
    useNewUrlParser: true
  });
};
app.get("/",async(req,res,next)=>{
  try{
    const resp = await axios.get("https://api.wazirx.com/api/v2/tickers");
    console.log(typeof resp.data);
    const response=[];
    // console.log(resp.data);
    // for(let x in resp.data){
    //   console.log(x);
    //   for(let i in x){
    //     console.log(i);
    //   }
    // }
    const iterate=(data)=>{
    Object.keys(data).forEach(key => {
      // console.log(`key: ${key}, value: ${data[key]}`);

      // if(response.length<10){
      //   if (typeof data[key]==='object') {
      //     data[key] = '';
      //   }
      //   response.push({ key: key, value: data[key] });
      // }
    if (typeof resp.data[key] === 'object') {
            iterate(data[key]);
            if(response.length<10)
            response.push({key:key,value:data[key]})
        }
    })
  }
   iterate(resp.data);
  for (let i = 0; i < response.length; i++) {
    // await HOD.insertMany(response[i].value);
    await HOD.findOneAndUpdate({name:response[i].value.name},response[i].value);
    
  }
  const saved=await HOD.find().sort({x:-1}).limit(10);
    console.log(response);
    res.json({status:"Server is running",data:saved});
  }catch(e){
    console.log(e);
    res.json(e);
  }
})

app.listen(3001,async()=>{
  await connect(); 
  console.log("Port is on 3001");
})