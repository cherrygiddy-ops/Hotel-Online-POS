package com.onlinepos.printer;

import android.os.IInterface;
import android.os.RemoteException;

public interface IPrinterService extends IInterface {

    int printText(String text, PrintTextFormat format) throws RemoteException;

    int printText2(String text, PrintTextFormat format, int width, int align)
            throws RemoteException;

    int commit() throws RemoteException;

    int getStatus() throws RemoteException;
}