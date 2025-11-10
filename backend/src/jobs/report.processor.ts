import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';

@Processor('reports')
export class ReportProcessor extends WorkerHost {
  async process(job: Job): Promise<any> {
    console.log(`📊 Processing report job: ${job.id}`);
    console.log(`Report type: ${job.data.type}`);
    
    // Simulate report generation
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    console.log(`✅ Report ${job.id} generated successfully`);
    return { success: true, reportId: job.id };
  }
}
