import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GridStateService {
 private gridFilterPredicates: any = null;
  private gridSearchText: string = null;

  setFilterState(predicates: any) {
    this.gridFilterPredicates = predicates;
  }

  getFilterState(): any {
    return this.gridFilterPredicates;
  }

  setSearchText(text: string) {
    this.gridSearchText = text;
  }

  getSearchText(): string {
    return this.gridSearchText;
  }
  
  clearFilterState() {
    this.gridFilterPredicates = null;
    this.gridSearchText = null;
  }
}