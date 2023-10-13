"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.editMovieSchema = exports.movieDataSchema = exports.formSchema = void 0;
const zod_1 = require("zod");
exports.formSchema = zod_1.z.object({
    movieName: zod_1.z.string().min(2, "Must be at least 2 characters.").max(1000, "Must not be more than 1000 characters"),
    duration: zod_1.z.string().refine((duration) => {
        try {
            const durationArr = duration.split(""); //extracting wheter the entered duration is m or h
            if (durationArr[durationArr.length - 1] == "m") {
                if (+duration.split("m")[0] >= 1 && +duration.split("m")[0] <= 720)
                    return true;
            }
            if (durationArr[durationArr.length - 1] == "h") {
                if (+duration.split("h")[0] >= 0.1 && +duration.split("h")[0] <= 12)
                    return true;
            }
            else
                return false;
        }
        catch (error) {
            return false;
        }
    }, { message: "Duration must be 1-720m or 0.1-12h in format: Xh or Xm" }),
    rating: zod_1.z.string().refine((rating) => {
        try {
            if (+rating >= 0 && +rating <= 10)
                return true;
            return false;
        }
        catch (error) {
            return error;
        }
    }, { message: "Rating should be between 0 and 10" })
});
exports.movieDataSchema = zod_1.z.object({
    movieName: zod_1.z.string().min(2, "Must be at least 2 characters.").max(1000, "Must not be more than 1000 characters"),
    duration: zod_1.z.number(),
    rating: zod_1.z.number()
});
exports.editMovieSchema = zod_1.z.object({
    orignalMovieData: exports.movieDataSchema,
    newMovieData: exports.formSchema
});
