import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink } from '@angular/router';

import { Navbar } from '../../components/navbar/navbar';

@Component({
  selector: 'app-not-found-page',
  imports: [RouterLink, MatButtonModule, Navbar],
  templateUrl: './not-found.html',
  styleUrl: './not-found.scss',
})
export class NotFoundPage {}
