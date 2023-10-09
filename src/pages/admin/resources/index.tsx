/* eslint-disable @typescript-eslint/no-redundant-type-constituents */
import { Box, Button, Grid, List, ListItemButton, ListItemText, TextField } from "@mui/material"
import { type PartnerMetaOptions, type PartnerMetaTypes } from "@prisma/client"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { AuthedComponent } from "~/components/AuthedComponent"
import ButtonActivator from "~/components/ui/ButtonActivator"
import { ModalBox } from "~/components/ui/ModalBox"
import { api } from "~/utils/api"

export default AuthedComponent(function ResourcesPage() {
    const resources = api.resources.getResourcesType.useQuery()
    const addResource = api.resources.createResourceType.useMutation()

    const [activeResource, setActiveResource] = useState<PartnerMetaTypes | null>(null)

    return (
        <>
            <Grid container spacing={2}>
                <Grid item xs={12} lg={8}></Grid>
                <Grid item xs={12} lg={4}>
                    <ButtonActivator Activator={() => <Button variant={'contained'}>Añadir tipo</Button>}>
                        {(onClose) => (
                            <ModalBox onClose={onClose} modalTitle="Añadiendo un tipo">
                                <ResourcesTypesForm onSubmit={async ({ value }) => {
                                    console.log('values', value)
                                    await addResource.mutateAsync({ text: value })
                                    await resources.refetch()
                                    onClose()
                                }} />
                            </ModalBox>
                        )}
                    </ButtonActivator>
                    {resources.isFetched && resources.data && <TypesResourcesList activeResource={activeResource} setActiveResource={setActiveResource} resources={resources.data} />}
                </Grid>
            </Grid>
        </>
    )
})

function TypesResourcesList(props: {activeResource: PartnerMetaTypes | null, resources: PartnerMetaTypes[], setActiveResource: (value: PartnerMetaTypes) => void}) {
    const { activeResource, resources, setActiveResource } = props
    return <Box>
        <List>
            {resources.map(r => (
                <ListItemButton selected={r.id === activeResource?.id} onClick={() => setActiveResource(r)} key={r.id}>
                    <ListItemText primary={r.label} />
                </ListItemButton>
            ))}
        </List>
    </Box>
}

function ResourcesTypesForm({ onSubmit }: { onSubmit: ({ value }: { value: string }) => void }) {
    const { register, handleSubmit } = useForm<{ value: string }>()
    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <TextField {...register('value')} fullWidth label={'Tipo de recurso'} />
                </Grid>
                <Grid item xs={12}>
                    <Button type={'submit'}>Añadir</Button>
                </Grid>
            </Grid>
        </form>
    )
}
