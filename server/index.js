import express from 'express'
import dotenv from "dotenv";
dotenv.config();
import cookieParser from 'cookie-parser'
import authRoute from './routes/auth.route.js'
import postRoute from './routes/post.route.js'
// import userRoute from './routes/user.route.js'

const app = express();

app.use(express.json())
app.use(cookieParser())
app.use('/api/posts', postRoute);
app.use('/api/auth', authRoute);
// app.use('/api/posts', postRoute);


app.listen(8000, ()=> {
    console.log('Server Started at PORT: 8000');
    
})
