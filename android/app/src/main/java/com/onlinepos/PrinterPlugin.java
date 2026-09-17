package com.onlinePos;

import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.annotation.CapacitorPlugin;
import com.onlinepos.printer.PrinterManager;

@CapacitorPlugin(name = "Printer")
public class PrinterPlugin extends Plugin {

    private PrinterManager printerManager;

    @Override
    public void load() {
        super.load();
        printerManager = new PrinterManager(getContext());
        printerManager.connect();
    }

    @com.getcapacitor.PluginMethod
    public void testPrint(PluginCall call) {
        if (printerManager == null) {
            call.reject("Printer manager is not initialized");
            return;
        }

        try {
            if (!printerManager.isConnected()) {
                printerManager.connect();
                call.reject("Printer service is not connected yet. Please try again.");
                return;
            }

            int result = printerManager.testPrint();

            JSObject ret = new JSObject();
            ret.put("result", result);

            if (result == 0) {
                call.resolve(ret);
            } else {
                call.reject("Printer returned error code: " + result);
            }

        } catch (Exception e) {
            call.reject("Printer test failed: " + e.getMessage());
        }
    }
}