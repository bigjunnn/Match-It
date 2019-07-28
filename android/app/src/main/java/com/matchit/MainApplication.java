package com.matchit;

import android.app.Application;

import com.facebook.react.ReactApplication;
import com.reactnative.ivpusic.imagepicker.PickerPackage;
import com.RNFetchBlob.RNFetchBlobPackage;
import io.invertase.firebase.RNFirebasePackage;
import io.invertase.firebase.auth.RNFirebaseAuthPackage;
import com.oblador.vectoricons.VectorIconsPackage;
import com.reactnativecommunity.asyncstorage.AsyncStoragePackage;
import com.swmansion.gesturehandler.react.RNGestureHandlerPackage;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;
import com.reactnativecommunity.viewpager.RNCViewPagerPackage;

import java.util.Arrays;
import java.util.List;

public class MainApplication extends Application implements ReactApplication {

  private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
    @Override
    public boolean getUseDeveloperSupport() {
      return BuildConfig.DEBUG;
    }

    @Override
    protected List<ReactPackage> getPackages() {
      return Arrays.<ReactPackage>asList(
          new MainReactPackage(),
            new RNCViewPagerPackage(),
            new PickerPackage(),
            new RNFetchBlobPackage(),
            new RNFirebasePackage(),
            new VectorIconsPackage(),
            new AsyncStoragePackage(),
            new RNGestureHandlerPackage(),
            new RNFirebaseAuthPackage()
      );
    }

    @Override
    protected String getJSMainModuleName() {
      return "index";
    }
  };

  @Override
  public ReactNativeHost getReactNativeHost() {
    return mReactNativeHost;
  }

  @Override
  public void onCreate() {
    super.onCreate();
    SoLoader.init(this, /* native exopackage */ false);
  }
}
