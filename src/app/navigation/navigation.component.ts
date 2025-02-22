import { Component, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { RecipeService } from '../recipe.service';
import { Recipe } from '../recipe.model';
import { debounceTime, distinctUntilChanged, fromEvent, map } from 'rxjs';

@Component({
  selector: 'app-navigation',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './navigation.component.html'
})
export class NavigationComponent implements AfterViewInit {
  @ViewChild('searchInput') searchInput!: ElementRef;
  
  isSearchActive = false;
  searchQuery = '';
  searchResults: Recipe[] = [];

  constructor(private recipeService: RecipeService) {}

  ngAfterViewInit() {
    // Setup search debounce when search is active
    this.setupSearchDebounce();
  }

  private setupSearchDebounce() {
    if (this.searchInput) {
      fromEvent(this.searchInput.nativeElement, 'input')
        .pipe(
          map((event: any) => event.target.value),
          debounceTime(300),
          distinctUntilChanged()
        )
        .subscribe((value: string) => {
          this.performSearch(value);
        });
    }
  }

  toggleSearch() {
    this.isSearchActive = true;
    setTimeout(() => {
      if (this.searchInput) {
        this.searchInput.nativeElement.focus();
      }
    });
  }

  closeSearch() {
    this.isSearchActive = false;
    this.searchQuery = '';
    this.searchResults = [];
  }

  onSearch() {
    if (this.searchQuery.trim()) {
      this.performSearch(this.searchQuery);
    } else {
      this.searchResults = [];
    }
  }

  private performSearch(query: string) {
    this.recipeService.searchRecipes(query).subscribe({
      next: (results) => {
        this.searchResults = results;
      },
      error: (error) => {
        console.error('Error searching recipes:', error);
        this.searchResults = [];
      }
    });
  }
}
