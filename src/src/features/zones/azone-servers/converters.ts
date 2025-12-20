import {IAZoneServerInDTO, IAZoneServerOutDTO, IAZoneServersPagedResponseDTO} from "@app/features/zones/azone-servers/dto";
import {IAZoneServer, IAZoneServersPaged} from "@app/features/zones/azone-servers/models";

export function zoneServerFromDTO(dto: IAZoneServerInDTO): IAZoneServer {
    return {
        zoneId: dto.zone_id,
        serverId: dto.server_id,
        tenantId: dto.tenant_id,
        state: dto.state,
        createdAt: dto.created_at,
        updatedAt: dto.updated_at,
    }
}

export function zoneServerToDTO(zoneServer: IAZoneServer): IAZoneServerOutDTO {
    return {
        zone_id: zoneServer.zoneId,
        server_id: zoneServer.serverId,
        tenant_id: zoneServer.tenantId,
        state: zoneServer.state,
    }
}

export function zoneServersPagedFromDTO(dto: IAZoneServersPagedResponseDTO): IAZoneServersPaged {
    return {
        records: dto.records.map(zoneServerFromDTO),
        total: dto.total,
        totalFiltered: dto.total_filtered,
    }
}