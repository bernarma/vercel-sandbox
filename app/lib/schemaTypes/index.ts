import { type SchemaTypeDefinition } from 'sanity'
import { eventType } from './eventType'
import { userType } from './userType'
import { customerType } from './customerType'
import { invoiceType } from './invoiceType'
import { revenueType } from './revenueType'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [eventType, userType, customerType, invoiceType, revenueType],
}
