import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { first } from 'rxjs/operators';

import { UserError } from '../../models/userError.enum'
import { ConfirmValidator } from '../../helpers/confirm.validators';
import { AuthService } from '../../services/auth.service';

@Component({
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  form: FormGroup;
  hidePassword: boolean = true;
  httpError: number = null;
  isConnecting: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      goTag: ['', [Validators.required, Validators.maxLength(50), Validators.pattern(/^[a-zA-Z0-9]*$/)]],
      lastName: ['', [Validators.maxLength(50), Validators.pattern(/^[a-zA-Z -]*$/)]],
      firstName: ['', [Validators.maxLength(50), Validators.pattern(/^[a-zA-Z -]*$/)]],
      email: ['', [Validators.required, Validators.email, Validators.maxLength(320)]],
      password: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(20), Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&+])[A-Za-z\d@$!%*?&+]{8,}$/)]],
      confirm: ['', Validators.required],
    }, { 
      validator: ConfirmValidator('password', 'confirm')
    });
  }

  get f() { return this.form.controls; }

  onSubmit() {

    if (this.form.invalid) {
        return;
    }
    this.isConnecting = true;

    this.authService.register(this.form.value)
        .pipe(first())
        .subscribe(
            data => {
              this.router.navigate(['../login'], { relativeTo: this.route });
            },
            httpError => {
              this.httpError = httpError.status;
              this.isConnecting = false;
              this.form.reset(this.form.value)

              switch (+httpError.error.detail) {
                case UserError.GoTagNotUnique:
                  this.f.goTag.setErrors({goTagUse:true});
                  break;
                case UserError.EmailNotUnique:
                  this.f.email.setErrors({emailUse:true});
                  break;
              }
            });
    }
  getErrorMessageGoTag() {
    if (this.f.goTag.hasError('required')) {
      return 'You must enter a value';
    }

    if (this.f.goTag.hasError('goTagUse')) {
      return 'GoTag already use';
    }
    return this.f.goTag.hasError('pattern') ? 'must only contain alphanumeric characters' : '';
  }

  getErrorMessageLastName() {
    return this.f.lastName.hasError('pattern') ? 'must only contain text characters, white space and hyphen' : '';
  }

  getErrorMessageFirstName() {
    return this.f.firstName.hasError('pattern') ? 'must only contain text characters, white space and hyphen' : '';
  }

  getErrorMessageEmail() {
    if (this.f.email.hasError('required')) {
      return 'You must enter a value';
    }
    if (this.f.email.hasError('emailUse')) {
      return 'Email already use';
    }
    return this.f.email.hasError('email') ? 'Not a valid email' : '';
  }

  getErrorMessagePassword() {
    if (this.f.password.hasError('required')) {
      return 'You must enter a value';
    }
    else if (this.f.password.hasError('minlength')) {
      return 'Enter at least 8 characters';
    }
    return this.f.password.hasError('pattern') ? 'must contain at least one uppercase letter, one lowercase letter, one number and one special character (@$!%*?&+)' : '';
  }

  getErrorMessageConfirm() {
    if (this.f.confirm.hasError('required')) {
      return 'You must enter a value';
    }
    return this.f.confirm.hasError('confirmValidator') ? 'Password do not match' : '';
  }
  
  getErrorMessage() {
    if(this.httpError == 404)
      return '...';
    this.httpError = null;
    return 'Unable to connect to server';
  }
}

