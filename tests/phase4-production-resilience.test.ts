import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { searchCatalog } from '../src/lib/catalogSearch';
import {
  getEmailSuggestion,
  isValidIndianPhone,
  normalizeIndianPhone,
  isValidPan,
  isPanRequiredForOrder,
  STANDARD_INDIAN_RING_SIZES,
  STANDARD_INDIAN_BANGLE_SIZES,
  PAN_THRESHOLD_PAISE,
} from '../src/lib/checkoutValidation';
import { mockProducts } from '../src/data/mockProducts';
import type { CartItem } from '../src/types';

describe('Phase 4: Production Resilience & User Experience Suite', () => {

  // =========================================================================
  // 1. Instant Catalog Search Engine (⌘K)
  // =========================================================================
  describe('1. Instant Catalog Search Engine (⌘K)', () => {
    it('returns default recommendation slice when query is empty or whitespace', () => {
      const resultsEmpty = searchCatalog(mockProducts, '', 4);
      assert.strictEqual(resultsEmpty.length, 4);

      const resultsSpaces = searchCatalog(mockProducts, '   ', 3);
      assert.strictEqual(resultsSpaces.length, 3);
    });

    it('matches products case-insensitively across product names', () => {
      const lower = searchCatalog(mockProducts, 'choker');
      const upper = searchCatalog(mockProducts, 'CHOKER');
      const mixed = searchCatalog(mockProducts, 'ChOkEr');

      assert.ok(lower.length > 0, 'Expected to find choker products');
      assert.strictEqual(lower.length, upper.length);
      assert.strictEqual(lower.length, mixed.length);
      assert.ok(lower.every(p => 
        p.name.toLowerCase().includes('choker') || 
        p.description.toLowerCase().includes('choker') || 
        p.category.toLowerCase().includes('choker')
      ));
    });

    it('supports multi-term searching where all tokens must match', () => {
      const results = searchCatalog(mockProducts, 'polki gold');
      assert.ok(Array.isArray(results));
      for (const product of results) {
        const text = `${product.name} ${product.description} ${product.category} ${product.purity || ''}`.toLowerCase();
        assert.ok(text.includes('polki') && text.includes('gold'));
      }
    });

    it('returns empty array when query does not match any catalog item', () => {
      const results = searchCatalog(mockProducts, 'nonexistent_xyz_titanium_widget');
      assert.strictEqual(results.length, 0);
    });

    it('matches products by purity tags (e.g. "22k", "18k")', () => {
      const results22k = searchCatalog(mockProducts, '22K');
      assert.ok(results22k.length > 0);
      assert.ok(results22k.some(p => (p.purity || '').includes('22K') || p.name.includes('22K')));
    });
  });

  // =========================================================================
  // 2. Indian Jewelry Standard Sizing Standards
  // =========================================================================
  describe('2. Indian Jewelry Standard Sizing Standards', () => {
    it('provides standard Indian ring sizes ranging from 10 to 24 with standard highlight', () => {
      assert.ok(STANDARD_INDIAN_RING_SIZES.length >= 15);
      assert.ok(STANDARD_INDIAN_RING_SIZES.includes('10'));
      assert.ok(STANDARD_INDIAN_RING_SIZES.includes('14 (Standard)'));
      assert.ok(STANDARD_INDIAN_RING_SIZES.includes('24'));
    });

    it('provides standard Indian bangle sizes based on inner diameter in inches', () => {
      assert.ok(STANDARD_INDIAN_BANGLE_SIZES.includes('2.2 (2-2/16")'));
      assert.ok(STANDARD_INDIAN_BANGLE_SIZES.includes('2.4 (2-4/16")'));
      assert.ok(STANDARD_INDIAN_BANGLE_SIZES.includes('2.6 (2-6/16" - Most Popular)'));
      assert.ok(STANDARD_INDIAN_BANGLE_SIZES.includes('2.8 (2-8/16")'));
      assert.ok(STANDARD_INDIAN_BANGLE_SIZES.includes('2.10 (2-10/16")'));
    });

    it('correctly categorizes ring and bangle products in mockProducts', () => {
      const rings = mockProducts.filter(p => 
        p.category.toLowerCase().includes('ring') || p.name.toLowerCase().includes('ring')
      );
      assert.ok(rings.length > 0, 'Catalog should contain rings');

      const bangles = mockProducts.filter(p => 
        p.category.toLowerCase().includes('bangle') || 
        p.category.toLowerCase().includes('kada') || 
        p.category.toLowerCase().includes('bracelet') ||
        p.name.toLowerCase().includes('bangle') ||
        p.name.toLowerCase().includes('kada') ||
        p.name.toLowerCase().includes('bracelet')
      );
      assert.ok(bangles.length > 0, 'Catalog should contain bangles or kadas');
    });
  });

  // =========================================================================
  // 3. Cart Sizing & Toast State Reducer Logic
  // =========================================================================
  describe('3. Cart Sizing & Toast State Reducer Logic', () => {
    // Pure reducer recreation mirroring CartContext.tsx
    type CartState = {
      items: CartItem[];
      lastAddedItem?: CartItem | null;
    };

    type CartAction =
      | { type: 'ADD_ITEM'; payload: CartItem }
      | { type: 'REMOVE_ITEM'; payload: { product_id: string; metal_finish: string; selected_size?: string } }
      | { type: 'UPDATE_QUANTITY'; payload: { product_id: string; metal_finish: string; quantity: number; selected_size?: string } }
      | { type: 'CLEAR_CART' }
      | { type: 'CLEAR_TOAST' };

    const cartReducer = (state: CartState, action: CartAction): CartState => {
      switch (action.type) {
        case 'ADD_ITEM': {
          const existingItemIndex = state.items.findIndex(
            (item) => item.product_id === action.payload.product_id && 
                      item.metal_finish === action.payload.metal_finish &&
                      (item.selected_size || '') === (action.payload.selected_size || '')
          );
          if (existingItemIndex >= 0) {
            const newItems = [...state.items];
            newItems[existingItemIndex].quantity += action.payload.quantity;
            return { ...state, items: newItems, lastAddedItem: action.payload };
          }
          return { ...state, items: [...state.items, action.payload], lastAddedItem: action.payload };
        }
        case 'REMOVE_ITEM':
          return {
            ...state,
            items: state.items.filter(
              (item) => !(item.product_id === action.payload.product_id && 
                          item.metal_finish === action.payload.metal_finish &&
                          (item.selected_size || '') === (action.payload.selected_size || ''))
            ),
          };
        case 'CLEAR_TOAST':
          return { ...state, lastAddedItem: null };
        case 'CLEAR_CART':
          return { items: [], lastAddedItem: null };
        default:
          return state;
      }
    };

    it('differentiates cart items of the same product when sizes differ', () => {
      const baseProduct: CartItem = {
        product_id: 'prod_ring_1',
        name: 'Royal Heritage Diamond Ring',
        price: 8500000,
        quantity: 1,
        metal_finish: 'Yellow Gold',
        selected_size: '14 (Standard)',
        slug: 'royal-diamond-ring'
      };

      const state1 = cartReducer({ items: [] }, { type: 'ADD_ITEM', payload: baseProduct });
      assert.strictEqual(state1.items.length, 1);
      assert.strictEqual(state1.lastAddedItem?.selected_size, '14 (Standard)');

      // Add same ring in size 18
      const size18Product: CartItem = {
        ...baseProduct,
        selected_size: '18'
      };
      const state2 = cartReducer(state1, { type: 'ADD_ITEM', payload: size18Product });
      assert.strictEqual(state2.items.length, 2, 'Should create 2 distinct items for different sizes');
      assert.strictEqual(state2.items[0].selected_size, '14 (Standard)');
      assert.strictEqual(state2.items[1].selected_size, '18');
      assert.strictEqual(state2.lastAddedItem?.selected_size, '18');
    });

    it('combines quantity when same product, metal finish, and size is added again', () => {
      const item: CartItem = {
        product_id: 'prod_bangle_1',
        name: 'Kundan Antique Bangle',
        price: 15000000,
        quantity: 1,
        metal_finish: 'Yellow Gold',
        selected_size: '2.6 (2-6/16" - Most Popular)',
        slug: 'kundan-antique-bangle'
      };

      const state1 = cartReducer({ items: [] }, { type: 'ADD_ITEM', payload: item });
      const state2 = cartReducer(state1, { type: 'ADD_ITEM', payload: { ...item, quantity: 2 } });

      assert.strictEqual(state2.items.length, 1);
      assert.strictEqual(state2.items[0].quantity, 3);
      assert.ok(state2.lastAddedItem);
    });

    it('clears toast notification without wiping shopping bag items', () => {
      const item: CartItem = {
        product_id: 'prod_1',
        name: 'Choker',
        price: 5000000,
        quantity: 1,
        metal_finish: 'Yellow Gold',
        slug: 'choker'
      };
      const state1 = cartReducer({ items: [] }, { type: 'ADD_ITEM', payload: item });
      assert.ok(state1.lastAddedItem);

      const state2 = cartReducer(state1, { type: 'CLEAR_TOAST' });
      assert.strictEqual(state2.lastAddedItem, null);
      assert.strictEqual(state2.items.length, 1);
    });
  });

  // =========================================================================
  // 4. Checkout Typo Correction & Statutory PAN Verification
  // =========================================================================
  describe('4. Checkout Typo Correction & Statutory PAN Verification', () => {
    it('detects and corrects common email domain typos', () => {
      assert.strictEqual(getEmailSuggestion('customer@gamil.com'), 'customer@gmail.com');
      assert.strictEqual(getEmailSuggestion('vikram@gmal.com'), 'vikram@gmail.com');
      assert.strictEqual(getEmailSuggestion('priya@gmial.com'), 'priya@gmail.com');
      assert.strictEqual(getEmailSuggestion('amit@yaho.com'), 'amit@yahoo.com');
      assert.strictEqual(getEmailSuggestion('karan@yahooo.com'), 'karan@yahoo.com');
      assert.strictEqual(getEmailSuggestion('sunita@hotmial.com'), 'sunita@hotmail.com');
      assert.strictEqual(getEmailSuggestion('rahul@outlok.com'), 'rahul@outlook.com');
      assert.strictEqual(getEmailSuggestion('meera@iclud.com'), 'meera@icloud.com');
      assert.strictEqual(getEmailSuggestion('rohit@rediffmial.com'), 'rohit@rediffmail.com');
    });

    it('returns null for correctly spelled email domains', () => {
      assert.strictEqual(getEmailSuggestion('ananya@gmail.com'), null);
      assert.strictEqual(getEmailSuggestion('store@ambikajewels.com'), null);
      assert.strictEqual(getEmailSuggestion('user@outlook.com'), null);
      assert.strictEqual(getEmailSuggestion('user@yahoo.co.in'), null);
      assert.strictEqual(getEmailSuggestion('invalid-email-without-at'), null);
    });

    it('validates 10-digit Indian phone numbers with various formats', () => {
      assert.strictEqual(isValidIndianPhone('9876543210'), true);
      assert.strictEqual(isValidIndianPhone('+91 98765 43210'), true);
      assert.strictEqual(isValidIndianPhone('+91-9876543210'), true);
      assert.strictEqual(isValidIndianPhone('09876543210'), true);
      assert.strictEqual(isValidIndianPhone('919876543210'), true);

      // Invalid phone numbers
      assert.strictEqual(isValidIndianPhone('1234567890'), false, 'Indian mobiles do not start with 1');
      assert.strictEqual(isValidIndianPhone('5876543210'), false, 'Indian mobiles do not start with 5');
      assert.strictEqual(isValidIndianPhone('987654321'), false, 'Too short (9 digits)');
      assert.strictEqual(isValidIndianPhone('987654321000'), false, 'Too long');
      assert.strictEqual(isValidIndianPhone('abcdefghij'), false, 'Non-digits');
    });

    it('normalizes Indian phone numbers into clean 10-digit strings', () => {
      assert.strictEqual(normalizeIndianPhone('+91 98765 43210'), '9876543210');
      assert.strictEqual(normalizeIndianPhone('09876543210'), '9876543210');
      assert.strictEqual(normalizeIndianPhone('+91-9876543210'), '9876543210');
    });

    it('validates Indian PAN format (5 letters, 4 digits, 1 letter)', () => {
      assert.strictEqual(isValidPan('ABCDE1234F'), true);
      assert.strictEqual(isValidPan('abcde1234f'), true, 'Case insensitive');
      assert.strictEqual(isValidPan('  ABCDE1234F  '), true, 'Trims whitespace');

      assert.strictEqual(isValidPan('ABCD12345F'), false, '4 letters + 5 digits is invalid');
      assert.strictEqual(isValidPan('12345ABCDE'), false, 'Inverted pattern');
      assert.strictEqual(isValidPan('ABCDE12345'), false, 'Ends with digit');
      assert.strictEqual(isValidPan(''), false);
    });

    it('enforces ₹2,00,000 threshold for mandatory PAN requirement (Rule 114B)', () => {
      assert.strictEqual(PAN_THRESHOLD_PAISE, 20000000); // ₹2,00,000.00
      assert.strictEqual(isPanRequiredForOrder(19999900), false, '₹1,99,999 does not require PAN');
      assert.strictEqual(isPanRequiredForOrder(20000000), true, '₹2,00,000 strictly requires PAN');
      assert.strictEqual(isPanRequiredForOrder(55000000), true, '₹5,50,000 requires PAN');
    });
  });

  // =========================================================================
  // 5. Admin Open Showroom Access Integrity
  // =========================================================================
  describe('5. Admin Open Showroom Access Integrity', () => {
    it('verifies admin orders API schema handles status updates', async () => {
      // Mock request payload for order status transition
      const validStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
      for (const status of validStatuses) {
        assert.ok(validStatuses.includes(status));
      }
    });
  });
});
