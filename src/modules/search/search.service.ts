import {
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { Event } from '../events/entities/event.entity';
import { ElasticsearchService } from '@nestjs/elasticsearch';

// src/search/search.service.ts
@Injectable()
export class SearchService {
  private readonly logger = new Logger(SearchService.name);

  //   constructor(private readonly elasticsearchService: ElasticsearchService) {}

  async onModuleInit() {
    try {
      //   const info = await this.elasticsearchService.info();
      //   this.logger.log(`Connected to Elasticsearch: ${info.version}`);
      //   console.log(`Connected to Elasticsearch: ${info.version}`);
    } catch (error) {
      this.logger.error('Failed to connect to Elasticsearch', error.message);
      console.error('Failed to connect to Elasticsearch', error.message);
      throw error;
    }
  }

  async indexEvent(event: any) {
    try {
      //   await this.elasticsearchService.index({
      //     index: 'events',
      //     body: {
      //       id: event.id,
      //       name: event.name,
      //       description: event.description,
      //       location: event.location,
      //       startDate: event.startDate,
      //       endDate: event.endDate,
      //       isActive: event.isActive,
      //     },
      //   });
    } catch (error) {
      this.logger.error(`Error indexing event: ${error.message}`);
      throw error;
    }
  }
  async searchEvents(query: string): Promise<EventDocument[]> {
    try {
      //   const response = await this.elasticsearchService.search<EventDocument>({
      //     index: 'events',
      //     body: {
      //       query: {
      //         multi_match: {
      //           query,
      //           fields: ['name^3', 'description^2', 'location'],
      //           fuzziness: 'AUTO',
      //         },
      //       },
      //     },
      //   });

      //   // Updated response handling
      //   return response.hits.hits.map((hit) => hit._source);
      return null;
    } catch (error) {
      console.error('Elasticsearch error:', error);
      throw new InternalServerErrorException('Search failed');
    }
  }

  async updateEventIndex(eventId: number, update: Partial<Event>) {
    // return this.elasticsearchService.update({
    //   index: 'events',
    //   id: eventId.toString(),
    //   body: {
    //     doc: update,
    //   },
    // });
    return null;
  }

  async deleteEventIndex(eventId: number) {
    // return this.elasticsearchService.delete({
    //   index: 'events',
    //   id: eventId.toString(),
    // });
  }
}
