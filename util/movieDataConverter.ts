//this file changes the formType data to movieType data that mysql accepts

import { formType, movieDataType } from "../types/formTypes";

export function converMovieData(movieData:formType):movieDataType{
    
    let {movieName,duration,rating}=movieData;
    let durationHours:number;
    
    if(duration.slice(-1)=="h"){
         durationHours=parseFloat(duration.slice(0,duration.length-1)); //converting input to number
    }
    else {
        durationHours=+(parseFloat(duration.slice(0,duration.length-1))/60).toFixed(1); //fixing to 1 demical point
    }
    const ratingNum=parseFloat(rating); //converting input to number
    console.log({movieName,durationHours,ratingNum})
    return {movieName,duration:durationHours,rating:ratingNum}
}