package com.rasoulj.jozapp;

import org.devio.rn.splashscreen.SplashScreen;
import android.os.Bundle;

import com.wix.reactnativenotifications.RNNotificationsPackage;

import com.facebook.react.ReactActivity;

public class MainActivity extends ReactActivity {

  /**
   * Returns the name of the main component registered from JavaScript. This is used to schedule
   * rendering of the component.
   */
  @Override
  protected String getMainComponentName() {
    return "jozapp";
  }

  @Override
  protected void onCreate(Bundle savedInstanceState) {
      SplashScreen.show(this, R.style.SplashStatusBarTheme);
      super.onCreate(savedInstanceState);
  }
}
