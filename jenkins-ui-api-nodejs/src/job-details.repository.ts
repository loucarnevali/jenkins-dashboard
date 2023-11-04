import { EntityRepository, Repository } from 'typeorm';
import { JobDetailsEntity } from './job-details.entity';

@EntityRepository(JobDetailsEntity)
export class JobDetailsRepositoryRepository extends Repository<JobDetailsEntity> {}