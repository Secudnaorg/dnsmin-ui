import * as React from "react";
import {useEffect, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
import {toast} from "react-toastify";
import {Formik, FormikHelpers} from "formik";
import {boolean, number, object, string} from "yup";
import {
    Button,
    Checkbox,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    FormControl,
    FormControlLabel,
    FormHelperText,
    InputLabel,
    MenuItem,
    Select,
    Stack,
    TextField,
    Typography,
} from "@mui/material";
import {useAZone, useCreateAZone, useUpdateAZone} from "@app/features/zones/azones/hooks";
import {IAZone} from "@app/features/zones/azones/models";
import {mapFastApiErrorsToFormik} from "@app/utils/fastapi-formik";

type FormDialogProps = {
    basePath: string;
};

const validationSchema = object({
    tenantId: string().nullable(),
    viewId: string().nullable(),
    fqdn: string()
        .required("FQDN is required.")
        .max(253, "FQDN must be at most 253 characters."),
    kind: string()
        .required("Type is required.")
        .oneOf(["Native", "Master", "Slave", "Producer", "Consumer"]),
    serial: number()
        .required("Serial is required.")
        .min(0, "Serial must be zero or greater."),
    dnssec: boolean().required(),
    shared: boolean().required(),
});

const emptyZone: IAZone = {
    tenantId: "",
    viewId: "",
    fqdn: "",
    kind: "Native",
    serial: 1,
    dnssec: false,
    shared: false,
};

export const FormDialog: React.FC<FormDialogProps> = ({basePath}) => {
    const navigate = useNavigate();
    const {action, recordId} = useParams();
    const isEdit = !!recordId;
    const [open, setOpen] = useState(false);
    const {data} = useAZone(recordId!);
    const createZone = useCreateAZone();
    const updateZone = useUpdateAZone(recordId!);
    const isValid = !recordId || (recordId && data?.id);

    const initialValues: IAZone = isEdit
        ? {
            tenantId: data?.tenantId ?? "",
            viewId: data?.viewId ?? "",
            fqdn: data?.fqdn ?? "",
            kind: data?.kind ?? "Native",
            serial: data?.serial ?? 1,
            dnssec: data?.dnssec ?? false,
            shared: data?.shared ?? false,
        }
        : emptyZone;

    const closeDialog = () => {
        navigate(basePath);
    };

    const normalize = (values: IAZone): IAZone => ({
        ...values,
        tenantId: values.tenantId || null,
        viewId: values.viewId || null,
        serial: Number(values.serial),
    });

    const handleSubmit = async (values: IAZone, actions: FormikHelpers<IAZone>) => {
        try {
            if (isEdit) {
                await updateZone.mutateAsync(normalize(values));
            } else {
                await createZone.mutateAsync(normalize(values));
            }
            closeDialog();
            actions.resetForm();
            actions.setStatus();
            toast.success("Zone saved!");
        } catch (err: any) {
            if (err.response?.status === 422 && err.response.data?.detail) {
                actions.setErrors(mapFastApiErrorsToFormik(err.response.data.detail));
                toast.error("Zone could not be saved!");
            } else {
                console.error(err);
                toast.error(err.message || "Zone could not be saved!");
            }
            actions.setStatus("Zone could not be saved!");
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
                            {recordId && !data?.id ? "Zone Not Found!" : <>{isEdit ? "Update" : "Create"} Zone</>}
                        </DialogTitle>
                        <DialogContent>
                            <DialogContentText>
                                {!isValid ? (
                                    <Typography variant="body1" color="error">
                                        No zone could be found with the ID provided!
                                    </Typography>
                                ) : form.status ? (
                                    <Typography variant="body1" color="error">{form.status}</Typography>
                                ) : null}
                            </DialogContentText>
                            {isValid && (
                                <Stack spacing={3} marginTop={2}>
                                    <TextField
                                        label="FQDN"
                                        fullWidth
                                        {...form.getFieldProps("fqdn")}
                                        error={form.errors.fqdn !== undefined}
                                        helperText={form.errors.fqdn?.toString()}
                                    />
                                    <FormControl fullWidth>
                                        <InputLabel id="zone-kind-label">Type</InputLabel>
                                        <Select
                                            labelId="zone-kind-label"
                                            label="Type"
                                            {...form.getFieldProps("kind")}
                                            error={form.errors.kind !== undefined}
                                        >
                                            <MenuItem value="Native">Native</MenuItem>
                                            <MenuItem value="Master">Master</MenuItem>
                                            <MenuItem value="Slave">Slave</MenuItem>
                                            <MenuItem value="Producer">Producer</MenuItem>
                                            <MenuItem value="Consumer">Consumer</MenuItem>
                                        </Select>
                                        <FormHelperText>{form.errors.kind?.toString()}</FormHelperText>
                                    </FormControl>
                                    <TextField
                                        label="Serial"
                                        type="number"
                                        fullWidth
                                        {...form.getFieldProps("serial")}
                                        onChange={(event) => form.setFieldValue("serial", Number(event.target.value))}
                                        error={form.errors.serial !== undefined}
                                        helperText={form.errors.serial?.toString()}
                                    />
                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                checked={Boolean(form.values.dnssec)}
                                                onChange={(event) => form.setFieldValue("dnssec", event.target.checked)}
                                            />
                                        }
                                        label="DNSSEC"
                                    />
                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                checked={Boolean(form.values.shared)}
                                                onChange={(event) => form.setFieldValue("shared", event.target.checked)}
                                            />
                                        }
                                        label="Shared"
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
                                    {isEdit ? "Update" : "Create"} Zone
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
