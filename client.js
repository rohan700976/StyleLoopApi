require('dotenv').config();
const {Redis}=require('ioredis');
const client = new Redis(process.env.REDISCLOUD);

module.exports=client;