import {defineField, defineType} from 'sanity'

export const invoiceType = defineType({
  name: 'invoice',
  title: 'Invoice',
  type: 'document',
  fields: [
    defineField({
      name: 'customer',
      type: 'reference',
      to: [{type: 'customer'}],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'amount',
      type: 'number',
      validation: (rule) => rule.required().min(0),
    }),
    defineField({
      name: 'status',
      type: 'string',
      options: {
        list: [
          {title: 'Pending', value: 'pending'},
          {title: 'Paid', value: 'paid'},
        ],
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'date',
      type: 'date',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'createdAt',
      type: 'datetime',
      initialValue: () => new Date().toISOString(),
    }),
  ],
})
