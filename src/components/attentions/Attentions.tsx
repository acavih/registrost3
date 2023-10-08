import { Box, Button, Card, CardActions, CardContent, CardHeader, Grid, TextField, Typography } from "@mui/material"
import { DatePicker } from "@mui/x-date-pickers"
import { type Attention } from "@prisma/client"
import dayjs from 'dayjs'
import { useRouter } from "next/router"
import { useEffect } from "react"
import { useForm, type SubmitHandler } from "react-hook-form"
import ButtonActivator from "~/components/ui/ButtonActivator"
import { ModalBox } from "~/components/ui/ModalBox"
import { api } from "~/utils/api"

export function Attentions() {
    const router = useRouter()
    const attentions = api.attentions.userAttentions.useQuery({ id: router.query.id as string })
    return (
        <Box>
            <Box sx={{marginTop: '10px'}} display={'flex'} justifyContent={'space-between'}>
                <Typography variant={'h5'}>Listado de atenciones ({(attentions.data ?? []).length})</Typography>
                <AddAttentionButton onAddAttention={() => void attentions.refetch()} />
            </Box>
            <Grid container spacing={2}>
                {attentions.data?.map((a) => (
                    <Grid item key={a.id} xs={12}>
                        <Attention a={a} onRefresh={() => void attentions.refetch()} />
                    </Grid>
                ))}
            </Grid>
        </Box>
    )
}

export function Attention({ a, onRefresh }: { a: Attention, onRefresh: () => void }) {
    const router = useRouter()

    const removeAttention = api.attentions.removeAttention.useMutation()
    const updateAttention = api.attentions.updateAttention.useMutation()
    
    return (
        <Card>
            <CardHeader title={dayjs(a.date).format('DD/MM/YYYY')} />
            <CardContent>
                <Typography>{a.note}</Typography>
            </CardContent>
            <CardActions>
                <ButtonActivator Activator={() => (<Button size={'small'} variant="contained" sx={{marginRight: '20px'}}>Editar atención</Button>)}>
                    {(onClose) => (
                        <ModalBox onClose={onClose} modalTitle="Editar atención">
                            <AttentionForm attention={a} onSubmit={async (update: Attention) => {
                                console.log('On submit', update)
                                await updateAttention.mutateAsync({
                                    ...update as any,
                                    partnerId: router.query.id as string,
                                    id: a.id
                                })
                                /*await addAttention.mutateAsync({
                                    ...a as any,
                                    partnerId: router.query.id as string
                                })*/
                                onRefresh()
                                onClose()
                            }} />
                        </ModalBox>
                    )}
                </ButtonActivator>
                <ButtonActivator Activator={() => <Button disableElevation color="error" variant={"contained"}>Eliminar atención</Button>}>
                    {(onClose) => (
                        <ModalBox modalTitle="De verdad quieres eliminar la atencion" onClose={onClose}>
                            <Button disableElevation color="error" variant={"contained"} onClick={async () => {
                                await removeAttention.mutateAsync({ id: a.id })
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

export function AddAttentionButton({ onAddAttention }) {
    const addAttention = api.attentions.addAttention.useMutation()
    const router = useRouter()
    return <ButtonActivator Activator={() => (<Button size={'small'} variant="contained">Añadir atención</Button>)}>
        {(onClose) => (
            <ModalBox onClose={onClose} modalTitle="Añadir atención">
                <AttentionForm attention={null} onSubmit={async (a) => {
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

export function AttentionForm({ onSubmit, attention }: { onSubmit: SubmitHandler<Attention>, attention: Attention | null }) {
    const { register, handleSubmit, formState, setValue } = useForm<Attention>()

    useEffect(() => {
        if (attention) {
            setValue('pendent', attention.pendent)
            setValue('note', attention.note)
            setValue('date', attention.date)
            setValue('pendentDate', attention.pendentDate)
        }
    }, [])
    return (
        <form onSubmit={handleSubmit(onSubmit) as any}>
            <Grid container spacing={1}>
                <Grid xs={12} item>
                    <DatePicker value={formState.dirtyFields.date} onChange={(value: any) => {
                        setValue('date', value.toDate())
                    }} defaultValue={attention?.date ? dayjs(attention.date) : null} label={'Fecha de atención'} sx={{ width: '100%' }} />
                </Grid>
                <Grid xs={12} item>
                    <TextField {...register('note')} fullWidth label="Comentario" />
                </Grid>
                <Grid xs={12} item>
                    <DatePicker value={formState.dirtyFields.pendentDate} onChange={(value: any) => {
                        setValue('pendentDate', value.toDate())
                    }} defaultValue={attention?.pendentDate ? dayjs(attention.pendentDate) : null} label={'Fecha de pendiente'} sx={{ width: '100%' }} />
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

