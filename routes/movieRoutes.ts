import express from 'express';
const router = express.Router();
import MOVIE from "../models/movie"
import { formSchema, formType, movieDataType } from '../types/formTypes';
import { Op } from 'sequelize';
import { paginationSchema } from '../types/getDataTypes';



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




// route to get paginated list of users back req --> export type pageinatedType = { page:number, limit:number}
router.post("/paginatedList",async(req,res)=>{
  try{
    const parsedInput =  paginationSchema.safeParse(req.body);
    if(!parsedInput.success){
        return res.json({error:parsedInput.error})  //return if the input type is incorrect
    }
    if(parsedInput.success){
        const {page,limit} = parsedInput.data
        const data = await MOVIE.findAndCountAll({
                offset:(page-1)*limit,
                limit
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

const {ratingFilterValue,nameFilterValue} = req.body;

console.log({ratingFilterValue,nameFilterValue})

if(ratingFilterValue=="lessThanSeven" && nameFilterValue=="betweenAandM" ){

    const movieList = await MOVIE.findAll({
        where: {
            rating: {
              [Op.lte]: 7  // using the "less than" operator
            }
            ,
            movieName: {
                [Op.regexp]: '^[a-mA-M].*' // using the "regexp" operator
              }
          }
    })
    
    return res.json({movieList})

}

if(ratingFilterValue=="lessThanSeven" && nameFilterValue=="betweenMandZ"){
    const movieList = await MOVIE.findAll({
        where: {
            rating: {
              [Op.lte]: 7  // using the "greater than" operator
            },
            movieName: {
                [Op.regexp]: '^[n-zA-Z].*' // using the "regexp" operator
              }
          }
    })

  return  res.json({movieList})
}



if(ratingFilterValue=="greaterThanSeven" && nameFilterValue=="betweenAandM"){
    const movieList = await MOVIE.findAll({
        where: {
            rating: {
              [Op.gte]: 7  // using the "greater than" operator
            },
            movieName: {
                [Op.regexp]: '^[a-mA-M].*' // using the "regexp" operator
              }
          }
    })

    return res.json({movieList})
}



if(ratingFilterValue=="greaterThanSeven" && nameFilterValue=="betweenMandZ"){
    const movieList = await MOVIE.findAll({
        where: {
            rating: {
              [Op.gte]: 7  // using the "greater than" operator
            },
            movieName: {
                [Op.regexp]: '^[n-zA-Z].*' // using the "regexp" operator
              }
          }
    })

    return res.json({movieList})
}

else {
    return res.json({request:"failed"})
}


})

export default router