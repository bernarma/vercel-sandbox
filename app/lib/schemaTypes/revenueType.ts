import {defineField, defineType} from 'sanity'

export const revenueType = defineType({
  name: 'revenue',
  title: 'Revenue',
  type: 'document',
  fields: [
    defineField({
      name: 'month',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'revenue',
      type: 'number',
      validation: (rule) => rule.required().min(0),
    }),
    defineField({
      name: 'createdAt',
      type: 'datetime',
      initialValue: () => new Date().toISOString(),
    }),
  ],
})
