import {getApi} from "@app/utils/http";
import {ListResourceParams} from "@app/types/api";
import {cryptoKeyFromDTO, cryptoKeysPagedFromDTO, cryptoKeyToDTO} from "@app/features/zones/azone-crypto-keys/converters";
import {ICryptoKeyInDTO, ICryptoKeysPagedResponseDTO} from "@app/features/zones/azone-crypto-keys/dto";
import {IAZoneCryptoKey, IAZoneCryptoKeysPaged} from "@app/features/zones/azone-crypto-keys/models";

export const AZoneCryptoKeysService = {
    async search(zoneId: string, req?: ListResourceParams): Promise<IAZoneCryptoKeysPaged> {
        const params = req !== undefined ? {
            filterModel: req.filterModel,
            sortModel: req.sortModel,
            paginationModel: req.paginationModel,
        } : {};

        const response = await getApi().post<ICryptoKeysPagedResponseDTO>(
            `/zones/authoritative/${zoneId}/crypto-keys/search`, params
        );

        return cryptoKeysPagedFromDTO(response.data);
    },

    async get(zoneId: string, id: string): Promise<IAZoneCryptoKey> {
        const response = await getApi().get<ICryptoKeyInDTO>(`/zones/authoritative/${zoneId}/crypto-keys/${id}`);
        return cryptoKeyFromDTO(response.data);
    },

    async create(zoneId: string, payload: Omit<IAZoneCryptoKey, "id">): Promise<IAZoneCryptoKey> {
        const dtoPayload = cryptoKeyToDTO(payload as IAZoneCryptoKey);
        const response = await getApi().post<ICryptoKeyInDTO>(`/zones/authoritative/${zoneId}/crypto-keys`, dtoPayload);
        return cryptoKeyFromDTO(response.data);
    },

    async update(zoneId: string, id: string, payload: Partial<IAZoneCryptoKey>): Promise<IAZoneCryptoKey> {
        const dtoPayload = cryptoKeyToDTO(payload as IAZoneCryptoKey);
        const response = await getApi().put<ICryptoKeyInDTO>(`/zones/authoritative/${zoneId}/crypto-keys/${id}`, dtoPayload);
        return cryptoKeyFromDTO(response.data);
    },

    async remove(zoneId: string, id: string): Promise<void> {
        await getApi().delete(`/zones/authoritative/${zoneId}/crypto-keys/${id}`);
    },
};