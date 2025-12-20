import {getApi} from "@app/utils/http";
import {ListResourceParams} from "@app/types/api";
import {recordFromDTO, recordsPagedFromDTO, recordToDTO} from "@app/features/zones/rzone-records/converters";
import {IRZoneRecordInDTO, IRZoneRecordsPagedResponseDTO} from "@app/features/zones/rzone-records/dto";
import {IRZoneRecord, IRZoneRecordsPaged} from "@app/features/zones/rzone-records/models";

export const RZoneRecordsService = {
    async search(zoneId: string, req?: ListResourceParams): Promise<IRZoneRecordsPaged> {
        const params = req !== undefined ? {
            filterModel: req.filterModel,
            sortModel: req.sortModel,
            paginationModel: req.paginationModel,
        } : {};

        const response = await getApi().post<IRZoneRecordsPagedResponseDTO>(
            `/zones/recursive/${zoneId}/records/search`, params
        );

        return recordsPagedFromDTO(response.data);
    },

    async get(zoneId: string, id: string): Promise<IRZoneRecord> {
        const response = await getApi().get<IRZoneRecordInDTO>(`/zones/recursive/${zoneId}/records/${id}`);
        return recordFromDTO(response.data);
    },

    async create(zoneId: string, payload: Omit<IRZoneRecord, "id">): Promise<IRZoneRecord> {
        const dtoPayload = recordToDTO(payload as IRZoneRecord);
        const response = await getApi().post<IRZoneRecordInDTO>(`/zones/recursive/${zoneId}/records`, dtoPayload);
        return recordFromDTO(response.data);
    },

    async update(zoneId: string, id: string, payload: Partial<IRZoneRecord>): Promise<IRZoneRecord> {
        const dtoPayload = recordToDTO(payload as IRZoneRecord);
        const response = await getApi().put<IRZoneRecordInDTO>(`/zones/recursive/${zoneId}/records/${id}`, dtoPayload);
        return recordFromDTO(response.data);
    },

    async remove(zoneId: string, id: string): Promise<void> {
        await getApi().delete(`/zones/recursive/${zoneId}/records/${id}`);
    },
};