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
import {useAZoneRecord, useDeleteAZoneRecord} from "@app/features/zones/azone-records/hooks";

type DeleteDialogProps = {
    basePath: string;
    zoneId: string;
};

export const DeleteDialog: React.FC<DeleteDialogProps> = ({basePath, zoneId}) => {
    const navigate = useNavigate();
    const {action, recordId} = useParams();
    const [open, setOpen] = useState(false);
    const {data} = useAZoneRecord(zoneId, recordId!);
    const deleteRecord = useDeleteAZoneRecord(zoneId);

    const closeDialog = () => {
        navigate(basePath);
    };

    const handleSubmit = async () => {
        try {
            await deleteRecord.mutateAsync(recordId!);
            closeDialog();
            toast.success("Record deleted!");
        } catch (err: any) {
            console.error(err);
            toast.error("Record could not be deleted!");
        }
    };

    useEffect(() => {
        setOpen(action === "delete");
    }, [action]);

    return (
        <Dialog open={open} onClose={closeDialog}>
            <DialogTitle>{data?.id ? "Delete Record?" : "Record Not Found!"}</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    {data?.id ? (
                        <>
                            <Typography variant="body1" mb={4}>
                                Are you sure you want to delete this DNS record?
                            </Typography>
                            <Stack spacing={1}>
                                <Typography variant="body1">Name: {data.name || "@"}</Typography>
                                <Typography variant="body1">Type: {data.type}</Typography>
                                <Typography variant="body1">Content: {data.content}</Typography>
                            </Stack>
                        </>
                    ) : (
                        <Typography variant="body1" color="error">
                            No record could be found with the ID provided.
                        </Typography>
                    )}
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={closeDialog}>{data?.id ? "Cancel" : "Close"}</Button>
                {data?.id && (
                    <Button color="error" variant="contained" onClick={handleSubmit} autoFocus>
                        Delete Record
                    </Button>
                )}
            </DialogActions>
        </Dialog>
    );
};

export default DeleteDialog;
