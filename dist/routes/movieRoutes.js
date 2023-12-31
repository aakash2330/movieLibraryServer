"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const movie_1 = __importDefault(require("../models/movie"));
const formTypes_1 = require("../types/formTypes");
const sequelize_1 = require("sequelize");
const getDataTypes_1 = require("../types/getDataTypes");
const movieDataConverter_1 = require("../util/movieDataConverter");
function getMoviesList() {
    return __awaiter(this, void 0, void 0, function* () {
        const movieList = yield movie_1.default.findAll();
        console.log(movieList);
        return movieList;
    });
}
//route to add a new movie
router.post("/add", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const parsedInput = formTypes_1.formSchema.safeParse(req.body);
        if (!parsedInput.success) {
            return res.status(403).json({ error: parsedInput.error });
        }
        if (parsedInput.success) {
            let { movieName, duration, rating } = parsedInput.data;
            let durationHours;
            if (duration.slice(-1) == "h") {
                durationHours = parseFloat(duration.slice(0, duration.length - 1)); //converting input to number
            }
            else {
                durationHours = +(parseFloat(duration.slice(0, duration.length - 1)) / 60).toFixed(1); //fixing to 1 demical point
            }
            const ratingNum = parseFloat(rating); //converting input to number
            console.log({ movieName, durationHours, ratingNum });
            //add to database
            yield movie_1.default.sync();
            yield movie_1.default.create({
                movieName: movieName,
                duration: durationHours,
                rating: ratingNum
            });
            res.json({ movieAdded: { movieName, durationHours, ratingNum } });
        }
    }
    catch (error) {
        res.json({ request: "failed" });
    }
}));
// route to get list of movies back
router.get("/list", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const movieList = yield getMoviesList();
        res.json({ movieList });
    }
    catch (error) {
        res.json({ request: "failed" });
    }
}));
router.post("/customList", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const parsedInput = getDataTypes_1.paginationSchema.safeParse(req.body);
        if (!parsedInput.success) {
            return res.json({ error: parsedInput.error }); //return if the input type is incorrect
        }
        if (parsedInput.success) {
            const { page, limit, keyword, orderBy, sortBy } = parsedInput.data;
            const data = yield movie_1.default.findAndCountAll({
                offset: (page - 1) * limit,
                limit,
                order: [[orderBy, sortBy]],
                where: {
                    movieName: {
                        [sequelize_1.Op.substring]: keyword
                    }
                }
            });
            return res.json({
                totalPages: Math.ceil(data.count / limit),
                totalItem: data.count,
                data: data.rows
            });
        }
    }
    catch (error) {
        return res.json({ request: "failed" });
    }
}));
// route to download list of movies in a csv file 
router.get("/download", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const movieList = yield getMoviesList();
        const convertToCsv = (data) => {
            const header = Object.keys(data[0]).join(',');
            const rows = data.map(row => Object.values(row).join(',')).join('\n');
            return `${header}\n${rows}`;
        };
        const csvData = convertToCsv(movieList.map(movie => movie.toJSON()));
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', 'attachment; filename=movieList.csv');
        res.send(csvData);
    }
    catch (error) {
        res.json({ request: "failed" });
    }
}));
router.post("/filter", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { filter } = req.body;
    console.log({ filter });
    if (filter == "lessThanSeven") {
        const movieList = yield movie_1.default.findAll({
            where: {
                rating: {
                    [sequelize_1.Op.lte]: 7 // using the "less than" operator
                }
            }
        });
        return res.json({ movieList });
    }
    else {
        const movieList = yield movie_1.default.findAll({
            where: {
                rating: {
                    [sequelize_1.Op.gte]: 7 // using the "less than" operator
                }
            }
        });
        return res.json({ movieList });
    }
}));
router.put("/edit", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const parsedInput = formTypes_1.editMovieSchema.safeParse(req.body);
        if (!parsedInput.success) {
            return res.json({ error: parsedInput.error }); //return if the input type is incorrect
        }
        if (parsedInput.success) {
            const { newMovieData, orignalMovieData } = parsedInput.data;
            const convertednewMovieData = (0, movieDataConverter_1.converMovieData)(newMovieData);
            console.log({ convertednewMovieData, orignalMovieData });
            const data = yield movie_1.default.update(convertednewMovieData, {
                where: {
                    movieName: orignalMovieData.movieName, //add other fileds in future
                }
            });
            console.log(data);
            res.json({ request: "movie-edited" });
        }
    }
    catch (error) {
        res.json({ request: "failed" });
    }
}));
exports.default = router;
