package com.onlinePos.printer;

import android.content.ComponentName;
import android.content.Context;
import android.content.Intent;
import android.os.IBinder;
import android.os.RemoteException;
import android.util.Log;

public class PrinterManager {

    private static final String TAG = "PrinterManager";

    private final Context context;
    private final PrinterServiceConnection connection;

    private IPrinterService printerService;
    private boolean bound = false;

    public PrinterManager(Context context) {
        this.context = context.getApplicationContext();
        this.connection = new PrinterServiceConnection(this);
    }

    public boolean connect() {
        try {
            Intent intent = new Intent("net.nyx.printerservice.IPrinterService");
            intent.setPackage("net.nyx.printerservice");

            boolean result = context.bindService(
                    intent,
                    connection,
                    Context.BIND_AUTO_CREATE
            );

            Log.d(TAG, "bindService result = " + result);

            return result;

        } catch (Exception e) {
            Log.e(TAG, "bindService failed", e);
            return false;
        }
    }

    void onServiceConnected(IBinder service) {
        Log.d(TAG, "onServiceConnected called");

        printerService = new IPrinterServiceProxy(service);
        bound = true;

        Log.d(TAG, "Printer service connected successfully");
    }

    void onServiceDisconnected() {
        Log.d(TAG, "onServiceDisconnected called");

        printerService = null;
        bound = false;
    }

    public int printReceipt(String receipt) throws RemoteException {
        Log.d(TAG, "printReceipt called. bound=" + bound +
                ", printerService=" + (printerService != null));

        if (printerService == null || !bound) {
            throw new IllegalStateException(
                    "Printer service is not connected"
            );
        }

        PrintTextFormat format = new PrintTextFormat();

        format.textSize = 26;
        format.align = 0;      // left
        format.style = 1;      // bold
        format.font = 3;       // monospace
        format.scaleX = 1.0f;
        format.scaleY = 1.0f;      // monospace

        int result = printerService.printText(receipt, format);

        Log.d(TAG, "printReceipt result=" + result);

        if (result == 0) {
            result = printerService.commit();
            Log.d(TAG, "commit result=" + result);
        }

        return result;
    }

    public boolean isConnected() {
        return bound && printerService != null;
    }

    public void disconnect() {
        try {
            if (bound) {
                context.unbindService(connection);
                Log.d(TAG, "Service unbound");
            }
        } catch (Exception e) {
            Log.e(TAG, "Error unbinding service", e);
        }

        bound = false;
        printerService = null;
    }
}

