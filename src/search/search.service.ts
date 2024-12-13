import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ElasticsearchService } from '@nestjs/elasticsearch';

@Injectable()
export class SearchService implements OnModuleInit {
  private readonly logger = new Logger(SearchService.name);

  constructor(
    private readonly configService: ConfigService,
    private readonly elasticsearchService: ElasticsearchService,
  ) {}

  async onModuleInit() {
    try {
      // Performing a basic health check to log successful connection
      const health = await this.elasticsearchService.ping();
      this.logger.log('Elasticsearch connected successfully');

      // creating initial index
      await this.createIndex();
    } catch (error) {
      this.logger.error('Failed to connect to Elasticsearch', error.stack);
      throw error;
    }
  }

  async createIndex() {
    const index = this.configService.get('ELASTICSEARCH_INDEX_NAME');
    const checkIndex = await this.elasticsearchService.indices.exists({
      index,
    });
    if (!checkIndex) {
      this.logger.log(`Creating Elastic Search Indices: ${index}`);
      await this.elasticsearchService.indices.create({
        index,
        body: {
          mappings: {
            properties: {
              title: {
                type: 'text',
              },
              description: {
                type: 'text',
              },
              post_by: {
                type: 'text',
                fields: {
                  keyword: {
                    type: 'keyword',
                    ignore_above: 30,
                  },
                },
              },
              tag: {
                type: 'text',
                fields: {
                  keyword: {
                    type: 'keyword',
                    ignore_above: 20,
                  },
                },
              },
              contact: {
                type: 'keyword',
              },
            },
          },
          settings: {
            analysis: {
              analyzer: {
                // Analyzer for indexing: Optimized for autocomplete functionality with prefix-based tokens
                autocomplete_index_analyzer: {
                  type: 'custom',
                  tokenizer: 'autocomplete', // Custom tokenizer for edge n-grams
                  filter: ['lowercase'], // Ensures case-insensitivity
                },
                // Analyzer for querying: Optimized for exact match or prefix match
                autocomplete_search_analyzer: {
                  type: 'custom',
                  tokenizer: 'standard', // Splits user input into terms
                  filter: ['lowercase'], // Ensures case-insensitivity
                },
              },
              tokenizer: {
                // Custom tokenizer to generate edge n-grams for prefix-based matching
                autocomplete: {
                  type: 'edge_ngram',
                  min_gram: 1, // Minimum token length
                  max_gram: 30, // Maximum token length
                  token_chars: ['letter', 'digit', 'whitespace'], // Includes letters, digits, and spaces
                },
              },
              filter: {
                // Optional: Define an edge_ngram filter for advanced configurations
                autocomplete_filter: {
                  type: 'edge_ngram',
                  min_gram: 1,
                  max_gram: 30,
                },
              },
            },
          },
        },
      });
    }
  }

  async removeIndex() {
    const index = this.configService.get('ELASTICSEARCH_INDEX_NAME');
    const checkIndex = await this.elasticsearchService.indices.exists({
      index,
    });
    if (checkIndex) {
      this.logger.log(`Deleting Elastic Search Indices: ${index}`);
      await this.elasticsearchService.indices.delete({
        index,
      });
    }
  }

  // creating document index
  async indexPost(post: any, id : number) {
    return await this.elasticsearchService.index({
      index: this.configService.get('ELASTICSEARCH_INDEX_NAME'),
      id: id.toString(),
      body: post,
    });
  }

  // searching document by post title
  async findPosts(search: string) {
    console.log(search,"ssssssssssssssss")
    let results = [];
        const body = await this.elasticsearchService.search({
            index: this.configService.get('ELASTICSEARCH_INDEX_NAME'),
            body: {
                size: 12,
                query: {
                    match: {
                        // 'title.complete': {
                        //     query: search,
                        // },
                        title: search
                    },
                },
            },
        });
        const hits = body.hits.hits;
        hits.map(item => {
            results.push(item._source);
        });

        return { results, total: body.hits.total };
  }

  // searching document by post Id
  async searchPostById(postId: string) {
    return await this.elasticsearchService.get({
      index: this.configService.get('ELASTICSEARCH_INDEX_NAME'),
      id: postId,
    });
  }

  // searching all document
  async searchAllPost() {
    let posts = []
    const body = await this.elasticsearchService.search({
      index: this.configService.get('ELASTICSEARCH_INDEX_NAME')
    });
    const hits = body.hits.hits;
        hits.map(item => {
            posts.push(item._source);
        });

    return { posts, total: body };
  }

  // updating doc
  async updatePostById(id: string, body: any) {
    await this.elasticsearchService.update({
      index: this.configService.get('ELASTICSEARCH_INDEX_NAME'),
      id,
      body: {
        doc: body
      }
    })
  }

  // deleting document by id
  async deletePostById(id: string) {
    await this.elasticsearchService.delete({
      index: this.configService.get('ELASTICSEARCH_INDEX_NAME'),
      id,
    });
  }

  // deleting document using query
  async deleteSingleDoc(id: string) {
    await this.elasticsearchService.delete({
      index: this.configService.get('ELASTICSEARCH_INDEX_NAME'),
      id
    });
  }

  // deleting all doc
  async deleteAllDoc() {
    await this.elasticsearchService.deleteByQuery({
      index: this.configService.get('ELASTICSEARCH_INDEX_NAME'),
      query: {
        match_all: {}
      }
    })
  }
}
