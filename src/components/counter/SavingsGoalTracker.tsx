'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { DailyRates, SavingsGoal, GoalPayment } from '@/types/counter';
import {
  getSavingsGoals,
  saveSavingsGoal,
  deleteSavingsGoal,
  addGoalPayment,
} from '@/lib/counterStore';
import {
  PiggyBank,
  Plus,
  Trash2,
  Share2,
  Calendar,
  Phone,
  User,
  Scale,
  Sparkles,
  TrendingUp,
  CheckCircle2,
  Coins,
  ChevronRight,
  X,
  HeartHandshake,
} from 'lucide-react';

interface SavingsGoalTrackerProps {
  rates: DailyRates;
}

export const SavingsGoalTracker: React.FC<SavingsGoalTrackerProps> = ({ rates }) => {
  const [goals, setGoals] = useState<SavingsGoal[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [activeGoalForPayment, setActiveGoalForPayment] = useState<SavingsGoal | null>(null);

  // New Goal Form State
  const [newGoalForm, setNewGoalForm] = useState({
    customerName: '',
    customerPhone: '',
    eventName: '',
    targetWeightGrams: 10.0,
    targetAmountRupees: 0,
    targetPurity: '22K' as '22K' | '18K' | '14K' | '925Silver',
    targetDate: '',
  });

  // Payment Form State
  const [paymentForm, setPaymentForm] = useState({
    weightGrams: 0.0,
    amountPaid: 0,
    note: '',
    date: new Date().toISOString().slice(0, 10),
  });

  // Load goals on mount
  useEffect(() => {
    loadGoals();
  }, []);

  const loadGoals = async () => {
    setIsLoading(true);
    try {
      const fetched = await getSavingsGoals();
      setGoals(fetched);
    } catch (err) {
      console.error('Error loading goals:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateGoal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGoalForm.customerName || !newGoalForm.eventName) return;

    const newGoal: SavingsGoal = {
      id: `goal_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      customerName: newGoalForm.customerName,
      customerPhone: newGoalForm.customerPhone,
      eventName: newGoalForm.eventName,
      targetWeightGrams: Number(newGoalForm.targetWeightGrams) || 0,
      targetAmountRupees: Number(newGoalForm.targetAmountRupees) || 0,
      targetPurity: newGoalForm.targetPurity,
      targetDate: newGoalForm.targetDate,
      payments: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const updated = await saveSavingsGoal(newGoal);
    setGoals(updated);
    setShowAddModal(false);
    setNewGoalForm({
      customerName: '',
      customerPhone: '',
      eventName: '',
      targetWeightGrams: 10.0,
      targetAmountRupees: 0,
      targetPurity: '22K',
      targetDate: '',
    });
  };

  const handleDeleteGoal = async (id: string) => {
    if (confirm('Are you sure you want to delete this customer savings goal?')) {
      const updated = await deleteSavingsGoal(id);
      setGoals(updated);
    }
  };

  const handleAddPaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeGoalForPayment) return;

    const payment: GoalPayment = {
      id: `pay_${Date.now()}`,
      date: paymentForm.date || new Date().toISOString().slice(0, 10),
      weightGrams: Number(paymentForm.weightGrams) || 0,
      amountPaid: Number(paymentForm.amountPaid) || 0,
      note: paymentForm.note,
    };

    const updated = await addGoalPayment(activeGoalForPayment.id, payment);
    setGoals(updated);
    setActiveGoalForPayment(null);
    setPaymentForm({
      weightGrams: 0.0,
      amountPaid: 0,
      note: '',
      date: new Date().toISOString().slice(0, 10),
    });
  };

  const getActiveRateForPurity = (purity: string) => {
    switch (purity) {
      case '22K':
        return rates.gold_22k;
      case '18K':
        return rates.gold_18k;
      case '14K':
        return rates.gold_14k;
      case '925Silver':
        return rates.silver_925;
      default:
        return rates.gold_22k;
    }
  };

  const handleShareProgressOnWhatsApp = (goal: SavingsGoal) => {
    const activeRate = getActiveRateForPurity(goal.targetPurity);
    const totalAccumulatedGrams = goal.payments.reduce((acc, p) => acc + p.weightGrams, 0);
    const totalPaidRupees = goal.payments.reduce((acc, p) => acc + p.amountPaid, 0);
    const currentValuation = Math.round(totalAccumulatedGrams * activeRate);

    const progressPct = goal.targetWeightGrams > 0
      ? Math.min(100, Math.round((totalAccumulatedGrams / goal.targetWeightGrams) * 100))
      : 0;

    const remainingGrams = Math.max(0, goal.targetWeightGrams - totalAccumulatedGrams);
    const estimatedCostToComplete = Math.round(remainingGrams * activeRate);

    let text = `*AMBIKA JEWELS — GOLD SAVINGS PROGRESS UPDATE*\n`;
    text += `Customer: *${goal.customerName}*\n`;
    text += `Event Goal: *${goal.eventName}*\n`;
    text += `Target: ${goal.targetWeightGrams}g (${goal.targetPurity})\n`;
    text += `----------------------------------------\n`;
    text += `*Accumulated Gold:* ${totalAccumulatedGrams.toFixed(3)} grams (${progressPct}% complete)\n`;
    text += `*Total Amount Deposited:* ₹${totalPaidRupees.toLocaleString('en-IN')}\n`;
    text += `*Current Gold Valuation Today:* ₹${currentValuation.toLocaleString('en-IN')} (at ₹${activeRate}/g)\n`;
    text += `----------------------------------------\n`;
    text += `*Remaining Gold Balance:* ${remainingGrams.toFixed(3)} grams\n`;
    text += `*Est. Cost Today to Complete:* ₹${estimatedCostToComplete.toLocaleString('en-IN')}\n`;
    text += `----------------------------------------\n`;
    text += `Ambika Jewels | Lower Roop Nagar, Jammu\nPh: +91 9682589725`;

    const encoded = encodeURIComponent(text);
    let url = `https://wa.me/?text=${encoded}`;
    if (goal.customerPhone) {
      const cleanPhone = goal.customerPhone.replace(/\D/g, '');
      const fullPhone = cleanPhone.length === 10 ? `91${cleanPhone}` : cleanPhone;
      url = `https://wa.me/${fullPhone}?text=${encoded}`;
    }

    window.open(url, '_blank');
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-outline-variant/30 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-primary/20 text-primary border border-primary/40 text-xs font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
              Wedding Trousseau & Savings
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl text-primary font-headline-md font-bold mt-1">
            Customer Gold Savings & Weight Goal Tracker
          </h2>
          <p className="text-xs sm:text-sm text-on-surface-variant">
            Track gold accumulation schemes, bridal trousseau deposits, and live gold market growth per customer.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="gold-bg-gradient font-bold text-on-primary-fixed py-3 px-5 rounded-xl shadow-lg hover:shadow-primary/20 transition-all flex items-center justify-center gap-2 text-sm shrink-0 cursor-pointer min-h-[48px]"
        >
          <Plus className="w-4 h-4" />
          <span>New Customer Savings Goal</span>
        </button>
      </div>

      {/* Loading state */}
      {isLoading ? (
        <div className="text-center py-12 text-on-surface-variant text-sm animate-pulse">
          Loading customer savings goals...
        </div>
      ) : goals.length === 0 ? (
        /* Empty state */
        <div className="glass-panel p-10 rounded-2xl border border-primary/20 text-center space-y-4 max-w-lg mx-auto my-8">
          <div className="w-14 h-14 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center mx-auto text-primary">
            <PiggyBank className="w-7 h-7" />
          </div>
          <h3 className="text-xl font-bold text-primary font-headline-md">No Savings Goals Logged Yet</h3>
          <p className="text-xs sm:text-sm text-on-surface-variant">
            Create a gold accumulation or bridal trousseau savings goal for your customer to track past deposits, live market valuations, and remaining weight.
          </p>
          <button
            onClick={() => setShowAddModal(true)}
            className="gold-bg-gradient font-bold text-on-primary-fixed py-3 px-6 rounded-xl text-sm cursor-pointer shadow-md inline-flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>Create First Goal</span>
          </button>
        </div>
      ) : (
        /* Goals List */
        <div className="space-y-6">
          {goals.map((goal) => {
            const activeRate = getActiveRateForPurity(goal.targetPurity);
            const totalAccumulatedGrams = goal.payments.reduce((acc, p) => acc + p.weightGrams, 0);
            const totalPaidRupees = goal.payments.reduce((acc, p) => acc + p.amountPaid, 0);
            const currentValuation = Math.round(totalAccumulatedGrams * activeRate);

            const progressPct = goal.targetWeightGrams > 0
              ? Math.min(100, Math.round((totalAccumulatedGrams / goal.targetWeightGrams) * 100))
              : 0;

            const remainingGrams = Math.max(0, goal.targetWeightGrams - totalAccumulatedGrams);
            const estimatedCostToComplete = Math.round(remainingGrams * activeRate);

            return (
              <div
                key={goal.id}
                className="glass-panel p-5 sm:p-6 rounded-2xl border border-primary/30 bg-surface-container-high space-y-5 shadow-lg relative overflow-hidden"
              >
                {/* Card Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-outline-variant/30 pb-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-xl font-bold text-primary font-headline-md">
                        {goal.customerName}
                      </h3>
                      {goal.customerPhone && (
                        <span className="text-xs text-on-surface-variant bg-surface px-2.5 py-0.5 rounded border border-outline-variant/30 font-mono">
                          {goal.customerPhone}
                        </span>
                      )}
                      <span className="text-xs bg-amber-400/20 text-amber-300 font-bold px-2 py-0.5 rounded">
                        {goal.targetPurity} Goal
                      </span>
                    </div>

                    <div className="flex items-center gap-3 text-xs text-on-surface-variant">
                      <span className="font-semibold text-on-surface">Event: {goal.eventName}</span>
                      {goal.targetDate && (
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 text-primary" /> Target Date: {goal.targetDate}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleShareProgressOnWhatsApp(goal)}
                      className="bg-emerald-600/90 hover:bg-emerald-600 text-white text-xs font-bold px-3 py-2 rounded-lg flex items-center gap-1.5 cursor-pointer transition-all shadow-sm"
                    >
                      <Share2 className="w-3.5 h-3.5" />
                      <span>WhatsApp Update</span>
                    </button>

                    <button
                      onClick={() => setActiveGoalForPayment(goal)}
                      className="bg-primary/20 hover:bg-primary/30 text-primary border border-primary/40 text-xs font-bold px-3 py-2 rounded-lg flex items-center gap-1.5 cursor-pointer transition-all"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Log Purchase / Payment</span>
                    </button>

                    <button
                      onClick={() => handleDeleteGoal(goal.id)}
                      className="text-on-surface-variant hover:text-red-400 p-2 rounded-lg hover:bg-surface transition-colors cursor-pointer"
                      title="Delete Goal"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Progress Bar Section */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-xs font-bold">
                    <span className="text-on-surface-variant">Target Weight Accumulation Progress</span>
                    <span className="text-primary font-mono text-sm">{progressPct}% ({totalAccumulatedGrams.toFixed(3)}g / {goal.targetWeightGrams}g)</span>
                  </div>

                  {/* Outer Progress Track */}
                  <div className="w-full h-3.5 bg-surface-container-lowest rounded-full overflow-hidden border border-outline-variant/30 p-0.5">
                    <div
                      className="h-full rounded-full gold-shimmer-bg transition-all duration-500"
                      style={{ width: `${progressPct}%` }}
                    />
                  </div>
                </div>

                {/* Metrics Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
                  {/* Total Paid & Accumulated */}
                  <div className="bg-surface/80 p-3.5 rounded-xl border border-outline-variant/30 space-y-1">
                    <span className="text-[11px] text-on-surface-variant uppercase font-semibold block">
                      Total Deposited & Accumulated
                    </span>
                    <div className="text-base font-bold text-on-surface font-mono">
                      {totalAccumulatedGrams.toFixed(3)}g Gold
                    </div>
                    <div className="text-xs text-on-surface-variant">
                      Rupees Deposited: <strong className="text-on-surface">₹{totalPaidRupees.toLocaleString('en-IN')}</strong>
                    </div>
                  </div>

                  {/* Current Live Valuation */}
                  <div className="bg-surface/80 p-3.5 rounded-xl border border-primary/30 space-y-1">
                    <span className="text-[11px] text-primary uppercase font-semibold block flex items-center gap-1">
                      <TrendingUp className="w-3.5 h-3.5" />
                      Live Gold Value Today
                    </span>
                    <div className="text-base font-extrabold text-primary font-mono">
                      ₹{currentValuation.toLocaleString('en-IN')}
                    </div>
                    <div className="text-[11px] text-on-surface-variant">
                      Based on today's {goal.targetPurity} rate (₹{activeRate}/g)
                    </div>
                  </div>

                  {/* Remaining Balance */}
                  <div className="bg-surface/80 p-3.5 rounded-xl border border-outline-variant/30 space-y-1">
                    <span className="text-[11px] text-amber-300 uppercase font-semibold block">
                      Remaining Balance Needed
                    </span>
                    <div className="text-base font-bold text-amber-200 font-mono">
                      {remainingGrams.toFixed(3)}g Gold
                    </div>
                    <div className="text-xs text-on-surface-variant">
                      Est. Cost Today: <strong className="text-amber-200">₹{estimatedCostToComplete.toLocaleString('en-IN')}</strong>
                    </div>
                  </div>
                </div>

                {/* Payment History Sub-List */}
                {goal.payments.length > 0 && (
                  <div className="space-y-2 pt-2 border-t border-outline-variant/20">
                    <h4 className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">
                      Purchase / Payment Log History ({goal.payments.length})
                    </h4>
                    <div className="space-y-1.5 max-h-40 overflow-y-auto no-scrollbar">
                      {goal.payments.map((p, idx) => (
                        <div
                          key={p.id || idx}
                          className="flex items-center justify-between p-2.5 rounded-lg bg-surface/50 border border-outline-variant/20 text-xs"
                        >
                          <div className="flex items-center gap-2">
                            <span className="text-on-surface-variant font-mono">{p.date}</span>
                            <span className="font-semibold text-primary">{p.weightGrams.toFixed(3)}g added</span>
                            {p.note && <span className="text-on-surface-variant italic">({p.note})</span>}
                          </div>
                          <span className="font-mono font-bold text-on-surface">
                            ₹{p.amountPaid.toLocaleString('en-IN')}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* CREATE NEW GOAL MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
          <div className="glass-panel p-6 rounded-2xl border border-primary/40 max-w-lg w-full space-y-5 bg-surface-container-high my-auto">
            <div className="flex items-center justify-between border-b border-outline-variant/30 pb-3">
              <div className="flex items-center gap-2">
                <PiggyBank className="w-5 h-5 text-primary" />
                <h3 className="text-lg font-bold text-primary font-headline-md">
                  New Customer Gold Savings Goal
                </h3>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-on-surface-variant hover:text-on-surface text-xl font-bold p-1"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateGoal} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-on-surface font-semibold block mb-1">
                    Customer Name <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Ananya Sharma"
                    value={newGoalForm.customerName}
                    onChange={(e) => setNewGoalForm({ ...newGoalForm, customerName: e.target.value })}
                    className="w-full bg-surface border border-outline-variant/50 focus:border-primary text-on-surface px-3 py-2.5 rounded-lg text-sm min-h-[44px]"
                  />
                </div>

                <div>
                  <label className="text-xs text-on-surface-variant block mb-1">Phone Number</label>
                  <input
                    type="tel"
                    placeholder="e.g. 9876543210"
                    value={newGoalForm.customerPhone}
                    onChange={(e) => setNewGoalForm({ ...newGoalForm, customerPhone: e.target.value })}
                    className="w-full bg-surface border border-outline-variant/50 focus:border-primary text-on-surface px-3 py-2.5 rounded-lg text-sm min-h-[44px]"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs text-on-surface font-semibold block mb-1">
                  Event / Goal Name <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ananya's Bridal Trousseau - Oct 2026"
                  value={newGoalForm.eventName}
                  onChange={(e) => setNewGoalForm({ ...newGoalForm, eventName: e.target.value })}
                  className="w-full bg-surface border border-outline-variant/50 focus:border-primary text-on-surface px-3 py-2.5 rounded-lg text-sm min-h-[44px]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-on-surface font-semibold block mb-1">Target Weight (Grams)</label>
                  <input
                    type="number"
                    step="0.1"
                    min="0.1"
                    value={newGoalForm.targetWeightGrams}
                    onChange={(e) => setNewGoalForm({ ...newGoalForm, targetWeightGrams: Number(e.target.value) })}
                    className="w-full bg-surface border border-outline-variant/50 focus:border-primary text-on-surface px-3 py-2.5 rounded-lg text-sm font-bold font-mono min-h-[44px]"
                  />
                </div>

                <div>
                  <label className="text-xs text-on-surface font-semibold block mb-1">Target Purity</label>
                  <select
                    value={newGoalForm.targetPurity}
                    onChange={(e) => setNewGoalForm({ ...newGoalForm, targetPurity: e.target.value as any })}
                    className="w-full bg-surface border border-outline-variant/50 focus:border-primary text-on-surface px-3 py-2.5 rounded-lg text-sm font-bold min-h-[44px]"
                  >
                    <option value="22K">22K Gold (916)</option>
                    <option value="18K">18K Gold (750)</option>
                    <option value="14K">14K Gold (585)</option>
                    <option value="925Silver">925 Sterling Silver</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs text-on-surface-variant block mb-1">Target Date (Optional)</label>
                <input
                  type="date"
                  value={newGoalForm.targetDate}
                  onChange={(e) => setNewGoalForm({ ...newGoalForm, targetDate: e.target.value })}
                  className="w-full bg-surface border border-outline-variant/50 focus:border-primary text-on-surface px-3 py-2 rounded-lg text-sm min-h-[44px]"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="bg-surface border border-outline-variant/40 px-4 py-2.5 rounded-xl text-xs font-semibold text-on-surface cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="gold-bg-gradient font-bold text-on-primary-fixed px-6 py-2.5 rounded-xl text-sm shadow-md cursor-pointer"
                >
                  Create Goal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* LOG PAYMENT / PURCHASE MODAL */}
      {activeGoalForPayment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
          <div className="glass-panel p-6 rounded-2xl border border-primary/40 max-w-md w-full space-y-5 bg-surface-container-high my-auto">
            <div className="flex items-center justify-between border-b border-outline-variant/30 pb-3">
              <div className="flex items-center gap-2">
                <Coins className="w-5 h-5 text-primary" />
                <h3 className="text-lg font-bold text-primary font-headline-md">
                  Log Purchase / Deposit
                </h3>
              </div>
              <button
                onClick={() => setActiveGoalForPayment(null)}
                className="text-on-surface-variant hover:text-on-surface text-xl font-bold p-1"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-on-surface-variant">
              Logging payment for <strong>{activeGoalForPayment.customerName}</strong> ({activeGoalForPayment.eventName}).
            </p>

            <form onSubmit={handleAddPaymentSubmit} className="space-y-4">
              <div>
                <label className="text-xs text-on-surface font-semibold block mb-1">Date</label>
                <input
                  type="date"
                  required
                  value={paymentForm.date}
                  onChange={(e) => setPaymentForm({ ...paymentForm, date: e.target.value })}
                  className="w-full bg-surface border border-outline-variant/50 focus:border-primary text-on-surface px-3 py-2.5 rounded-lg text-sm min-h-[44px]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-on-surface font-semibold block mb-1">
                    Gold Added (Grams)
                  </label>
                  <input
                    type="number"
                    step="0.001"
                    min="0"
                    placeholder="0.000"
                    value={paymentForm.weightGrams || ''}
                    onChange={(e) => setPaymentForm({ ...paymentForm, weightGrams: Number(e.target.value) })}
                    className="w-full bg-surface border border-outline-variant/50 focus:border-primary text-on-surface px-3 py-2.5 rounded-lg text-sm font-bold font-mono min-h-[44px]"
                  />
                </div>

                <div>
                  <label className="text-xs text-on-surface font-semibold block mb-1">
                    Amount Paid (₹)
                  </label>
                  <input
                    type="number"
                    step="1"
                    min="0"
                    placeholder="0"
                    value={paymentForm.amountPaid || ''}
                    onChange={(e) => setPaymentForm({ ...paymentForm, amountPaid: Number(e.target.value) })}
                    className="w-full bg-surface border border-outline-variant/50 focus:border-primary text-on-surface px-3 py-2.5 rounded-lg text-sm font-bold font-mono min-h-[44px]"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs text-on-surface-variant block mb-1">Note (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. 2nd Installment / Gold Coin"
                  value={paymentForm.note}
                  onChange={(e) => setPaymentForm({ ...paymentForm, note: e.target.value })}
                  className="w-full bg-surface border border-outline-variant/50 focus:border-primary text-on-surface px-3 py-2.5 rounded-lg text-sm min-h-[44px]"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setActiveGoalForPayment(null)}
                  className="bg-surface border border-outline-variant/40 px-4 py-2.5 rounded-xl text-xs font-semibold text-on-surface cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="gold-bg-gradient font-bold text-on-primary-fixed px-6 py-2.5 rounded-xl text-sm shadow-md cursor-pointer"
                >
                  Save Log
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
