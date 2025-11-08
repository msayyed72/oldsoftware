import { Component } from '@angular/core';


@Component({
  moduleId: module.id,
  templateUrl: './add.html',
})
export class InvoiceAddComponent {
 // The array of invoice items that will be rendered
  items: any[] = [
    {
      id: 1,
      item: 'Calendar App Customization',
      quantity: 2,
      price: 120,
      total: 240,
    },
    {
      id: 2,
      item: 'Make Calendar App Dynamic',
      quantity: null,
      price: null,
      total: null,
    },
  ];

  // Method to remove an item from the array by its ID
  removeItem(id: number): void {
    this.items = this.items.filter(item => item.id !== id);
  }

  // Method to add a new, empty item to the array
  addItem(): void {
    const newItem: any = {
      id: this.items.length > 0 ? Math.max(...this.items.map(i => i.id)) + 1 : 1,
      item: '',
      quantity: null,
      price: null,
      total: null,
    };
    this.items.push(newItem);
  }
  
  // A helper function to calculate the total for a row
  calculateTotal(item: any): number | null {
      if (item.quantity && item.price) {
          return item.quantity * item.price;
      }
      return null;
  }
}
