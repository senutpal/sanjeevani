import { OpdPatient, Bed, InventoryItem, AdmittedPatient, OpdPrediction, InventoryAction } from '@/lib/types/types';
import { supabase } from '@/integrations/supabase/client';
import { OpdQueueItem, InventoryItem as SupabaseInventoryItem } from '@/integrations/supabase/database.types';

// Mock data
const mockOpdQueue: OpdPatient[] = [
  {
    id: 'PT00123',
    name: 'Rajesh Kumar',
    department: 'ENT',
    waitTime: 25,
    status: 'waiting',
    joinedAt: new Date(Date.now() - 25 * 60000).toISOString(),
    symptoms: 'Sore throat and mild fever',
  },
  {
    id: 'PT00124',
    name: 'Priya Sharma',
    department: 'Ortho',
    waitTime: 40,
    status: 'waiting',
    joinedAt: new Date(Date.now() - 40 * 60000).toISOString(),
    symptoms: 'Knee pain while walking',
  },
  {
    id: 'PT00125',
    name: 'Amit Patel',
    department: 'Cardio',
    waitTime: 10,
    status: 'assigned',
    assignedDoctor: 'Dr. Meera Gupta',
    joinedAt: new Date(Date.now() - 60 * 60000).toISOString(),
    symptoms: 'Chest discomfort and palpitations',
  },
  {
    id: 'PT00126',
    name: 'Sunita Desai',
    department: 'General',
    waitTime: 15,
    status: 'waiting',
    joinedAt: new Date(Date.now() - 15 * 60000).toISOString(),
    symptoms: 'Mild headache and dizziness',
  },
  {
    id: 'PT00127',
    name: 'Vikram Singh',
    department: 'Neuro',
    waitTime: 50,
    status: 'assigned',
    assignedDoctor: 'Dr. Anand Sharma',
    joinedAt: new Date(Date.now() - 90 * 60000).toISOString(),
    symptoms: 'Numbness in right arm',
  },
  {
    id: 'PT00128',
    name: 'Neha Verma',
    department: 'Pediatric',
    waitTime: 5,
    status: 'completed',
    assignedDoctor: 'Dr. Priya Joshi',
    joinedAt: new Date(Date.now() - 120 * 60000).toISOString(),
    symptoms: 'Fever and cough for 2 days',
  },
];

// Generate random mock beds
const generateMockBeds = (): Bed[] => {
  const wards = ['General', 'ICU', 'Pediatric', 'Orthopedic', 'Cardiology', 'Neurology'];
  const floors = [1, 2, 3, 4];
  const statuses = ['available', 'occupied', 'reserved', 'maintenance'] as const;
  const beds: Bed[] = [];

  // Generate random patient names
  const patientFirstNames = ['Rahul', 'Priya', 'Amit', 'Neha', 'Vikram', 'Suman', 'Raj', 'Anjali', 'Sanjay', 'Meena'];
  const patientLastNames = ['Sharma', 'Patel', 'Singh', 'Verma', 'Kumar', 'Gupta', 'Joshi', 'Desai', 'Malhotra', 'Reddy'];

  let id = 1;
  wards.forEach(ward => {
    floors.forEach(floor => {
      // Generate different number of beds per ward and floor
      const bedCount = Math.floor(5 + Math.random() * 10);
      
      for (let i = 1; i <= bedCount; i++) {
        const status = statuses[Math.floor(Math.random() * statuses.length)];
        
        const bed: Bed = {
          id: `bed-${id++}`,
          number: `${ward.charAt(0)}${floor}-${i < 10 ? '0' + i : i}`,
          ward,
          floor,
          status,
        };

        // Add patient details for occupied beds
        if (status === 'occupied') {
          const firstName = patientFirstNames[Math.floor(Math.random() * patientFirstNames.length)];
          const lastName = patientLastNames[Math.floor(Math.random() * patientLastNames.length)];
          
          bed.patientName = `${firstName} ${lastName}`;
          bed.patientId = `PT${Math.floor(10000 + Math.random() * 90000)}`;
        }

        beds.push(bed);
      }
    });
  });

  return beds;
};

// Generate mock inventory items
const generateMockInventory = (): InventoryItem[] => {
  const medicines = [
    'Paracetamol', 'Ibuprofen', 'Amoxicillin', 'Aspirin', 'Metformin', 
    'Atorvastatin', 'Lisinopril', 'Azithromycin', 'Diazepam', 'Omeprazole',
    'Cetirizine', 'Levothyroxine', 'Amlodipine', 'Dolo 650', 'Crocin'
  ];
  
  const consumables = [
    'Surgical Gloves', 'Face Masks', 'Syringes', 'Bandages', 'Gauze', 
    'IV Lines', 'Catheters', 'Surgical Tape', 'Antiseptic Wipes', 'Disposable Gowns'
  ];

  const categories = ['Medicine', 'Consumable', 'Equipment', 'Emergency'];
  const items: InventoryItem[] = [];

  // Generate medicines
  medicines.forEach((name, index) => {
    const quantity = Math.floor(Math.random() * 100);
    const status: InventoryItem['status'] = 
      quantity === 0 ? 'out-of-stock' : 
      quantity < 10 ? 'low' : 
      'in-stock';
      
    const category = 'Medicine';
    
    const lastRestocked = Math.random() > 0.2 
      ? new Date(Date.now() - Math.floor(Math.random() * 30) * 86400000).toISOString() 
      : undefined;

    items.push({
      id: `med-${index + 1}`,
      name,
      quantity,
      status,
      category,
      lastRestocked
    });
  });

  // Generate consumables
  consumables.forEach((name, index) => {
    const quantity = Math.floor(Math.random() * 200);
    const status: InventoryItem['status'] = 
      quantity === 0 ? 'out-of-stock' : 
      quantity < 10 ? 'low' : 
      'in-stock';
      
    const category = 'Consumable';
    
    const lastRestocked = Math.random() > 0.2 
      ? new Date(Date.now() - Math.floor(Math.random() * 30) * 86400000).toISOString() 
      : undefined;

    items.push({
      id: `cons-${index + 1}`,
      name,
      quantity,
      status,
      category,
      lastRestocked
    });
  });

  // Generate a few random other items
  for (let i = 0; i < 10; i++) {
    const category = categories[Math.floor(Math.random() * categories.length)];
    const name = `${category} Item ${i + 1}`;
    const quantity = Math.floor(Math.random() * 50);
    const status: InventoryItem['status'] = 
      quantity === 0 ? 'out-of-stock' : 
      quantity < 10 ? 'low' : 
      'in-stock';
    
    const lastRestocked = Math.random() > 0.3 
      ? new Date(Date.now() - Math.floor(Math.random() * 30) * 86400000).toISOString() 
      : undefined;

    items.push({
      id: `item-${i + 1}`,
      name,
      quantity,
      status,
      category,
      lastRestocked
    });
  }

  return items;
};

// Cache mock data
const mockBeds = generateMockBeds();
const mockInventory = generateMockInventory();

// The current system time, provided by the environment
const currentTime = '2025-04-20T10:32:54+05:30';

// Generate random new patients occasionally
const getRandomUpdatedQueue = (): OpdPatient[] => {
  // Clone the existing queue
  const updatedQueue = [...mockOpdQueue];

  // Randomly update statuses (20% chance)
  if (Math.random() > 0.8) {
    const indexToUpdate = Math.floor(Math.random() * updatedQueue.length);
    const patient = updatedQueue[indexToUpdate];
    
    if (patient.status === 'waiting') {
      updatedQueue[indexToUpdate] = {
        ...patient,
        status: 'assigned',
        assignedDoctor: `Dr. ${['Sharma', 'Patel', 'Gupta', 'Verma', 'Reddy'][Math.floor(Math.random() * 5)]}`
      };
    } else if (patient.status === 'assigned') {
      updatedQueue[indexToUpdate] = {
        ...patient,
        status: 'completed'
      };
    }
  }

  // Randomly add a new patient (10% chance)
  if (Math.random() > 0.9) {
    const departments = ['ENT', 'Ortho', 'Cardio', 'Neuro', 'General', 'Pediatric', 'Gynecology'];
    const firstNames = ['Rajesh', 'Sunita', 'Amit', 'Priya', 'Vikram', 'Neha', 'Sanjay', 'Meena'];
    const lastNames = ['Sharma', 'Patel', 'Singh', 'Gupta', 'Kumar', 'Reddy', 'Malhotra', 'Joshi'];
    
    const newPatientJoinedAt = new Date().toISOString();
    
    const newPatient: OpdPatient = {
      id: `PT${Math.floor(10000 + Math.random() * 90000)}`,
      name: `${firstNames[Math.floor(Math.random() * firstNames.length)]} ${lastNames[Math.floor(Math.random() * lastNames.length)]}`,
      department: departments[Math.floor(Math.random() * departments.length)] as any,
      waitTime: Math.max(0, Math.floor((new Date(currentTime).getTime() - new Date(newPatientJoinedAt).getTime()) / 60000)),
      status: 'waiting',
      joinedAt: newPatientJoinedAt,
      symptoms: 'Sample symptoms',
    };
    
    updatedQueue.push(newPatient);
  }

  // Sort by wait time (longest first)
  return updatedQueue.sort((a, b) => {
    // Completed patients at the bottom
    if (a.status === 'completed' && b.status !== 'completed') return 1;
    if (a.status !== 'completed' && b.status === 'completed') return -1;
    
    // Then sort by wait time
    return b.waitTime - a.waitTime;
  });
};

// Simulating API fetch with delay
const simulateFetch = <T>(data: T, delay = 800): Promise<T> => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(data), delay);
  });
};

// OPD Queue API
export const fetchOpdQueue = async (): Promise<OpdPatient[]> => {
  try {
    // Try to fetch from Supabase first
    const { data, error } = await supabase
      .from('opd_queue')
      .select('*')
      .order('joined_at', { ascending: false });
    
    if (error) throw error;
    
    if (data && data.length > 0) {
      // Convert Supabase data to OpdPatient format
      const queueItems = data as OpdQueueItem[];
      return queueItems.map(item => ({
        id: item.id,
        name: item.name,
        department: item.department,
        // Calculate waitTime in minutes from joinedAt or registrationTime to now
        waitTime: Math.max(0, Math.floor((new Date(currentTime).getTime() - new Date(item.registration_time || item.joined_at).getTime()) / 60000)),
        status: item.status,
        assignedDoctor: item.assigned_doctor || undefined,
        joinedAt: item.joined_at,
        tokenNumber: item.token_number,
        registrationTime: item.registration_time || item.joined_at,
        symptoms: item.symptoms || '',
      }));
    }
  } catch (err) {
    console.error("Error fetching from Supabase, falling back to mock data:", err);
  }
  
  // Fallback to mock data
  return simulateFetch(getRandomUpdatedQueue());
};

// Assign doctor to patient
export const assignDoctor = async (patientId: string, doctorName: string): Promise<OpdPatient> => {
  try {
    // Try to update in Supabase first
    const { data, error } = await supabase
      .from('opd_queue')
      .update({ 
        assigned_doctor: doctorName,
        status: 'assigned',
        updated_at: new Date().toISOString()
      })
      .eq('id', patientId)
      .select()
      .single();
    
    if (error) throw error;
    
    if (data) {
      // Convert to OpdPatient format
      const queueItem = data as OpdQueueItem;

      const joinedAt = new Date(queueItem.joined_at);
      const now = new Date(currentTime);

      const waitTimeInMinutes = Math.max(
        0,
        Math.floor((now.getTime() - joinedAt.getTime()) / 60000)
      );

      return {
        id: queueItem.id,
        name: queueItem.name,
        department: queueItem.department,
        waitTime: waitTimeInMinutes || queueItem.wait_time || 0,
        status: queueItem.status,
        assignedDoctor: queueItem.assigned_doctor || undefined,
        joinedAt: queueItem.joined_at,
        tokenNumber: queueItem.token_number,
        registrationTime: queueItem.registration_time || queueItem.joined_at,
        symptoms: (queueItem as any).symptoms || '',
      };
    }
  } catch (err) {
    console.error("Error updating in Supabase, falling back to mock data:", err);
  }
  
  // Fallback to mock implementation
  const patient = mockOpdQueue.find(p => p.id === patientId);
  
  if (!patient) {
    throw new Error('Patient not found');
  }
  
  const updatedPatient = {
    ...patient,
    status: 'assigned' as const,
    assignedDoctor: doctorName
  };
  
  // Update in mock data
  const index = mockOpdQueue.findIndex(p => p.id === patientId);
  if (index >= 0) {
    mockOpdQueue[index] = updatedPatient;
  }
  
  return simulateFetch(updatedPatient);
};

// Mark patient as completed
export const completePatient = async (patientId: string): Promise<OpdPatient> => {
  try {
    // Try to update in Supabase first
    const { data, error } = await supabase
      .from('opd_queue')
      .update({ 
        status: 'completed',
        completed_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .eq('id', patientId)
      .select()
      .single();
    
    if (error) throw error;
    
    if (data) {
      // Convert to OpdPatient format
      const queueItem = data as OpdQueueItem;
      const joinedAt = new Date(queueItem.joined_at);
      const now = new Date(currentTime);
      const waitTimeInMinutes = Math.max(0, Math.floor((now.getTime() - joinedAt.getTime()) / 60000));
      return {
        id: queueItem.id,
        name: queueItem.name,
        department: queueItem.department,
        waitTime: waitTimeInMinutes || queueItem.wait_time || 0,
        status: queueItem.status,
        assignedDoctor: queueItem.assigned_doctor || undefined,
        joinedAt: queueItem.joined_at,
        tokenNumber: queueItem.token_number,
        registrationTime: queueItem.registration_time || queueItem.joined_at,
        symptoms: (queueItem as any).symptoms || '',
      };
    }
  } catch (err) {
    console.error("Error updating in Supabase, falling back to mock data:", err);
  }

  // Fallback to mock implementation
  const patient = mockOpdQueue.find(p => p.id === patientId);
  
  if (!patient) {
    throw new Error('Patient not found');
  }
  
  const updatedPatient = {
    ...patient,
    status: 'completed' as const
  };
  
  // Update in mock data
  const index = mockOpdQueue.findIndex(p => p.id === patientId);
  if (index >= 0) {
    mockOpdQueue[index] = updatedPatient;
  }
  
  return simulateFetch(updatedPatient);
};

// Fetch bed data
export const fetchBeds = async (): Promise<Bed[]> => {
  return simulateFetch(mockBeds);
};

// Fetch inventory data
export const fetchInventory = async (): Promise<InventoryItem[]> => {
  try {
    // Try to fetch from Supabase first
    const { data, error } = await supabase
      .from('inventory')
      .select('*')
      .order('name');
    
    if (error) throw error;
    
    if (data && data.length > 0) {
      // Convert Supabase data to InventoryItem format
      const inventoryItems = data as SupabaseInventoryItem[];
      return inventoryItems.map(item => ({
        id: item.id,
        name: item.name,
        quantity: item.quantity,
        status: item.status,
        category: item.category,
        lastRestocked: item.last_restocked,
        expiryDate: item.expiry_date
      }));
    }
  } catch (err) {
    console.error("Error fetching from Supabase, falling back to mock data:", err);
  }
  
  // Fallback to mock data
  return simulateFetch(mockInventory);
};

// Update bed status
export const updateBedStatus = async (bedId: string, status: Bed['status'], patientDetails?: { name: string, id: string }): Promise<Bed> => {
  const bedIndex = mockBeds.findIndex(b => b.id === bedId);
  
  if (bedIndex === -1) {
    throw new Error('Bed not found');
  }
  
  const updatedBed = {
    ...mockBeds[bedIndex],
    status,
  };
  
  if (status === 'occupied' && patientDetails) {
    updatedBed.patientName = patientDetails.name;
    updatedBed.patientId = patientDetails.id;
  } else if (status !== 'occupied') {
    delete updatedBed.patientName;
    delete updatedBed.patientId;
  }
  
  mockBeds[bedIndex] = updatedBed;
  
  return simulateFetch(updatedBed);
};

// Manage inventory (restock or use items)
export const manageInventoryItem = async (action: InventoryAction): Promise<InventoryItem> => {
  const { itemId, type, quantity, expiryDate } = action;
  
  try {
    // Get current inventory item
    const { data: currentItem, error: getError } = await supabase
      .from('inventory')
      .select('*')
      .eq('id', itemId)
      .single();
    
    if (getError) throw getError;
    
    if (!currentItem) {
      throw new Error('Inventory item not found');
    }
    
    // Calculate new quantity based on action type
    let newQuantity = currentItem.quantity;
    
    if (type === 'restock') {
      newQuantity += quantity;
    } else if (type === 'use') {
      newQuantity = Math.max(0, newQuantity - quantity); // Prevent negative
    }
    
    // Determine status based on new quantity
    let newStatus: InventoryItem['status'] = 'in-stock';
    if (newQuantity === 0) {
      newStatus = 'out-of-stock';
    } else if (newQuantity < 10) {
      newStatus = 'low';
    }
    
    // Prepare update data
    const updateData: any = {
      quantity: newQuantity,
      status: newStatus,
      updated_at: new Date().toISOString()
    };
    
    // Set last_restocked if this is a restock operation
    if (type === 'restock') {
      updateData.last_restocked = new Date().toISOString();
      
      // Only update expiry date if provided
      if (expiryDate) {
        updateData.expiry_date = expiryDate;
      }
    }
    
    // Update the item in Supabase
    const { data: updatedData, error: updateError } = await supabase
      .from('inventory')
      .update(updateData)
      .eq('id', itemId)
      .select()
      .single();
    
    if (updateError) throw updateError;
    
    if (updatedData) {
      // Convert to InventoryItem format
      const inventoryItem = updatedData as SupabaseInventoryItem;
      return {
        id: inventoryItem.id,
        name: inventoryItem.name,
        quantity: inventoryItem.quantity,
        status: inventoryItem.status,
        category: inventoryItem.category,
        lastRestocked: inventoryItem.last_restocked,
        expiryDate: inventoryItem.expiry_date
      };
    }
    
    throw new Error('Failed to update inventory item');
    
  } catch (err) {
    console.error("Error managing inventory in Supabase, falling back to mock implementation:", err);
    
    // Fallback to mock implementation
    const itemIndex = mockInventory.findIndex(item => item.id === itemId);
    
    if (itemIndex === -1) {
      throw new Error('Inventory item not found');
    }
    
    const item = mockInventory[itemIndex];
    
    // Calculate new quantity based on action type
    let newQuantity = item.quantity;
    
    if (type === 'restock') {
      newQuantity += quantity;
    } else if (type === 'use') {
      newQuantity = Math.max(0, newQuantity - quantity); // Prevent negative
    }
    
    // Determine status based on new quantity
    let newStatus: InventoryItem['status'] = 'in-stock';
    if (newQuantity === 0) {
      newStatus = 'out-of-stock';
    } else if (newQuantity < 10) {
      newStatus = 'low';
    }
    
    const updatedItem = {
      ...item,
      quantity: newQuantity,
      status: newStatus,
      lastRestocked: type === 'restock' ? new Date().toISOString() : item.lastRestocked,
      expiryDate: type === 'restock' && expiryDate ? expiryDate : item.expiryDate
    };
    
    mockInventory[itemIndex] = updatedItem;
    
    return simulateFetch(updatedItem);
  }
};

// Update inventory item
export const updateInventoryItem = async (itemId: string, updates: Partial<Omit<InventoryItem, 'id'>>): Promise<InventoryItem> => {
  const itemIndex = mockInventory.findIndex(item => item.id === itemId);
  
  if (itemIndex === -1) {
    throw new Error('Inventory item not found');
  }
  
  // Update quantity and calculate status
  let newStatus = mockInventory[itemIndex].status;
  
  if ('quantity' in updates) {
    const quantity = updates.quantity as number;
    newStatus = quantity === 0 ? 'out-of-stock' : quantity < 10 ? 'low' : 'in-stock';
  }
  
  const updatedItem = {
    ...mockInventory[itemIndex],
    ...updates,
    status: updates.status || newStatus,
    lastRestocked: updates.quantity && updates.quantity > mockInventory[itemIndex].quantity 
      ? new Date().toISOString() 
      : mockInventory[itemIndex].lastRestocked
  };
  
  mockInventory[itemIndex] = updatedItem;
  
  return simulateFetch(updatedItem);
};