import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Request } from '@nestjs/common';
import { ShipmentsService } from './shipments.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('shipments')
@UseGuards(JwtAuthGuard)
export class ShipmentsController {
  constructor(private shipmentsService: ShipmentsService) {}

  @Post()
  create(@Body() createDto: any, @Request() req) {
    return this.shipmentsService.create(createDto, req.user.userId);
  }

  @Get()
  findAll() {
    return this.shipmentsService.findAll();
  }

  @Get('statistics')
  getStatistics() {
    return this.shipmentsService.getStatistics();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.shipmentsService.findOne(id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateDto: any) {
    return this.shipmentsService.update(id, updateDto);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.shipmentsService.delete(id);
  }
}
