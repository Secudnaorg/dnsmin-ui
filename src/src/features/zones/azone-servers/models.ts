import {ModelBase} from "@app/types/models";
import {IZoneSyncPolicy} from "@app/features/sync/models";

export interface AZoneServer extends ModelBase {
    zoneId: string;
    serverId: string;
    tenantId?: string | null;
    state: string;
    syncPolicy: IZoneSyncPolicy | null;
    createdAt?: string | null;
    updatedAt?: string | null;
    synchronizedAt?: string | null;
}

export interface AZoneServersPaged extends ModelBase {
    records: AZoneServer[];
    total: number;
    totalFiltered: number;
}

export type IAZoneServer = AZoneServer;
export type IAZoneServersPaged = AZoneServersPaged;