import { Grid, Button, TextField } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import { Partner } from "@prisma/client";
import { useForm } from "react-hook-form";

export function PartnerForm({ onSubmit }: { onSubmit: (values: Partner) => void; }) {
    const { handleSubmit, register, setValue, formState } = useForm<Partner>();
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
                    }} label={'Fecha de nacimiento'} sx={{width: '100%'}} />
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
