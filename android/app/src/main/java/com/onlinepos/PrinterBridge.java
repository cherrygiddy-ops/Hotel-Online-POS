package com.onlinepos;

import android.content.ComponentName;
import android.content.Context;
import android.content.Intent;
import android.content.ServiceConnection;
import android.os.IBinder;
import android.os.RemoteException;

import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;

import net.nyx.printerservice.print.IPrinterService;


@CapacitorPlugin(name = "PrinterBridge")
public class PrinterBridge extends Plugin {

    private IPrinterService printerService;
    private boolean bound = false;

    private final ServiceConnection connection = new ServiceConnection() {
        @Override
        public void onServiceConnected(ComponentName name, IBinder service) {
            printerService = IPrinterService.Stub.asInterface(service);
            bound = true;
        }

        @Override
        public void onServiceDisconnected(ComponentName name) {
            printerService = null;
            bound = false;
        }
    };

    @Override
    public void load() {
        Intent intent = new Intent();
        intent.setPackage("net.nyx.printerservice");
        intent.setAction("net.nyx.printerservice.IPrinterService");
        getContext().bindService(intent, connection, Context.BIND_AUTO_CREATE);
    }

    @PluginMethod
    public void printText(PluginCall call) {
        String text = call.getString("text", "");

        if (!bound || printerService == null) {
            call.reject("Printer not connected");
            return;
        }

        try {
            printerService.printText(text, 384, 0, 0);
            printerService.printText("\n\n\n", 384, 0, 0);
            printerService.commit();

            JSObject ret = new JSObject();
            ret.put("success", true);
            call.resolve(ret);

        } catch (RemoteException e) {
            call.reject("Print failed: " + e.getMessage());
        }
    }
}