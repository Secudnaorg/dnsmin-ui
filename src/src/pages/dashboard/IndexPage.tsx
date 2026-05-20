import * as React from "react";
import {Container, Grid} from '@mui/material';
import {useQuery} from "@tanstack/react-query";
import PageHeader from '@components/PageHeader';
import StatisticCard from '@components/cards/StatisticCard';
import {ListResourceParams} from "@app/types/api";
import {getApi} from "@app/utils/http";

interface ViewProps {
    basePath: string;
}

interface DashboardStats {
    tenants: number;
    clients: number;
    users: number;
    servers: number;
    zones: number;
    sessions: number;
}

const dashboardSearchParams: ListResourceParams = {
    filterModel: {
        logicOperator: "and",
        quickFilterValues: [],
    } as ListResourceParams["filterModel"],
    paginationModel: {
        page: 0,
        pageSize: 100,
    },
    sortModel: [],
};

interface SearchTotalResponse {
    total: number;
}

async function getCount(endpoint: string): Promise<number> {
    const response = await getApi().post<SearchTotalResponse>(
        endpoint,
        dashboardSearchParams,
        {timeout: 10000}
    );

    return response.data.total;
}

async function getDashboardStats(): Promise<DashboardStats> {
    return {
        tenants: await getCount("/tenants/search"),
        clients: await getCount("/auth/clients/search"),
        users: await getCount("/auth/users/search"),
        servers: await getCount("/servers/search"),
        zones: await getCount("/zones/authoritative/search"),
        sessions: await getCount("/auth/sessions/search"),
    };
}

const Page: React.FC<ViewProps> = () => {
    const {data, isLoading} = useQuery({
        queryKey: ["dashboard-stats"],
        queryFn: getDashboardStats,
        retry: 5,
        retryDelay: 1000,
    });

    const getValue = (value: number | undefined) => isLoading ? "..." : value ?? 0;

    return (
        <>
            <Container maxWidth={false} sx={{marginY: 2}}>
                <PageHeader title={'Dashboard'}/>
                <Grid container spacing={2}>
                    <Grid size={{sm: 12, md: 2}} display="flex" justifyContent="center">
                        <StatisticCard label="Total Tenants" value={getValue(data?.tenants)}/>
                    </Grid>
                    <Grid size={{sm: 12, md: 2}} display="flex" justifyContent="center">
                        <StatisticCard label="Total API Clients" value={getValue(data?.clients)}/>
                    </Grid>
                    <Grid size={{sm: 12, md: 2}} display="flex" justifyContent="center">
                        <StatisticCard label="Total Users" value={getValue(data?.users)}/>
                    </Grid>
                    <Grid size={{sm: 12, md: 2}} display="flex" justifyContent="center">
                        <StatisticCard label="Total Servers" value={getValue(data?.servers)}/>
                    </Grid>
                    <Grid size={{sm: 12, md: 2}} display="flex" justifyContent="center">
                        <StatisticCard label="Total Zones" value={getValue(data?.zones)}/>
                    </Grid>
                    <Grid size={{sm: 12, md: 2}} display="flex" justifyContent="center">
                        <StatisticCard label="Active Sessions" value={getValue(data?.sessions)}/>
                    </Grid>
                </Grid>
            </Container>
        </>
    );
};

export default Page;
