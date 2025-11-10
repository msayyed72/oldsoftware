import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { ManifestsService } from './manifests.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('manifests')
@UseGuards(JwtAuthGuard)
export class ManifestsController {
  constructor(private manifestsService: ManifestsService) {}

  @Post()
  create(@Body() createDto: any) {
    return this.manifestsService.create(createDto);
  }

  @Get()
  findAll() {
    return this.manifestsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.manifestsService.findOne(id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateDto: any) {
    return this.manifestsService.update(id, updateDto);
  }

  @Post(':id/shipments')
  addShipment(@Param('id') id: string, @Body() body: { shipmentId: string }) {
    return this.manifestsService.addShipment(id, body.shipmentId);
  }

  @Delete(':id/shipments/:shipmentId')
  removeShipment(@Param('id') id: string, @Param('shipmentId') shipmentId: string) {
    return this.manifestsService.removeShipment(id, shipmentId);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.manifestsService.delete(id);
  }
}
