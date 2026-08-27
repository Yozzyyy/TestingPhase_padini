export const knowledgeBaseData = [
  {
    id: 'ops',
    category: 'Store Operations',
    items: [
      {
        id: 'ops-1',
        question: 'Inventory Tracking (IMS)',
        answer: 'All stock movements must be logged via the IMS handheld. Use the chatbot popup for real-time SKU availability checks across regional branches.'
      },
      {
        id: 'ops-2',
        question: 'Damaged Merchandise',
        answer: "Items with defects must be tagged with a 'DEF' label and stored in the QC bin. Floor supervisors must sign off weekly."
      }
    ]
  },
  {
    id: 'sales',
    category: 'Sales & Returns',
    items: [
      {
        id: 'sales-1',
        question: 'Exchange Policy',
        answer: 'Exchanges are valid within 14 days of purchase with original receipt. Tags must be intact. Lingerie and accessories are excluded.'
      },
      {
        id: 'sales-2',
        question: 'Member Discounts',
        answer: 'PMP (Padini Multi-brand Privilege) members receive 10% off on normal priced items. Verify ID on the POS app.'
      }
    ]
  },
  {
    id: 'conduct',
    category: 'Staff Conduct',
    items: [
      {
        id: 'conduct-1',
        question: 'Dress Code',
        answer: 'Smart casual in neutral tones (Black, White, Grey). Branded Padini apparel is encouraged. Name badges visible at all times.'
      },
      {
        id: 'conduct-2',
        question: 'Crisis Contacts',
        answer: 'Regional Manager: EXT 882. Security Hotline: EXT 991. IT Portal: https://it.padini.local.'
      }
    ]
  }
];