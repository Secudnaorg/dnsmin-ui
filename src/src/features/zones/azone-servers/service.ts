import {getApi} from "@app/utils/http";
import {ListResourceParams} from "@app/types/api";
import {zoneServerFromDTO, zoneServersPagedFromDTO, zoneServerToDTO} from "@app/features/zones/azone-servers/converters";
import {IAZoneServerInDTO, IAZoneServersPagedResponseDTO} from "@app/features/zones/azone-servers/dto";
import {IAZoneServer, IAZoneServersPaged} from "@app/features/zones/azone-servers/models";

export const AZoneServersService = {
    async search(zoneId: string, req?: ListResourceParams): Promise<IAZoneServersPaged> {
        const params = req !== undefined ? {
            filterModel: req.filterModel,
            sortModel: req.sortModel,
            paginationModel: req.paginationModel,
        } : {};

        const response = await getApi().post<IAZoneServersPagedResponseDTO>(
            `/zones/authoritative/${zoneId}/servers/search`, params
        );

        return zoneServersPagedFromDTO(response.data);
    },

    async get(zoneId: string, serverId: string): Promise<IAZoneServer> {
        const response = await getApi().get<IAZoneServerInDTO>(`/zones/authoritative/${zoneId}/servers/${serverId}`);
        return zoneServerFromDTO(response.data);
    },

    async create(zoneId: string, payload: IAZoneServer): Promise<IAZoneServer> {
        const dtoPayload = zoneServerToDTO(payload as IAZoneServer);
        const response = await getApi().post<IAZoneServerInDTO>(`/zones/authoritative/${zoneId}/servers`, dtoPayload);
        return zoneServerFromDTO(response.data);
    },

    async update(zoneId: string, serverId: string, payload: Partial<IAZoneServer>): Promise<IAZoneServer> {
        const dtoPayload = zoneServerToDTO(payload as IAZoneServer);
        const response = await getApi().put<IAZoneServerInDTO>(`/zones/authoritative/${zoneId}/servers/${serverId}`, dtoPayload);
        return zoneServerFromDTO(response.data);
    },

    async remove(zoneId: string, serverId: string): Promise<void> {
        await getApi().delete(`/zones/authoritative/${zoneId}/servers/${serverId}`);
    },
};