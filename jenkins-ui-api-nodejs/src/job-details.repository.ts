import { EntityRepository, Repository } from 'typeorm';
import { JobDetails } from './job-details.entity';

@EntityRepository(JobDetails)
export class JobDetailsRepositoryRepository extends Repository<JobDetailsRepository> {}