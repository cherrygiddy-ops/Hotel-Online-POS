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

        android.util.Log.d(
                "PrinterPlugin",
                "load() called"
        );

        printerManager = new PrinterManager(getContext());

        android.util.Log.d(
                "PrinterPlugin",
                "Calling printerManager.connect()"
        );

        printerManager.connect();
    }

    @com.getcapacitor.PluginMethod
    public void printReceipt(PluginCall call) {

        android.util.Log.d(
                "PrinterPlugin",
                "printReceipt() called"
        );

        String receipt = call.getString("receipt");

        // Diagnostic: verify that JavaScript actually sent receipt content
        android.util.Log.d(
                "PrinterPlugin",
                "Receipt received: "
                        + (receipt == null
                        ? "NULL"
                        : "length=" + receipt.length())
        );

        if (receipt == null || receipt.trim().isEmpty()) {
            android.util.Log.e(
                    "PrinterPlugin",
                    "Receipt content is empty"
            );

            call.reject("Receipt content is empty");
            return;
        }

        if (printerManager == null) {
            android.util.Log.e(
                    "PrinterPlugin",
                    "Printer manager is not initialized"
            );

            call.reject("Printer manager is not initialized");
            return;
        }

        if (!printerManager.isConnected()) {

            android.util.Log.d(
                    "PrinterPlugin",
                    "Printer not connected yet. Waiting..."
            );

            printerManager.connect();

            new android.os.Handler(
                    android.os.Looper.getMainLooper()
            ).postDelayed(() -> {

                try {

                    if (!printerManager.isConnected()) {

                        android.util.Log.e(
                                "PrinterPlugin",
                                "Printer service did not connect"
                        );

                        call.reject(
                                "Printer service did not connect"
                        );

                        return;
                    }

                    android.util.Log.d(
                            "PrinterPlugin",
                            "Sending receipt to PrinterManager. Length="
                                    + receipt.length()
                    );

                    int result =
                            printerManager.printReceipt(receipt);

                    android.util.Log.d(
                            "PrinterPlugin",
                            "PrinterManager returned result="
                                    + result
                    );

                    JSObject ret = new JSObject();
                    ret.put("result", result);

                    if (result == 0) {
                        call.resolve(ret);
                    } else {
                        call.reject(
                                "Printer returned error code: "
                                        + result
                        );
                    }

                } catch (Exception e) {

                    android.util.Log.e(
                            "PrinterPlugin",
                            "Receipt printing failed",
                            e
                    );

                    call.reject(
                            "Receipt printing failed: "
                                    + e.getMessage()
                    );
                }

            }, 1000);

            return;
        }

        try {

            android.util.Log.d(
                    "PrinterPlugin",
                    "Printer already connected. Sending receipt. Length="
                            + receipt.length()
            );

            int result =
                    printerManager.printReceipt(receipt);

            android.util.Log.d(
                    "PrinterPlugin",
                    "PrinterManager returned result="
                            + result
            );

            JSObject ret = new JSObject();
            ret.put("result", result);

            if (result == 0) {

                call.resolve(ret);

            } else {

                call.reject(
                        "Printer returned error code: "
                                + result
                );
            }

        } catch (Exception e) {

            android.util.Log.e(
                    "PrinterPlugin",
                    "Receipt printing failed",
                    e
            );

            call.reject(
                    "Receipt printing failed: "
                            + e.getMessage()
            );
        }
    }
}