package com.onlinePos;

import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.annotation.CapacitorPlugin;
import com.onlinePos.printer.PrinterManager;

@CapacitorPlugin(name = "Printer")
public class PrinterPlugin extends Plugin {

    private PrinterManager printerManager;

    @Override
    public void load() {
        super.load();

        android.util.Log.d("PrinterPlugin", "load() called");

        printerManager = new PrinterManager(getContext());

        android.util.Log.d("PrinterPlugin", "Calling printerManager.connect()");

        printerManager.connect();
    }

    @com.getcapacitor.PluginMethod
    public void printReceipt(PluginCall call) {
        android.util.Log.d("PrinterPlugin", "printReceipt() called");

        String receipt = call.getString("receipt");

        if (receipt == null || receipt.trim().isEmpty()) {
            call.reject("Receipt content is empty");
            return;
        }

        if (printerManager == null) {
            call.reject("Printer manager is not initialized");
            return;
        }

        if (!printerManager.isConnected()) {
            android.util.Log.d(
                    "PrinterPlugin",
                    "Printer not connected yet. Waiting..."
            );

            printerManager.connect();

            new android.os.Handler(android.os.Looper.getMainLooper())
                    .postDelayed(() -> {
                        try {
                            if (!printerManager.isConnected()) {
                                call.reject("Printer service did not connect");
                                return;
                            }

                            int result = printerManager.printReceipt(receipt);

                            com.getcapacitor.JSObject ret =
                                    new com.getcapacitor.JSObject();

                            ret.put("result", result);

                            if (result == 0) {
                                call.resolve(ret);
                            } else {
                                call.reject(
                                        "Printer returned error code: " + result
                                );
                            }

                        } catch (Exception e) {
                            android.util.Log.e(
                                    "PrinterPlugin",
                                    "Receipt printing failed",
                                    e
                            );

                            call.reject(
                                    "Receipt printing failed: " + e.getMessage()
                            );
                        }
                    }, 1000);

            return;
        }

        try {
            int result = printerManager.printReceipt(receipt);

            com.getcapacitor.JSObject ret =
                    new com.getcapacitor.JSObject();

            ret.put("result", result);

            if (result == 0) {
                call.resolve(ret);
            } else {
                call.reject(
                        "Printer returned error code: " + result
                );
            }

        } catch (Exception e) {
            android.util.Log.e(
                    "PrinterPlugin",
                    "Receipt printing failed",
                    e
            );

            call.reject(
                    "Receipt printing failed: " + e.getMessage()
            );
        }
    }
}
