import { Routes } from '@angular/router';

// dashboard
import { IndexComponent } from './index';
import { AnalyticsComponent } from './analytics';
import { FinanceComponent } from './finance';
import { CryptoComponent } from './crypto';

// widgets
import { WidgetsComponent } from './widgets';

// tables
import { TablesComponent } from './tables';

// font-icons
import { FontIconsComponent } from './font-icons';

// charts
import { ChartsComponent } from './charts';

// dragndrop
import { DragndropComponent } from './dragndrop';

// layouts
import { AppLayout } from './layouts/app-layout';
import { AuthLayout } from './layouts/auth-layout';

// pages
import { KnowledgeBaseComponent } from './pages/knowledge-base';
import { FaqComponent } from './pages/faq';
import { DispatchComponent } from './operaion/dispatch/dispatch';
import { DispatchManifestComponent } from './operaion/dispatch/dispatchmanifest';
import { ToWarehouseComponent } from './operaion/forwarding/towarehouse';
import { ToWarehouseManifestComponent } from './operaion/forwarding/towarehousemanifest';
import { ToBranchComponent } from './operaion/forwarding/tobranch';
import { ToBranchManifestComponent } from './operaion/forwarding/tobranchmanifest';
import { FromAgentComponent } from './operaion/receiving/fromAgent';
import { FromAgentManifestComponent } from './operaion/receiving/fromAgentManifest';
import { FromBranchManifestComponent } from './operaion/receiving/fromBranchManifest';
import { FromBranchComponent } from './operaion/receiving/fromBranch';
import { FromWarehouseComponent } from './operaion/receiving/fromWarehouse';
import { FromWarehouseManifestComponent } from './operaion/receiving/fromWarehouseManifest';
import { DispatchReportComponent } from './forms/dispatchReport';
import { HawbAllocationComponent } from './allocaion/hawbAllocation';
import { AgentAllocationComponent } from './allocaion/agentAllocation';
import { TrackingComponent } from './Utilities/Tracking';
export const routes: Routes = [
    { 
        path: '', 
        redirectTo: 'auth/login', 
        pathMatch: 'full' 
    },
    {
        path: '',
        component: AppLayout,
        children: [
            // dashboard
            { path: '', component: IndexComponent, title: 'Sales Admin | VRISTO - Multipurpose Tailwind Dashboard Template' },
            { path: 'analytics', component: AnalyticsComponent, title: 'Analytics Admin | VRISTO - Multipurpose Tailwind Dashboard Template' },
            { path: 'finance', component: FinanceComponent, title: 'Finance Admin | VRISTO - Multipurpose Tailwind Dashboard Template' },
            { path: 'crypto', component: CryptoComponent, title: 'Crypto Admin | VRISTO - Multipurpose Tailwind Dashboard Template' },
            { path:'Operation/DispatchManifest/:id' , component:DispatchManifestComponent},
            { path:'Operation/Dispatch' , component:DispatchComponent},
            { path:'Operation/ToBranch' , component:ToBranchComponent},
            { path:'Operation/ToBranchManifest/:id/:id2/:id3/:id4/:id5/:id6/:id7/:id8/:id9' , component:ToBranchManifestComponent},
            { path:'Operation/ToWarehouse' , component:ToWarehouseComponent},
            { path:'Operation/ToWarehouseManifest/:id/:id2/:id3/:id4/:id5/:id6/:id7/:id8/:id9' , component:ToWarehouseManifestComponent},
            { path:'Operation/FromWarehouse' , component:FromWarehouseComponent},
            { path:'Operation/FromWarehouseManifest/:id/:id2/:id3' , component:FromWarehouseManifestComponent},
            { path:'Operation/FromBranch' , component:FromBranchComponent},
            { path:'Operation/FromBranchManifest/:id/:id2/:id3' , component:FromBranchManifestComponent},
            { path:'Operation/FromAgent' , component:FromAgentComponent},
            { path:'Operation/FromAgentManifest/:id/:id2/:id3' , component:FromAgentManifestComponent},
            { path:'Layouts/DispatchReport' , component:DispatchReportComponent},
            { path:'HAWB/hawbAllocation' , component:HawbAllocationComponent},
            { path:'Agent/AgentAllocation' , component:AgentAllocationComponent},
            { path:'Utilities/tracking' , component:TrackingComponent},
            //apps
           
            //apps
            { path: '', loadChildren: () => import('./apps/apps.module').then((d) => d.AppsModule) },

            // widgets
            { path: 'widgets', component: WidgetsComponent, title: 'Widgets | VRISTO - Multipurpose Tailwind Dashboard Template' },

            // components
            { path: '', loadChildren: () => import('./components/components.module').then((d) => d.ComponentsModule) },
            { path: '', loadChildren: () => import('./UniversalMail/universel/universel.module').then((d) => d.UniverselModule) },
            { path: '', loadChildren: () => import('./warehouseShipment/warehouse-shipment/warehouse-shipment.module').then((d) => d.WarehouseShipmentModule) },
            { path: '', loadChildren: () => import('./Report/report.module').then((d) => d.ReportModule) },
            { path: '', loadChildren: () => import('./Incomplete/incomplete-booking/incomplete-booking.module').then((d) => d.IncompleteBookingModule) },

            // elements
            { path: '', loadChildren: () => import('./elements/elements.module').then((d) => d.ElementsModule) },
            //customerBookings
            { path: '', loadChildren: () => import('./CustomerBookings/customer-booking/customer-booking.module').then((d) => d.CustomerBookingModule) },
            { path: '', loadChildren: () => import('./Dispatch/dispatch/dispatch.module').then((d) => d.DispatchModule) },
            { path: '', loadChildren: () => import('./Notes/addnotes/addnotes.module').then((d) => d.AddnotesModule) },

            // forms
            { path: '', loadChildren: () => import('./forms/form.module').then((d) => d.FormModule) },

            // users
            { path: '', loadChildren: () => import('./users/user.module').then((d) => d.UsersModule) },

            // tables
            { path: 'tables', component: TablesComponent, title: 'Tables | VRISTO - Multipurpose Tailwind Dashboard Template' },
            { path: '', loadChildren: () => import('./datatables/datatables.module').then((d) => d.DatatablesModule) },

            // font-icons
            { path: 'font-icons', component: FontIconsComponent, title: 'Font Icons | VRISTO - Multipurpose Tailwind Dashboard Template' },

            // charts
            { path: 'charts', component: ChartsComponent, title: 'Charts | VRISTO - Multipurpose Tailwind Dashboard Template' },

            // dragndrop
            { path: 'dragndrop', component: DragndropComponent, title: 'Dragndrop | VRISTO - Multipurpose Tailwind Dashboard Template' },

            // pages
            { path: 'pages/knowledge-base', component: KnowledgeBaseComponent, title: 'Knowledge Base | VRISTO - Multipurpose Tailwind Dashboard Template' },
            { path: 'pages/faq', component: FaqComponent, title: 'FAQ | VRISTO - Multipurpose Tailwind Dashboard Template' },
        ],
    },

    {
        path: '',
        component: AuthLayout,
        children: [
            // pages
            { path: '', loadChildren: () => import('./pages/pages.module').then((d) => d.PagesModule) },

            // auth
            { path: '', loadChildren: () => import('./auth/auth.module').then((d) => d.AuthModule) },
        ],
    },
];
