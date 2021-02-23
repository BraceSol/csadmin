import {
  Component,
  ChangeDetectionStrategy,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { Subscription } from 'rxjs';
import { TranslationService } from './modules/i18n/translation.service';
// language list
import { locale as enLang } from './modules/i18n/vocabs/en';
import { locale as chLang } from './modules/i18n/vocabs/ch';
import { locale as esLang } from './modules/i18n/vocabs/es';
import { locale as jpLang } from './modules/i18n/vocabs/jp';
import { locale as deLang } from './modules/i18n/vocabs/de';
import { locale as frLang } from './modules/i18n/vocabs/fr';
import { SplashScreenService } from './_metronic/partials/layout/splash-screen/splash-screen.service';
import { TableExtendedService } from './_metronic/shared/crud-table';
import {DeviceDetectorService,DeviceInfo} from 'ngx-device-detector'

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'body[root]',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent implements OnInit, OnDestroy {
  private unsubscribe: Subscription[] = []; // Read more: => https://brianflove.com/2016/12/11/anguar-2-unsubscribe-observables/
	lat:any;
  lng:any;
  deviceInfo = null;
  isDesktopDevice: boolean;
	isTablet: boolean;
	isMobile: boolean;
  constructor(
    private translationService: TranslationService,
    private splashScreenService: SplashScreenService,
    private router: Router,
    private deviceService: DeviceDetectorService,
    private tableService: TableExtendedService
  ) {
    // register translations
    this.translationService.loadTranslations(
      enLang,
      chLang,
      esLang,
      jpLang,
      deLang,
      frLang
    );
  }

  ngOnInit() {
    this.epicFunction();
    this.getUserLocation();
    const routerSubscription = this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        // clear filtration paginations and others
        this.tableService.setDefaults();
        // hide splash screen
        this.splashScreenService.hide();

        // scroll to top on every route change
        window.scrollTo(0, 0);

        // to display back the body content
        setTimeout(() => {
          document.body.classList.add('page-loaded');
        }, 500);
      }
    });
    this.unsubscribe.push(routerSubscription);
    
  }
	getUserLocation() {
	
		navigator.geolocation.getCurrentPosition(position => {
			this.lat = position.coords.latitude;
      this.lng = position.coords.longitude;
      console.log("==================lat and long",this.lat,this.lng)
			// localStorage.setItem("lat", this.lat);
      // localStorage.setItem("lng",this.lng);
      localStorage.setItem("lat","31");
      localStorage.setItem("lng","71");
      console.log("==========",this.lat,this.lng)
		  },error=>{
//			  alert  ("Please allow location")
//			  this.router.navigateByUrl('/auth/login');
		  }
		  );

}
epicFunction() {
  this.deviceInfo = this.deviceService.getDeviceInfo();
  localStorage.setItem("browser",this.deviceInfo.browser);
  // localStorage.setItem("lat","31");
  // localStorage.setItem("lng","71");
  console.log("==========",this.deviceInfo.browser)
  this.isMobile = this.deviceService.isMobile();
  this.isTablet = this.deviceService.isTablet();
  this.isDesktopDevice = this.deviceService.isDesktop();
  }
  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }
}
