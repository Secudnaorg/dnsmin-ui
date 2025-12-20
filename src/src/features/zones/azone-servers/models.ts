import {ModelBase} from "@app/types/models";

export interface AZoneServer extends ModelBase {
    zoneId: string;
    serverId: string;
    tenantId?: string | null;
    state: string;
    createdAt?: string | null;
    updatedAt?: string | null;
}

export interface AZoneServersPaged extends ModelBase {
    records: AZoneServer[];
    total: number;
    totalFiltered: number;
}

export type IAZoneServer = AZoneServer;
export type IAZoneServersPaged = AZoneServersPaged;