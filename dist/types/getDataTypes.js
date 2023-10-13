"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.paginationSchema = void 0;
const zod_1 = require("zod");
exports.paginationSchema = zod_1.z.object({
    page: zod_1.z.number().max(10, "please enter a page value less than 10").optional().default(10),
    limit: zod_1.z.number().optional().default(10),
    orderBy: zod_1.z.string().optional(),
    sortBy: zod_1.z.string().optional().default('asc'),
    keyword: zod_1.z.string().optional().default("")
});
