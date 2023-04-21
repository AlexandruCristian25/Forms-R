import { Component, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators, AsyncValidatorFn } from '@angular/forms';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  genders = ['male', 'female'];
  bannedUsernames = ['Paul', 'Alex'];

  myForm: FormGroup;

  ngOnInit(): void {
    this.myForm = new FormGroup({
      'userData': new FormGroup({
        'username': new FormControl(null, [Validators.required, this.excludedNames.bind(this)]),
        'email': new FormControl(
          null, 
          [Validators.required, Validators.email],
          this.usedEmails as AsyncValidatorFn
          ),  
      }),
      'gender': new FormControl('male'),
      'languages': new FormArray([]),
    });

    // this.myForm.setValue({
    //   'userData': {
    //     'username': 'Rzv',
    //     'email': 'rr@rr.com'
    //   },
    //   'gender': 'male',
    //   'languages': []
    // });
    // this.myForm.patchValue({
    //   'userData': {
    //     'username': 'Alex',
    //   },
    // });

    // this.myForm.valueChanges.subscribe(val => {
    //   console.log('===', val);
    // });
    this.myForm.statusChanges.subscribe(state => {
      console.log('>>>', state);
    });
  }

  onUserSubmit() {
    console.log(this.myForm);
    this.myForm.reset();
  }

  onAddLanguage() {
    const control = new FormControl(null, Validators.required);
    (<FormArray>this.myForm.get('languages')).push(control);
  }

  getControls() {
    return (this.myForm.get('languages') as FormArray).controls;
  }

  excludedNames(control: FormControl): {[k: string]: boolean} | null {
    // console.log('===', control.value);
    // console.log('---', this.bannedUsernames.indexOf(control.value));
    if (this.bannedUsernames.indexOf(control.value) !== -1) {
      return {'usernameExistsInBannedList': true};
    }
    return null;
  }

  usedEmails(control: FormControl): Promise<any> | Observable<any> {
    const promise = new Promise((resolve, reject) => {
      setTimeout(() => {
        if (control.value === 'aa@aa.com') {
          resolve({'emailAlreadyInUse': true});
        } else {
          resolve(null);
        }
      }, 5000);
    });
    return promise;
  }
}
