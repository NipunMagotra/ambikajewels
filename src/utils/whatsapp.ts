import { siteConfig } from '@/config/siteConfig';
import type { Product, CartItem } from '@/types';

export function getProductWhatsAppUrl(
  product: Product, 
  selectedFinish?: string, 
  quantity: number = 1
): string {
  const phone = siteConfig.contact.whatsapp.replace(/[^0-9]/g, '') || '919419100000';
  const finish = selectedFinish || product.metal_finishes?.[0] || '22K Yellow Gold';
  
  const mainImage = product.images?.[0] || '/hero-clean.png';
  const imageUrl = mainImage.startsWith('http') 
    ? mainImage 
    : `https://ambika-jewels.com${mainImage}`;

  const message = 
`Namaste Ambika Jewels! 🙏

I would like to buy the following piece:

📌 *Product:* ${product.name}
💰 *Price:* ${product.display_price}
✨ *Finish:* ${finish}
🔢 *Quantity:* ${quantity}
📦 *Category:* ${product.category}

🖼️ *Product Image:* ${imageUrl}

📝 *Description:* ${product.description.replace(/\n+/g, ' ')}

Please confirm availability and help me complete my order!`;

  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}

export function getCartWhatsAppUrl(
  items: CartItem[], 
  totalAmountStr: string, 
  customerName?: string, 
  customerPhone?: string
): string {
  const phone = siteConfig.contact.whatsapp.replace(/[^0-9]/g, '') || '919419100000';
  
  const itemLines = items.map((item, idx) => 
    `${idx + 1}. *${item.name}* [${item.metal_finish}]\n   Qty: ${item.quantity} | Total: ₹${(item.price * item.quantity / 100).toLocaleString('en-IN')}`
  ).join('\n\n');

  const message = 
`Namaste Ambika Jewels! 🙏

I would like to place an order for these items:

${itemLines}

💳 *Total Order Amount:* ${totalAmountStr}
${customerName ? `👤 *Name:* ${customerName}\n` : ''}${customerPhone ? `📞 *Phone:* ${customerPhone}\n` : ''}
Please confirm availability and guide me on payment!`;

  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}
