import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';

// @ts-ignore
const backendUrl = window['getWebAppBackendUrl'] || parent["getWebAppBackendUrl"];
let bsInit: string = '';
if (backendUrl != undefined) {
  bsInit = `${backendUrl('').substring(1)}fetch/bs_init`;
}

// The router must inherited from the bsInit backend URL
const routes: Routes = [ 
	{ path: bsInit, component: AppComponent, children: [ 
		{ path: '', component: AppComponent}
	]}
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
    })
export class AppRoutingModule { }
