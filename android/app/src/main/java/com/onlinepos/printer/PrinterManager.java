package com.onlinepos.printer;

import android.content.Context;
import android.content.Intent;
import android.os.IBinder;
import android.os.RemoteException;

public class PrinterManager {

    private final Context context;
    private final PrinterServiceConnection connection;

    private IPrinterService printerService;
    private boolean bound = false;

    public PrinterManager(Context context) {
        this.context = context.getApplicationContext();
        this.connection = new PrinterServiceConnection(this);
    }

    public boolean connect() {
        Intent intent = new Intent();
        intent.setPackage("net.nyx.printerservice");
        intent.setAction("net.nyx.printerservice.IPrinterService");

        return context.bindService(intent, connection, Context.BIND_AUTO_CREATE);
    }

    void onServiceConnected(IBinder service) {
        printerService = new IPrinterServiceProxy(service);
        bound = true;
    }

    void onServiceDisconnected() {
        printerService = null;
        bound = false;
    }

    public int testPrint() throws RemoteException {
        if (printerService == null || !bound) {
            throw new IllegalStateException("Printer service is not connected");
        }

        PrintTextFormat format = new PrintTextFormat();
        format.textSize = 32;
        format.align = 1;
        format.style = 1;
        format.font = 0;

        int result = printerService.printText("TEST PRINT", format);

        if (result == 0) {
            result = printerService.commit();
        }

        return result;
    }

    public boolean isConnected() {
        return bound && printerService != null;
    }

    public void disconnect() {
        if (bound) {
            context.unbindService(connection);
            bound = false;
            printerService = null;
        }
    }
}
