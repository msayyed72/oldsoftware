import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Create users
  const adminPassword = await bcrypt.hash('admin123', 10);
  const staffPassword = await bcrypt.hash('staff123', 10);

  const admin = await prisma.user.upsert({
    where: { email: 'admin@logistics.com' },
    update: {},
    create: {
      email: 'admin@logistics.com',
      password: adminPassword,
      name: 'Admin User',
      role: 'ADMIN',
    },
  });

  const staff = await prisma.user.upsert({
    where: { email: 'staff@logistics.com' },
    update: {},
    create: {
      email: 'staff@logistics.com',
      password: staffPassword,
      name: 'Staff User',
      role: 'STAFF',
    },
  });

  console.log('✅ Users created');

  // Create bookings
  const booking1 = await prisma.booking.create({
    data: {
      bookingNumber: 'BK1001',
      customerName: 'Acme Corporation',
      customerEmail: 'contact@acme.com',
      customerPhone: '+1-555-0100',
      customerAddress: '123 Business St, New York, NY 10001',
      origin: 'New York',
      destination: 'Los Angeles',
      serviceType: 'AIR_CARGO',
      status: 'CONFIRMED',
      totalWeight: 250.5,
      totalValue: 5000,
      notes: 'Urgent delivery required',
      createdBy: admin.id,
    },
  });

  const booking2 = await prisma.booking.create({
    data: {
      bookingNumber: 'BK1002',
      customerName: 'Tech Solutions Inc',
      customerEmail: 'info@techsol.com',
      customerPhone: '+1-555-0200',
      customerAddress: '456 Innovation Ave, San Francisco, CA 94102',
      origin: 'San Francisco',
      destination: 'Chicago',
      serviceType: 'GROUND',
      status: 'PENDING',
      totalWeight: 150.0,
      totalValue: 3000,
      createdBy: staff.id,
    },
  });

  console.log('✅ Bookings created');

  // Create shipments
  const shipments = await prisma.shipment.createMany({
    data: [
      {
        trackingNumber: 'TRK100001',
        hawbNumber: 'HAWB001',
        bookingId: booking1.id,
        senderName: 'Acme Corporation',
        senderAddress: '123 Business St',
        senderCity: 'New York',
        senderState: 'NY',
        senderPincode: '10001',
        senderPhone: '+1-555-0100',
        receiverName: 'West Coast Distributors',
        receiverAddress: '789 Pacific Blvd',
        receiverCity: 'Los Angeles',
        receiverState: 'CA',
        receiverPincode: '90001',
        receiverPhone: '+1-555-0101',
        weight: 125.5,
        dimensions: '50x40x30cm',
        declaredValue: 2500,
        status: 'IN_TRANSIT',
        paymentMode: 'PREPAID',
        serviceType: 'AIR_CARGO',
        currentLocation: 'Chicago Hub',
        createdBy: admin.id,
      },
      {
        trackingNumber: 'TRK100002',
        bookingId: booking1.id,
        senderName: 'Acme Corporation',
        senderAddress: '123 Business St',
        senderCity: 'New York',
        senderState: 'NY',
        senderPincode: '10001',
        senderPhone: '+1-555-0100',
        receiverName: 'West Coast Distributors',
        receiverAddress: '789 Pacific Blvd',
        receiverCity: 'Los Angeles',
        receiverState: 'CA',
        receiverPincode: '90001',
        receiverPhone: '+1-555-0101',
        weight: 125.0,
        dimensions: '45x40x30cm',
        declaredValue: 2500,
        status: 'PICKED_UP',
        paymentMode: 'PREPAID',
        serviceType: 'AIR_CARGO',
        currentLocation: 'New York Warehouse',
        createdBy: admin.id,
      },
      {
        trackingNumber: 'TRK100003',
        bookingId: booking2.id,
        senderName: 'Tech Solutions Inc',
        senderAddress: '456 Innovation Ave',
        senderCity: 'San Francisco',
        senderState: 'CA',
        senderPincode: '94102',
        senderPhone: '+1-555-0200',
        receiverName: 'Midwest Tech Hub',
        receiverAddress: '321 Lake Shore Dr',
        receiverCity: 'Chicago',
        receiverState: 'IL',
        receiverPincode: '60601',
        receiverPhone: '+1-555-0201',
        weight: 150.0,
        dimensions: '60x50x40cm',
        declaredValue: 3000,
        status: 'CREATED',
        paymentMode: 'COD',
        serviceType: 'GROUND',
        createdBy: staff.id,
      },
      {
        trackingNumber: 'TRK100004',
        senderName: 'Global Exports Ltd',
        senderAddress: '100 Harbor View',
        senderCity: 'Seattle',
        senderState: 'WA',
        senderPincode: '98101',
        senderPhone: '+1-555-0300',
        receiverName: 'East Coast Imports',
        receiverAddress: '500 Atlantic Ave',
        receiverCity: 'Boston',
        receiverState: 'MA',
        receiverPincode: '02101',
        receiverPhone: '+1-555-0301',
        weight: 200.0,
        dimensions: '80x60x50cm',
        declaredValue: 4500,
        status: 'DELIVERED',
        paymentMode: 'PREPAID',
        serviceType: 'AIR_CARGO',
        currentLocation: 'Delivered',
        createdBy: staff.id,
      },
    ],
  });

  console.log('✅ Shipments created');

  // Create manifests
  const manifest1 = await prisma.manifest.create({
    data: {
      manifestNumber: 'MF2001',
      manifestType: 'DISPATCH',
      origin: 'New York',
      destination: 'Los Angeles',
      dispatchDate: new Date('2024-11-10'),
      status: 'IN_TRANSIT',
      vehicleNumber: 'TRK-5678',
      driverName: 'John Driver',
      driverPhone: '+1-555-9001',
      totalShipments: 2,
      totalWeight: 250.5,
      notes: 'Air cargo dispatch - Priority handling',
    },
  });

  const manifest2 = await prisma.manifest.create({
    data: {
      manifestNumber: 'MF2002',
      manifestType: 'RECEIVING',
      origin: 'Seattle',
      destination: 'Boston',
      dispatchDate: new Date('2024-11-09'),
      status: 'RECEIVED',
      vehicleNumber: 'TRK-9012',
      driverName: 'Jane Transport',
      driverPhone: '+1-555-9002',
      totalShipments: 1,
      totalWeight: 200.0,
    },
  });

  console.log('✅ Manifests created');

  // Link shipments to manifests
  const shipmentsList = await prisma.shipment.findMany({
    where: {
      trackingNumber: {
        in: ['TRK100001', 'TRK100002', 'TRK100004'],
      },
    },
  });

  for (const shipment of shipmentsList) {
    if (shipment.trackingNumber === 'TRK100004') {
      await prisma.manifestItem.create({
        data: {
          manifestId: manifest2.id,
          shipmentId: shipment.id,
        },
      });
    } else {
      await prisma.manifestItem.create({
        data: {
          manifestId: manifest1.id,
          shipmentId: shipment.id,
        },
      });
    }
  }

  console.log('✅ Manifest items linked');
  console.log('\n📦 Database seeded successfully!');
  console.log('\n🔑 Login credentials:');
  console.log('Admin: admin@logistics.com / admin123');
  console.log('Staff: staff@logistics.com / staff123');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
