import express from 'express';
import { z } from 'zod';
import { sendContactEmail } from '../services/email';

const router = express.Router();

const contactSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  subject: z.string().min(1),
  message: z.string().min(1),
});

router.post('/contact', async (req, res) => {
  try {
    const { name, email, subject, message } = contactSchema.parse(req.body);

    await sendContactEmail(name, email, subject, message);

    res.json({ message: 'Message sent successfully' });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.issues });
    }
    console.error('Contact form error:', error);
    res.status(500).json({ error: 'Failed to send message' });
  }
});

export default router;
