import * as React from "react";
import {useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
import {Button, Grid, Stack, Typography} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import {
    DataGridPro,
    GridActionsCellItem,
    GridColDef,
    GridFilterModel,
    GridLogicOperator,
    GridPaginationModel,
    GridSortModel,
} from "@mui/x-data-grid-pro";
import {useAZone} from "@app/features/zones/azones/hooks";
import {useAZoneRecords} from "@app/features/zones/azone-records/hooks";
import PageHeader from "@components/PageHeader";
import StatisticCard from "@components/cards/StatisticCard";
import FormDialog from "@app/features/zones/azone-records/components/FormDialog";
import DeleteDialog from "@app/features/zones/azone-records/components/DeleteDialog";

interface ViewProps {
    basePath: string;
}

const ListView = (_props: ViewProps) => {
    const navigate = useNavigate();
    const {zoneId} = useParams();
    const recordsBasePath = `/zones/authoritative/${zoneId}/records`;
    const zonesBasePath = "/zones/authoritative";

    const [filterModel, setFilterModel] = useState<GridFilterModel>({
        items: [],
        quickFilterValues: [],
        logicOperator: GridLogicOperator.And,
    });
    const [sortModel, setSortModel] = useState<GridSortModel>([]);
    const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({page: 0, pageSize: 10});

    const {data: zone} = useAZone(zoneId!);
    const {data, isLoading} = useAZoneRecords(zoneId!, {filterModel, sortModel, paginationModel});

    const isFilteringActive = React.useMemo(() => {
        return filterModel.items.length > 0 || (filterModel.quickFilterValues?.length ?? 0) > 0;
    }, [filterModel]);

    const columns: readonly GridColDef<any>[] = [
        {field: "name", headerName: "Name", width: 180, valueGetter: (_value, row) => row.name || "@"},
        {field: "type", headerName: "Type", width: 110},
        {field: "ttl", headerName: "TTL", width: 110},
        {field: "content", headerName: "Content", minWidth: 260, flex: 1},
        {field: "disabled", headerName: "Disabled", width: 120},
        {field: "comment", headerName: "Comment", width: 220},
        {field: "createdAt", headerName: "Created", width: 175},
        {field: "updatedAt", headerName: "Updated", width: 175},
        {
            field: "actions",
            type: "actions",
            headerName: "Actions",
            width: 100,
            getActions: (params) => [
                <GridActionsCellItem
                    key="edit"
                    icon={<EditIcon/>}
                    label="Edit"
                    onClick={() => navigate(`${recordsBasePath}/${params.row.id}/update`)}
                    showInMenu
                />,
                <GridActionsCellItem
                    key="delete"
                    icon={<DeleteIcon/>}
                    label="Delete"
                    onClick={() => navigate(`${recordsBasePath}/${params.row.id}/delete`)}
                    showInMenu
                />,
            ],
        },
    ];

    return (
        <>
            <PageHeader title="DNS Records"/>
            <Stack direction="row" alignItems="center" spacing={2} marginBottom={2}>
                <Button startIcon={<ArrowBackIcon/>} onClick={() => navigate(zonesBasePath)}>
                    Back to Zones
                </Button>
                <Typography variant="h6">{zone?.fqdn ?? ""}</Typography>
            </Stack>
            <Grid container justifyContent="space-between">
                <Grid size={{sm: 12, md: 6, lg: 4}} paddingY={2}>
                    <Grid container spacing={2}>
                        <Grid size={{sm: 12, md: 6}}>
                            <StatisticCard label="Total Records" value={data?.total}/>
                        </Grid>
                        {isFilteringActive && (
                            <Grid size={{sm: 12, md: 6}}>
                                <StatisticCard label="Total Results" value={data?.totalFiltered}/>
                            </Grid>
                        )}
                    </Grid>
                </Grid>
                <Grid size={{sm: 12, md: 3, lg: 2}} paddingY={2} display="flex" justifyContent="flex-end"
                      alignItems="flex-end">
                    <Button variant="contained" onClick={() => navigate(`${recordsBasePath}/create`)}>
                        Create Record
                    </Button>
                </Grid>
                <Grid size={12}>
                    <DataGridPro
                        autoHeight
                        loading={isLoading}
                        columns={columns}
                        rows={data?.records ?? []}
                        getRowId={(row) => row.id}
                        rowCount={data?.totalFiltered ?? 0}
                        filterMode="server"
                        sortingMode="server"
                        paginationMode="server"
                        pagination
                        pageSizeOptions={[5, 10, 25, 50, 100]}
                        filterModel={filterModel}
                        sortModel={sortModel}
                        paginationModel={paginationModel}
                        onFilterModelChange={(model) => setFilterModel(model)}
                        onSortModelChange={(model) => setSortModel(model)}
                        onPaginationModelChange={(model) => setPaginationModel(model)}
                        initialState={{
                            pinnedColumns: {
                                right: ["actions"],
                            },
                        }}
                    />
                </Grid>
            </Grid>
            {zoneId && (
                <>
                    <FormDialog basePath={recordsBasePath} zoneId={zoneId}/>
                    <DeleteDialog basePath={recordsBasePath} zoneId={zoneId}/>
                </>
            )}
        </>
    );
};

export default ListView;
