import { Button, Card, CardActions, CardContent, CardHeader, Grid, TextField, Typography } from "@mui/material"
import { DatePicker } from "@mui/x-date-pickers"
import { type Attention } from "@prisma/client"
import dayjs from 'dayjs'
import { useRouter } from "next/router"
import { useForm, type SubmitHandler } from "react-hook-form"
import ButtonActivator from "~/components/ui/ButtonActivator"
import { ModalBox } from "~/components/ui/ModalBox"
import { api } from "~/utils/api"

export function Attention({a, onRefresh}: {a: Attention, onRefresh: () => void}) {
    const removeAttention = api.attentions.removeAttention.useMutation()
    return (
        <Card>
            <CardHeader title={dayjs(a.date).format('DD/MM/YYYY')} />
            <CardContent>
                <Typography>{a.note}</Typography>
            </CardContent>
            <CardActions>
                <ButtonActivator Activator={() => <Button disableElevation color="error" variant={"contained"}>Eliminar atención</Button>}>
                    {(onClose) => (
                        <ModalBox modalTitle="De verdad quieres eliminar la atencion" onClose={onClose}>
                            <Button disableElevation color="error" variant={"contained"} onClick={async () => {
                                await removeAttention.mutateAsync({id: a.id})
                                onRefresh()
                                onClose()
                            }}>Si, eliminar</Button>
                        </ModalBox>
                    )}
                </ButtonActivator>
            </CardActions>
        </Card>
    )
}

export function AddAttentionButton({onAddAttention}) {
    const addAttention = api.attentions.addAttention.useMutation()
    const router = useRouter()
    return <ButtonActivator Activator={() => (<Button size={'small'} variant="contained">Añadir atención</Button>)}>
        {(onClose) => (
            <ModalBox onClose={onClose} modalTitle="Añadir atención">
                <AttentionForm onSubmit={async (a) => {
                    console.log('On submit', a)
                    await addAttention.mutateAsync({
                        ...a as any,
                        partnerId: router.query.id as string
                    })
                    onAddAttention()
                    onClose()
                }} />
            </ModalBox>
        )}
    </ButtonActivator>
}

export function AttentionForm({onSubmit}: {onSubmit: SubmitHandler<Attention>}) {
    const {register, handleSubmit, formState, setValue} = useForm<Attention>()
    return (
        <form onSubmit={handleSubmit(onSubmit) as any}>
            <Grid container spacing={1}>
                <Grid xs={12} item>
                    <DatePicker value={formState.dirtyFields.date} onChange={(value: any) => {
                        setValue('date', value.toDate())
                    }} label={'Fecha de atención'} sx={{width: '100%'}} />
                </Grid>
                <Grid xs={12} item>
                    <TextField {...register('note')} fullWidth label="Comentario" />
                </Grid>
                <Grid xs={12} item>
                    <DatePicker value={formState.dirtyFields.pendentDate} onChange={(value: any) => {
                        setValue('pendentDate', value.toDate())
                    }} label={'Fecha de pendiente'} sx={{width: '100%'}} />
                </Grid>
                <Grid xs={12} item>
                    <TextField {...register('pendent')} fullWidth label="Pendiente" />
                </Grid>
                <Grid xs={12} flexDirection={'row'} item display={'flex'} justifyContent={'flex-end'}>
                    <Button type={'submit'}>Guardar</Button>
                </Grid>
            </Grid>
        </form>
    )
}

