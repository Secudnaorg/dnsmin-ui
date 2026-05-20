import * as React from "react";
import {useEffect, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
import {toast} from "react-toastify";
import {Formik, FormikHelpers} from "formik";
import {object, string} from "yup";
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Stack,
    TextField,
    Typography,
} from "@mui/material";
import {useCreateTenant, useTenant, useUpdateTenant} from "@app/features/tenants/tenants/hooks";
import {ITenant} from "@app/features/tenants/tenants/models";
import {mapFastApiErrorsToFormik} from "@app/utils/fastapi-formik";

type FormDialogProps = {
    basePath: string;
};

const validationSchema = object({
    name: string()
        .required("Tenant name is required.")
        .min(2, "Tenant name must be at least 2 characters.")
        .max(100, "Tenant name must be at most 100 characters."),
    fqdn: string()
        .nullable()
        .max(253, "FQDN must be at most 253 characters."),
    stopgapDomainId: string()
        .nullable(),
    stopgapHostname: string()
        .nullable()
        .max(253, "Stopgap hostname must be at most 253 characters."),
});

const emptyTenant: ITenant = {
    name: "",
    fqdn: "",
    stopgapDomainId: "",
    stopgapHostname: "",
};

export const FormDialog: React.FC<FormDialogProps> = ({basePath}) => {
    const navigate = useNavigate();
    const {action, recordId} = useParams();
    const isEdit = !!recordId;
    const [open, setOpen] = useState(false);
    const {data} = useTenant(recordId!);
    const createTenant = useCreateTenant();
    const updateTenant = useUpdateTenant(recordId!);
    const isValid = !recordId || (recordId && data?.id);

    const initialValues: ITenant = isEdit
        ? {
            name: data?.name ?? "",
            fqdn: data?.fqdn ?? "",
            stopgapDomainId: data?.stopgapDomainId ?? "",
            stopgapHostname: data?.stopgapHostname ?? "",
        }
        : emptyTenant;

    const closeDialog = () => {
        navigate(basePath);
    };

    const normalize = (values: ITenant): ITenant => ({
        ...values,
        fqdn: values.fqdn || null,
        stopgapDomainId: values.stopgapDomainId || null,
        stopgapHostname: values.stopgapHostname || null,
    });

    const handleSubmit = async (values: ITenant, actions: FormikHelpers<ITenant>) => {
        try {
            if (isEdit) {
                await updateTenant.mutateAsync(normalize(values));
            } else {
                await createTenant.mutateAsync(normalize(values));
            }
            closeDialog();
            actions.resetForm();
            actions.setStatus();
            toast.success("Tenant saved!");
        } catch (err: any) {
            if (err.response?.status === 422 && err.response.data?.detail) {
                actions.setErrors(mapFastApiErrorsToFormik(err.response.data.detail));
                toast.error("Tenant could not be saved!");
            } else {
                console.error(err);
                toast.error(err.message || "Tenant could not be saved!");
            }
            actions.setStatus("Tenant could not be saved!");
        }
        actions.setSubmitting(false);
    };

    useEffect(() => {
        setOpen(action === "create" || action === "update");
    }, [action]);

    return (
        <Dialog fullWidth maxWidth={isValid ? "sm" : "xs"} open={open} onClose={closeDialog}>
            <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                enableReinitialize
                validateOnChange={false}
                validateOnBlur={false}
                onSubmit={handleSubmit}
            >
                {form => (
                    <form onSubmit={form.handleSubmit} onReset={form.handleReset}>
                        <DialogTitle>
                            {recordId && !data?.id ? "Tenant Not Found!" : <>{isEdit ? "Update" : "Create"} Tenant</>}
                        </DialogTitle>
                        <DialogContent>
                            <DialogContentText>
                                {!isValid ? (
                                    <Typography variant="body1" color="error">
                                        No tenant could be found with the ID provided!
                                    </Typography>
                                ) : form.status ? (
                                    <Typography variant="body1" color="error">{form.status}</Typography>
                                ) : null}
                            </DialogContentText>
                            {isValid && (
                                <Stack spacing={3} marginTop={2}>
                                    <TextField
                                        label="Name"
                                        fullWidth
                                        {...form.getFieldProps("name")}
                                        error={form.errors.name !== undefined}
                                        helperText={form.errors.name?.toString()}
                                    />
                                    <TextField
                                        label="FQDN"
                                        fullWidth
                                        {...form.getFieldProps("fqdn")}
                                        error={form.errors.fqdn !== undefined}
                                        helperText={form.errors.fqdn?.toString()}
                                    />
                                    <TextField
                                        label="Stopgap Domain ID"
                                        fullWidth
                                        {...form.getFieldProps("stopgapDomainId")}
                                        error={form.errors.stopgapDomainId !== undefined}
                                        helperText={form.errors.stopgapDomainId?.toString()}
                                    />
                                    <TextField
                                        label="Stopgap Hostname"
                                        fullWidth
                                        {...form.getFieldProps("stopgapHostname")}
                                        error={form.errors.stopgapHostname !== undefined}
                                        helperText={form.errors.stopgapHostname?.toString()}
                                    />
                                </Stack>
                            )}
                        </DialogContent>
                        <DialogActions>
                            <Button variant="contained" color="error" type="reset" onClick={closeDialog}>
                                {isValid ? "Cancel" : "Close"}
                            </Button>
                            {isValid && (
                                <Button variant="contained" type="submit">
                                    {isEdit ? "Update" : "Create"} Tenant
                                </Button>
                            )}
                        </DialogActions>
                    </form>
                )}
            </Formik>
        </Dialog>
    );
};

export default FormDialog;
