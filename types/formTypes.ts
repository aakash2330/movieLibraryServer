
import { z } from 'zod'



export const formSchema = z.object({
    movieName: z.string().min(2,"Must be at least 2 characters.",).max(1000 , "Must not be more than 1000 characters"),
    duration:z.string().refine(
        (duration) => {try{

            const durationArr = duration.split(""); //extracting wheter the entered duration is m or h

            if(durationArr[durationArr.length-1]=="m"){
                    if(+duration.split("m")[0]>=1 && +duration.split("m")[0]<=720 ) return true; 
            }
            if(durationArr[durationArr.length-1]=="h"){
                    if(+duration.split("h")[0]>=0.1 && +duration.split("h")[0]<=12)return true;
            }
            else return false

        }catch(error){
            return false
        }},
        { message: "Duration must be 1-720m or 0.1-12h in format: Xh or Xm" }
      )
,
    rating: z.string().refine((rating)=>{
        try{
            if(+rating>=0 && +rating<=10)return true;
            return false
        }
        catch(error){
            return error;
        }
    }, { message: "Rating should be between 0 and 10" })
})

export type formType = z.infer<typeof formSchema>

export type movieDataType = {
    movieName:string,
    duration: number,
    rating: number
}


