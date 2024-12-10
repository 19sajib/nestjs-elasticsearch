import { Module } from '@nestjs/common';
import { SearchService } from './search.service';
import { ElasticsearchModule } from '@nestjs/elasticsearch';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule,
    ElasticsearchModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        node: configService.get('ELASTICSEARCH_HOST'),
        auth: {
          username: configService.get('ELASTICSEARCH_USER'),
          password: configService.get('ELASTICSEARCH_PASSWORD'),
        },
        maxRetries: 7,
        requestTimeout: 30000,
        pingTimeout: 30000,
        sniffOnStart: true,
        log: 'trace'
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [SearchService]
})
export class SearchModule {}
