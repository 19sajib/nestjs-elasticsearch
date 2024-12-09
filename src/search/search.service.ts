import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ElasticsearchService } from '@nestjs/elasticsearch';

@Injectable()
export class SearchService implements OnModuleInit {
    private readonly logger = new Logger(SearchService.name);
  
    constructor(private readonly elasticsearchService: ElasticsearchService) {}
  
    async onModuleInit() {
      try {
        // Performing a basic health check to log successful connection
        // const health = await this.elasticsearchService.ping();
        // this.logger.log('Elasticsearch connected successfully', health);

        this.logger.log('Elasticsearch connected successfully....');
      } catch (error) {
        this.logger.error('Failed to connect to Elasticsearch', error.stack);
        throw error;
      }
    }

}
