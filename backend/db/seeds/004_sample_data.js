exports.seed = async function (knex) {
  // Only insert sample data when NODE_ENV is development
  if (process.env.NODE_ENV !== 'development') {
    return;
  }

  await knex.raw('SET FOREIGN_KEY_CHECKS = 0');
  await knex('rentals').truncate();
  await knex('vehicle_assignments').truncate();
  await knex('drivers').truncate();
  await knex('vehicles').truncate();
  await knex.raw('SET FOREIGN_KEY_CHECKS = 1');

  // 1. Seed Vehicles
  const vehicles = [
    {
      id: 1,
      vin: '4T1B11HK5JU192831',
      plate: 'PR-2024-TC',
      make: 'Toyota',
      model: 'Camry',
      year: 2023,
      color: 'Midnight Black',
      mileage: 24500,
      status: 'rented',
      purchase_date: '2023-01-15',
      purchase_price: 28500.00,
      financing_details: 'Commercial Fleet Finance LLC - Term 48 mo',
      location: 'JFK Airport Fleet Hub'
    },
    {
      id: 2,
      vin: '1HGCR2F83HA029341',
      plate: 'PR-2024-HA',
      make: 'Honda',
      model: 'Accord',
      year: 2023,
      color: 'Platinum White',
      mileage: 31200,
      status: 'rented',
      purchase_date: '2023-03-20',
      purchase_price: 29800.00,
      financing_details: 'Direct Capital - Term 36 mo',
      location: 'LAX Cargo Hub'
    },
    {
      id: 3,
      vin: '5NPE24AF9NH194821',
      plate: 'PR-2024-HS',
      make: 'Hyundai',
      model: 'Sonata',
      year: 2022,
      color: 'Electric Shadow',
      mileage: 42100,
      status: 'rented',
      purchase_date: '2022-08-10',
      purchase_price: 26200.00,
      financing_details: 'Paid in Full',
      location: 'Chicago Midway Hub'
    },
    {
      id: 4,
      vin: '1G1ZD5ST8LF104928',
      plate: 'PR-2024-CM',
      make: 'Chevrolet',
      model: 'Malibu',
      year: 2023,
      color: 'Dark Ash Metallic',
      mileage: 19800,
      status: 'available',
      purchase_date: '2023-05-18',
      purchase_price: 27400.00,
      financing_details: 'Commercial Fleet Finance LLC',
      location: 'Main Yard Dispatch'
    },
    {
      id: 5,
      vin: '5YJ3E1EB8NF839210',
      plate: 'PR-2024-TM',
      make: 'Tesla',
      model: 'Model 3',
      year: 2024,
      color: 'Deep Blue Metallic',
      mileage: 14300,
      status: 'rented',
      purchase_date: '2024-01-10',
      purchase_price: 44000.00,
      financing_details: 'Tesla Financial Services - Term 60 mo',
      location: 'Austin Domain Tech Center'
    },
    {
      id: 6,
      vin: '1GNSKBKC9PR901842',
      plate: 'PR-2024-CT',
      make: 'Chevrolet',
      model: 'Tahoe',
      year: 2023,
      color: 'Summit White',
      mileage: 38900,
      status: 'maintenance',
      purchase_date: '2023-02-14',
      purchase_price: 62500.00,
      financing_details: 'Fleet Lease Corp',
      location: 'Metro Service Facility'
    },
    {
      id: 7,
      vin: '1FTFW1ED6PFB92841',
      plate: 'PR-2024-FF',
      make: 'Ford',
      model: 'F-150',
      year: 2023,
      color: 'Carbonized Gray',
      mileage: 22400,
      status: 'available',
      purchase_date: '2023-04-11',
      purchase_price: 56000.00,
      financing_details: 'Direct Capital',
      location: 'Central Dispatch Yard'
    },
    {
      id: 8,
      vin: 'WBA53BJ04RCL91823',
      plate: 'PR-2024-BM',
      make: 'BMW',
      model: '5 Series',
      year: 2024,
      color: 'Phytonic Blue',
      mileage: 9800,
      status: 'rented',
      purchase_date: '2024-02-28',
      purchase_price: 64800.00,
      financing_details: 'BMW Financial Services',
      location: 'Downtown Executive Terminal'
    }
  ];

  await knex('vehicles').insert(vehicles);

  // 2. Seed Drivers
  const drivers = [
    {
      id: 1,
      first_name: 'Marcus',
      last_name: 'Vance',
      phone: '+1 (555) 234-8901',
      email: 'marcus.vance@primeroute.io',
      license_number: 'DL-NY-9028148',
      license_state: 'NY',
      license_expiry: '2026-09-14',
      status: 'active',
      balance: 0.00,
      deposit_held: 500.00,
      notes: 'Driver with Apex Logistics contract.'
    },
    {
      id: 2,
      first_name: 'David',
      last_name: 'Miller',
      phone: '+1 (555) 345-6712',
      email: 'david.miller@gmail.com',
      license_number: 'DL-CA-4491029',
      license_state: 'CA',
      license_expiry: '2026-11-20',
      status: 'active',
      balance: 0.00,
      deposit_held: 600.00,
      notes: 'Commercial delivery driver.'
    },
    {
      id: 3,
      first_name: 'Sarah',
      last_name: 'Jenkins',
      phone: '+1 (555) 456-7890',
      email: 'sjenkins@outlook.com',
      license_number: 'DL-IL-8849103',
      license_state: 'IL',
      license_expiry: '2026-04-18',
      status: 'active',
      balance: 0.00,
      deposit_held: 500.00,
      notes: 'Urban Express Services contractor.'
    },
    {
      id: 4,
      first_name: 'Alexander',
      last_name: 'Reed',
      phone: '+1 (555) 567-8901',
      email: 'alex.reed@ridesharefleet.com',
      license_number: 'DL-TX-5510928',
      license_state: 'TX',
      license_expiry: '2027-01-10',
      status: 'active',
      balance: 150.00,
      deposit_held: 500.00,
      notes: 'Green Mobility Corp EV driver.'
    },
    {
      id: 5,
      first_name: 'Elena',
      last_name: 'Rostova',
      phone: '+1 (555) 678-9012',
      email: 'elena.rostova@vipchauffeur.org',
      license_number: 'DL-FL-7729104',
      license_state: 'FL',
      license_expiry: '2026-07-25',
      status: 'active',
      balance: 0.00,
      deposit_held: 1000.00,
      notes: 'Executive livery service chauffeur.'
    },
    {
      id: 6,
      first_name: 'Carlos',
      last_name: 'Mendez',
      phone: '+1 (555) 789-0123',
      email: 'cmendez88@gmail.com',
      license_number: 'DL-WA-3391028',
      license_state: 'WA',
      license_expiry: '2025-12-05',
      status: 'pending',
      balance: 0.00,
      deposit_held: 0.00,
      notes: 'Application under review.'
    }
  ];

  await knex('drivers').insert(drivers);

  // 3. Seed Rentals
  const rentals = [
    {
      id: 1,
      contract_no: 'RNT-2024-089',
      vehicle_id: 1,
      driver_id: 1,
      created_by: 1,
      status: 'active',
      start_date: '2025-07-01',
      end_date: '2025-07-15',
      weekly_rate: 487.50,
      deposit_amount: 500.00,
      mileage_at_pickup: 24500,
      mileage_at_return: null,
      terms: 'Premium commercial fleet lease agreement.'
    },
    {
      id: 2,
      contract_no: 'RNT-2024-090',
      vehicle_id: 3,
      driver_id: 3,
      created_by: 1,
      status: 'active',
      start_date: '2025-07-05',
      end_date: '2025-07-19',
      weekly_rate: 420.00,
      deposit_amount: 500.00,
      mileage_at_pickup: 42100,
      mileage_at_return: null,
      terms: 'Rideshare commercial rental with mileage tier.'
    },
    {
      id: 3,
      contract_no: 'RNT-2024-091',
      vehicle_id: 5,
      driver_id: 4,
      created_by: 1,
      status: 'awaiting_signature',
      start_date: '2025-07-10',
      end_date: '2025-07-24',
      weekly_rate: 462.50,
      deposit_amount: 500.00,
      mileage_at_pickup: 12400,
      mileage_at_return: null,
      terms: 'Supercharging allowance included.'
    },
    {
      id: 4,
      contract_no: 'RNT-2024-092',
      vehicle_id: 2,
      driver_id: 2,
      created_by: 1,
      status: 'completed',
      start_date: '2025-06-15',
      end_date: '2025-07-12',
      weekly_rate: 525.00,
      deposit_amount: 600.00,
      mileage_at_pickup: 28100,
      mileage_at_return: 31200,
      terms: 'Vehicle returned in pristine condition.'
    },
    {
      id: 5,
      contract_no: 'RNT-2024-093',
      vehicle_id: 7,
      driver_id: 3,
      created_by: 1,
      status: 'draft',
      start_date: '2025-07-22',
      end_date: '2025-07-29',
      weekly_rate: 1100.00,
      deposit_amount: 500.00,
      mileage_at_pickup: 22400,
      mileage_at_return: null,
      terms: 'Tow package requested for filming gear.'
    }
  ];

  await knex('rentals').insert(rentals);

  // 4. Seed Vehicle Assignments
  const assignments = [
    {
      id: 1,
      vehicle_id: 1,
      driver_id: 1,
      assigned_by: 1,
      start_date: '2025-07-01 09:00:00',
      end_date: null,
      notes: 'Active lease assignment'
    },
    {
      id: 2,
      vehicle_id: 3,
      driver_id: 3,
      assigned_by: 1,
      start_date: '2025-07-05 10:00:00',
      end_date: null,
      notes: 'Active rideshare assignment'
    },
    {
      id: 3,
      vehicle_id: 2,
      driver_id: 2,
      assigned_by: 1,
      start_date: '2025-06-15 08:30:00',
      end_date: '2025-07-12 16:00:00',
      notes: 'Completed delivery contract'
    }
  ];

  await knex('vehicle_assignments').insert(assignments);
};
