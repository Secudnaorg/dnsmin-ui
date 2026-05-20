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
import {
    useAZoneRecord,
    useCreateAZoneRecord,
    useUpdateAZoneRecord,
} from "@app/features/zones/azone-records/hooks";
import {IAZoneRecord} from "@app/features/zones/azone-records/models";
import {mapFastApiErrorsToFormik} from "@app/utils/fastapi-formik";

type FormDialogProps = {
    basePath: string;
    zoneId: string;
};

const recordTypes = ["A", "AAAA", "CNAME", "MX", "NS", "PTR", "SRV", "TXT", "CAA"];

const validationSchema = object({
    name: string().nullable().max(255, "Name must be at most 255 characters."),
    type: string().required("Type is required.").oneOf(recordTypes),
    ttl: number().required("TTL is required.").min(0, "TTL must be zero or greater."),
    content: string().required("Content is required."),
    comment: string().nullable(),
    disabled: boolean().required(),
});

const emptyRecord = (zoneId: string): IAZoneRecord => ({
    zoneId,
    name: "",
    type: "A",
    ttl: 3600,
    content: "",
    comment: "",
    disabled: false,
});

export const FormDialog: React.FC<FormDialogProps> = ({basePath, zoneId}) => {
    const navigate = useNavigate();
    const {action, recordId} = useParams();
    const isEdit = !!recordId;
    const [open, setOpen] = useState(false);
    const {data} = useAZoneRecord(zoneId, recordId!);
    const createRecord = useCreateAZoneRecord(zoneId);
    const updateRecord = useUpdateAZoneRecord(zoneId, recordId!);
    const isValid = !recordId || (recordId && data?.id);

    const initialValues: IAZoneRecord = isEdit
        ? {
            zoneId,
            name: data?.name ?? "",
            type: data?.type ?? "A",
            ttl: data?.ttl ?? 3600,
            content: data?.content ?? "",
            comment: data?.comment ?? "",
            disabled: data?.disabled ?? false,
        }
        : emptyRecord(zoneId);

    const closeDialog = () => {
        navigate(basePath);
    };

    const normalize = (values: IAZoneRecord): IAZoneRecord => ({
        ...values,
        zoneId,
        tenantId: null,
        viewId: null,
        name: values.name?.trim() || "",
        ttl: Number(values.ttl),
        content: values.content?.trim() || "",
        comment: values.comment?.trim() || null,
    });

    const handleSubmit = async (values: IAZoneRecord, actions: FormikHelpers<IAZoneRecord>) => {
        try {
            if (isEdit) {
                await updateRecord.mutateAsync(normalize(values));
            } else {
                await createRecord.mutateAsync(normalize(values));
            }
            closeDialog();
            actions.resetForm();
            actions.setStatus();
            toast.success("Record saved!");
        } catch (err: any) {
            if (err.response?.status === 422 && err.response.data?.detail) {
                actions.setErrors(mapFastApiErrorsToFormik(err.response.data.detail));
                toast.error("Record could not be saved!");
            } else {
                console.error(err);
                toast.error(err.message || "Record could not be saved!");
            }
            actions.setStatus("Record could not be saved!");
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
                            {recordId && !data?.id ? "Record Not Found!" : <>{isEdit ? "Update" : "Create"} Record</>}
                        </DialogTitle>
                        <DialogContent>
                            <DialogContentText>
                                {!isValid ? (
                                    <Typography variant="body1" color="error">
                                        No record could be found with the ID provided.
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
                                        placeholder="@, www, api"
                                        {...form.getFieldProps("name")}
                                        error={form.errors.name !== undefined}
                                        helperText={form.errors.name?.toString() || "Use blank or @ for the zone apex."}
                                    />
                                    <FormControl fullWidth>
                                        <InputLabel id="record-type-label">Type</InputLabel>
                                        <Select
                                            labelId="record-type-label"
                                            label="Type"
                                            {...form.getFieldProps("type")}
                                            error={form.errors.type !== undefined}
                                        >
                                            {recordTypes.map(type => (
                                                <MenuItem key={type} value={type}>{type}</MenuItem>
                                            ))}
                                        </Select>
                                        <FormHelperText>{form.errors.type?.toString()}</FormHelperText>
                                    </FormControl>
                                    <TextField
                                        label="TTL"
                                        type="number"
                                        fullWidth
                                        {...form.getFieldProps("ttl")}
                                        onChange={(event) => form.setFieldValue("ttl", Number(event.target.value))}
                                        error={form.errors.ttl !== undefined}
                                        helperText={form.errors.ttl?.toString()}
                                    />
                                    <TextField
                                        label="Content"
                                        fullWidth
                                        {...form.getFieldProps("content")}
                                        error={form.errors.content !== undefined}
                                        helperText={form.errors.content?.toString()}
                                    />
                                    <TextField
                                        label="Comment"
                                        fullWidth
                                        multiline
                                        minRows={2}
                                        {...form.getFieldProps("comment")}
                                        error={form.errors.comment !== undefined}
                                        helperText={form.errors.comment?.toString()}
                                    />
                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                checked={Boolean(form.values.disabled)}
                                                onChange={(event) => form.setFieldValue("disabled", event.target.checked)}
                                            />
                                        }
                                        label="Disabled"
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
                                    {isEdit ? "Update" : "Create"} Record
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
