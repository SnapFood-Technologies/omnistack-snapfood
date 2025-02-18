// api/batch.ts
import { createOmniGateway } from './index';
import {
    BatchParams,
    Batch,
    CreateBatchPayload,
    UpdateBatchPayload,
    BatchResponse,
    BatchMetrics
} from './types/batch';

export const createBatchApi = (clientApiKey: string) => {
    const omniGateway = createOmniGateway(clientApiKey);

    return {
        getBatches: async (params: BatchParams = {}): Promise<BatchResponse> => {
            const { data } = await omniGateway.get('/batches', { params });
            return data;
        },

        createBatch: async (batch: CreateBatchPayload): Promise<Batch> => {
            const { data } = await omniGateway.post('/batches', batch);
            return data;
        },

        getBatchById: async (id: string): Promise<Batch> => {
            const { data } = await omniGateway.get(`/batches/${id}`);
            return data;
        },

        updateBatch: async (id: string, batch: UpdateBatchPayload): Promise<Batch> => {
            const { data } = await omniGateway.put(`/batches/${id}`, batch);
            return data;
        },

        deactivateBatch: async (id: string): Promise<Batch> => {
            const { data } = await omniGateway.put(`/batches/${id}/deactivate`);
            return data;
        },

        deleteBatch: async (id: string): Promise<Batch> => {
            const { data } = await omniGateway.delete(`/batches/${id}`);
            return data;
        },

        getBatchesByProduct: async (productId: string): Promise<Batch[]> => {
            const { data } = await omniGateway.get(`/batches/product/${productId}`);
            return data;
        },

        getBatchesByWarehouse: async (warehouseId: string): Promise<Batch[]> => {
            const { data } = await omniGateway.get(`/batches/warehouse/${warehouseId}`);
            return data;
        },

        getActiveBatchesQuantity: async (productId: string, warehouseId: string): Promise<number> => {
            const { data } = await omniGateway.get('/batches/quantity', {
                params: { productId, warehouseId }
            });
            return data;
        },

        getBatchMetrics: async (): Promise<BatchMetrics> => {
            const { data } = await omniGateway.get('/batches/metrics');
            return data;
        }
    };
};