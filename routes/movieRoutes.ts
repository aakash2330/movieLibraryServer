import express from 'express';
const router = express.Router();
import MOVIE from "../models/movie"
import { editMovieSchema, formSchema, formType, movieDataType } from '../types/formTypes';
import { Op } from 'sequelize';
import { paginationSchema } from '../types/getDataTypes';
import { converMovieData } from '../util/movieDataConverter';



async function getMoviesList(){
    const movieList = await MOVIE.findAll();
    console.log(movieList);
    return movieList
}



//route to add a new movie
router.post("/add",async(req,res)=>{
    
    try{
    const parsedInput =  formSchema.safeParse(req.body);
  
    
    if(!parsedInput.success){
        return res.status(403).json({error:parsedInput.error})
      }

    if(parsedInput.success){
    let {movieName,duration,rating}=parsedInput.data;
    let durationHours:number;
    
    if(duration.slice(-1)=="h"){
         durationHours=parseFloat(duration.slice(0,duration.length-1)); //converting input to number
    }
    else {
        durationHours=+(parseFloat(duration.slice(0,duration.length-1))/60).toFixed(1); //fixing to 1 demical point
    }
    const ratingNum=parseFloat(rating); //converting input to number
    console.log({movieName,durationHours,ratingNum})

    //add to database
    await MOVIE.sync();
        await MOVIE.create({
            movieName: movieName,
            duration: durationHours,
            rating: ratingNum
        });

    res.json({movieAdded:{movieName,durationHours,ratingNum}})}

}

    catch(error){
        res.json({request:"failed"})
    }
})




// route to get list of movies back
router.get("/list",async(req,res)=>{
try{
   const movieList =  await getMoviesList();
    res.json({movieList})
}
catch(error){
    res.json({request:"failed"})
}
})



router.post("/customList",async(req,res)=>{
  try{
    const parsedInput =  paginationSchema.safeParse(req.body);
    if(!parsedInput.success){
        return res.json({error:parsedInput.error})  //return if the input type is incorrect
    }
    if(parsedInput.success){
        const {page,limit,keyword,orderBy,sortBy} = parsedInput.data
        const data = await MOVIE.findAndCountAll({
                offset:(page-1)*limit,
                limit,
                order:[[orderBy,sortBy]],
                where:{
                    movieName:{
                        [Op.substring]: keyword
                    }
                    
                }
        })

        return res.json({
            totalPages:Math.ceil(data.count/limit),
            totalItem:data.count,
            data:data.rows
        })
    }

  }
  catch(error){
    return  res.json({request:"failed"})
  }
})





// route to download list of movies in a csv file 
router.get("/download",async (req,res)=>{

    try{
        const movieList =  await getMoviesList();
   
        const convertToCsv = (data) => {
            const header = Object.keys(data[0]).join(',');
            const rows = data.map(row => Object.values(row).join(',')).join('\n');
            return `${header}\n${rows}`;
          };
    
          const csvData = convertToCsv(movieList.map(movie => movie.toJSON()));
    
          res.setHeader('Content-Type', 'text/csv');
          res.setHeader('Content-Disposition', 'attachment; filename=movieList.csv');
          res.send(csvData);
    }catch (error){

        res.json({request:"failed"})
    }

    
})


router.post("/filter",async(req,res)=>{ //filtering the rating and sending the desired output

const {filter} = req.body;

console.log({filter})

if(filter=="lessThanSeven"  ){

    const movieList = await MOVIE.findAll({
        where: {
            rating: {
              [Op.lte]: 7  // using the "less than" operator
            }
          }
    })
    
    return res.json({movieList})

}


else {
    
    const movieList = await MOVIE.findAll({
        where: {
            rating: {
              [Op.gte]: 7  // using the "less than" operator
            }
          }
    })
    
    return res.json({movieList})

}
})


router.put("/edit",async(req,res)=>{
try{

    const parsedInput = editMovieSchema.safeParse(req.body);
    if(!parsedInput.success){
        return res.json({error:parsedInput.error})  //return if the input type is incorrect
    }

    if(parsedInput.success){
       
        const {newMovieData,orignalMovieData}=parsedInput.data;
        const convertednewMovieData:movieDataType = converMovieData(newMovieData);
        console.log({convertednewMovieData,orignalMovieData})

        const data = await MOVIE.update(
            convertednewMovieData ,{
            where: {
                movieName:orignalMovieData.movieName, //add other fileds in future
              }
        })
        console.log(data)
        res.json({request:"movie-edited"})
    }

}
catch(error){
    res.json({request:"failed"})
}
})

export default router