import { client } from './sanity';
import {
  CustomerField,
  CustomersTableType,
  InvoiceForm,
  InvoicesTable,
  LatestInvoiceRaw,
  Revenue,
} from './definitions';
import { formatCurrency } from './utils';

export async function fetchRevenue() {
  try {
    // Artificially delay a response for demo purposes.
    // Don't do this in production :)

    console.log('Fetching revenue data...');
    await new Promise((resolve) => setTimeout(resolve, 3000));

    const data = await client.fetch<Revenue[]>(`
      *[_type == "revenue"] {
        month,
        revenue
      }
    `);

    console.log('Data fetch completed after 3 seconds.');

    return data;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch revenue data.');
  }
}

export async function fetchLatestInvoices() {
  try {
    const data = await client.fetch<LatestInvoiceRaw[]>(`
      *[_type == "invoice"] | order(date desc)[0..5] {
        "id": _id,
        amount,
        status,
        date,
        "name": customer->name,
        "email": customer->email,
        "image_url": customer->imageUrl
      }
    `);

    const latestInvoices = data.map((invoice) => ({
      ...invoice,
      amount: formatCurrency(invoice.amount),
    }));
    return latestInvoices;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch the latest invoices.');
  }
}

export async function fetchCardData() {
  try {
    const data = await client.fetch<{
      invoices: number;
      customers: number;
      paid: number;
      pending: number;
    }>(`
      {
        "invoices": count(*[_type == "invoice"]),
        "customers": count(*[_type == "customer"]),
        "paid": math::sum(*[_type == "invoice" && status == "paid"].amount),
        "pending": math::sum(*[_type == "invoice" && status == "pending"].amount)
      }
    `);

    const numberOfInvoices = data.invoices ?? 0;
    const numberOfCustomers = data.customers ?? 0;
    const totalPaidInvoices = formatCurrency(data.paid ?? 0);
    const totalPendingInvoices = formatCurrency(data.pending ?? 0);

    return {
      numberOfCustomers,
      numberOfInvoices,
      totalPaidInvoices,
      totalPendingInvoices,
    };
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch card data.');
  }
}

const ITEMS_PER_PAGE = 6;
export async function fetchFilteredInvoices(
  query: string,
  currentPage: number,
) {
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;
  const limit = currentPage * ITEMS_PER_PAGE;

  try {
    const invoices = await client.fetch<InvoicesTable[]>(`
      *[_type == "invoice" && (
        customer->name match "*" + ${JSON.stringify(query)} + "*" ||
        customer->email match "*" + ${JSON.stringify(query)} + "*" ||
        string(amount) match "*" + ${JSON.stringify(query)} + "*" ||
        string(date) match "*" + ${JSON.stringify(query)} + "*" ||
        status match "*" + ${JSON.stringify(query)} + "*"
      )]       | order(date desc)[${offset}..${limit - 1}] {
        "id": _id,
        amount,
        date,
        status,
        "customer_id": customer._ref,
        "name": customer->name,
        "email": customer->email,
        "image_url": customer->imageUrl
      }
    `);

    return invoices;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch invoices.');
  }
}

export async function fetchInvoicesPages(query: string) {
  try {
    const data = await client.fetch<{ count: number }>(`
      count(*[_type == "invoice" && (
        customer->name match "*" + ${JSON.stringify(query)} + "*" ||
        customer->email match "*" + ${JSON.stringify(query)} + "*" ||
        string(amount) match "*" + ${JSON.stringify(query)} + "*" ||
        string(date) match "*" + ${JSON.stringify(query)} + "*" ||
        status match "*" + ${JSON.stringify(query)} + "*"
      )])
    `);

    const totalPages = Math.ceil(Number(data) / ITEMS_PER_PAGE);
    return totalPages;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch total number of invoices.');
  }
}

export async function fetchInvoiceById(id: string) {
  try {
    const data = await client.fetch<InvoiceForm>(`
      *[_type == "invoice" && _id == ${JSON.stringify(id)}][0] {
        "id": _id,
        amount,
        status,
        "customer_id": customer._ref
      }
    `);

    const invoice = data ? {
      ...data,
      // Convert amount from cents to dollars
      amount: data.amount / 100,
    } : null;

    return invoice;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch invoice.');
  }
}

export async function fetchCustomers() {
  try {
    const customers = await client.fetch<CustomerField[]>(`
      *[_type == "customer"] | order(name asc) {
        "id": _id,
        name
      }
    `);

    return customers;
  } catch (err) {
    console.error('Database Error:', err);
    throw new Error('Failed to fetch all customers.');
  }
}

export async function fetchFilteredCustomers(query: string) {
  try {
    const data = await client.fetch<CustomersTableType[]>(`
      *[_type == "customer" && (
        name match "*" + ${JSON.stringify(query)} + "*" ||
        email match "*" + ${JSON.stringify(query)} + "*"
      )] {
        "id": _id,
        name,
        email,
        "image_url": imageUrl,
        "total_invoices": count(*[_type == "invoice" && customer._ref == ^._id]),
        "total_pending": math::sum(*[_type == "invoice" && customer._ref == ^._id && status == "pending"].amount),
        "total_paid": math::sum(*[_type == "invoice" && customer._ref == ^._id && status == "paid"].amount)
      } | order(name asc)
    `);

    const customers = data.map((customer) => ({
      ...customer,
      total_pending: formatCurrency(customer.total_pending),
      total_paid: formatCurrency(customer.total_paid),
    }));

    return customers;
  } catch (err) {
    console.error('Database Error:', err);
    throw new Error('Failed to fetch customer table.');
  }
}
