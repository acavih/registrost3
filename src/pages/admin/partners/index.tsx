import { Breadcrumbs, Button, Divider, Grid, Typography } from "@mui/material"
import type { GridColDef } from "@mui/x-data-grid"
import { DataGrid } from "@mui/x-data-grid"
import type { Partner } from "@prisma/client"
import Link from 'next/link'
import { AuthedComponent } from "~/components/AuthedComponent"
import ButtonActivator from "~/components/ui/ButtonActivator"
import { api } from "~/utils/api"
import { PartnerForm } from "../../../components/partners/PartnerForm"
import { ModalBox } from "../../../components/ui/ModalBox"
import { calcularEdad } from "../../../utils/calcularEdad"

export default AuthedComponent(function PartnersPage() {
    const partners = api.partners.partnersList.useQuery()
    return (
        <>
            <Breadcrumbs aria-label="breadcrumb">
                <Typography color="text.primary">Página de socios</Typography>
            </Breadcrumbs>
            <Divider sx={{margin: '10px 0px'}} />
            <Grid container gap={1}>
                <Grid xs={12} item display={'flex'} justifyContent={'space-between'}>
                    <Typography variant="h5">Listado de socios</Typography>
                    <ButtonAddPartner onAdd={() => partners.refetch()} />
                </Grid>
                <Grid xs={12} item>
                    {partners.isFetched && <PartnersTable partners={partners.data} />}
                </Grid>
            </Grid>
        </>
    )
})

function ButtonAddPartner({onAdd}) {
    const addPartner = api.partners.createPartner.useMutation()
    return (
        <ButtonActivator Activator={() => (<Button variant={'contained'}>Añadir socio</Button>)}>
            {(onClose) => (
                <ModalBox onClose={onClose} modalTitle="Añadir socio">
                    <PartnerForm partner={null} onSubmit={async (values) => {
                        console.log('añadiendo socio', values)
                        const partnerCreated = await addPartner.mutateAsync(values as any)
                        console.log(partnerCreated)
                        onAdd()
                        onClose()
                    }} />
                </ModalBox>
            )}
        </ButtonActivator>
    )
}

function PartnersTable({partners}) {
    const columns: GridColDef<any, Partner> [] = [
        {field: 'name', headerName: 'Nombre'},
        {field: 'surname', headerName: 'Apellidos'},
        {field: 'sipcard', headerName: 'SIP'},
        {field: 'phone', headerName: 'Teléfono'},
        {field: 'bornDate', headerName: 'Edad', valueFormatter: (params) => {
            return params.value ? (calcularEdad(params.value) + " años") as any : 'N/A'
        }},
        {field: 'email', headerName: 'Email'},
        {field: 'actions', headerName: 'Acciones', renderCell: (params) => {
            console.log(params)
            return (
                <Button LinkComponent={Link} href={`/admin/partners/${params.id}`} variant="contained" size="small">Ver</Button>
            )
        }},
    ]
    return (
        <DataGrid rows={partners} autoHeight={true} columns={columns} />
    )
}
