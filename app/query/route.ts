import { client } from '@/app/lib/sanity';

async function listInvoices() {
  const data = await client.fetch(`
    *[_type == "invoice" && amount == 666] {
      amount,
      "customerName": customer->name
    }
  `);
  return data;
}

export async function GET() {
  try {
    return Response.json(await listInvoices());
  } catch (error) {
    return Response.json({ error }, { status: 500 });
  }
}
