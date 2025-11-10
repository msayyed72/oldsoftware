import { Queue } from 'bullmq';
export declare class JobsService {
    private reportsQueue;
    constructor(reportsQueue: Queue);
    generateReport(type: string, data: any): Promise<{
        jobId: string;
        status: string;
    }>;
}
