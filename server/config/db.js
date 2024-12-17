const mongoose = require('mongoose');

const connectDB = async ()=> {
  try {
    mongoose.set('strictQuery');
    const conn = await mongoose.connect(process.env.MONGODB_URI)
    console.log(`database is connected : ${conn.connection.host}`);
    
  } catch (error) {
    console.log(`somthing worng connection database : ${error}`);
    
  }
}

module.exports = connectDB;