import * as React from "react";
import {Routes, Route, Outlet} from "react-router-dom";
import PrivateRoute from "@app/routes/PrivateRoute";
import UserLayout from "@layouts/user/Layout";
import PageTitle from "@components/PageTitle";
import SubNavigation from "@components/SubNavigation";
import SettingsIndexPage from "@pages/settings/IndexPage";

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
    {path: '/', component: SettingsIndexPage, title: 'Settings Management'},
    {path: '/ui', component: SettingsIndexPage, title: 'User Interface Settings'},
    {path: '/registration', component: SettingsIndexPage, title: 'Registration Settings'},
    {path: '/authentication', component: SettingsIndexPage, title: 'Authentication Settings'},
    {path: '/synchronization', component: SettingsIndexPage, title: 'Synchronization Settings'},
];

const Router: React.FC<RouterProps> = ({basePath}) => {
    return (
        <>
            <Routes>
                <Route element={<PrivateRoute/>}>
                    <Route element={<UserLayout/>}>
                        <Route element={
                            <>
                                <SubNavigation baseNavKey={'settings'}/>
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
