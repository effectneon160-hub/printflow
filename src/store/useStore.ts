import { create } from 'zustand';

export type QuoteStatus = 'Draft' | 'Sent' | 'Approved' | 'Rejected';
export type JobStatus =
'Pending' |
'In Design' |
'Approved' |
'In Production' |
'Completed';
export type InvoiceStatus = 'Unpaid' | 'Partial' | 'Paid' | 'Overdue';

export interface Customer {
  id: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  totalOrders: number;
  totalSpent: number;
  createdAt: string;
}
export interface QuoteItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}
export interface MockupElement {
  id: string;
  type: 'text' | 'image' | 'shape';
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  opacity: number;
  content?: string;
  color?: string;
  shapeType?: 'rect' | 'circle';
  fontSize?: number;
}

export interface Quote {
  id: string;
  customerId: string;
  status: QuoteStatus;
  items: QuoteItem[];
  subtotal: number;
  tax: number;
  discount: number;
  total: number;
  notes: string;
  createdAt: string;
  updatedAt: string;
  mockupElements?: MockupElement[];
  mockupBackground?: string;
}
export interface Product {
  id: string;
  name: string;
  category: string;
  basePrice: number;
  image: string;
  variants: {size: string;color: string;sku: string;}[];
  description: string;
  inStock: boolean;
}
export interface Job {
  id: string;
  quoteId: string;
  customerId: string;
  title: string;
  status: JobStatus;
  priority: 'Low' | 'Medium' | 'High' | 'Rush';
  dueDate: string;
  assignedTo: string;
  notes: string;
  createdAt: string;
  updatedAt: string;
}
export interface Invoice {
  id: string;
  jobId: string;
  customerId: string;
  quoteId: string;
  items: {
    description: string;
    quantity: number;
    unitPrice: number;
    total: number;
  }[];
  subtotal: number;
  tax: number;
  discount: number;
  total: number;
  amountPaid: number;
  status: InvoiceStatus;
  dueDate: string;
  createdAt: string;
}
export interface Activity {
  id: string;
  type:
  'quote_created' |
  'quote_sent' |
  'quote_approved' |
  'customer_added' |
  'payment_received' |
  'job_created' |
  'job_status_changed' |
  'invoice_created' |
  'invoice_paid';
  description: string;
  date: string;
}

interface StoreState {
  customers: Customer[];
  quotes: Quote[];
  activities: Activity[];
  products: Product[];
  jobs: Job[];
  invoices: Invoice[];
  addCustomer: (
  c: Omit<Customer, 'id' | 'createdAt' | 'totalOrders' | 'totalSpent'>)
  => void;
  updateCustomer: (id: string, data: Partial<Customer>) => void;
  addQuote: (q: Omit<Quote, 'id' | 'createdAt' | 'updatedAt'>) => string;
  updateQuote: (id: string, data: Partial<Quote>) => void;
  addActivity: (a: Omit<Activity, 'id' | 'date'>) => void;
  addJob: (j: Omit<Job, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateJob: (id: string, data: Partial<Job>) => void;
  addInvoice: (i: Omit<Invoice, 'id' | 'createdAt'>) => void;
  updateInvoice: (id: string, data: Partial<Invoice>) => void;
}

const CUSTOMERS: Customer[] = [
{
  id: 'c1',
  name: 'David Miller',
  company: 'Riverside Church',
  email: 'david@riverside.org',
  phone: '(555) 123-4567',
  totalOrders: 12,
  totalSpent: 14500,
  createdAt: '2025-01-15T10:00:00Z'
},
{
  id: 'c2',
  name: 'Sarah Jenkins',
  company: 'Metro Fire Department',
  email: 'sjenkins@metrofire.gov',
  phone: '(555) 987-6543',
  totalOrders: 5,
  totalSpent: 8200,
  createdAt: '2025-02-20T14:30:00Z'
},
{
  id: 'c3',
  name: 'Michael Chang',
  company: 'Lincoln High School',
  email: 'mchang@lincolnhigh.edu',
  phone: '(555) 456-7890',
  totalOrders: 8,
  totalSpent: 6100,
  createdAt: '2025-03-05T09:15:00Z'
},
{
  id: 'c4',
  name: 'Jessica Torres',
  company: 'Craft Brewery Co',
  email: 'jessica@craftbrewery.com',
  phone: '(555) 222-3333',
  totalOrders: 3,
  totalSpent: 2400,
  createdAt: '2025-04-10T11:45:00Z'
},
{
  id: 'c5',
  name: 'Tom Bradley',
  company: 'Summit CrossFit',
  email: 'tom@summitcrossfit.com',
  phone: '(555) 888-9999',
  totalOrders: 1,
  totalSpent: 540,
  createdAt: '2025-05-12T16:20:00Z'
},
{
  id: 'c6',
  name: 'Emily Chen',
  company: 'Downtown Dental',
  email: 'echen@downtowndental.com',
  phone: '(555) 444-5555',
  totalOrders: 2,
  totalSpent: 1200,
  createdAt: '2025-06-01T08:00:00Z'
},
{
  id: 'c7',
  name: 'Chris Nakamura',
  company: 'Bay Area Tech Summit',
  email: 'chris@techsummit.io',
  phone: '(555) 777-8888',
  totalOrders: 4,
  totalSpent: 9500,
  createdAt: '2025-07-15T13:10:00Z'
},
{
  id: 'c8',
  name: 'Natalie Reeves',
  company: 'Golden State Realty',
  email: 'natalie@gsrealty.com',
  phone: '(555) 666-7777',
  totalOrders: 6,
  totalSpent: 4800,
  createdAt: '2025-08-22T15:45:00Z'
}];


const QUOTES: Quote[] = [
{
  id: 'Q-1001',
  customerId: 'c1',
  status: 'Approved',
  items: [
  {
    id: 'i1',
    description: 'Custom Youth T-Shirts (Navy)',
    quantity: 100,
    unitPrice: 12,
    total: 1200
  }],

  subtotal: 1200,
  tax: 0,
  discount: 0,
  total: 1200,
  notes: 'Need by end of month for youth retreat.',
  createdAt: '2025-09-01T10:00:00Z',
  updatedAt: '2025-09-05T14:00:00Z'
},
{
  id: 'Q-1002',
  customerId: 'c2',
  status: 'Sent',
  items: [
  {
    id: 'i2',
    description: 'Embroidered Polos (Station 42)',
    quantity: 50,
    unitPrice: 35,
    total: 1750
  },
  {
    id: 'i3',
    description: 'Heavyweight Hoodies',
    quantity: 50,
    unitPrice: 45,
    total: 2250
  }],

  subtotal: 4000,
  tax: 320,
  discount: 400,
  total: 3920,
  notes: 'Applied 10% municipal discount.',
  createdAt: '2025-09-10T09:30:00Z',
  updatedAt: '2025-09-10T09:30:00Z'
},
{
  id: 'Q-1003',
  customerId: 'c3',
  status: 'Draft',
  items: [
  {
    id: 'i4',
    description: 'Track Team Windbreakers',
    quantity: 30,
    unitPrice: 55,
    total: 1650
  }],

  subtotal: 1650,
  tax: 132,
  discount: 0,
  total: 1782,
  notes: 'Awaiting final roster sizes.',
  createdAt: '2025-09-15T11:15:00Z',
  updatedAt: '2025-09-15T11:15:00Z'
},
{
  id: 'Q-1004',
  customerId: 'c4',
  status: 'Approved',
  items: [
  {
    id: 'i5',
    description: 'Staff Canvas Aprons',
    quantity: 20,
    unitPrice: 28,
    total: 560
  }],

  subtotal: 560,
  tax: 44.8,
  discount: 0,
  total: 604.8,
  notes: 'Logo centered on chest.',
  createdAt: '2025-09-18T14:20:00Z',
  updatedAt: '2025-09-19T10:00:00Z'
},
{
  id: 'Q-1005',
  customerId: 'c5',
  status: 'Sent',
  items: [
  {
    id: 'i6',
    description: 'Dri-Fit Competition Tees',
    quantity: 150,
    unitPrice: 18,
    total: 2700
  }],

  subtotal: 2700,
  tax: 216,
  discount: 100,
  total: 2816,
  notes: 'Rush order for upcoming competition.',
  createdAt: '2025-09-20T16:45:00Z',
  updatedAt: '2025-09-21T09:00:00Z'
},
{
  id: 'Q-1006',
  customerId: 'c7',
  status: 'Approved',
  items: [
  {
    id: 'i7',
    description: 'Tech Summit Swag Bundle',
    quantity: 500,
    unitPrice: 15,
    total: 7500
  }],

  subtotal: 7500,
  tax: 600,
  discount: 0,
  total: 8100,
  notes: 'Deliver to venue by Sept 8.',
  createdAt: '2025-08-20T09:00:00Z',
  updatedAt: '2025-08-25T10:00:00Z'
},
{
  id: 'Q-1007',
  customerId: 'c8',
  status: 'Approved',
  items: [
  {
    id: 'i8',
    description: 'Realtor Branded Polos',
    quantity: 20,
    unitPrice: 35,
    total: 700
  }],

  subtotal: 700,
  tax: 56,
  discount: 0,
  total: 756,
  notes: 'Gold embroidery on navy.',
  createdAt: '2025-08-10T14:00:00Z',
  updatedAt: '2025-08-12T09:00:00Z'
}];


const PRODUCTS: Product[] = [
{
  id: 'p1',
  name: 'Classic Cotton T-Shirt',
  category: 'T-Shirts',
  basePrice: 12,
  image:
  'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&q=80',
  variants: [
  { size: 'S', color: 'White', sku: 'TS-W-S' },
  { size: 'M', color: 'White', sku: 'TS-W-M' },
  { size: 'L', color: 'White', sku: 'TS-W-L' },
  { size: 'XL', color: 'White', sku: 'TS-W-XL' }],

  description:
  '100% combed ringspun cotton, 4.3 oz. Classic fit with tear-away label.',
  inStock: true
},
{
  id: 'p2',
  name: 'Premium Performance Polo',
  category: 'Polos',
  basePrice: 35,
  image:
  'https://images.unsplash.com/photo-1586363104862-3a5e2ab60d99?w=400&q=80',
  variants: [
  { size: 'M', color: 'Navy', sku: 'PO-N-M' },
  { size: 'L', color: 'Navy', sku: 'PO-N-L' }],

  description: 'Moisture-wicking, snag-resistant performance polo.',
  inStock: true
},
{
  id: 'p3',
  name: 'Heavyweight Pullover Hoodie',
  category: 'Hoodies',
  basePrice: 45,
  image:
  'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400&q=80',
  variants: [
  { size: 'L', color: 'Black', sku: 'HO-B-L' },
  { size: 'XL', color: 'Black', sku: 'HO-B-XL' }],

  description:
  '10 oz. cotton/poly blend, fleece-lined hood and kangaroo pocket.',
  inStock: true
},
{
  id: 'p4',
  name: 'Structured Trucker Hat',
  category: 'Hats',
  basePrice: 15,
  image:
  'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=400&q=80',
  variants: [{ size: 'OSFA', color: 'Charcoal/White', sku: 'HA-CW-OS' }],
  description: 'Mesh back, snap closure, mid-profile structured front.',
  inStock: true
},
{
  id: 'p5',
  name: 'Canvas Tote Bag',
  category: 'Bags',
  basePrice: 8.5,
  image:
  'https://images.unsplash.com/photo-1597484662317-9bd7bdda2907?w=400&q=80',
  variants: [{ size: 'Standard', color: 'Natural', sku: 'BA-N-ST' }],
  description: '12 oz. heavy canvas with reinforced web handles.',
  inStock: true
},
{
  id: 'p6',
  name: 'Dri-Fit Competition Tee',
  category: 'T-Shirts',
  basePrice: 18,
  image:
  'https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=400&q=80',
  variants: [
  { size: 'S', color: 'Red', sku: 'TS-R-S' },
  { size: 'M', color: 'Red', sku: 'TS-R-M' },
  { size: 'L', color: 'Red', sku: 'TS-R-L' }],

  description: 'Breathable, lightweight athletic fit for competition.',
  inStock: true
},
{
  id: 'p7',
  name: 'Team Warm-up Jacket',
  category: 'Jackets',
  basePrice: 55,
  image:
  'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&q=80',
  variants: [
  { size: 'M', color: 'Royal', sku: 'JA-R-M' },
  { size: 'L', color: 'Royal', sku: 'JA-R-L' }],

  description: 'Water-resistant shell with mesh lining.',
  inStock: true
},
{
  id: 'p8',
  name: 'Reversible Mesh Jersey',
  category: 'Jerseys',
  basePrice: 22,
  image:
  'https://images.unsplash.com/photo-1504450758481-7338eba7524a?w=400&q=80',
  variants: [{ size: 'L', color: 'Black/White', sku: 'JE-BW-L' }],
  description: 'Two layers of 100% polyester mesh, reversible.',
  inStock: true
}];


const JOBS: Job[] = [
{
  id: 'J-2001',
  quoteId: 'Q-1001',
  customerId: 'c1',
  title: 'Youth Retreat Shirts',
  status: 'In Production',
  priority: 'Medium',
  dueDate: '2025-10-15T00:00:00Z',
  assignedTo: 'Alex M.',
  notes: 'Blanks arriving Thursday.',
  createdAt: '2025-09-05T15:00:00Z',
  updatedAt: '2025-09-22T08:00:00Z'
},
{
  id: 'J-2002',
  quoteId: 'Q-1004',
  customerId: 'c4',
  title: 'Brewery Staff Aprons',
  status: 'Approved',
  priority: 'High',
  dueDate: '2025-10-05T00:00:00Z',
  assignedTo: 'Sarah K.',
  notes: 'Logo approved, ready for embroidery.',
  createdAt: '2025-09-19T11:00:00Z',
  updatedAt: '2025-09-20T14:00:00Z'
},
{
  id: 'J-2003',
  quoteId: 'Q-1006',
  customerId: 'c7',
  title: 'Tech Summit Swag',
  status: 'Completed',
  priority: 'Rush',
  dueDate: '2025-09-10T00:00:00Z',
  assignedTo: 'Mike R.',
  notes: 'Delivered to venue on time.',
  createdAt: '2025-08-25T09:00:00Z',
  updatedAt: '2025-09-09T16:00:00Z'
},
{
  id: 'J-2004',
  quoteId: 'Q-1002',
  customerId: 'c2',
  title: 'Station 42 Polos & Hoodies',
  status: 'In Design',
  priority: 'Medium',
  dueDate: '2025-10-20T00:00:00Z',
  assignedTo: 'Jessica T.',
  notes: 'Digitizing new patch logo.',
  createdAt: '2025-09-21T10:00:00Z',
  updatedAt: '2025-09-21T10:00:00Z'
},
{
  id: 'J-2005',
  quoteId: 'Q-1007',
  customerId: 'c8',
  title: 'Realtor Branded Polos',
  status: 'Completed',
  priority: 'Low',
  dueDate: '2025-09-20T00:00:00Z',
  assignedTo: 'Alex M.',
  notes: 'Shipped via FedEx.',
  createdAt: '2025-08-12T10:00:00Z',
  updatedAt: '2025-09-18T12:00:00Z'
},
{
  id: 'J-2006',
  quoteId: 'Q-1003',
  customerId: 'c3',
  title: 'Track Windbreakers',
  status: 'Pending',
  priority: 'Low',
  dueDate: '2025-11-01T00:00:00Z',
  assignedTo: 'Unassigned',
  notes: 'Waiting on final sizes from coach.',
  createdAt: '2025-09-22T09:00:00Z',
  updatedAt: '2025-09-22T09:00:00Z'
},
{
  id: 'J-2007',
  quoteId: 'Q-1005',
  customerId: 'c5',
  title: 'CrossFit Competition Tees',
  status: 'Pending',
  priority: 'Rush',
  dueDate: '2025-10-01T00:00:00Z',
  assignedTo: 'Sarah K.',
  notes: 'Rush — competition is Oct 3.',
  createdAt: '2025-09-21T12:00:00Z',
  updatedAt: '2025-09-21T12:00:00Z'
}];


const INVOICES: Invoice[] = [
{
  id: 'INV-3001',
  jobId: 'J-2003',
  customerId: 'c7',
  quoteId: 'Q-1006',
  items: [
  {
    description: 'Tech Summit Swag Bundle',
    quantity: 500,
    unitPrice: 15,
    total: 7500
  }],

  subtotal: 7500,
  tax: 600,
  discount: 0,
  total: 8100,
  amountPaid: 8100,
  status: 'Paid',
  dueDate: '2025-09-25T00:00:00Z',
  createdAt: '2025-09-10T00:00:00Z'
},
{
  id: 'INV-3002',
  jobId: 'J-2001',
  customerId: 'c1',
  quoteId: 'Q-1001',
  items: [
  {
    description: 'Custom Youth T-Shirts (Navy)',
    quantity: 100,
    unitPrice: 12,
    total: 1200
  }],

  subtotal: 1200,
  tax: 0,
  discount: 0,
  total: 1200,
  amountPaid: 600,
  status: 'Partial',
  dueDate: '2025-10-15T00:00:00Z',
  createdAt: '2025-09-05T16:00:00Z'
},
{
  id: 'INV-3003',
  jobId: 'J-2005',
  customerId: 'c8',
  quoteId: 'Q-1007',
  items: [
  {
    description: 'Realtor Branded Polos',
    quantity: 20,
    unitPrice: 35,
    total: 700
  }],

  subtotal: 700,
  tax: 56,
  discount: 0,
  total: 756,
  amountPaid: 0,
  status: 'Overdue',
  dueDate: '2025-09-01T00:00:00Z',
  createdAt: '2025-08-15T00:00:00Z'
},
{
  id: 'INV-3004',
  jobId: 'J-2002',
  customerId: 'c4',
  quoteId: 'Q-1004',
  items: [
  {
    description: 'Staff Canvas Aprons',
    quantity: 20,
    unitPrice: 28,
    total: 560
  }],

  subtotal: 560,
  tax: 44.8,
  discount: 0,
  total: 604.8,
  amountPaid: 0,
  status: 'Unpaid',
  dueDate: '2025-10-19T00:00:00Z',
  createdAt: '2025-09-19T12:00:00Z'
}];


const ACTIVITIES: Activity[] = [
{
  id: 'a1',
  type: 'quote_approved',
  description: 'Quote Q-1004 approved by Craft Brewery Co',
  date: '2025-09-19T10:00:00Z'
},
{
  id: 'a2',
  type: 'quote_sent',
  description: 'Quote Q-1005 sent to Summit CrossFit',
  date: '2025-09-21T09:00:00Z'
},
{
  id: 'a3',
  type: 'job_created',
  description: 'Job J-2007 created for Summit CrossFit',
  date: '2025-09-21T12:00:00Z'
},
{
  id: 'a4',
  type: 'invoice_paid',
  description: 'Payment of $8,100 received for INV-3001',
  date: '2025-09-20T14:00:00Z'
},
{
  id: 'a5',
  type: 'job_status_changed',
  description: 'Job J-2001 moved to In Production',
  date: '2025-09-22T08:00:00Z'
},
{
  id: 'a6',
  type: 'customer_added',
  description: 'New customer Golden State Realty added',
  date: '2025-08-22T15:45:00Z'
}];


export const useStore = create<StoreState>((set) => ({
  customers: CUSTOMERS,
  quotes: QUOTES,
  activities: ACTIVITIES,
  products: PRODUCTS,
  jobs: JOBS,
  invoices: INVOICES,

  addCustomer: (d) =>
  set((s) => {
    const c: Customer = {
      ...d,
      id: `c_${Date.now()}`,
      totalOrders: 0,
      totalSpent: 0,
      createdAt: new Date().toISOString()
    };
    return {
      customers: [c, ...s.customers],
      activities: [
      {
        id: `a_${Date.now()}`,
        type: 'customer_added',
        description: `New customer ${c.company} added`,
        date: new Date().toISOString()
      },
      ...s.activities]

    };
  }),
  updateCustomer: (id, d) =>
  set((s) => ({
    customers: s.customers.map((c) => c.id === id ? { ...c, ...d } : c)
  })),

  addQuote: (d) => {
    let newId = '';
    set((s) => {
      const q: Quote = {
        ...d,
        id: `Q-${1000 + s.quotes.length + 1}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      newId = q.id;
      const cust = s.customers.find((c) => c.id === d.customerId);
      return {
        quotes: [q, ...s.quotes],
        activities: [
        {
          id: `a_${Date.now()}`,
          type: d.status === 'Sent' ? 'quote_sent' : 'quote_created',
          description: `${d.status === 'Sent' ? 'Sent' : 'Draft'} Quote ${q.id} for ${cust?.company || 'Customer'}`,
          date: new Date().toISOString()
        },
        ...s.activities]
      };
    });
    return newId;
  },
  updateQuote: (id, d) =>
  set((s) => {
    const q = s.quotes.find((x) => x.id === id);
    const acts = [...s.activities];
    if (d.status && d.status !== q?.status) {
      const cust = s.customers.find((c) => c.id === q?.customerId);
      acts.unshift({
        id: `a_${Date.now()}`,
        type: d.status === 'Approved' ? 'quote_approved' : 'quote_sent',
        description: `Quote ${id} ${d.status === 'Approved' ? 'approved by' : 'sent to'} ${cust?.company}`,
        date: new Date().toISOString()
      });
    }
    return {
      quotes: s.quotes.map((x) =>
      x.id === id ? { ...x, ...d, updatedAt: new Date().toISOString() } : x
      ),
      activities: acts
    };
  }),

  addActivity: (d) =>
  set((s) => ({
    activities: [
    { ...d, id: `a_${Date.now()}`, date: new Date().toISOString() },
    ...s.activities]

  })),

  addJob: (d) =>
  set((s) => {
    const j: Job = {
      ...d,
      id: `J-${2000 + s.jobs.length + 1}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    const cust = s.customers.find((c) => c.id === d.customerId);
    return {
      jobs: [j, ...s.jobs],
      activities: [
      {
        id: `a_${Date.now()}`,
        type: 'job_created',
        description: `Job ${j.id} created for ${cust?.company}`,
        date: new Date().toISOString()
      },
      ...s.activities]

    };
  }),
  updateJob: (id, d) =>
  set((s) => {
    const acts = [...s.activities];
    if (d.status)
    acts.unshift({
      id: `a_${Date.now()}`,
      type: 'job_status_changed',
      description: `Job ${id} moved to ${d.status}`,
      date: new Date().toISOString()
    });
    return {
      jobs: s.jobs.map((j) =>
      j.id === id ? { ...j, ...d, updatedAt: new Date().toISOString() } : j
      ),
      activities: acts
    };
  }),

  addInvoice: (d) =>
  set((s) => {
    const inv: Invoice = {
      ...d,
      id: `INV-${3000 + s.invoices.length + 1}`,
      createdAt: new Date().toISOString()
    };
    const cust = s.customers.find((c) => c.id === d.customerId);
    return {
      invoices: [inv, ...s.invoices],
      activities: [
      {
        id: `a_${Date.now()}`,
        type: 'invoice_created',
        description: `Invoice ${inv.id} generated for ${cust?.company}`,
        date: new Date().toISOString()
      },
      ...s.activities]

    };
  }),
  updateInvoice: (id, d) =>
  set((s) => {
    const inv = s.invoices.find((i) => i.id === id);
    const acts = [...s.activities];
    if (d.amountPaid !== undefined && d.amountPaid > (inv?.amountPaid || 0)) {
      acts.unshift({
        id: `a_${Date.now()}`,
        type: 'invoice_paid',
        description: `Payment received for Invoice ${id}`,
        date: new Date().toISOString()
      });
    }
    return {
      invoices: s.invoices.map((i) => i.id === id ? { ...i, ...d } : i),
      activities: acts
    };
  })
}));