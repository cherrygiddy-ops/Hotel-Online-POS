import { partnerAgreement } from "@/lib/mock-data";
import { motion } from "framer-motion";
import { ArrowUp, Info } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

export default function PartnerAgreements() {
  const { currentMonth, previousMonth } = partnerAgreement;
  const growth = (((currentMonth.netEarnings - previousMonth.netEarnings) / previousMonth.netEarnings) * 100).toFixed(1);

  return (
    <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold font-display">Agreement & Impact</h1>
          <p className="text-muted-foreground">Your revenue share terms and deduction breakdown</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { label: "Revenue Share", value: `${partnerAgreement.revenueSharePercent}%`, sub: "Custom rate" },
            { label: "Partner Type", value: partnerAgreement.partnerType, sub: "LoHo content embedded externally" },
            { label: "Net Growth", value: `+${growth}%`, sub: "vs previous month" },
          ].map((card, i) => (
            <motion.div key={card.label} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="stat-card text-center">
              <p className="text-sm text-muted-foreground">{card.label}</p>
              <p className="mt-2 text-2xl font-bold font-display text-primary">{card.value}</p>
              <p className="mt-1 text-xs text-muted-foreground">{card.sub}</p>
            </motion.div>
          ))}
        </div>

        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="stat-card">
          <div className="flex items-center gap-2 mb-4">
            <h3 className="text-lg font-semibold font-display">Revenue Breakdown</h3>
            <Tooltip>
              <TooltipTrigger>
                <Info className="h-4 w-4 text-muted-foreground" />
              </TooltipTrigger>
              <TooltipContent>
                <p className="max-w-xs text-sm">Net Payout = Gross Revenue × (1 - Platform Fee%) × (1 - Tax%)</p>
              </TooltipContent>
            </Tooltip>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Item</th>
                  <th className="text-right py-3 px-4 font-medium text-muted-foreground">Current Month</th>
                  <th className="text-right py-3 px-4 font-medium text-muted-foreground">Previous Month</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { label: "Gross Revenue", curr: currentMonth.grossRevenue, prev: previousMonth.grossRevenue },
                  { label: "Platform Fee", curr: -currentMonth.platformFee, prev: -previousMonth.platformFee },
                  { label: "Tax", curr: -currentMonth.tax, prev: -previousMonth.tax },
                  { label: "Net Earnings", curr: currentMonth.netEarnings, prev: previousMonth.netEarnings, bold: true },
                ].map((row) => (
                  <tr key={row.label} className={`border-b border-border/50 ${row.bold ? "bg-muted/20" : "hover:bg-muted/30"} transition-colors`}>
                    <td className={`py-3 px-4 ${row.bold ? "font-bold" : ""}`}>{row.label}</td>
                    <td className={`py-3 px-4 text-right ${row.bold ? "font-bold text-primary" : row.curr < 0 ? "text-destructive" : ""}`}>
                      ${Math.abs(row.curr).toLocaleString()}
                    </td>
                    <td className={`py-3 px-4 text-right ${row.bold ? "font-bold" : row.prev < 0 ? "text-destructive" : ""}`}>
                      ${Math.abs(row.prev).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </DashboardLayout>
  );
}
