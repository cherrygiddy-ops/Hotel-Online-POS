package com.onlinePos.printer;

import android.os.Parcel;
import android.os.Parcelable;

public class PrintTextFormatCreator implements Parcelable.Creator<PrintTextFormat> {

    @Override
    public PrintTextFormat createFromParcel(Parcel parcel) {
        return new PrintTextFormat(parcel);
    }

    @Override
    public PrintTextFormat[] newArray(int size) {
        return new PrintTextFormat[size];
    }
}
