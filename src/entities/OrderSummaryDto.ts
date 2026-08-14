export interface OrderSummaryDto {
  totalReceipts: number;   // count of PAID receipts today
  paidReceipts: number;    // same as totalReceipts
  pendingReceipts: number; // count of PENDING receipts today
  totalSales: number;      // sum of PAID receipts today
}