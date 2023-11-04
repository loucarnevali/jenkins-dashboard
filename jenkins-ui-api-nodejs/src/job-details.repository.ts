import { EntityRepository, Repository } from 'typeorm';
import { JobDetails } from './job-details.entity';

@EntityRepository(JobDetails)
export class JobDetailsRepository extends Repository<JobDetails> {}