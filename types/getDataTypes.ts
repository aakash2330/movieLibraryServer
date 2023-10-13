
import { number, z } from 'zod'

export const paginationSchema = z.object({

    page:z.number().max(10,"please enter a page value less than 10"),
    limit:z.number()

})

export type paginationSchemaType = z.infer<typeof paginationSchema>