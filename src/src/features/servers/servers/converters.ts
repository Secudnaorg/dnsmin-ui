import {IServerInDTO, IServerOutDTO, IServersPagedResponseDTO} from "@app/features/servers/servers/dto";
import {IServer, IServersPaged} from "@app/features/servers/servers/models";

export function serverFromDTO(dto: IServerInDTO): IServer {
    return {
        id: dto.id,
        type: dto.type,
        mode: dto.mode,
        serverId: dto.server_id,
        version: dto.version,
        hostname: dto.hostname,
        apiUrl: dto.api_url,
        apiKey: dto.api_key,
        shared: dto.shared,
        createdAt: dto.created_at,
        updatedAt: dto.updated_at,
    }
}

export function serverToDTO(server: IServer): IServerOutDTO {
    return {
        id: server.id,
        type: server.type,
        mode: server.mode,
        server_id: server.serverId,
        version: server.version,
        hostname: server.hostname,
        api_url: server.apiUrl,
        api_key: server.apiKey,
        shared: server.shared,
    }
}

export function serversPagedFromDTO(dto: IServersPagedResponseDTO): IServersPaged {
    return {
        records: dto.records.map(serverFromDTO),
        total: dto.total,
        totalFiltered: dto.total_filtered,
    }
}