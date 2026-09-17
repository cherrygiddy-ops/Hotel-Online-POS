package com.onlinePos.printer;

import android.content.ComponentName;
import android.content.ServiceConnection;
import android.os.IBinder;

public class PrinterServiceConnection implements ServiceConnection {

    private final PrinterManager manager;

    public PrinterServiceConnection(PrinterManager manager) {
        this.manager = manager;
    }

    @Override
    public void onServiceConnected(ComponentName name, IBinder service) {
        manager.onServiceConnected(service);
    }

    @Override
    public void onServiceDisconnected(ComponentName name) {
        manager.onServiceDisconnected();
    }
}
