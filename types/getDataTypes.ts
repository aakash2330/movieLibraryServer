
import { number, z } from 'zod'

export const paginationSchema = z.object({

    page:z.number().max(10,"please enter a page value less than 10").optional().default(10),
    limit:z.number().optional().default(10),
    orderBy:z.string().optional().default("movieName"),
    sortBy:z.string().optional().default('asc'), 
    keyword:z.string().optional().default("")

})

export type paginationSchemaType = z.infer<typeof paginationSchema>