import { Directive } from '@angular/core';
import {
  FormControl,
  FormGroup,
  AbstractControl,
  Validators,
} from '@angular/forms';

interface ValidatorFn {
  (control: AbstractControl<any, any>): ValidationErrors | null;
}
type ValidationErrors = {
  [key: string]: any;
}; 
@Directive({
  selector: '[appAutocompleteObjectValidator]'
})
export class AutocompleteObjectValidatorDirective {
  
  constructor() { }

}
export function forbiddenNameValidator(nameRe: RegExp): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const forbidden = nameRe.test(control.value);
    return forbidden ? {forbiddenName: {value: control.value}} : null;
  };
}
