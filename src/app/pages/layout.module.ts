import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InlineSVGModule } from 'ng-inline-svg';
import { PagesRoutingModule } from './pages-routing.module';
import {
  NgbDropdownModule,
  NgbProgressbarModule,
  NgbTooltipModule,
} from '@ng-bootstrap/ng-bootstrap';
import { TranslationModule } from '../modules/i18n/translation.module';
import { LayoutComponent } from './_layout/layout.component';
import { ScriptsInitComponent } from './_layout/init/scipts-init/scripts-init.component';
import { HeaderMobileComponent } from './_layout/components/header-mobile/header-mobile.component';
import { AsideComponent } from './_layout/components/aside/aside.component';
import { AsideStaticComponent } from './_layout/components/aside/aside-static/aside-static.component';
import { AsideProfessionalsComponent } from './_layout/components/aside/aside-professionals/aside-professionals.component';
import { AsideEmployersComponent } from './_layout/components/aside/aside-employers/aside-employers.component';
import { AsideAdminComponent } from './_layout/components/aside/aside-admin/aside-admin.component';
import { AsideDocMgtComponent } from './_layout/components/aside/aside-docmgt/aside-docmgt.component';
import { AsideReportsComponent } from './_layout/components/aside/aside-reports/aside-reports.component';
import { AsideDynamicComponent } from './_layout/components/aside/aside-dynamic/aside-dynamic.component';
import { AsideSearchComponent } from './_layout/components/aside/aside-search/aside-search.component';
import { FooterComponent } from './_layout/components/footer/footer.component';
import { HeaderComponent } from './_layout/components/header/header.component';
import { HeaderMenuComponent } from './_layout/components/header/header-menu/header-menu.component';
import { TopbarComponent } from './_layout/components/topbar/topbar.component';
import { ExtrasModule } from '../_metronic/partials/layout/extras/extras.module';
import { LanguageSelectorComponent } from './_layout/components/topbar/language-selector/language-selector.component';
import { CoreModule } from '../_metronic/core';
import { SubheaderModule } from '../_metronic/partials/layout/subheader/subheader.module';
import { HeaderMenuDynamicComponent } from './_layout/components/header/header-menu-dynamic/header-menu-dynamic.component';
import { DropdownMenusModule } from '../_metronic/partials/content/dropdown-menus/dropdown-menus.module';
import { ProfessionalComponent } from './professional/professional.component';

@NgModule({
  declarations: [
    LayoutComponent,
    ScriptsInitComponent,
    HeaderMobileComponent,
    AsideComponent,
    FooterComponent,
    HeaderComponent,
    HeaderMenuComponent,
    TopbarComponent,
    LanguageSelectorComponent,
    AsideDynamicComponent,
    AsideAdminComponent,
    AsideDocMgtComponent,
    AsideStaticComponent,
    AsideProfessionalsComponent,
    AsideReportsComponent,
    AsideEmployersComponent,
    AsideSearchComponent,
    HeaderMenuDynamicComponent,
    // ProfessionalComponent,
  ],
  imports: [
    CommonModule,
    PagesRoutingModule,
    TranslationModule,
    InlineSVGModule,
    ExtrasModule,
    NgbDropdownModule,
    NgbProgressbarModule,
    NgbTooltipModule,
    CoreModule,
    SubheaderModule,
    DropdownMenusModule,
  ],
})
export class LayoutModule { }
