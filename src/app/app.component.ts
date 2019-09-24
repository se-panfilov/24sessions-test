import { Component, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.styl']
})
export class AppComponent implements OnInit {

  items: ReadonlyArray<Item> = [];

  sortBy: string | undefined = undefined;
  direction: Direction = Direction.asc;
  filterText: string = '';

  deletedItems: ReadonlyArray<number> = [];

  getItems(): ReadonlyArray<Item> {
    return [...this.items]
      .sort((a, b) => {
        if (!this.sortBy) return 0;
        if (a[this.sortBy] > b[this.sortBy]) return this.getDirectionNumericByDirection(-1, this.direction);
        if (a[this.sortBy] < b[this.sortBy]) return this.getDirectionNumericByDirection(1, this.direction);
        return 0;
      })
      .filter(val => {
        if (!this.filterText) return true;
        const { name, id, email } = val;
        return this.isMatch(name, this.filterText) || this.isMatch(id, this.filterText) || this.isMatch(email, this.filterText);
      })
      .filter(val => {
        return !this.deletedItems.includes(val.id);
      });
  }

  isMatch(value: string | number, searchText: string): boolean {
    return value.toString().toLowerCase().includes(searchText.toLowerCase());
  }

  getDirectionNumericByDirection(num: number, direction: Direction): number {
    return direction === Direction.asc ? num * -1 : num;
  }

  sort(columnName: string): void {
    this.direction = (this.direction === Direction.asc) ? Direction.desc : Direction.asc;
    this.sortBy = columnName;
  }

  ngOnInit(): void {
    this.makeFakeRequest().subscribe(value => this.items = value);
  }

  makeFakeRequest(): Observable<ReadonlyArray<Item>> {
    return of([
      { id: 1, name: 'alpha', email: 'ccc@wqew.ee' },
      { id: 2, name: 'beta', email: 'bbbb@wqew.ee' },
      { id: 3, name: 'gamma', email: 'aaa@wqew.ee' },
      { id: 4, name: 'alpha-beta', email: 'ddd@wqew.ee' }
    ]);
  }

  remove(item: Item): void {
    this.deletedItems = [...this.deletedItems, item.id];
  }

}

interface Item {
  id: number;
  name: string;
  email: string;
}

enum Direction {
  asc = 'ASC',
  desc = 'DESC'
}
