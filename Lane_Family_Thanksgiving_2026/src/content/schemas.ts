import { z } from 'zod';
export const schemas = {
  pages: {
    home: z.object({
      "hero": z.object({
        "headline": z.string(),
        "subheading": z.string(),
        "tagline": z.string()
      }),
      "details": z.object({
        "sectionLabel": z.string(),
        "cards": z.array(z.object({
          "id": z.string(),
          "emoji": z.string(),
          "title": z.string(),
          "body": z.string(),
          "sub": z.string()
        }))
      }),
      "rsvp": z.object({
        "sectionLabel": z.string(),
        "headline": z.string(),
        "body": z.string(),
        "cta": z.string()
      })
    }),
    signup: z.object({
      "badge": z.string(),
      "title": z.string(),
      "subtitle": z.string()
    })
  },
  data: {
    pdfs: z.array(z.object({
      "id": z.string(),
      "title": z.string(),
      "fileUrl": z.string(),
      "display": z.string(),
      "caption": z.string()
    }))
  }
};
export type Schemas = typeof schemas;