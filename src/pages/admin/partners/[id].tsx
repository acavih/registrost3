import { Box, Breadcrumbs, Button, Divider, Grid, TableBody, TableCell, TableContainer, TableRow, Typography } from "@mui/material"
import { Partner } from "@prisma/client"
import dayjs from 'dayjs'
import Link from 'next/link'
import { useRouter } from "next/router"
import { AuthedComponent } from "~/components/AuthedComponent"
import { AddAttentionButton, Attention as AttentionComponent } from "~/components/attentions/Attentions"
import { PartnerForm } from "~/components/partners/PartnerForm"
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
                <Box display={'flex'} flexDirection={'row'}>
                    {partner.data && <EditPartnerButton onUpdate={() => partner.refetch()} partner={partner.data} />}
                    <ButtonActivator Activator={() => (<Button sx={{marginLeft: '20px'}} color="error" variant="contained">Eliminar socio</Button>)}>
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
                        <AttentionComponent a={a} onRefresh={() => void attentions.refetch()} />
                    </Grid>
                ))}
            </Grid>
        </>
    )
})

function EditPartnerButton({partner, onUpdate}: {partner: Partner, onUpdate: () => void}) {
    const updatePartner = api.partners.updatePartner.useMutation()
    const router = useRouter()
    return <ButtonActivator Activator={() => (<Button variant="contained">Editar socio</Button>)}>
        {(onClose) => (
            <ModalBox modalTitle="Editando un socio" onClose={onClose}>
                <PartnerForm partner={partner} onSubmit={async (values: Partner) => {
                    await updatePartner.mutateAsync({
                        ...values as any,
                        id: router.query.id as string
                    })
                    onUpdate()
                    onClose()
                }} />
            </ModalBox>
        )}
    </ButtonActivator>
}
