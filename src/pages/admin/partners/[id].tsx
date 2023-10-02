import { Box, Breadcrumbs, Button, Card, CardActions, CardContent, CardHeader, Divider, Grid, TableBody, TableCell, TableContainer, TableRow, TextField, Typography } from "@mui/material"
import { DatePicker } from "@mui/x-date-pickers"
import { type Attention } from "@prisma/client"
import dayjs from 'dayjs'
import Link from 'next/link'
import { useRouter } from "next/router"
import { useForm, type SubmitHandler } from "react-hook-form"
import { AuthedComponent } from "~/components/AuthedComponent"
import ButtonActivator from "~/components/ui/ButtonActivator"
import { ModalBox } from "~/components/ui/ModalBox"
import { api } from "~/utils/api"

export default AuthedComponent(function Partner() {
    const router = useRouter()
    const partner = api.partners.partnerShow.useQuery({ id: router.query.id as string })
    const removePartner = api.partners.removePartner.useMutation()
    const attentions = api.attentions.userAttentions.useQuery({ id: router.query.id as string })
    return (
        <>
            <Breadcrumbs aria-label="breadcrumb">
                <Link color="inherit" href="/admin/partners">
                    Pagina de socios
                </Link>
                <Typography color="text.primary">
                    {partner.isFetched ? `${partner.data!.name} ${partner.data!.surname}` : router.query.id}
                </Typography>
            </Breadcrumbs>
            <Divider sx={{ margin: '10px 0px' }} />
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant={'h4'}>{partner.data?.name} {partner.data?.surname}</Typography>
                <ButtonActivator Activator={() => (<Button color="error" variant="contained">Eliminar socio</Button>)}>
                    {(onClose) => (
                        <ModalBox modalTitle="¿Estas seguro que quieres eliminar este socio?" onClose={onClose}>
                            <Button variant={'contained'} color={'error'} onClick={async () => {
                                await removePartner.mutateAsync({ id: router.query.id as string })
                                onClose()
                                router.push('/admin/partners')
                            }}>
                                Confirmar
                            </Button>
                        </ModalBox>
                    )}
                </ButtonActivator>
            </Box>

            <TableContainer>
                <TableBody>
                    <TableRow>
                        <TableCell sx={{ fontWeight: 'bold' }}>Correo electrónico</TableCell>
                        <TableCell>{partner.data?.email}</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell sx={{ fontWeight: 'bold' }}>Telefono</TableCell>
                        <TableCell>{partner.data?.phone}</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell sx={{ fontWeight: 'bold' }}>Fecha de nacimiento</TableCell>
                        <TableCell>{partner.isFetched && dayjs(partner.data?.bornDate).format('DD/MM/YYYY')}</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell sx={{ fontWeight: 'bold' }}>SIP</TableCell>
                        <TableCell>{partner.data?.sipcard}</TableCell>
                    </TableRow>
                </TableBody>
            </TableContainer>

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
        </>
    )
})

function Attention({a, onRefresh}: {a: Attention, onRefresh: () => void}) {
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
    /*<Box sx={{ margin: '10px', border: '1px solid', padding: '5px' }}>
        <Typography>{dayjs(a.date).format('DD/MM/YYYY')}</Typography>
        
    </Box>*/
}

function AddAttentionButton({onAddAttention}) {
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

function AttentionForm({onSubmit}: {onSubmit: SubmitHandler<Attention>}) {
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

