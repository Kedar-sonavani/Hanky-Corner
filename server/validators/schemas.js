const { z } = require('zod');

const productSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().optional(),
  price: z.number().positive("Price must be a positive number"),
  discount_price: z.number().positive().optional().nullable(),
  stock: z.number().int().nonnegative("Stock cannot be negative"),
  images: z.array(z.string().url()).min(1, "At least one image is required"),
  is_featured: z.boolean().optional(),
  category_ids: z.array(z.string().uuid()).optional(),
  material: z.string().optional(),
  care_instructions: z.string().optional(),
  origin: z.string().optional(),
  manufacturer: z.string().optional(),
  weight: z.string().optional(),
});

const orderSchema = z.object({
  customer_name: z.string().min(1, "Name is required"),
  customer_email: z.string().email("Invalid email address"),
  customer_phone: z.string().optional(),
  shipping_address: z.string().min(10, "Shipping address must be detailed"),
  total_price: z.number().positive(),
  items: z.array(z.object({
    product_id: z.string().uuid(),
    quantity: z.number().int().positive(),
    price: z.number().positive(),
    title: z.string()
  })).min(1, "Order must have at least one item")
});

module.exports = {
  productSchema,
  orderSchema
};
