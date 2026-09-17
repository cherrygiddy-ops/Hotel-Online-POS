import { registerPlugin } from "@capacitor/core";

export interface PrinterPlugin {
  testPrint(): Promise<{ result: number }>;
}

const Printer = registerPlugin<PrinterPlugin>("Printer");

export default Printer;