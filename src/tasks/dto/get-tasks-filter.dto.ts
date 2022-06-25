import { IsOptional } from 'class-validator';
import { TaskStatus } from '../task-status.model';

export class GetTasksFilterDto {
  @IsOptional()
  status?: TaskStatus;

  @IsOptional()
  search?: string;
}
