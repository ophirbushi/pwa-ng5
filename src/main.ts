import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

if ('serviceWorker' in navigator) {
  navigator.serviceWorker
    .register('./sw.js');

  navigator.serviceWorker.onmessage = function (a) {
    document.querySelector('h2').innerText = 'update required';
    alert('update')
  }

}

if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.log(err));
