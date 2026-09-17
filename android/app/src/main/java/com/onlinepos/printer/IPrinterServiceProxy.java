package com.onlinePos.printer;


import android.os.IBinder;
import android.os.Parcel;
import android.os.RemoteException;

public class IPrinterServiceProxy implements IPrinterService {

    private static final String DESCRIPTOR =
            "net.nyx.printerservice.print.IPrinterService";

    private final IBinder remote;

    public IPrinterServiceProxy(IBinder remote) {
        this.remote = remote;
    }

    @Override
    public IBinder asBinder() {
        return remote;
    }

    @Override
    public int printText(String text, PrintTextFormat format)
            throws RemoteException {

        Parcel data = Parcel.obtain();
        Parcel reply = Parcel.obtain();

        try {
            data.writeInterfaceToken(DESCRIPTOR);
            data.writeString(text);

            if (format != null) {
                data.writeInt(1);
                format.writeToParcel(data, 0);
            } else {
                data.writeInt(0);
            }

            remote.transact(7, data, reply, 0);
            reply.readException();

            return reply.readInt();

        } finally {
            data.recycle();
            reply.recycle();
        }
    }

    @Override
    public int printText2(
            String text,
            PrintTextFormat format,
            int width,
            int align) throws RemoteException {

        Parcel data = Parcel.obtain();
        Parcel reply = Parcel.obtain();

        try {
            data.writeInterfaceToken(DESCRIPTOR);
            data.writeString(text);

            if (format != null) {
                data.writeInt(1);
                format.writeToParcel(data, 0);
            } else {
                data.writeInt(0);
            }

            data.writeInt(width);
            data.writeInt(align);

            remote.transact(8, data, reply, 0);
            reply.readException();

            return reply.readInt();

        } finally {
            data.recycle();
            reply.recycle();
        }
    }

    @Override
    public int commit() throws RemoteException {

        Parcel data = Parcel.obtain();
        Parcel reply = Parcel.obtain();

        try {
            data.writeInterfaceToken(DESCRIPTOR);

            remote.transact(21, data, reply, 0);
            reply.readException();

            return reply.readInt();

        } finally {
            data.recycle();
            reply.recycle();
        }
    }

    @Override
    public int getStatus() throws RemoteException {

        Parcel data = Parcel.obtain();
        Parcel reply = Parcel.obtain();

        try {
            data.writeInterfaceToken(DESCRIPTOR);

            remote.transact(4, data, reply, 0);
            reply.readException();

            return reply.readInt();

        } finally {
            data.recycle();
            reply.recycle();
        }
    }
}
