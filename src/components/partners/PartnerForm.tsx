import { Grid, Button, TextField } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import { Partner } from "@prisma/client";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

export function PartnerForm({ partner = null, onSubmit }: { partner: Partner | null | undefined, onSubmit: (values: Partner) => void; }) {
    const { handleSubmit, register, setValue, formState } = useForm<Partner>();
    const [loaded, setLoaded] = useState(false)

    useEffect(() => {
        if (partner) {
            console.log(partner.bornDate instanceof Date)
            setValue('name', partner.name)
            setValue('email', partner.email)
            setValue('bornDate', partner.bornDate)
            setValue('notes', partner.notes)
            setValue('pendent', partner.pendent)
            setValue('phone', partner.phone)
            setValue('sipcard', partner.sipcard)
            setValue('surname', partner.surname)
        }
        setTimeout(() => {
            setLoaded(true)
        }, 250);
    }, [])

    if (!loaded) {
        return <div></div>
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <TextField {...register('name')} fullWidth label={'Nombre'} />
                </Grid>
                <Grid item xs={12}>
                    <TextField {...register('surname')} fullWidth label={'Apellidos'} />
                </Grid>
                <Grid item xs={12}>
                    <DatePicker value={formState.dirtyFields.bornDate} onChange={(value: any) => {
                        setValue('bornDate', value.toDate())
                    }} defaultValue={partner?.bornDate ? dayjs(partner.bornDate) : null} format="DD/MM/YYYY" label={'Fecha de nacimiento'} sx={{width: '100%'}} />
                </Grid>
                <Grid item xs={12}>
                    <TextField {...register('sipcard')} fullWidth label={'Tarjeta sip'} />
                </Grid>
                <Grid item xs={12}>
                    <TextField {...register('email')} fullWidth label={'Correo electrónico'} />
                </Grid>
                <Grid item xs={12}>
                    <TextField {...register('phone')} fullWidth label={'Teléfono'} />
                </Grid>
                <Grid item xs={12}>
                    <TextField {...register('notes')} fullWidth label={'Comentarios'} />
                </Grid>
                <Grid item xs={12}>
                    <TextField {...register('pendent')} fullWidth label={'Cosas pendientes'} />
                </Grid>
                <Grid item xs={12} display={'flex'} justifyContent={'flex-end'} flexDirection={'row'}>
                    <Button type={'submit'} variant={'contained'}>Guardar socio</Button>
                </Grid>
            </Grid>
        </form>
    );
}
