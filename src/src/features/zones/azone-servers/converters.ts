import {IAZoneServerInDTO, IAZoneServerOutDTO, IAZoneServersPagedResponseDTO} from "@app/features/zones/azone-servers/dto";
import {IAZoneServer, IAZoneServersPaged} from "@app/features/zones/azone-servers/models";
import {zoneSyncPolicyFromDTO, zoneSyncPolicyToDTO} from "@app/features/sync/converters";

export function zoneServerFromDTO(dto: IAZoneServerInDTO): IAZoneServer {
    return {
        zoneId: dto.zone_id,
        serverId: dto.server_id,
        tenantId: dto.tenant_id,
        state: dto.state,
        syncPolicy: zoneSyncPolicyFromDTO(dto.sync_policy),
        createdAt: dto.created_at,
        updatedAt: dto.updated_at,
        synchronizedAt: dto.synchronized_at,
    }
}

export function zoneServerToDTO(zoneServer: IAZoneServer): IAZoneServerOutDTO {
    return {
        zone_id: zoneServer.zoneId,
        server_id: zoneServer.serverId,
        tenant_id: zoneServer.tenantId,
        state: zoneServer.state,
        sync_policy: zoneSyncPolicyToDTO(zoneServer.syncPolicy),
    }
}

export function zoneServersPagedFromDTO(dto: IAZoneServersPagedResponseDTO): IAZoneServersPaged {
    return {
        records: dto.records.map(zoneServerFromDTO),
        total: dto.total,
        totalFiltered: dto.total_filtered,
    }
}