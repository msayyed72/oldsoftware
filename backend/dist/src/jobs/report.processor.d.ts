import { WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
export declare class ReportProcessor extends WorkerHost {
    process(job: Job): Promise<any>;
}
