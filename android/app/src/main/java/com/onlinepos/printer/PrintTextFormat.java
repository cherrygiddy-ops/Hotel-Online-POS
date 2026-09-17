package com.onlinepos.printer;

import android.os.Parcel;
import android.os.Parcelable;

public class PrintTextFormat implements Parcelable {

    public int textSize = 24;
    public boolean flag = false;
    public float scaleX = 1.0f;
    public float scaleY = 1.0f;
    public float offsetX = 0.0f;
    public float offsetY = 0.0f;
    public int value1 = 0;
    public int value2 = 0;
    public int align = 0;
    public int style = 0;
    public int font = 0;
    public String customFont = null;

    public PrintTextFormat() {
    }

    protected PrintTextFormat(Parcel parcel) {
        textSize = parcel.readInt();
        flag = parcel.readByte() != 0;
        scaleX = parcel.readFloat();
        scaleY = parcel.readFloat();
        offsetX = parcel.readFloat();
        offsetY = parcel.readFloat();
        value1 = parcel.readInt();
        value2 = parcel.readInt();
        align = parcel.readInt();
        style = parcel.readInt();
        font = parcel.readInt();
        customFont = parcel.readString();
    }

    public static final Parcelable.Creator<PrintTextFormat> CREATOR =
            new PrintTextFormatCreator();

    @Override
    public void writeToParcel(Parcel parcel, int flags) {
        parcel.writeInt(textSize);
        parcel.writeByte((byte) (flag ? 1 : 0));
        parcel.writeFloat(scaleX);
        parcel.writeFloat(scaleY);
        parcel.writeFloat(offsetX);
        parcel.writeFloat(offsetY);
        parcel.writeInt(value1);
        parcel.writeInt(value2);
        parcel.writeInt(align);
        parcel.writeInt(style);
        parcel.writeInt(font);
        parcel.writeString(customFont);
    }

    @Override
    public int describeContents() {
        return 0;
    }
}
