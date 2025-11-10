import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';

@Injectable()
export class JobsService {
  constructor(@InjectQueue('reports') private reportsQueue: Queue) {}

  async generateReport(type: string, data: any) {
    const job = await this.reportsQueue.add('generate-report', {
      type,
      data,
      timestamp: new Date(),
    });
    return { jobId: job.id, status: 'queued' };
  }
}
