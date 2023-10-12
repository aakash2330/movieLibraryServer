import express from 'express';
const router = express.Router();
import MOVIE from "../models/movie"
import { formSchema, formType, movieDataType } from '../types/formTypes';
import { Op } from 'sequelize';



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


router.post("/filterRating",async(req,res)=>{ //filtering the rating and sending the desired output

console.log(req.body)

if(req.body.filter=="lessThanSeven"){

    const movieList = await MOVIE.findAll({
        where: {
            rating: {
              [Op.lte]: 7  // using the "less than" operator
            }
          }
    })
    
    res.json({movieList})

}

else{
    const movieList = await MOVIE.findAll({
        where: {
            rating: {
              [Op.gte]: 7  // using the "greater than" operator
            }
          }
    })

    res.json({movieList})
}


})

export default router