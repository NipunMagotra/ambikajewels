export type MetalPurity = '24K' | '22K' | '18K' | '14K' | '999Silver' | '925Silver';

export type DailyRates = {
  gold_24k: number;
  gold_22k: number;
  gold_18k: number;
  gold_14k: number;
  silver_999: number;
  silver_925: number;
  updated_at: string;
  updated_by?: string;
};

export type BillInput = {
  customerName: string;
  customerPhone: string;
  metalPurity: '22K' | '18K' | '14K' | '925Silver';
  grossWeight: number;
  stoneWeight: number;
  makingType: 'percent' | 'flat';
  makingRate: number;
  includeHallmark: boolean;
  hallmarkCount: number;
  hallmarkRate: number;
  includeGst: boolean;
  gstRate: number;
  oldGoldWeight: number;
  oldGoldPurityRate: number;
  notes?: string;
};

export type BillBreakdown = {
  netWeight: number;
  appliedRatePerGram: number;
  netGoldValue: number;
  makingCharges: number;
  hallmarkingCharges: number;
  grossSubtotal: number;
  gstAmount: number;
  oldGoldDeduction: number;
  finalAmountDue: number;
};

export type GoalPayment = {
  id: string;
  date: string;
  weightGrams: number;
  amountPaid: number;
  note?: string;
};

export type SavingsGoal = {
  id: string;
  customerName: string;
  customerPhone: string;
  eventName: string;
  targetWeightGrams: number;
  targetAmountRupees: number;
  targetPurity: '22K' | '18K' | '14K' | '925Silver';
  targetDate: string;
  payments: GoalPayment[];
  createdAt: string;
  updatedAt: string;
};
