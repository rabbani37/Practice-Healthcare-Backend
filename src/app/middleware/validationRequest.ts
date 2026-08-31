import z from "zod";
import { catchAsync } from "../utils/catchAsync";
import { NextFunction, Request, Response } from "express";


export const validationRequest = (schemaZod: z.ZodObject) => {

    return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        let payload = req.body ?? {}
        const result = schemaZod.safeParse(payload);

        if (!result.success) {
            throw new Error(result.error.issues[0].message)
        }
        payload = result.data
        next()
    })
}

