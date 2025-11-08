import { Component, OnInit, ViewChild } from '@angular/core';
import { SpreadsheetComponent } from '@syncfusion/ej2-angular-spreadsheet';

@Component({
  selector: 'app-sheet-payment-hsitory',
  templateUrl: './sheet-payment-hsitory.component.html',
  styleUrls: ['./sheet-payment-hsitory.component.css']
})
export class SheetPaymentHsitoryComponent implements OnInit {
  @ViewChild('default') public spreadsheetObj: SpreadsheetComponent;

  public data1: any = [
    { Date: "05-09-2025", Account: "03651304", Amount: 158, Subcategory: "Counter Credit", Memo: "VOHRA S" },
    { Date: "05-09-2025", Account: "03651304", Amount: 39, Subcategory: "Counter Credit", Memo: "EURO LOGISTICS WOR" },
    { Date: "05-09-2025", Account: "03651304", Amount: 93, Subcategory: "Counter Credit", Memo: "EURO LOGISTICS WOR" },
  ];

  constructor() {}

  ngOnInit(): void {}

  public openUrl = 'https://services.syncfusion.com/angular/production/api/spreadsheet/open';
  public saveUrl = 'https://services.syncfusion.com/angular/production/api/spreadsheet/save';

  created() {
    this.spreadsheetObj.cellFormat({ fontWeight: 'bold', textAlign: 'center', verticalAlign: 'middle' }, 'A1:A8');
    this.spreadsheetObj.numberFormat('$#,##0.00', 'C2:C10');
    this.spreadsheetObj.numberFormat('0', 'D2:D10');
    this.spreadsheetObj.hideColumn(5, 100, true);
  }

  onCellEdit(args: any): void {
    console.log("Cell edited", args);
    
    // Get the row index from the address
    const rowIndex = this.getRowIndexFromAddress(args.address);
    
    // Get the entire row data
    if (rowIndex > 0) { // Row index 0 is header
      const rowData = this.spreadsheetObj.getActiveSheet().rows[rowIndex];
      console.log("Row data:", rowData);
      
      // If you want the data from your dataSource
      if (rowIndex - 1 < this.data1.length) {
        console.log("Data source row:", this.data1[rowIndex - 1]);
      }
    }
  }

  onActionComplete(args: any): void {
    console.log(args)
    console.log('args')
    if (args.action === 'cellSave') {
      console.log("Cell saved", args);
      
      // Get the row index from the address
        const rowIndex = this.getRowIndexFromAddress(args.eventArgs.address);
   const colIndex = this.getColumnIndexFromAddress(args.eventArgs.address);
   
   // Note: rowIndex is 1-based, so subtract 1 to get 0-based index for rows array
   const sheet = this.spreadsheetObj.getActiveSheet();
   if (rowIndex > 0 && sheet.rows.length >= rowIndex) {
     const row = sheet.rows[rowIndex - 1];
     if (row) {
       const rowData = {};
       // We assume the first row (index0) is the header row
       const headerRow = sheet.rows[0];
       row.cells.forEach((cell, index) => {
         if (headerRow && headerRow.cells[index]) {
           // Use the header cell's value as the key
           rowData[headerRow.cells[index].value] = cell.value;
         }
       });
       console.log("Row data after save:", rowData);
     }
   }
 }
}
      // Get the entire row data
     
  getColumnIndexFromAddress(address: string): number {
    const match = address.match(/([A-Za-z]+)(\d+)/);
    if (match) {
      const columnLetter = match[1];
      return this.convertColumnLetterToIndex(columnLetter);
    }
    return -1;
  }

  convertColumnLetterToIndex(letter: string): number {
    const column = letter.toUpperCase();
    let columnIndex = 0;
    for (let i = 0; i < column.length; i++) {
      columnIndex = columnIndex * 26 + (column.charCodeAt(i) - 64);
    }
    return columnIndex;
  }

  getRowIndexFromAddress(address: string): number {
    const match = address.match(/([A-Za-z]+)(\d+)/);
    if (match) {
      return parseInt(match[2], 10);
    }
    return -1;
  }
}