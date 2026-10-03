import React from 'react';
import { Package, AlertTriangle, CheckCircle, Clock } from 'lucide-react';

export const InventoryTable = ({ inventory = [] }) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 mb-6">
      
      {/* Header */}
      <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-3">
        <div>
          <h3 className="text-base font-extrabold text-slate-900 flex items-center space-x-2">
            <Package className="w-5 h-5 text-setu-600" />
            <span>Medicine & Oxygen Inventory Stockout Intelligence</span>
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">Automated days remaining calculation and stockout risk flagging</p>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
              <th className="py-2.5 px-3">Item Name</th>
              <th className="py-2.5 px-3">Category</th>
              <th className="py-2.5 px-3">Current Stock</th>
              <th className="py-2.5 px-3">Daily Use</th>
              <th className="py-2.5 px-3">Est. Days Remaining</th>
              <th className="py-2.5 px-3">Stockout Risk</th>
              <th className="py-2.5 px-3">Last Updated</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
            {inventory.map((item) => {
              const risk = item.stockout_risk;

              return (
                <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-3 font-bold text-slate-900">{item.item_name}</td>
                  <td className="py-3 px-3">
                    <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded text-[11px]">
                      {item.category}
                    </span>
                  </td>
                  <td className="py-3 px-3 font-semibold">{item.current_stock} {item.unit}</td>
                  <td className="py-3 px-3 text-slate-600">{item.daily_consumption} / day</td>
                  <td className="py-3 px-3">
                    <strong className={item.days_remaining <= 3 ? 'text-red-600 font-extrabold' : 'text-slate-900'}>
                      ~{item.days_remaining} days
                    </strong>
                  </td>
                  <td className="py-3 px-3">
                    <span className={`inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${
                      risk === 'Critical' ? 'bg-red-100 text-red-800 border-red-300' :
                      risk === 'Low' ? 'bg-amber-100 text-amber-800 border-amber-300' :
                      'bg-emerald-100 text-emerald-800 border-emerald-300'
                    }`}>
                      {risk === 'Critical' && <AlertTriangle className="w-3 h-3 text-red-600" />}
                      <span>{risk}</span>
                    </span>
                  </td>
                  <td className="py-3 px-3 text-slate-400 text-[11px]">
                    {item.last_updated ? new Date(item.last_updated).toLocaleTimeString() : 'Just now'}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

    </div>
  );
};
