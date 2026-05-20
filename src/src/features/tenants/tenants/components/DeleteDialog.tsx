import * as React from "react";
import {useEffect, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
import {toast} from "react-toastify";
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Stack,
    Typography,
} from "@mui/material";
import {useDeleteTenant, useTenant} from "@app/features/tenants/tenants/hooks";

type DeleteDialogProps = {
    basePath: string;
};

export const DeleteDialog: React.FC<DeleteDialogProps> = ({basePath}) => {
    const navigate = useNavigate();
    const {action, recordId} = useParams();
    const [open, setOpen] = useState(false);
    const {data} = useTenant(recordId!);
    const deleteTenant = useDeleteTenant();

    const closeDialog = () => {
        navigate(basePath);
    };

    const handleSubmit = async () => {
        try {
            await deleteTenant.mutateAsync(recordId!);
            closeDialog();
            toast.success("Tenant deleted!");
        } catch (err: any) {
            console.error(err);
            toast.error(err.message || "Tenant could not be deleted!");
        }
    };

    useEffect(() => {
        setOpen(action === "delete");
    }, [action]);

    return (
        <Dialog open={open} onClose={closeDialog}>
            <DialogTitle>{data?.id ? "Delete Tenant?" : "Tenant Not Found!"}</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    {data?.id ? (
                        <>
                            <Typography variant="body1" mb={4}>
                                Are you absolutely sure you want to delete this tenant?
                            </Typography>
                            <Stack spacing={1}>
                                <Typography variant="body1">Tenant ID: {data.id}</Typography>
                                <Typography variant="body1">Name: {data.name}</Typography>
                                {data.fqdn && <Typography variant="body1">FQDN: {data.fqdn}</Typography>}
                            </Stack>
                        </>
                    ) : (
                        <Typography variant="body1" color="error">
                            No tenant could be found with the ID provided!
                        </Typography>
                    )}
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={closeDialog}>{data?.id ? "Cancel" : "Close"}</Button>
                {data?.id && (
                    <Button color="error" variant="contained" onClick={handleSubmit} autoFocus>
                        Delete Tenant
                    </Button>
                )}
            </DialogActions>
        </Dialog>
    );
};

export default DeleteDialog;
