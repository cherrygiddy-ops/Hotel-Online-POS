package com.onlinePos;

import android.os.Bundle;
import com.getcapacitor.BridgeActivity;
import com.onlinePos.PrinterPlugin;

public class MainActivity extends BridgeActivity {

    @Override
    public void onCreate(Bundle savedInstanceState) {
        registerPlugin(PrinterPlugin.class);
        super.onCreate(savedInstanceState);
    }
}