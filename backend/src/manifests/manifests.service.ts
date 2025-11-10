import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ManifestsService {
  constructor(private prisma: PrismaService) {}

  async create(data: any) {
    const manifestNumber = `MF${Date.now()}`;
    return this.prisma.manifest.create({
      data: {
        ...data,
        manifestNumber,
      },
    });
  }

  async findAll() {
    return this.prisma.manifest.findMany({
      include: {
        items: {
          include: {
            shipment: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    return this.prisma.manifest.findUnique({
      where: { id },
      include: {
        items: {
          include: {
            shipment: true,
          },
        },
      },
    });
  }

  async update(id: string, data: any) {
    return this.prisma.manifest.update({
      where: { id },
      data,
    });
  }

  async addShipment(manifestId: string, shipmentId: string) {
    return this.prisma.manifestItem.create({
      data: {
        manifestId,
        shipmentId,
      },
    });
  }

  async removeShipment(manifestId: string, shipmentId: string) {
    return this.prisma.manifestItem.deleteMany({
      where: {
        manifestId,
        shipmentId,
      },
    });
  }

  async delete(id: string) {
    return this.prisma.manifest.delete({
      where: { id },
    });
  }
}
