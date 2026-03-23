import {defineField, defineType} from 'sanity'

export const userType = defineType({
  name: 'user',
  title: 'User',
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
      name: 'password',
      type: 'string',
      description: 'Hashed password',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'createdAt',
      type: 'datetime',
      initialValue: () => new Date().toISOString(),
    }),
  ],
})
