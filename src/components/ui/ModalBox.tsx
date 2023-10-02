import { Modal, Card, CardContent, CardHeader } from "@mui/material";

export function ModalBox({ onClose, children, modalTitle = 'Modal sin título' }) {
    return <Modal onClose={onClose} open={true}>
        <Card sx={{width: '50vw', margin: '20px auto'}}>
            <CardHeader title={modalTitle} />
            <CardContent>
                {children}
            </CardContent>
        </Card>
    </Modal>;
}
