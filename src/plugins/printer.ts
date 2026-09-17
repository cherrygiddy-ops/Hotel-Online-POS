import { registerPlugin } from "@capacitor/core";

export interface PrinterPlugin {
  printReceipt(receipt: string): Promise<{ result: number }>;
}

const Printer = registerPlugin<PrinterPlugin>("Printer");

export default Printer;