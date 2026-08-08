package net.nyx.printerservice.print;

import android.os.Binder;
import android.os.IBinder;
import android.os.IInterface;
import android.os.Parcel;
import android.os.RemoteException;

public interface IPrinterService extends IInterface {

    int printText(String text, int width, int align, int style) throws RemoteException;

    int commit() throws RemoteException;


    abstract class Stub extends Binder implements IPrinterService {

        private static final String DESCRIPTOR =
                "net.nyx.printerservice.print.IPrinterService";


        public Stub() {
            attachInterface(this, DESCRIPTOR);
        }


        public static IPrinterService asInterface(IBinder binder) {

            if (binder == null) {
                return null;
            }

            return new Proxy(binder);
        }


        @Override
        public IBinder asBinder() {
            return this;
        }


        private static class Proxy implements IPrinterService {

            private final IBinder remote;


            Proxy(IBinder remote) {
                this.remote = remote;
            }


            @Override
            public IBinder asBinder() {
                return remote;
            }


            @Override
            public int printText(String text, int width, int align, int style)
                    throws RemoteException {

                Parcel data = Parcel.obtain();
                Parcel reply = Parcel.obtain();

                try {

                    data.writeInterfaceToken(DESCRIPTOR);
                    data.writeString(text);
                    data.writeInt(width);
                    data.writeInt(align);
                    data.writeInt(style);

                    remote.transact(10, data, reply, 0);

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
        }
    }
}