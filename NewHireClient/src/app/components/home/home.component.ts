import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  features = [
    {
      title: 'Easy Job Search',
      description: 'Find your dream job with our advanced search filters and recommendations.',
      icon: 'search'
    },
    {
      title: 'Quick Apply',
      description: 'Apply to multiple jobs with just a few clicks using your saved profile.',
      icon: 'document'
    },
    {
      title: 'Company Profiles',
      description: 'Research companies and find the perfect cultural fit for your career.',
      icon: 'building'
    }
  ];
}
