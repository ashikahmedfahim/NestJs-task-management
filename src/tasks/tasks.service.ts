import { Injectable, NotFoundException } from '@nestjs/common';
import { TaskStatus } from './task-status.model';
import { v4 as uuid } from 'uuid';
import { TasksRepository } from './tasks.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './task.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(TasksRepository)
    private tasksRepository: TasksRepository,
  ) {}

  async getAllTasks(getTasksFilterDto: GetTasksFilterDto): Promise<Task[]> {
    const { status, search } = getTasksFilterDto;
    const query = await this.tasksRepository.createQueryBuilder('task');

    if (status) {
      query.andWhere('task.status = :status', { status });
    }

    if (search) {
      query.andWhere(
        'task.title LIKE :search OR task.description LIKE :search',
        { search: `%${search}%` },
      );
    }
    
    const tasks = await query.getMany();
    return tasks;
  }

  async getSingleTask(id: uuid): Promise<Task> {
    const task = await this.tasksRepository.findOne(id);
    if (!task) throw new NotFoundException();
    return task;
  }

  async createTask(createTaskDto: CreateTaskDto): Promise<Task> {
    const { title, description } = createTaskDto;
    const task = this.tasksRepository.create({
      title: title,
      description: description,
      status: TaskStatus.OPEN,
    });
    await this.tasksRepository.save(task);
    return task;
  }

  async updateTaskStatus(id: uuid, status: TaskStatus): Promise<Task> {
    const task = await this.getSingleTask(id);
    task.status = status;
    await this.tasksRepository.save(task);
    return task;
  }

  async deleteTask(id: string): Promise<void> {
    const result = await this.tasksRepository.delete(id);
    if (result.affected === 0) throw new NotFoundException();
  }
}
