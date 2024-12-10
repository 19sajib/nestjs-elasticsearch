import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ElasticsearchService } from '@nestjs/elasticsearch';

@Injectable()
export class SearchService implements OnModuleInit {
    private readonly logger = new Logger(SearchService.name);
  
    constructor(private readonly elasticsearchService: ElasticsearchService, private readonly configService: ConfigService) {}
  
    async onModuleInit() {
      try {
        // Performing a basic health check to log successful connection
        const health = await this.elasticsearchService.ping();
        this.logger.log('Elasticsearch connected successfully');

        // creating initial index
        await this.createIndex()
      } catch (error) {
        this.logger.error('Failed to connect to Elasticsearch', error.stack);
        throw error;
      }
    }

    async createIndex () {
        const index = this.configService.get('ELASTICSEARCH_INDEX_NAME');
        const checkIndex = await this.elasticsearchService.indices.exists({ index });
        if(!checkIndex) {
          this.logger.log(`Creating Elastic Search Indices: ${index}`)
          await this.elasticsearchService.indices.create({
            index,
            body: {
              mappings: {
                properties: {
                  title: {
                    type: 'text'
                  },
                  description: {
                    type: 'text'
                  },
                  post_by: {
                    type: 'text',
                    fields: {
                      keyword: {
                        type: 'keyword',
                        ignore_above: 30
                      }
                    }
                  },
                  tag: {
                    type: 'text',
                    fields: {
                      keyword: {
                        type: 'keyword',
                        ignore_above: 20
                      }
                    }
                  },
                  contact: {
                    type: 'keyword'
                  }
                }
              }
            }
          })
        }
    }

    async removeIndex() {
      const index = this.configService.get('ELASTICSEARCH_INDEX_NAME');
      const checkIndex = await this.elasticsearchService.indices.exists({ index });
      if(checkIndex) {
        this.logger.log(`Deleting Elastic Search Indices: ${index}`)
        await this.elasticsearchService.indices.delete({
          index
        })
      }
    }

}
