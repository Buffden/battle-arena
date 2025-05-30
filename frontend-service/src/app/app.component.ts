import { Component } from '@angular/core';
import { ApiTestComponent } from './components/api-test/api-test.component';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [ApiTestComponent, HttpClientModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'battle-arena';
}
