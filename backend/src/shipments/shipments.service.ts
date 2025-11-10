import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ShipmentsService {
  constructor(private prisma: PrismaService) {}

  async create(data: any, userId: string) {
    const trackingNumber = `TRK${Date.now()}`;
    return this.prisma.shipment.create({
      data: {
        ...data,
        trackingNumber,
        createdBy: userId,
      },
    });
  }

  async findAll(filters?: any) {
    return this.prisma.shipment.findMany({
      include: {
        booking: true,
        user: { select: { id: true, name: true, email: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    return this.prisma.shipment.findUnique({
      where: { id },
      include: {
        booking: true,
        user: { select: { id: true, name: true, email: true } },
        manifestItems: {
          include: {
            manifest: true,
          },
        },
      },
    });
  }

  async update(id: string, data: any) {
    return this.prisma.shipment.update({
      where: { id },
      data,
    });
  }

  async delete(id: string) {
    return this.prisma.shipment.delete({
      where: { id },
    });
  }

  async getStatistics() {
    const total = await this.prisma.shipment.count();
    const inTransit = await this.prisma.shipment.count({
      where: { status: 'IN_TRANSIT' },
    });
    const delivered = await this.prisma.shipment.count({
      where: { status: 'DELIVERED' },
    });
    const pending = await this.prisma.shipment.count({
      where: { status: 'CREATED' },
    });

    return { total, inTransit, delivered, pending };
  }
}
