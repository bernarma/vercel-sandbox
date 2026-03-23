import {defineField, defineType} from 'sanity'

export const customerType = defineType({
  name: 'customer',
  title: 'Customer',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'email',
      type: 'string',
      validation: (rule) => rule.required().email(),
    }),
    defineField({
      name: 'imageUrl',
      type: 'string',
      description: 'URL to customer image',
    }),
    defineField({
      name: 'createdAt',
      type: 'datetime',
      initialValue: () => new Date().toISOString(),
    }),
  ],
})
