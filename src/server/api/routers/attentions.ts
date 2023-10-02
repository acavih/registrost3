import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const attentionsRouter = createTRPCRouter({
    userAttentions: protectedProcedure.input(z.object({id: z.string()})).query(async ({input, ctx: {db}}) => {
        const attentions = await db.attention.findMany({
            where: {partnerId: input.id},
            orderBy: {
                date: 'desc'
            }
        })

        return attentions
    }),
    addAttention: protectedProcedure.input(z.object({
        partnerId: z.string(),
        note: z.string(),
        pendent: z.string(),
        pendentDate: z.date(),
        date: z.date(),
        archived: z.boolean().default(false)
    })).mutation(async ({input, ctx: {db}}) => {
        const attention = await db.attention.create({data: input})
        return attention
    }),
    removeAttention: protectedProcedure.input(z.object({id: z.string()})).mutation(async ({input, ctx: {db}}) => {
        await db.attention.delete({where: {id: input.id}})
        return true
    })
})