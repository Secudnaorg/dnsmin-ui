import {BaseDTO} from "@app/types/dto";

export interface AZoneServerInDTO extends BaseDTO {
    zone_id: string;
    server_id: string;
    tenant_id: string | null;
    state: string;
    created_at: string;
    updated_at: string | null;
}

export interface AZoneServerOutDTO extends BaseDTO {
    zone_id: string;
    server_id: string;
    tenant_id?: string | null;
    state: string;
}

export interface AZoneServersPagedResponseDTO extends BaseDTO {
    records: AZoneServerInDTO[];
    total: number;
    total_filtered: number;
}

export type IAZoneServerInDTO = AZoneServerInDTO;
export type IAZoneServerOutDTO = AZoneServerOutDTO;
export type IAZoneServersPagedResponseDTO = AZoneServersPagedResponseDTO;