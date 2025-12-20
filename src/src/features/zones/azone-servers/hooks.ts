import {useQuery, useQueryClient, useMutation} from "@tanstack/react-query";
import {ListResourceParams} from "@app/types/api";
import {AZoneServersService} from "@app/features/zones/azone-servers/service";
import {IAZoneServer} from "@app/features/zones/azone-servers/models";

export function useAZoneServer(zoneId: string, id: string) {
    return useQuery({
        queryKey: ["zones-azone-server", id],
        queryFn: () => AZoneServersService.get(zoneId, id),
        enabled: !!id,
    });
}

export function useAZoneServers(zoneId: string, params?: ListResourceParams) {
    return useQuery({
        queryKey: ["zones-azone-servers", params],
        queryFn: () => AZoneServersService.search(zoneId, params),
        placeholderData: (previousData) => previousData,
    });
}

export function useCreateAZoneServer(zoneId: string) {
    const qc = useQueryClient();

    return useMutation({
        mutationFn: (payload: IAZoneServer) => AZoneServersService.create(zoneId, payload),
        onSuccess: () => {
            qc.invalidateQueries({queryKey: ["zones-azone-servers"]});
        }
    });
}

export function useUpdateAZoneServer(zoneId: string, id: string) {
    const qc = useQueryClient();

    return useMutation({
        mutationFn: (payload: Partial<IAZoneServer>) => AZoneServersService.update(zoneId, id, payload),
        onSuccess: () => {
            qc.invalidateQueries({queryKey: ["zones-azone-servers"]});
            qc.invalidateQueries({queryKey: ["zones-azone-server", id]});
        }
    });
}

export function useDeleteAZoneServer(zoneId: string) {
    const qc = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => AZoneServersService.remove(zoneId, id),
        onSuccess: () => {
            qc.invalidateQueries({queryKey: ["zones-azone-servers"]});
        }
    });
}
