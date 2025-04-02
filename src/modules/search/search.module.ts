import { Logger, Module } from '@nestjs/common';
import { SearchService } from './search.service';
import { SearchController } from './search.controller';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [],

  controllers: [SearchController],
  providers: [SearchService, Logger],
})
export class SearchModule {}
