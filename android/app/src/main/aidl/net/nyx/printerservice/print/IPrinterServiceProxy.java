package net.nyx.printerservice.print;

import android.os.IBinder;
import android.os.Parcel;
import android.os.RemoteException;

public class IPrinterServiceProxy implements IPrinterService {

    private final IBinder binder;

    public IPrinterServiceProxy(IBinder binder) {
        this.binder = binder;
    }

    @Override
    public IBinder asBinder() {
        return binder;
    }

    @Override
    public int printText(String text, int width, int align, int style) throws RemoteException {
        Parcel data = Parcel.obtain();
        Parcel reply = Parcel.obtain();

        try {
            data.writeInterfaceToken("net.nyx.printerservice.print.IPrinterService");
            data.writeString(text);
            data.writeInt(width);
            data.writeInt(align);
            data.writeInt(style);

            binder.transact(10, data, reply, 0);

            reply.readException();
            return reply.readInt();
        } finally {
            reply.recycle();
            data.recycle();
        }
    }

    @Override
    public int commit() throws RemoteException {
        Parcel data = Parcel.obtain();
        Parcel reply = Parcel.obtain();

        try {
            data.writeInterfaceToken("net.nyx.printerservice.print.IPrinterService");

            binder.transact(21, data, reply, 0);

            reply.readException();
            return reply.readInt();
        } finally {
            reply.recycle();
            data.recycle();
        }
    }
}