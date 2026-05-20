import * as React from "react";
import {Routes, Route, Outlet} from "react-router-dom";
import PrivateRoute from "@app/routes/PrivateRoute";
import UserLayout from "@layouts/user/Layout";
import PageTitle from "@components/PageTitle";
import SubNavigation from "@components/SubNavigation";
import ZonesIndexPage from "@pages/zones/IndexPage";
import AuthoritativeListView from "@app/features/zones/azones/views/ListView";
import AuthoritativeRecordsListView from "@app/features/zones/azone-records/views/ListView";
import RecursiveListView from "@app/features/zones/rzones/views/ListView";

interface RouterProps {
    basePath: string;
}

interface RouterRoute {
    path: string;
    title?: string;
    basePath?: string;
    component: React.ElementType;
}

const routes: RouterRoute[] = [
    {path: '/', component: ZonesIndexPage, title: 'Zones Management'},
    {path: '/authoritative', basePath: '/authoritative', component: AuthoritativeListView, title: 'Authoritative Zones'},
    {
        path: '/authoritative/:action',
        basePath: '/authoritative',
        component: AuthoritativeListView,
        title: 'Create Authoritative Zone - Authoritative Zones'
    },
    {
        path: '/authoritative/:recordId/:action',
        basePath: '/authoritative',
        component: AuthoritativeListView,
        title: 'Update Authoritative Zone - Authoritative Zones'
    },
    {
        path: '/authoritative/:recordId/:action',
        basePath: '/authoritative',
        component: AuthoritativeListView,
        title: 'Delete Authoritative Zone - Authoritative Zones'
    },
    {
        path: '/authoritative/:zoneId/records',
        basePath: '/authoritative/:zoneId/records',
        component: AuthoritativeRecordsListView,
        title: 'DNS Records - Authoritative Zones'
    },
    {
        path: '/authoritative/:zoneId/records/:action',
        basePath: '/authoritative/:zoneId/records',
        component: AuthoritativeRecordsListView,
        title: 'Create DNS Record - Authoritative Zones'
    },
    {
        path: '/authoritative/:zoneId/records/:recordId/:action',
        basePath: '/authoritative/:zoneId/records',
        component: AuthoritativeRecordsListView,
        title: 'Update DNS Record - Authoritative Zones'
    },
    {path: '/recursive', basePath: '/recursive', component: RecursiveListView, title: 'Recursive Zones'},
];

const Router: React.FC<RouterProps> = ({basePath}) => {
    return (
        <>
            <Routes>
                <Route element={<PrivateRoute/>}>
                    <Route element={<UserLayout/>}>
                        <Route element={
                            <>
                                <SubNavigation baseNavKey={'zones'}/>
                                <Outlet/>
                            </>
                        }>
                            {routes.map((route, index) => (
                                <Route key={index} path={route.path}
                                       element={route?.title ? (
                                           <PageTitle title={route.title}>
                                               <route.component
                                                   basePath={basePath + (route?.basePath ? route.basePath : '')}/>
                                           </PageTitle>
                                       ) : (
                                           <>
                                               <route.component
                                                   basePath={basePath + (route?.basePath ? route.basePath : '')}/>
                                           </>
                                       )}
                                />
                            ))}
                        </Route>
                    </Route>
                </Route>
            </Routes>
        </>
    );
};

export default Router;
