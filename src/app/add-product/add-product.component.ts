import { Component, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  AbstractControl,
  Validators,
} from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { FormBuilder } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';

import { addDoc, Firestore, collection } from '@angular/fire/firestore';
import { Router } from '@angular/router';

interface ValidatorFn {
  (control: AbstractControl<any, any>): ValidationErrors | null;
}
type ValidationErrors = {
  [key: string]: any;
};

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.scss'],
})
export class AddProductComponent implements OnInit {
  control = new FormControl('');

  numberRegEx = '^(0|[1-9][0-9]*)$';

  valueCategory: string = '';
  option: string[] = [
    'Danh mục sản phẩm',
    'Danh mục tháng 1',
    'Sản phẩm tháng 10',
  ];
  validationForm: FormGroup;
  filteredOption: Observable<string[]> | undefined;
  checkoutForm = this.formBuilder.group({
    name: '',
    category: '',
    brand: '',
    price: '',
    unit: '',
    salePrice: '',
    barcode: '',
    retailPrice: '',
    amountWarning: '',
    allowSale: true,
    saleFast: true,
    expire: '',
  });

  constructor(
    private formBuilder: FormBuilder,
    public firestore: Firestore,
    private router: Router
  ) {
    //Validation
    this.validationForm = new FormGroup({
      name: new FormControl(null, Validators.required),
      // category: new FormControl(null, [Validators.required, this.autocompleteObjectValidator()]),
      brand: new FormControl(null, Validators.required),
      // barcode: new FormControl(null, Validators.minLength(0)),
      price: new FormControl(null, [
        Validators.required,
        Validators.pattern(this.numberRegEx),
      ]),
      unit: new FormControl(null, Validators.required),
      salePrice: new FormControl(null, [
        Validators.required,
        Validators.pattern(this.numberRegEx),
      ]),
      retailPrice: new FormControl(null, [
        Validators.required,
        Validators.pattern(this.numberRegEx),
      ]),
      amountWarning: new FormControl(null, [
        Validators.required,
        Validators.pattern(this.numberRegEx),
      ]),

      // allowSale: new FormControl(null, Validators.minLength(0)),
      // saleFast: new FormControl(null, Validators.minLength(0)),
      // expire: new FormControl(null, Validators.minLength(0)),
    });
  }
  //Validation
  get name(): AbstractControl {
    return this.validationForm.get('name')!;
  }
  get category(): AbstractControl {
    return this.validationForm.get('category')!;
  }
  get price(): AbstractControl {
    return this.validationForm.get('price')!;
  }
  get unit(): AbstractControl {
    return this.validationForm.get('unit')!;
  }
  get salePrice(): AbstractControl {
    return this.validationForm.get('salePrice')!;
  }
  get retailPrice(): AbstractControl {
    return this.validationForm.get('retailPrice')!;
  }

  get amountWarning(): AbstractControl {
    return this.validationForm.get('amountWarning')!;
  }
  get barcode(): AbstractControl {
    return this.validationForm.get('barcode')!;
  }
  get expire(): AbstractControl {
    return this.validationForm.get(' expire')!;
  }
  get brand(): AbstractControl {
    return this.validationForm.get('brand')!;
  }
  get saleFast(): AbstractControl {
    return this.validationForm.get('saleFast')!;
  }
  get allowSale(): AbstractControl {
    return this.validationForm.get('allowSale')!;
  }
  ngOnInit() {
    //AutoComplete
    this.filteredOption = this.control.valueChanges.pipe(
      startWith(''),
      map((value) => this._filter(value || ''))
    );
  }

  onSubmit(value: any): void {
    // Process checkout data here
    value.category = this.valueCategory;
    this.addData(value);
    this.checkoutForm.reset();
    this.router.navigate(['']);
  }

  //Get value autoComplete form
  selectOption(e: MatAutocompleteSelectedEvent) {
    this.valueCategory = e.option.value;
  }
  onChange(e: any) {
    this.valueCategory = e.value;
  }

  autocompleteObjectValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      if (typeof control.value === 'string') {
        return { invalidAutocompleteObject: { value: control.value } };
      }
      return null; /* valid option selected */
    };
  }

  addData(value: any) {
    const dbInstance = collection(this.firestore, 'category');
    addDoc(dbInstance, value).catch((err) => {
      alert(err.message);
    });
  }

  private _filter(value: string): string[] {
    const filterValue = this._normalizeValue(value);
    return this.option.filter((option) =>
      this._normalizeValue(option).includes(filterValue)
    );
  }

  private _normalizeValue(value: string): string {
    return value.toLowerCase().replace(/\s/g, '');
  }
}
