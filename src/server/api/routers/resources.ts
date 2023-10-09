import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import {snakeCase} from 'change-case-all'

export const resourcesRouter = createTRPCRouter({
    createResourceType: protectedProcedure.input(z.object({text: z.string()})).mutation(async ({input, ctx: {db}}) => {
        const type = await db.partnerMetaTypes.create({
            data: {label: input.text, typemeta: snakeCase(input.text)}
        })
        return {
            success: true,
            type,
            message: 'Creado con éxito'
        }
    }),
    getResourcesType: protectedProcedure.query(async ({ctx: {db}}) => {
        return await db.partnerMetaTypes.findMany({})
    })
})