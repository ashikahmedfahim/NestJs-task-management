import { TaskStatus } from "../task.model";

export class GetTasksFilterDto{
  string?: TaskStatus;
  search?: string;
}