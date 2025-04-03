// src/events/events.controller.ts
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  Request,
  ValidationPipe,
  ParseIntPipe,
  Req,
} from '@nestjs/common';
import { EventsService } from './events.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { SearchEventsDto } from './dto/search-events.dto';
import { JwtAuthGuard } from '../auth/guards/jwt.auth.guard';
import { CreateTicketDto } from '../tickets/dto/create-ticket.dto';
import { OwnGuard } from '../auth/guards/own.guard';

@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Post()
  @UseGuards(JwtAuthGuard, OwnGuard)
  create(@Body() createEventDto: CreateEventDto) {
    return this.eventsService.createEvent(createEventDto);
  }

  @Get('search')
  search(@Query() searchEventsDto: SearchEventsDto) {
    return this.eventsService.searchEvents(searchEventsDto.query);
  }

  @Get('all')
  findAll(@Query() query) {
    return this.eventsService.findAllActiveEvents(query);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, OwnGuard)
  findOne(
    @Param('id', ParseIntPipe) id: number,
    @Query('customerId') customerId: string,
  ) {
    return this.eventsService.findEventById(id, +customerId);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, OwnGuard)
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateEventDto: UpdateEventDto,
  ) {
    return this.eventsService.updateEvent(id, updateEventDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, OwnGuard)
  remove(@Param('id', ParseIntPipe) id: number, @Request() req) {
    let user = req.user.id;
    return this.eventsService.deleteEvent(id, user);
  }

  // @Post(':id/tickets')
  // addTicket(
  //   @Param('id') eventId: number,
  //   @Body() createTicketDto: CreateTicketDto,
  // ) {
  //   return this.eventsService.addTicketToEvent(eventId, createTicketDto);
  // }
}
