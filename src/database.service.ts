import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { DataSource } from 'typeorm';

@Injectable()
export class DatabaseService implements OnModuleInit {
  private readonly logger = new Logger(DatabaseService.name); // Initialize Logger

  constructor(private readonly dataSource: DataSource) {}

  async onModuleInit() {
    try {
      this.logger.log('Database connected successfully'); // Log successful connection
    } catch (error) {
      this.logger.error('Database connection failed', error.stack); // Log connection error
      throw error;
    }
  }

  async query(queryText: string, parameters?: any[]): Promise<any> {
    try {
      this.logger.debug(`Executing query: ${queryText} with params: ${parameters || 'none'}`);
      return await this.dataSource.query(queryText, parameters);
    } catch (error) {
      this.logger.error(`Query failed: ${queryText}`, error.stack);
      throw error;
    }
  }
}
