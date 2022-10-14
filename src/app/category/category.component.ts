import { Component, OnInit } from '@angular/core';
import {
  Firestore,
  collection,
  getDocs,
  deleteDoc,
  doc,
} from '@angular/fire/firestore';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss'],
})
export class CategoryComponent implements OnInit {
  public data: any = [];
  constructor(public firestore: Firestore) {
    this.getData();
  }

  ngOnInit(): void {}
  getData() {
    const dbInstance = collection(this.firestore, 'category');
    getDocs(dbInstance).then((response) => {
      this.data = response.docs.map((item) => {
        return { ...item.data(), id: item.id };
      });
    });
  }
  delete(id: string) {
    const dataDelete = doc(this.firestore, 'category', id);
    deleteDoc(dataDelete)
      .then(() => {
        alert('Deleted');
        this.getData();
      })
      .catch((err) => {
        alert(err.message);
      });
  }
}
