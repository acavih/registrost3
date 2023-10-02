import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";

const partnerValidator = z.object({
    name: z.string().default(''),
    surname: z.string().default(''),
    email: z.string().default(''),
    phone: z.string().default(''),
    sipcard: z.string().default(''),
    notes: z.string().default(''),
    pendent: z.string().default(''),
    bornDate: z.date().optional(),
})

export const partnersRouter = createTRPCRouter({
    partnersList: protectedProcedure.query(async ({ctx: {db}}) => {
        const partners = await db.partner.findMany({
            take: 20
        })

        return partners
    }),
    createPartner: protectedProcedure.input(partnerValidator).mutation(async ({input, ctx: {db}}) => {
        const partnerCreated = await db.partner.create({
            data: input
        })

        return partnerCreated
    }),
    partnerShow: protectedProcedure.input(z.object({id: z.string()})).query(async ({input, ctx: {db}}) => {
        const partner = await db.partner.findFirst({
            where: {id: input.id},
            include: {
                attentions: true
            }
        })
        return partner
    }),
    removePartner: protectedProcedure.input(z.object({id: z.string()})).mutation(async ({input, ctx: {db}}) => {
        await db.partner.delete({where: {id: input.id}})
        return {}
    })
})