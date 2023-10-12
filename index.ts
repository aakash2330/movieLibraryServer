import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import dot from 'dotenv';
import movieRoutes from './routes/movieRoutes'




dot.config();

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());
app.use("/movie",movieRoutes);

const port = 3001;
app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})

export default app;